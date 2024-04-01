const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const text = document.getElementById('text');
const prefix = document.getElementById('prefix');
const output = document.getElementById('output');
const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copy');

generateButton.addEventListener('click', generate);

document.addEventListener('keydown', event => {
	if (event.key === 'Enter') generate();
});

copyButton.addEventListener('click', () => {
    output.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
});

function generate() {
    const characters = text.value.trim().split('');
    const length = characters.length;
	const evenMod = length % 2;
	const prefixValue = prefix.value.trim();

    // Generate the available colors in the gradient
	const colorsCount = (length + (2 - evenMod)) / 2;
    const availableColors = new Gradient(color1.value.substring(1), color2.value.substring(1), colorsCount).getColors().map(color => '#' + color);

	// Generate the initial gradient rotation
	let rotated = availableColors.concat(availableColors.slice(1 - evenMod, -1).reverse());

	// Generate the gradient lines
	const lines = [];
	for (let i = 0; i < length; i++) {
		let line = '';
		for (let j = 0; j < length; j++) line += rotated[j] + prefixValue + characters[j];
		lines.push("  - '" + line + "'");
		rotated.unshift(rotated.pop());
	}

	// Output the gradient lines
	output.innerHTML = lines.join('\n');
}

/**
 * Adapted from https://github.com/anomal/RainbowVis-JS under Eclipse Public License v1.0
 */
function Gradient(startColor, endColor, length) {
	function getBase10(color, start, end) {
		return parseInt(color.substring(start, end), 16);
	}
	let startColor_02_Base10 = getBase10(startColor, 0, 2);
	let endColor_02_Base10 = getBase10(endColor, 0, 2);
	let startColor_24_Base10 = getBase10(startColor, 2, 4);
	let endColor_24_Base10 = getBase10(endColor, 2, 4);
	let startColor_46_Base10 = getBase10(startColor, 4, 6);
	let endColor_46_Base10 = getBase10(endColor, 4, 6);

	function getColorsPerUnit(startColor_Base10, endColor_Base10) {
		return (endColor_Base10 - startColor_Base10) / length;
	}
	let colorsPerUnit_02 = getColorsPerUnit(startColor_02_Base10, endColor_02_Base10);
	let colorsPerUnit_24 = getColorsPerUnit(startColor_24_Base10, endColor_24_Base10);
	let colorsPerUnit_46 = getColorsPerUnit(startColor_46_Base10, endColor_46_Base10);

	function calcHex(number, startColor_Base10, colorsPerUnit) {
		const hex = Math.round((colorsPerUnit * number) + startColor_Base10).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	}

	this.getColorAt = function (number) {
		if (number < 0) number = 0;
		if (number > length) number = length;
		return calcHex(number, startColor_02_Base10, colorsPerUnit_02)
			+ calcHex(number, startColor_24_Base10, colorsPerUnit_24)
			+ calcHex(number, startColor_46_Base10, colorsPerUnit_46);
	}

	this.getColors = function () {
		const colors = [];
		for (let i = 0; i < length; i++) colors.push(this.getColorAt(i));
		return colors;
	}
}
