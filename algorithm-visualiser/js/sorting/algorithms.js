// Bubble Sort
async function bubbleSort() {
    try {
        toggleControls(true);
        const bars = document.getElementsByClassName('bar');
        
        for(let i = 0; i < array.length; i++) {
            for(let j = 0; j < array.length - i - 1; j++) {
                bars[j].classList.add('comparing');
                bars[j+1].classList.add('comparing');
                
                await sleep(delay);
                
                if(array[j] > array[j+1]) {
                    await swap(j, j+1, bars);
                }
                
                bars[j].classList.remove('comparing');
                bars[j+1].classList.remove('comparing');
            }
            bars[array.length - i - 1].classList.add('sorted');
        }
    } catch(e) {
        if(e.message === 'Sorting stopped') {
            resetBarsColor();
        }
    } finally {
        toggleControls(false);
    }
}

// Selection Sort
async function selectionSort() {
    try {
        toggleControls(true);
        const bars = document.getElementsByClassName('bar');
        
        for(let i = 0; i < array.length; i++) {
            let minIdx = i;
            bars[i].classList.add('comparing');
            
            for(let j = i + 1; j < array.length; j++) {
                bars[j].classList.add('comparing');
                await sleep(delay);
                
                if(array[j] < array[minIdx]) {
                    bars[minIdx].classList.remove('comparing');
                    minIdx = j;
                    bars[minIdx].classList.add('comparing');
                }
                
                bars[j].classList.remove('comparing');
            }
            
            if(minIdx !== i) {
                await swap(i, minIdx, bars);
            }
            
            bars[i].classList.remove('comparing');
            bars[i].classList.add('sorted');
            if(minIdx !== i) {
                bars[minIdx].classList.remove('comparing');
            }
        }
    } catch(e) {
        if(e.message === 'Sorting stopped') {
            resetBarsColor();
        }
    } finally {
        toggleControls(false);
    }
}

// Insertion Sort
async function insertionSort() {
    try {
        toggleControls(true);
        const bars = document.getElementsByClassName('bar');
        
        for(let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            bars[i].classList.add('comparing');
            
            while(j >= 0 && array[j] > key) {
                bars[j].classList.add('comparing');
                await sleep(delay);
                
                array[j + 1] = array[j];
                bars[j + 1].style.height = bars[j].style.height;
                
                bars[j].classList.remove('comparing');
                j--;
            }
            
            array[j + 1] = key;
            bars[j + 1].style.height = `${(key / Math.max(...array)) * 90}vh`;
            bars[i].classList.remove('comparing');
            
            for(let k = 0; k <= i; k++) {
                bars[k].classList.add('sorted');
            }
        }
    } catch(e) {
        if(e.message === 'Sorting stopped') {
            resetBarsColor();
        }
    } finally {
        toggleControls(false);
    }
}

// Quick Sort
async function quickSort() {
    try {
        toggleControls(true);
        await quickSortHelper(0, array.length - 1);
        const bars = document.getElementsByClassName('bar');
        for(let i = 0; i < bars.length; i++) {
            bars[i].classList.add('sorted');
        }
    } catch(e) {
        if(e.message === 'Sorting stopped') {
            resetBarsColor();
        }
    } finally {
        toggleControls(false);
    }
}

async function quickSortHelper(start, end) {
    if(start >= end) return;
    
    let pivotIndex = await partition(start, end);
    await quickSortHelper(start, pivotIndex - 1);
    await quickSortHelper(pivotIndex + 1, end);
}

async function partition(start, end) {
    const bars = document.getElementsByClassName('bar');
    let pivotValue = array[end];
    let pivotIndex = start;
    
    bars[end].classList.add('comparing');
    
    for(let i = start; i < end; i++) {
        bars[i].classList.add('comparing');
        await sleep(delay);
        
        if(array[i] <= pivotValue) {
            if(i !== pivotIndex) {
                await swap(i, pivotIndex, bars);
            }
            bars[pivotIndex].classList.remove('comparing');
            pivotIndex++;
        }
        bars[i].classList.remove('comparing');
    }
    
    await swap(pivotIndex, end, bars);
    bars[end].classList.remove('comparing');
    
    return pivotIndex;
}

// Merge Sort
async function mergeSort() {
    try {
        toggleControls(true);
        await mergeSortHelper(0, array.length - 1);
        const bars = document.getElementsByClassName('bar');
        for(let i = 0; i < bars.length; i++) {
            bars[i].classList.add('sorted');
        }
    } catch(e) {
        if(e.message === 'Sorting stopped') {
            resetBarsColor();
        }
    } finally {
        toggleControls(false);
    }
}

async function mergeSortHelper(start, end) {
    if(start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(start, mid);
    await mergeSortHelper(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const bars = document.getElementsByClassName('bar');
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    
    while(i < left.length && j < right.length) {
        bars[k].classList.add('comparing');
        await sleep(delay);
        
        if(left[i] <= right[j]) {
            array[k] = left[i];
            bars[k].style.height = `${(left[i] / Math.max(...array)) * 90}vh`;
            i++;
        } else {
            array[k] = right[j];
            bars[k].style.height = `${(right[j] / Math.max(...array)) * 90}vh`;
            j++;
        }
        
        bars[k].classList.remove('comparing');
        k++;
    }
    
    while(i < left.length) {
        bars[k].classList.add('comparing');
        await sleep(delay);
        
        array[k] = left[i];
        bars[k].style.height = `${(left[i] / Math.max(...array)) * 90}vh`;
        
        bars[k].classList.remove('comparing');
        i++;
        k++;
    }
    
    while(j < right.length) {
        bars[k].classList.add('comparing');
        await sleep(delay);
        
        array[k] = right[j];
        bars[k].style.height = `${(right[j] / Math.max(...array)) * 90}vh`;
        
        bars[k].classList.remove('comparing');
        j++;
        k++;
    }
}

// Helper function to reset bars color
function resetBarsColor() {
    const bars = document.getElementsByClassName('bar');
    Array.from(bars).forEach(bar => {
        bar.classList.remove('comparing', 'sorted');
    });
}