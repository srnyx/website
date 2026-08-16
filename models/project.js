const mongoose = require('mongoose');

mongoose.model("Project", new mongoose.Schema({
  _id: { type: String, required: true },
  platforms: {
    'GITHUB': String,
    'MODRINTH': String,
    'HANGAR': String,
    'SPIGOT': String,
    'BUKKIT': String,
    'EXTERNAL': String,
    'MANUAL': String,
  },
  'api-tiers': [String],
  'exclude-loaders': [String],
  'extra-loaders': [String],
  'minecraft-versions': [String],
}, {
  versionKey: false,
}));
