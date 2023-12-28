const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copy');
const downloadButton = document.getElementById('download');
const resultBox = document.getElementById('resultText');

const amount = 100
const unique = true

const addresses = {} // {ID: Address}
const leads = {} // {ID: Lead}
let ids = [] // ID
let idsLength = 0

// Load addresses
let addressesReady = false
fetch("/water/addresses")
    .then(response => response.text())
    .then(text => {
        text.split('\n').forEach((line) => {
            const [ , id, address] = line.split(',')
            addresses[id] = address
        })
        addressesReady = true
    })

// Load leads
let leadsReady = false
fetch("/water/leads")
    .then(response => response.text())
    .then(text => {
        text.split('\n').forEach((line) => {
            const [id, , , lead] = line.split(',')
            leads[id] = lead
        })
        ids = Object.keys(leads)
        idsLength = ids.length
        leadsReady = true
    })

generateButton.addEventListener('click', () => {
    if (!addressesReady || !leadsReady) {
        alert('Please wait for the data to load!')
        return
    }

    const result = {} // {ID: [Address, Lead]}
    if (unique) for (let i = 0; i < amount; i++) {
        const id = ids[Math.floor(Math.random() * idsLength)]
        if (!result[id]) result[id] = [addresses[id], leads[id] === '1' ? 'Yes' : 'No']
    } else for (let i = 0; i < amount; i++) {
        const id = ids[Math.floor(Math.random() * idsLength)]
        result[id] = [addresses[id], leads[id] === '1' ? 'Yes' : 'No']
    }

    // Address,Lead\nAddress,Lead\n...
    let resultText = ''
    for (const id in result) resultText += `${result[id][0]},${result[id][1]}\n`
    resultBox.value = resultText
})

copyButton.addEventListener('click', () => {
    resultBox.select();
    document.execCommand("copy");
    alert('Copied to clipboard!')
});

downloadButton.addEventListener('click', () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resultBox.value));
    element.setAttribute('download', 'result.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});
