const {app} = require("./routing.js");

app.get("/REDIRECT", (req, res) => {
    res.redirect("url");
});
