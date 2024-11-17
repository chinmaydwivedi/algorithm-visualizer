// Dijkstra's Algorithm
async function dijkstra(grid, startNode, endNode) {
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;
    
    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return false;
        
        closestNode.isVisited = true;
        if (!closestNode.isStart && !closestNode.isEnd) {
            await animateNode(closestNode, 'visited');
        }
        
        if (closestNode === endNode) return true;
        
        updateUnvisitedNeighbors(closestNode, grid);
    }
    return false;
}

// A* Algorithm
async function astar(grid, startNode, endNode) {
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;
    startNode.totalDistance = heuristic(startNode, endNode);
    
    while (unvisitedNodes.length) {
        sortNodesByTotalDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.isWall) continue;
        if (closestNode.totalDistance === Infinity) return false;
        
        closestNode.isVisited = true;
        if (!closestNode.isStart && !closestNode.isEnd) {
            await animateNode(closestNode, 'visited');
        }
        
        if (closestNode === endNode) return true;
        
        updateUnvisitedNeighborsAstar(closestNode, grid, endNode);
    }
    return false;
}

// Breadth-First Search
async function bfs(grid, startNode, endNode) {
    const queue = [startNode];
    const visited = new Set();
    startNode.distance = 0;
    
    while (queue.length) {
        const currentNode = queue.shift();
        
        if (currentNode.isWall) continue;
        if (visited.has(currentNode)) continue;
        
        visited.add(currentNode);
        if (!currentNode.isStart && !currentNode.isEnd) {
            await animateNode(currentNode, 'visited');
        }
        
        if (currentNode === endNode) return true;
        
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }
    return false;
}

// Depth-First Search
async function dfs(grid, startNode, endNode) {
    const stack = [startNode];
    const visited = new Set();
    
    while (stack.length) {
        const currentNode = stack.pop();
        
        if (currentNode.isWall) continue;
        if (visited.has(currentNode)) continue;
        
        visited.add(currentNode);
        if (!currentNode.isStart && !currentNode.isEnd) {
            await animateNode(currentNode, 'visited');
        }
        
        if (currentNode === endNode) return true;
        
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }
    return false;
}

// Helper functions
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
}

function sortNodesByTotalDistance(unvisitedNodes) {
    unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
}

function updateUnvisitedNeighbors(node, grid) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function updateUnvisitedNeighborsAstar(node, grid, endNode) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.heuristic = heuristic(neighbor, endNode);
        neighbor.totalDistance = neighbor.distance + neighbor.heuristic;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {row, col} = node;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function heuristic(node, endNode) {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

async function animateNode(node, className) {
    return new Promise(resolve => {
        setTimeout(() => {
            node.element.classList.add(className);
            resolve();
        }, getAnimationSpeed());
    });
}