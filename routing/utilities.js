const fs = require("fs");
const path = require("path");
const config = require("../config.json");

const googleTagId = config["google-tag"];
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
