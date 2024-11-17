// Global variables
let grid = [];
let startNode = null;
let endNode = null;
let isMousePressed = false;
let isStartNodeSelected = false;
let isEndNodeSelected = false;
let isRunning = false;

const GRID_ROWS = 20;
const GRID_COLS = 50;

// Initialize grid
function initializeGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    grid = [];

    for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COLS; col++) {
            const node = new Node(row, col);
            gridElement.appendChild(node.element);
            currentRow.push(node);
            
            // Add event listeners
            node.element.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handleMouseDown(node);
            });
            node.element.addEventListener('mouseenter', () => handleMouseEnter(node));
            node.element.addEventListener('mouseup', () => handleMouseUp());
        }
        grid.push(currentRow);
    }

    // Set default start and end positions
    setStartNode(grid[10][12]);
    setEndNode(grid[10][38]);

    // Add global mouse up listener
    document.addEventListener('mouseup', handleMouseUp);
}

// Mouse event handlers
function handleMouseDown(node) {
    if (isRunning) return;
    isMousePressed = true;
    
    if (node.isStart) {
        isStartNodeSelected = true;
    } else if (node.isEnd) {
        isEndNodeSelected = true;
    } else {
        toggleWall(node);
    }
}

function handleMouseEnter(node) {
    if (!isMousePressed || isRunning) return;
    
    if (isStartNodeSelected) {
        setStartNode(node);
    } else if (isEndNodeSelected) {
        setEndNode(node);
    } else {
        toggleWall(node);
    }
}

function handleMouseUp() {
    isMousePressed = false;
    isStartNodeSelected = false;
    isEndNodeSelected = false;
}

// Node operations
function setStartNode(node) {
    if (node.isEnd || node.isWall) return;
    if (startNode) {
        startNode.isStart = false;
        startNode.element.classList.remove('start');
    }
    startNode = node;
    node.isStart = true;
    node.element.classList.add('start');
}

function setEndNode(node) {
    if (node.isStart || node.isWall) return;
    if (endNode) {
        endNode.isEnd = false;
        endNode.element.classList.remove('end');
    }
    endNode = node;
    node.isEnd = true;
    node.element.classList.add('end');
}

function toggleWall(node) {
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    node.element.classList.toggle('wall');
}

// Grid operations
function clearGrid() {
    if (isRunning) return;
    grid.forEach(row => {
        row.forEach(node => {
            node.resetWalls();
            node.reset();
        });
    });
}

function clearPath() {
    if (isRunning) return;
    grid.forEach(row => {
        row.forEach(node => {
            node.reset();
        });
    });
}

// Algorithm visualization
async function visualize() {
    if (isRunning) return;
    isRunning = true;
    clearPath();

    const algorithm = document.getElementById('algorithm-select').value;
    let success = false;

    try {
        switch (algorithm) {
            case 'dijkstra':
                success = await dijkstra(grid, startNode, endNode);
                break;
            case 'astar':
                success = await astar(grid, startNode, endNode);
                break;
            case 'bfs':
                success = await bfs(grid, startNode, endNode);
                break;
            case 'dfs':
                success = await dfs(grid, startNode, endNode);
                break;
        }

        if (success) {
            await animatePath();
        } else {
            alert('No path found!');
        }
    } catch (error) {
        console.error('Visualization error:', error);
    }

    isRunning = false;
}

async function animatePath() {
    let currentNode = endNode;
    const path = [];
    
    while (currentNode !== null && currentNode !== startNode) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    for (const node of path) {
        await sleep(30);
        if (!node.isEnd) {
            node.element.classList.add('path');
        }
    }
}

function getAnimationSpeed() {
    const speed = document.getElementById('speed-select').value;
    switch (speed) {
        case 'fast': return 10;
        case 'slow': return 100;
        default: return 50;
    }
}

// Helper functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateRandomWalls() {
    if (isRunning) return;
    clearGrid();
    
    grid.forEach(row => {
        row.forEach(node => {
            if (!node.isStart && !node.isEnd && Math.random() < 0.3) {
                node.isWall = true;
                node.element.classList.add('wall');
            }
        });
    });
}

// Initialize on load
window.onload = initializeGrid;