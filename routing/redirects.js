const {app} = require("./routing.js");

app.get("*", (req, res, next) => {
    // Check protocol
    const protocol = req.protocol;
    if (protocol !== "http" && protocol !== "https") return res.status(400).send("400: Protocol must be http or https");

    // Get/check subDomains
    const reqSubDomains = req.subdomains;
    const subDomain = reqSubDomains.length === 0 ? "@" : reqSubDomains[0];
    if (noRedirect.includes(subDomain)) return;

    // Get redirect
    const split = req.originalUrl.split("?");
    const searchParams = split[1];
    const searchParamsString = searchParams ? "?" + searchParams : "";
    const redirect = getRedirect(subDomain, split[0].slice(1));

    // Redirect/next
    if (redirect) return res.redirect(redirect + searchParamsString);
    next();
});

function getRedirect(subDomain, path) {
    const subObject = object[subDomain];

    // GitHub
    if (!subObject) return github(subDomain, path);

    // Static
    const staticObject = subObject["static"];
    if (staticObject) {
        const staticUrl = staticObject[path];
        if (staticUrl) return staticUrl;
    }

    // Dynamic
    const dynamic = subObject["dynamic"];
    if (dynamic) for (const [key, value] of Object.entries(dynamic)) if (path.startsWith(key)) return `${value}/${path}`;

    // Dynamic Replace
    const dynamicReplace = subObject["dynamicReplace"];
    if (dynamicReplace) for (const [key, value] of Object.entries(dynamicReplace)) if (path.startsWith(`${key}/`) || path === key) return `${value}/${path.slice(key.length + 1)}`;

    // Primary
    const primary = subObject["primary"];
    if (primary) return primary;

    // GitHub
    if (subObject["github"]) return github(subDomain, path);
}

function github(subDomain, path) {
    const github = `https://github.com/srnyx/${subDomain}/`;
    if (path.startsWith('git/')) return `${github}blob/master${path.slice(3)}`;
    if (path === 'git') return `${github}blob/master`;
    return github + path;
}

// Subdomains that shouldn't redirect anywhere
const noRedirect = [
    "paste",
    "go-to",
    "img",
    "media"
]

