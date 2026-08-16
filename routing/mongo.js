const config = require("../config.json");
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(config.mongo)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Models
require('../models/project.js');

module.exports = mongoose;
