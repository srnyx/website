const express = require("express");
const path = require("path");
const {getHost} = require("../host");

const app = express();
module.exports.app = app;

app.use(express.static(path.join(__dirname, "../public")));

// All routes
require('./pages.js');
require('./redirects.js');

const port = process.env.PORT || 30015;
app.listen(port, () => {
    const host = getHost(port);
    console.log(`Server running on http://${host}`)
    app.set('subdomain offset', host.split(".").length);
});
