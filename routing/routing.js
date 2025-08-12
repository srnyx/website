const express = require("express");
const path = require("path");
const config = require("../config.json");

const app = express();
module.exports.app = app;

app.use(express.static(path.join(__dirname, "../public")));

// All routes
require('./pages.js');
require('./redirects.js');
require('./main.js');

// Get port and host
const port = process.env.PORT || config.port;
const host = config.host.replace("{PORT}", port);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://${host}`)
    app.set('subdomain offset', host.split(".").length);
});
