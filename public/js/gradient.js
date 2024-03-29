const input = document.getElementById('input');
const output = document.getElementById('output');
const generate = document.getElementById('generate');
const copy = document.getElementById('copy');

generate.addEventListener('click', () => {
    const colors = input.value
        .split('\n')
        .filter(color => color.trim() !== '')
        .map(color => color + '-');

    const reversed = [...colors]
        .reverse()
        .slice(1, -1);
    const combined = colors
        .concat(reversed)
        .reverse();

    const lines = combined.map((_, i) => {
        const rotated = [...combined.slice(combined.length - i), ...combined.slice(0, combined.length - i)];
        return "    - '" + rotated.slice(0, colors.length).join('') + "'";
    });

    output.textContent = lines.join('\n');
});

copy.addEventListener('click', () => {
    output.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
});
