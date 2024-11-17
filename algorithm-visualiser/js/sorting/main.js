// Global variables
let array = [];
let arraySize = 50;
let minValue = 5;
let maxValue = 500;
let delay = 100;
let isSorting = false;
let shouldStop = false;

// DOM Elements
const speedControl = document.getElementById('speed-control');
const sizeControl = document.getElementById('size-control');
const stopBtn = document.getElementById('stop-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

// Event Listeners
speedControl.addEventListener('input', function() {
    delay = 201 - this.value;
});

sizeControl.addEventListener('input', function() {
    arraySize = parseInt(this.value);
    generateNewArray();
});

// Array Generation
function generateNewArray() {
    array = [];
    for(let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    }
    displayBars();
}

// Display Functions
function displayBars() {
    const container = document.getElementById('bars-container');
    container.innerHTML = '';
    
    const maxHeight = Math.max(...array);
    const barWidth = Math.min(30, (container.clientWidth / arraySize) - 2);
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${(value / maxHeight) * 90}vh`;
        bar.style.width = `${barWidth}px`;
        container.appendChild(bar);
    });
}

// Control Functions
function toggleControls(disable) {
    sortButtons.forEach(btn => btn.disabled = disable);
    sizeControl.disabled = disable;
    stopBtn.disabled = !disable;
    isSorting = disable;
}

function stopSorting() {
    shouldStop = true;
}

// Helper Functions
function sleep(ms) {
    return new Promise(resolve => {
        if (shouldStop) {
            shouldStop = false;
            toggleControls(false);
            throw new Error('Sorting stopped');
        }
        setTimeout(resolve, ms);
    });
}

async function swap(i, j, bars) {
    // Visual swap
    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;
    
    // Array swap
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    await sleep(delay);
}

// Initialize
window.onload = () => {
    generateNewArray();
    delay = 201 - speedControl.value;
    arraySize = parseInt(sizeControl.value);
};