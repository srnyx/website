const {app} = require("./routing.js");
const fs = require("fs");
const path = require("path");

app.get("/*", (req,res) => {
    fs.readFile(path.join(__dirname, "../public/404/404.html"), (err, data) => {
        if (err) return console.error(err);
        res.set('Content-Type', 'text/html')
        res.status(404);
        res.send(data);
    });
})
