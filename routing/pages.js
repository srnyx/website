const {app} = require("./routing.js");
const {handle} = require("./utilities");

app.get("/recapblock", (req, res) => {
   res.send('{"channels":["movierecapsofficial","filmrecapshere","mysteryrecappedofficial","horrormovierecap6548","deviousrecapofficial","confusingmovies","quickfilms4650","storyrecapped","minutemovies1","jakerecaps","popcornrecap","goodemovies"]}');
});

app.get("/docs/spigot", (req, res) => {
    handle(res, "docs/spigot.html");
});

app.get("/docs/spigot/*", (req, res) => {
    handle(res, "docs/spigot.html", data => {
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
    handle(res, "docs/docs.html");
});

app.get("/docs/*", (req, res) => {
    res.redirect("/docs");
});