// All the redirections, @ is root
// Subsections: primary (string), static (object),
const object = {
    "@": {
        static: {
            // Music
            "spotify": "https://open.spotify.com/user/4ahrhexooug5ds02cuxwk7xuc",
            "playlist": "https://open.spotify.com/playlist/76YPSzrTgG2lujDtqHncxk",
            "pl": "https://open.spotify.com/playlist/76YPSzrTgG2lujDtqHncxk",
            "pinterest": "https://pinterest.com/srnyx",
            "soundcloud": "https://soundcloud.com/srnyx",
            "deezer": "https://deezer.com/us/profile/4374228162",
            "bandcamp": "https://bandcamp.com/srnyx",
            // Minecraft
            "modrinth": "https://modrinth.com/user/srnyx",
            "hangar": "https://hangar.papermc.io/srnyx",
            "polymart": "https://polymart.org/user/759",
            "spigot": "https://spigotmc.org/members/705071",
            "builtbybit": "https://builtbybit.com/members/252862",
            "bukkit": "https://dev.bukkit.org/members/srnyx",
            "curseforge": "https://curseforge.com/members/srnyxlive",
            "api": "https://github.com/srnyx/annoying-api",
            "modpack": "https://github.com/srnyx/modpack",
            "bstats": "https://bstats.org/author/srnyx",
            // Discord
            "discord": "https://dsc.gg/srnyx",
            "bio": "https://discords.com/bio/p/srnyx",
            "bots": "https://docs.google.com/document/d/e/2PACX-1vTNYYfb-Piv8T3jEbFbi3OXV6v0U8Oj974umNSI3c8seFzAZaPdtImKI4stf5vV1vro8B3hzyX9wLbI/pub",
            "lofi": "https://top.gg/bot/830530156048285716",
            // Social
            "media": "https://beacons.ai/srnyx/mediakit",
            "github": "https://github.com/srnyx",
            "gitlab": "https://gitlab.com/srnyx",
            "roblox": "https://roblox.com/users/108251343",
            "twitter": "https://twitter.com/srnyx",
            "x": "https://twitter.com/srnyx",
            "twitch": "https://twitch.tv/srnyx",
            "instagram": "https://instagram.com/realsrnyx",
            "threads": "https://threads.net/realsrnyx",
            "reddit": "https://reddit.com/user/srnyx",
            "youtube": "https://youtube.com/channel/UCZvkqbMtvejbV6MtPij0c6Q",
            "yt": "https://youtube.com/channel/UCZvkqbMtvejbV6MtPij0c6Q",
            "tiktok": "https://tiktok.com/@srnyx_",
            "medium": "https://medium.com/@srnyx",
            "tumblr": "https://tumblr.com/srnyx",
            "steam": "https://steamcommunity.com/id/srnyx",
            "vimeo": "https://vimeo.com/srnyx",
            // Templates
            "templates": "https://beacons.ai/srnyx/templates",
            "templates/simple": "https://xenon.bot/templates/r2uhQjNFKYHA",
            "templates/gaming": "https://xenon.bot/templates/xAkHWYehWD26",
            "templates/classroom": "https://xenon.bot/templates/mv723zHUBktr",
            "templates/studygroup": "https://xenon.bot/templates/DVyUKAVGz8uy",
            "templates/personal": "https://xenon.bot/templates/adcVcMg7tV7q",
            "templates/one": "https://xenon.bot/templates/ENe3dpAwNkMC",
            "templates/minecraft": "https://github.com/srnyx/mc-server-templates",
            "templates/mc": "https://github.com/srnyx/mc-server-templates",
            // Payment
            "donate": "https://ko-fi.com/srnyx",
            "ko-fi": "https://ko-fi.com/srnyx",
            "paypal": "https://venox.network/paypal",
            "stripe": "https://venox.network/stripe",
            "sponsor": "https://github.com/sponsors/srnyx",
            // Miscellaneous
            "disabled": "https://docs.google.com/document/d/e/2PACX-1vRDtSEco8rAS6gbMSgHo5Bk0QJzWs54sclZT-r8GLlgDWYghyU4yrhI6R9FpwNqWDWV25j955JCzKG_/pub",
            "review": "https://trustpilot.com/evaluate/srnyx.com",
            "reviews": "https://trustpilot.com/review/srnyx.com",
            "venox": "https://venox.network",
            "ai": "https://beta.character.ai/c/XrqPCrB3GheLszW9W3ZGLx92Pyw2v9Zcn9wJhEjncr4",
            "sywf": "https://chrome.google.com/webstore/detail/simple-youtube-windowed-fullscreen/pbihmiiillncegkbfnfkmlcjkpagehgh",
            "pc": "https://pcpartpicker.com/user/srnyx/saved/F9X7wP",
            "eminemify": "https://thunderstore.io/c/lethal-company/p/srnyx/Eminemify"
        },
        dynamicReplace: {
            "letterbox": "https://letterboxd.com/srnyx",
        }
    },
    seg: {
        dynamic: {
            "": "https://sites.google.com/view/srnyxevents",
        }
    },
    chrome: {
        static: {
            "sywf": "https://chrome.google.com/webstore/detail/simple-youtube-windowed-f/pbihmiiillncegkbfnfkmlcjkpagehgh",
            "recapblock": "https://chrome.google.com/webstore/detail/recapblock/okoeahofhgnlfkhiilkfhhipiekjdmja"
        }
    },
    "annoying-api": {
        github: true,
        static: {
            "modrinth": "https://modrinth.com/plugin/annoying-api",
            "hangar": "https://hangar.papermc.io/srnyx/AnnoyingAPI",
            "polymart": "https://polymart.org/resource/3238",
            "builtbybit": "https://builtbybit.com/resources/26658",
            "spigot": "https://spigotmc.org/resources/106637",
            "bukkit": "https://dev.bukkit.org/projects/annoying-api",
            "snapshot": "https://github.com/srnyx/annoying-api/actions/workflows/build.yml",
            "javadocs": "https://jitpack.io/com/github/srnyx/annoying-api/latest/javadoc/",
            "jitpack": "https://jitpack.io/#xyz.srnyx/annoying-api",
            "plugins": "https://github.com/srnyx/annoying-api/discussions/categories/annoying-api-plugins"
        }
    },
    "gradle-galaxy": {
        github: true,
        static: {
            "gradle": "https://plugins.gradle.org/plugin/xyz.srnyx.gradle-galaxy"
        }
    }
}