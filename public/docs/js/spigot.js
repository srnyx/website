const buttons = document.getElementsByClassName('button');
const path = window.location.href.split('/docs/spigot/')[1];

// Set display path
if (path) {
    let displayPath = path;
    if (displayPath.endsWith('.html')) {
        displayPath = displayPath.slice(0, -5);
    } else if (displayPath.includes('.html#')) {
        displayPath = displayPath.replace('.html#', '#')
    }
    document.getElementById('header').textContent = displayPath.replaceAll('/', '.');
}

for (const button of buttons) {
    button.addEventListener('click', () => {
        const version = button.textContent;
        const compiledPath = getPath(version);
        let url = `https://helpch.at/docs/${version}`;
        if (compiledPath) url += `/${compiledPath}`;
        window.location.href = url;
    });
}

const dashes = ['1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12']
const percentTwenty = ['1.11.2', '1.11.1', '1.11', '1.10.2', '1.10', '1.9.4', '1.9.2', '1.9.1', '1.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8', '1.7.10', '1.7.9', '1.7.8', '1.7.5', '1.7.2', '1.6.2', '1.5']

function getPath(version) {
    if (dashes.includes(version)) return path.replace(/[,()]/g, '-')
    if (percentTwenty.includes(version)) return path.replace(',', ',%20')
    return path;
}
