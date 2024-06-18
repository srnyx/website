const path = window.location.href.split('/docs/spigot/')[1];
const availableVersions = {
    '1.20': ['1.20.3', '1.20.2', '1.20.1', '1.20'],
    '1.19': ['1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19'],
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
    '1.5': ['1.5'],
};
const dashes = ['1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12']
const percentTwenty = ['1.11.2', '1.11.1', '1.11', '1.10.2', '1.10', '1.9.4', '1.9.2', '1.9.1', '1.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8', '1.7.10', '1.7.9', '1.7.8', '1.7.5', '1.7.2', '1.6.2', '1.5']

// Add buttons
const buttonsElement = document.getElementsByClassName('buttons')[0];
for (const version in availableVersions) {
    buttonsElement.innerHTML += `<b>${version}:</b>`;
    availableVersions[version].forEach(subVersion => {
        const button = document.createElement('a');
        button.classList.add('commonButton', 'versionButton');
        button.target = '_blank';
        button.textContent = subVersion;

        // Set URL
        let url = `https://helpch.at/docs/${subVersion}`;
        const compiledPath = getPath(subVersion);
        if (compiledPath) url += `/${compiledPath}`;
        button.href = url

        buttonsElement.appendChild(button);
    });
    buttonsElement.innerHTML += '<br>';
}

// Set latest button URL
const latestButton = document.getElementById('latest');
if (latestButton) {
    let url = 'https://hub.spigotmc.org/javadocs/spigot';
    const compiledPath = getPath('LATEST');
    if (compiledPath) url += `/${compiledPath}`;
    latestButton.href = url;
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
