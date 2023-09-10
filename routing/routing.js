const express = require("express");
const path = require("path");
const {getHost} = require("../host");

const app = express();
module.exports.app = app;

app.use(express.static(path.join(__dirname, "../public")));

// All routes
require('./pages.js');
require('./redirects.js');
require('./404.js');

const port = process.env.PORT || 3024;
app.listen(port, () => {
    const host = getHost(port);
    console.log(`Server running at http://${host}`)
    app.set('subdomain offset', host.split(".").length);
});
