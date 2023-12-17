const {app} = require("./routing.js");
const {handle} = require("./utilities");

app.get("/", (req, res) => {
    handle(res, "/main.html");
});

app.get("/*", (req, res) => {
    res.redirect("/");
});
