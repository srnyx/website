const head = document.getElementsByTagName('head')[0];
head.innerHTML += `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
`

document.getElementsByTagName('body')[0].innerHTML += `<div class="tuna"><a href="/pets"><img src="/assets/pets/tuna.png" alt="Tuna"></a></div>`

const tuna = document.getElementsByClassName('tuna')[0];
if (tuna) {
    const img = tuna.getElementsByTagName('img')[0];
    const style = img.style;
    img.addEventListener('mouseover', () => style.transform += `scale(1.25) rotate(${Math.floor(Math.random() * 720) - 360}deg)`);
    img.addEventListener('mouseout', () => style.transform = '');
}

const nav = document.getElementsByTagName('nav')[0];
if (nav) {
    // Get buttons
    let navButtonsString = '';
    if (window.location.pathname.split('/')[1] !== '') navButtonsString += `<a class="commonButton navButton" href="/">Home</a>`;
    for (const button of nav.getElementsByTagName('a')) navButtonsString += `<a class="commonButton navButton" href="${button.href}">${button.innerText}</a>`;

    // Set nav
    nav.innerHTML = `
        <button id="hideNav" class="toggleNav material-symbols-outlined">arrow_left_alt</button>
        
        <img class="logo" src="/assets/circle.png" alt="S">
        
        <div class="navButtons">${navButtonsString}</div>
        
        <div class="navSocials">
            <div><a href="/discord" target="_blank" rel="noreferrer">
                <img class="navSocial" src="/assets/discord.svg" alt="discord">
            </a></div>
            <div><a href="/github " target="_blank" rel="noreferrer">
                <img class="navSocial" src="/assets/github.svg" alt="github">
            </a></div>
        </div>
        
        <img class="name" src="/assets/banner-srnyx.png" alt="srnyx">
    `

    // Listeners
    const showNav = document.getElementById('showNav');
    document.getElementById('hideNav').addEventListener('click', () => {
        let position = 0;
        const id = setInterval(() => {
            position -= 5;
            nav.style.left = position + 'px';
            if (position !== -260) return;
            nav.classList.add('hidden');
            showNav.classList.remove('hidden');
            clearInterval(id);
        }, 5);
    });
    showNav.addEventListener('click', () => {
        nav.classList.remove('hidden');
        showNav.classList.add('hidden');

        let position = -260;
        const id = setInterval(() => {
            position += 5;
            nav.style.left = position + 'px';
            if (position === 0) clearInterval(id);
        }, 5);
    });
}

const links = document.getElementsByClassName('links')[0];
if (links) links.innerHTML = `
    <a class="commonButton" href="/twitter" target="_blank"><i class="fa-brands fa-x-twitter"></i> Twitter</a>
    <a class="commonButton" href="/twitch" target="_blank"><i class="fa-brands fa-twitch"></i> Twitch</a>
    <a class="commonButton" href="/roblox" target="_blank"><i class="fa-solid fa-square" style="rotate: 10deg"></i> Roblox</a>
    <a class="commonButton" href="/reddit" target="_blank"><i class="fa-brands fa-reddit-alien"></i> Reddit</a>
    <a class="commonButton" href="/youtube" target="_blank"><i class="fa-brands fa-youtube"></i> YouTube</a>
    <a class="commonButton" href="/steam" target="_blank"><i class="fa-brands fa-steam-symbol"></i> Steam</a>
    <a class="commonButton" href="/spotify" target="_blank"><i class="fa-brands fa-spotify"></i> Spotify</a>
`
