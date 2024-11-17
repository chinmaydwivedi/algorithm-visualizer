class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.distance = Infinity;
        this.heuristic = 0;
        this.totalDistance = Infinity;
        this.previousNode = null;
        this.isVisited = false;
        
        this.element = document.createElement('div');
        this.element.className = 'node';
        this.element.setAttribute('data-row', row);
        this.element.setAttribute('data-col', col);
    }

    reset() {
        this.distance = Infinity;
        this.heuristic = 0;
        this.totalDistance = Infinity;
        this.previousNode = null;
        this.isVisited = false;
        this.element.classList.remove('visited', 'path');
    }

    resetWalls() {
        if (!this.isStart && !this.isEnd) {
            this.isWall = false;
            this.element.classList.remove('wall');
        }
    }
} 