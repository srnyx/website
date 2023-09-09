const {app} = require("./routing.js");
const fs = require("fs");
const path = require("path");

app.get("/", (req, res) => {
    //res.redirect("https://beacons.ai/srnyx")
});

app.get("/docs/spigot", (req, res) => {
    handle(res, "docs/spigot.html");
});

app.get("/docs/spigot/*", (req, res) => {
    handle(res, "docs/spigot.html");
});

app.get("/docs", (req, res) => {
    handle(res, "docs/docs.html");
});

app.get("/docs/*", (req, res) => {
    res.redirect("/docs");
});

function handle(res, file) {
    fs.readFile(path.join(__dirname, "../public/" + file), (err, data) => {
        if (err) return console.error(err);
        res.set('Content-Type', 'text/html')
        res.send(data);
    })
}
