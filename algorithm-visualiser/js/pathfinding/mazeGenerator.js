async function generateMaze() {
    clearGrid();
    const grid = getGrid();
    const rows = grid.length;
    const cols = grid[0].length;

    // Make all cells walls initially
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!grid[row][col].isStart && !grid[row][col].isEnd) {
                grid[row][col].isWall = true;
                grid[row][col].element.classList.add('wall');
            }
        }
    }

    // Recursive division maze generation
    await recursiveDivision(grid, 1, rows - 2, 1, cols - 2);
}

async function recursiveDivision(grid, startRow, endRow, startCol, endCol) {
    if (endRow - startRow < 2 || endCol - startCol < 2) return;

    // Choose orientation (horizontal or vertical)
    const orientation = endRow - startRow > endCol - startCol ? 'horizontal' : 'vertical';

    if (orientation === 'horizontal') {
        const wallRow = Math.floor(random(startRow, endRow - 1));
        const passageCol = Math.floor(random(startCol, endCol));

        // Create horizontal wall
        for (let col = startCol; col <= endCol; col++) {
            if (col !== passageCol && !grid[wallRow][col].isStart && !grid[wallRow][col].isEnd) {
                grid[wallRow][col].isWall = true;
                grid[wallRow][col].element.classList.add('wall');
                await sleep(10);
            }
        }

        // Recursively divide regions
        await recursiveDivision(grid, startRow, wallRow - 1, startCol, endCol);
        await recursiveDivision(grid, wallRow + 1, endRow, startCol, endCol);
    } else {
        const wallCol = Math.floor(random(startCol, endCol - 1));
        const passageRow = Math.floor(random(startRow, endRow));

        // Create vertical wall
        for (let row = startRow; row <= endRow; row++) {
            if (row !== passageRow && !grid[row][wallCol].isStart && !grid[row][wallCol].isEnd) {
                grid[row][wallCol].isWall = true;
                grid[row][wallCol].element.classList.add('wall');
                await sleep(10);
            }
        }

        // Recursively divide regions
        await recursiveDivision(grid, startRow, endRow, startCol, wallCol - 1);
        await recursiveDivision(grid, startRow, endRow, wallCol + 1, endCol);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}