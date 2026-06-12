const path = window.location.href.split('/docs/spigot/')[1];
const availableVersions = {
    '1.21': ['1.21.10', '1.21.8', '1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21'],
    '1.20': ['1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20'],
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
const percentTwentyAndParentheses = ['1.11.2', '1.11.1', '1.11', '1.10.2', '1.10', '1.9.4', '1.9.2', '1.9.1', '1.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8', '1.7.10', '1.7.9', '1.7.8', '1.7.5', '1.7.2', '1.6.2', '1.5']
const noInit = dashes + percentTwentyAndParentheses

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

    // LATEST
    if (version === 'LATEST') {
        if (!path.includes('.html')) {
            if (!path.includes('#')) return path + '.html';
            return path.replace('#', '.html#');
        }
        return path;
    }

    let newPath = path;

    // dashes, percentTwenty
    if (dashes.includes(version)) newPath = newPath.replace(/[,()]/g, '-');
    if (percentTwentyAndParentheses.includes(version)) {
        newPath = newPath
          .replace(',', ',%20')
          .replace('--', '()')
    }

    // noInit
    if (noInit.includes(version)) {
        const className = newPath.split('/').pop().split('.html')[0];
        newPath = newPath.replace("%3Cinit%3E", className);
        console.log(newPath, className)
    }

    return newPath;
}
