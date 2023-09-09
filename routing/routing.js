const express = require("express");
const path = require("path");

const app = express();
module.exports.app = app;

app.use(express.static(path.join(__dirname, "../public")));

// All routes
require('./pages.js');
require('./redirects.js');
require('./404.js');

const port = process.env.PORT || 3024;
app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
