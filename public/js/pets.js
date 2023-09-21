fetch('/petImages')
    .then(res => res.json())
    .then(json => {
        let pets = '';
        for (const folder in json) {
            pets += `<div id=${folder}><h1>${folder.charAt(0).toUpperCase() + folder.slice(1)}!</h1>`;
            for (const file of json[folder]) pets += `<img src="/assets/pets/${folder}/${file}" alt="${file}">`;
            pets += '</div>';
        }

        const main = document.getElementsByTagName('main')[0];
        main.innerHTML += pets;

        const images = main.getElementsByTagName('img');
        for (const image of images) {
            image.addEventListener('mouseover', () => {
                for (const img of images) if (img !== image) img.style.filter = 'blur(3px)';
            });
            image.addEventListener('mouseout', () => {
                for (const img of images) img.style.filter = '';
            });
        }
    });
