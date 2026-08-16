const https = require("https");
const {writeFile} = require("fs");
const path = require("path");
const config = require("../config.json");
const minecraftVersionsJson = require("../minecraft-versions.json");
const mongo = require("./mongo.js");


const state = {
  done: false,
  projects: {},
}
module.exports.state = state;

function load() {
  mongo.model("Project").find().then(mongoProjects => {
    for (const mongoProject of mongoProjects) {
      const { id, project } = normalizeMongoProject(mongoProject);
      state.projects[id] = project;
    }
    state.done = true;
  });
}

function refresh(mongoProject) {
  const normalized = normalizeMongoProject(mongoProject);
  if (!state.projects[normalized.id]) state.count++;
  state.projects[normalized.id] = normalized.project;
  return normalized;
}
module.exports.refresh = refresh;

// Minecraft versions
let minecraftVersions = minecraftVersionsJson.versions;
if (config.projects["retrieve-versions-from-mojang"]) {
  // Retrieve Minecraft versions from Mojang's version manifest
  https.get("https://launchermeta.mojang.com/mc/game/version_manifest.json", res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        // Get as JSON
        const json = JSON.parse(data);
        if (!(json.versions && Array.isArray(json.versions))) {
          console.error("Invalid version manifest format");
          return;
        }

        // Get all release versions
        const allMinecraftVersions = [];
        for (let i = 0; i < json.versions.length; i++) {
          const version = json.versions[i];
          if (version.type === "release") allMinecraftVersions.push(version.id);
        }

        // Only update if there are new versions
        if (allMinecraftVersions.length !== minecraftVersions.length) {
          minecraftVersions = allMinecraftVersions;

          // Write to minecraft-versions.json
          writeFile(path.join(__dirname, '..', 'minecraft-versions.json'), JSON.stringify({versions: minecraftVersions}, null, 2), err => {
            if (err) return console.error("Error writing minecraft-versions.json", err);
            console.log("Successfully updated minecraft-versions.json");
          });
        }

        // Process projects
        load();
      } catch (e) {
        console.error("Error parsing version manifest JSON", e);
      }
    });
  }).on('error', (err) => {
    console.error("Error fetching version manifest", err);
  });
} else {
  load()
}

const tierExpansions = {
  bukkit: ["spigot", "paper", "purpur"],
  spigot: ["paper", "purpur"],
  paper: ["purpur"],
}

/**
 * @return  {{id: *, project: *}}
 */
function normalizeMongoProject(mongoProject) {
  const project = mongoProject.toObject();
  const id = project._id;
  delete project._id;

  // Loaders
  const loaders = project["extra-loaders"];
  // API tiers
  const apiTiers = project["api-tiers"];
  if (apiTiers) for (const tier of apiTiers) {
    loaders.push(tier);
    const expanded = tierExpansions[tier];
    if (expanded) loaders.push(...expanded);
  }
  // Excluded loaders
  const excludeLoaders = project["exclude-loaders"];
  if (excludeLoaders) for (const loader of excludeLoaders) {
    const index = loaders.indexOf(loader);
    if (index !== -1) loaders.splice(index, 1);
  }
  // Set
  project.loaders = [...new Set(loaders)];
  delete project["extra-loaders"];
  delete project["api-tiers"];
  delete project["exclude-loaders"];

  // Minecraft versions
  processMinecraftVersions(project);

  return { id, project };
}

function processMinecraftVersions(project) {
  let newMinecraftVersions = [];
  let originalMinecraftVersions = project["minecraft-versions"];
  for (let i = 0; i < originalMinecraftVersions.length; i++) {
    const version = originalMinecraftVersions[i];

    // Exact version
    if (minecraftVersions.includes(version)) {
      newMinecraftVersions.push(version);
      continue;
    }

    // Higher than or equal to (+)
    if (version.endsWith('+')) {
      const baseVersion = version.substring(0, version.length - 1);
      const startIndex = minecraftVersions.indexOf(baseVersion);
      if (startIndex === -1) continue;
      for (let j = 0; j <= startIndex; j++) newMinecraftVersions.push(minecraftVersions[j]);
    }

    // Lower than or equal to (-)
    if (version.endsWith('-')) {
      const baseVersion = version.substring(0, version.length - 1);
      const endIndex = minecraftVersions.indexOf(baseVersion);
      if (endIndex === -1) continue;
      for (let j = endIndex; j < minecraftVersions.length; j++) newMinecraftVersions.push(minecraftVersions[j]);
    }

    // Range (-)
    if (version.includes('-')) {
      const rangeSplit = version.split('-');
      if (rangeSplit.length !== 2) continue;
      const oldVersion = rangeSplit[0];
      const newVersion = rangeSplit[1];
      const startIndex = minecraftVersions.indexOf(newVersion);
      const endIndex = minecraftVersions.indexOf(oldVersion);
      if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) continue;
      for (let j = startIndex; j <= endIndex; j++) newMinecraftVersions.push(minecraftVersions[j]);
    }
  }
  // Remove duplicates
  newMinecraftVersions = [...new Set(newMinecraftVersions)];
  // Sort by index in allMinecraftVersions
  newMinecraftVersions.sort((a, b) => {
    return minecraftVersions.indexOf(a) - minecraftVersions.indexOf(b);
  });
  // Set
  project["minecraft-versions"] = newMinecraftVersions;
}
