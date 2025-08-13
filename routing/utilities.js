const fs = require("fs");
const path = require("path");
const https = require("https");
const projectsJson = require("../projects.json");

/**
 * Display a file's contents
 *
 * @param   res         response
 * @param   file        file path
 * @param   callable    function to call on file data
 * @param   error       error handler
 */
module.exports.handle = (res, file, callable, error) => {
    fs.readFile(path.join(__dirname, "../public/" + file), (err, data) => {
        if (err) {
            if (error) return error(err);
            return console.error(err);
        }
        if (callable) data = callable(data);
        res.contentType("text/html").send(data);
    })
}

// projects/data
const object = {
    "status": "processing",
    "count": Object.keys(projectsJson.projects).length,
    "projects": projectsJson.projects
}
// Defaults
for (const projectKey in object.projects) {
    const project = object.projects[projectKey];
    const platforms = project.platforms;

    // exactDefaults
    for (const key in projectsJson.defaults.exact) if (!project[key]) project[key] = projectsJson.defaults.exact[key];

    // hangar
    if (platforms.hangar && typeof platforms.hangar === "string") platforms.hangar = {
        "author": projectsJson.defaults.author,
        "name": platforms.hangar
    };

    // github
    const github = platforms.github;
    if (github === false) {
        delete platforms.github
    } else if (github && typeof github === "string") {
        platforms.github = {
            "author": projectsJson.defaults.author,
            "name": github
        };
    } else {
        if (!platforms.github) platforms.github = {};
        if (!platforms.github.author) platforms.github.author = projectsJson.defaults.author;
        if (!platforms.github.name) platforms.github.name = projectKey;
    }
}
// minecraft-versions
if (projectsJson["minecraft-versions"]["retrieve-from-mojang"]) {
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
                processMinecraftVersions(allMinecraftVersions);
            } catch (e) {
                console.error("Error parsing version manifest JSON", e);
            }
        });
    }).on('error', (err) => {
        console.error("Error fetching version manifest", err);
    });
} else {
    processMinecraftVersions(projectsJson["minecraft-versions"].versions);
}
function processMinecraftVersions(versions) {
    for (const projectKey in object.projects) {
        const project = object.projects[projectKey];
        let minecraftVersions = [];
        let originalMinecraftVersions = project["minecraft-versions"];
        for (let i = 0; i < originalMinecraftVersions.length; i++) {
            const version = originalMinecraftVersions[i];

            // Exact version
            if (versions.includes(version)) {
                minecraftVersions.push(version);
                continue;
            }

            // Higher than or equal to (+)
            if (version.endsWith('+')) {
                const baseVersion = version.substring(0, version.length - 1);
                const startIndex = versions.indexOf(baseVersion);
                if (startIndex === -1) continue;
                for (let j = 0; j <= startIndex; j++) minecraftVersions.push(versions[j]);
            }

            // Lower than or equal to (-)
            if (version.endsWith('-')) {
                const baseVersion = version.substring(0, version.length - 1);
                const endIndex = versions.indexOf(baseVersion);
                if (endIndex === -1) continue;
                for (let j = endIndex; j < versions.length; j++) minecraftVersions.push(versions[j]);
            }

            // Range (-)
            if (version.includes('-')) {
                const rangeSplit = version.split('-');
                if (rangeSplit.length !== 2) continue;
                const oldVersion = rangeSplit[0];
                const newVersion = rangeSplit[1];
                const startIndex = versions.indexOf(newVersion);
                const endIndex = versions.indexOf(oldVersion);
                if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) continue;
                for (let j = startIndex; j <= endIndex; j++) minecraftVersions.push(versions[j]);
            }
        }
        // Remove duplicates
        minecraftVersions = [...new Set(minecraftVersions)];
        // Sort by index in allMinecraftVersions
        minecraftVersions.sort((a, b) => {
            return versions.indexOf(a) - versions.indexOf(b);
        });
        // Set
        project["minecraft-versions"] = minecraftVersions;
    }

    object.status = "done";
}
module.exports.projects = object;
