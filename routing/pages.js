const fs = require("fs");
const path = require("path");
const {app} = require("./routing.js");
const {handle, projects} = require("./utilities");
const cors = require('cors');

// recapblock
app.use('/recapblock', cors({ origin: ['https://youtube.com', 'https://www.youtube.com'] }));
app.get("/recapblock/data", (req, res) => {
    res.contentType("application/json").send('{"channels":["filmzrecaps","filmsrecapped","quirkorecap","movierecapsofficial","filmrecapshere","mysteryrecappedofficial","horrormovierecap6548","deviousrecapofficial","confusingmovies","quickfilms4650","storyrecapped","minutemovies1","jakerecaps","popcornrecap","goodemovies","movierecaps_","foxrecaps","filmstoryrecapped","movieclub0505","clock7x","filmcrop","seriesrecapped"]}');
});

// projects
app.get("/projects", (req, res) => {
    handle(res, "/projects.html");
});
app.get("/projects/data", (req, res) => {
    res.contentType("application/json").send(projects);
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

app.get("/docs/spigot/*", (req, res) => {
    handle(res, "/docs/spigot.html", data => {
        const dataString = data.toString();

        // Get path
        const pathSplit = req.path.split('/docs/spigot/');
        if (pathSplit.length < 2) return dataString;
        let path = pathSplit[1];
        if (path.length < 1) return dataString;
        if (path.endsWith('.html')) path = path.substring(0, path.length - 5);

        const split = dataString.split('<head>');
        split.splice(1, 0, `<meta property="og:title" content=${path.replaceAll('/', '.')} />`);
        return split[0] + '<head>' + split[1] + split[2];
    });
});

app.get("/docs", (req, res) => {
    handle(res, "/docs/docs.html");
});

app.get("/docs/*", (req, res) => {
    res.redirect("/docs");
});

app.get("/pets", (req, res) => {
    handle(res, "/pets.html");
});

const petsJson = {};
fs.readdir(path.join(__dirname, '../public/assets/pets'), (err, folders) => {
    if (err) return console.error(err);
    for (const folder of folders) {
        const filePath = path.join(__dirname, `../public/assets/pets/${folder}`);
        if (fs.lstatSync(filePath).isDirectory()) fs.readdir(filePath, (err, files) => {
            const filteredFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'));
            if (filteredFiles.length !== 0) petsJson[folder] = filteredFiles;
        });
    }
});
