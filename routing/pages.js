const fs = require("fs");
const path = require("path");
const config = require("../config.json");
const {app} = require("./routing.js");
const projects = require("./projects.js");
const mongo = require("./mongo.js");
const {handle, requireBearer} = require("./utilities");
const cors = require('cors');

const Project = mongo.model("Project");


// resume
app.get("/resume", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "assets", "resume.pdf"));
});

// recapblock
app.get(
  "/recapblock/data",
  cors({ origin: ['https://youtube.com', 'https://www.youtube.com'] }),
  (req, res) => {
      res.json({ 'channels': ['filmzrecaps','filmsrecapped','quirkorecap','movierecapsofficial','filmrecapshere','mysteryrecappedofficial','horrormovierecap6548','deviousrecapofficial','confusingmovies','quickfilms4650','storyrecapped','minutemovies1','jakerecaps','popcornrecap','goodemovies','movierecaps_','foxrecaps','filmstoryrecapped','movieclub0505','clock7x','filmcrop','seriesrecapped'] });
  });

// projects
app.get("/projects", (req, res) => {
    handle(res, "/projects.html");
});
app.get("/projects/data", (req, res) => {
    const response = {
        count: Object.keys(projects.state.projects).length,
        projects: projects.state.projects
    }

    // Still processing
    if (!projects.state.done) return res.status(202).json(response);

    // Done processing
    return res.status(200).json(response);
});
app.get("/projects/data/:id", (req, res) => {
    res.json(projects.state.projects[req.params.id]);
});
app.post(
  "/projects/data/:id",
  requireBearer(config.projects.token),
  (req, res) => {
      Project.findOneAndUpdate(
          { _id: req.params.id },
          { $set: req.body },
          { upsert: true, returnDocument: "after" }
        ).then((mongoProject) => {
            projects.refresh(mongoProject);
            res.status(201).json({ message: "Project saved successfully" });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });
    });

app.get("/petImages", (req, res) => {
    res.send(petsJson);
});

app.get("/gradient", (req, res) => {
    handle(res, "/gradient.html");
});

app.get("/docs/spigot", (req, res) => {
    handle(res, "/docs/spigot.html");
});

app.get("/docs/spigot/*path", (req, res) => {
    handle(res, "/docs/spigot.html", data => {
        const dataString = data.toString();

        // Get path
        let path = req.params.path;
        if (Array.isArray(path)) path = path.join("/");
        if (!path) return dataString;
        if (path.endsWith('.html')) path = path.substring(0, path.length - 5);

        return dataString.replace("<head>", `<head><meta property="og:title" content="${path.replaceAll("/", ".")}" />`);
    });
});

app.get("/docs", (req, res) => {
    handle(res, "/docs/docs.html");
});

app.get("/docs/*path", (req, res) => {
    res.redirect("/docs");
});

app.get("/pets", (req, res) => {
    handle(res, "/pets.html");
});

const petsJson = {};
fs.readdir(path.join(__dirname, '..', 'public', 'assets', 'pets'), (err, folders) => {
    if (err) return console.error(err);
    for (const folder of folders) {
        const filePath = path.join(__dirname, '..', 'public', 'assets', 'pets', folder);
        if (fs.lstatSync(filePath).isDirectory()) fs.readdir(filePath, (err, files) => {
            const filteredFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'));
            if (filteredFiles.length !== 0) petsJson[folder] = filteredFiles;
        });
    }
});
