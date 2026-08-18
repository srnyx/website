const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("../config.json");

const googleTag = config["google-tag"];
const googleTagId = googleTag?.id;
const googleTagSecret = googleTag?.secret;
const googleTagScript = `<script async src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleTagId}');</script>`;

/**
 * Display a file's contents
 *
 * @param   res         response
 * @param   file        file path
 * @param   callable    function to call on file data
 * @param   error       error handler
 */
module.exports.handle = (res, file, callable, error) => {
    fs.readFile(path.join(__dirname, "../public/" + file), (err, data) => {
        if (err) {
            if (error) return error(err);
            return console.error(err);
        }
        data = data.toString().replace("<head>", `<head>${googleTagScript}`);
        if (callable) data = callable(data);
        res.contentType("text/html").send(data);
    })
}

/**
 * Report a redirect to Google Analytics via the Measurement Protocol (redirects never load gtag.js, so this is server-side)
 *
 * @param   req             request
 * @param   destination     the URL the request was redirected to
 */
module.exports.trackRedirect = (req, destination) => {
    if (!googleTagId || !googleTagSecret) return;

    const url = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${googleTagId}&api_secret=${googleTagSecret}`;
    const body = JSON.stringify({
        client_id: crypto.randomUUID(),
        events: [{
            name: "redirect",
            params: {
                source_path: req.originalUrl,
                destination: destination,
                page_location: `${req.protocol}://${req.headers.host}${req.originalUrl}`
            }
        }]
    });

    fetch(url, {method: "POST", body}).catch(err => console.error("Failed to track redirect:", err));
}

/**
 * Require a bearer token for API access
 *
 * @param   requiredToken   required bearer token
 */
const requireBearer = (requiredToken) => (req, res, next) => {
    if (!requiredToken) return res.status(500).json({ error: "Bearer token not configured" });

    const authorization = req.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing bearer token" });

    const token = authorization.slice(7);
    if (token !== requiredToken) return res.status(401).json({ error: "Invalid bearer token" });

    next();
};
module.exports.requireBearer = requireBearer;
