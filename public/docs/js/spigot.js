const buttons = document.getElementsByClassName('versionButton');
const path = window.location.href.split('/docs/spigot/')[1];
const availableVersions = {
    '1.19': ['1.19.3', '1.19.2', '1.19.1', '1.19'],
    '1.18': ['1.18.2', '1.18.1', '1.18'],
    '1.17': ['1.17.1', '1.17'],
    '1.16': ['1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1'],
    '1.15': ['1.15.2', '1.15.1', '1.15'],
    '1.14': ['1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14'],
    '1.13': ['1.13.2', '1.13.1', '1.13'],
    '1.12': ['1.12.2', '1.12.1', '1.12'],
    '1.11': ['1.11.2', '1.11.1', '1.11'],
    '1.10': ['1.10.2', '1.10'],
    '1.9': ['1.9.4', '1.9.2', '1.9'],
    '1.8': ['1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8'],
    '1.7': ['1.7.10', '1.7.9', '1.7.8', '1.7.5', '1.7.2'],
    '1.6': ['1.6.2'],
    '1.5': ['1.5.2'],
};

// Add buttons
const buttonsElement = document.getElementsByClassName('buttons')[0];
for (const version in availableVersions) {
    buttonsElement.innerHTML += `<b>${version}:</b>`;
    availableVersions[version].forEach(subVersion => {
        const button = document.createElement('button');
        button.classList.add('commonButton', 'versionButton');
        button.textContent = subVersion;
        buttonsElement.appendChild(button);
    });
    buttonsElement.innerHTML += '<br>';
}

// Set display path
if (path) {
    let displayPath = path;
    if (displayPath.endsWith('.html')) {
        displayPath = displayPath.slice(0, -5);
    } else if (displayPath.includes('.html#')) {
        displayPath = displayPath.replace('.html#', '#');
    }
    document.getElementById('header').textContent = displayPath.replaceAll('/', '.');
}

// Add button listeners
for (const button of buttons) {
    button.addEventListener('click', () => {
        const version = button.textContent;
        const compiledPath = getPath(version);
        let url = version === 'LATEST' ? 'https://hub.spigotmc.org/javadocs/spigot' : `https://helpch.at/docs/${version}`;
        if (compiledPath) url += `/${compiledPath}`;
        window.location.href = url;
    });
}

const dashes = ['1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12']
const percentTwenty = ['1.11.2', '1.11.1', '1.11', '1.10.2', '1.10', '1.9.4', '1.9.2', '1.9.1', '1.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8', '1.7.10', '1.7.9', '1.7.8', '1.7.5', '1.7.2', '1.6.2', '1.5']
function getPath(version) {
    if (!path) return;
    if (dashes.includes(version)) return path.replace(/[,()]/g, '-');
    if (percentTwenty.includes(version)) return path.replace(',', ',%20');
    if (version === 'LATEST' && !path.endsWith('.html')) {
        if (!path.includes('#')) return path + '.html';
        if (!path.includes('.html#')) return path.replace('#', '.html#');
    }
    return path;
}
