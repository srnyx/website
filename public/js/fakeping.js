const input = document.getElementById('input');
const downloadContainer = document.getElementById('downloadContainer');
const downloadLink = document.getElementById('downloadLink');
const output = document.getElementById('output');

input.addEventListener('change', () => {
    downloadContainer.hidden = true;
    output.src = '';

    const file = input.files[0];
    const type = file.type;
    const reader = new FileReader();
    reader.onload = event => {
        // PNG
        if (type === 'image/png') {
            png(file, event);
            return;
        }

        // GIF
        if (type === 'image/gif') {
            gif(file, event);
            return;
        }

        // Invalid file type
        input.value = '';
        alert('ERROR | Please upload a PNG or GIF!');
    };
    reader.readAsDataURL(file);
});

function png(file, event) {
    const image = new Image();
    image.src = event.target.result;
    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the uploaded image
        ctx.drawImage(image, 0, 0);

        // Draw the ping.png overlay
        const overlay = new Image();
        overlay.src = '/assets/ping.png';
        overlay.onload = () => {
            ctx.drawImage(overlay, 0, 0, image.width, image.height);
            const outputImage = canvas.toDataURL('image/png');

            output.src = outputImage;
            downloadContainer.hidden = false;
            downloadLink.href = "data:image/png;base64," + outputImage.split(',')[1];
            downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + "_fake.png";
        };
    };
}

function gif(file, event) {
    const gif = new GIF({
        workers: 2,
        quality: 10
    });

    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the uploaded gif frame
        ctx.drawImage(img, 0, 0);

        // Draw the ping.png overlay
        const overlay = new Image();
        overlay.src = '/assets/ping.png';
        overlay.onload = function() {
            ctx.drawImage(overlay, 0, 0, img.width, img.height);
            console.log('Adding frame to gif');
            gif.addFrame(canvas, {copy: true, delay: 100});
            console.log('Rendering gif...');
            gif.on('finished', blob => {
                console.log('Finished processing gif');
                const url = URL.createObjectURL(blob);
                output.src = url;
                downloadContainer.hidden = false;
                downloadLink.href = url;
                downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + "_fake.gif";
                console.log('GIF | Fake ping added to ' + file.name + ' and ready for download');
            });
            console.log('Starting gif render');
            gif.render();
        };
    };
}
