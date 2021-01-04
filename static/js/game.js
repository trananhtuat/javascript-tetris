let board_section = document.querySelector('.board-section')

for (let index = 0; index < 200; index++) {
    let block = `
        <div class="block">
            <div></div>
        </div>
    `
    board_section.innerHTML += block
}

// FUNCTION

newGrid = (width, height) => {
    let grid = new Array(height)
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(width)
    }
    let index = 0;
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 10; j++) {
            grid[i][j] = {
                index: index++,
                value: 0
            }
        }
    }
    return {
        board: grid,
        width: width,
        height: height
    }
}

newTetromino = (blocks, colors, start_x, start_y) => {
    let index = Math.floor(Math.random() * blocks.length)
    return {
        block: JSON.parse(JSON.stringify(blocks[index])),
        color: colors[index],
        x: start_x,
        y: start_y
    }
}

drawTetromino = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            console.log(x)
            if (value > 0 && isInGrid(x, y, grid)) {
                field[grid.board[x][y].index].style.background = tetromino.color
            }
        })
    })
}

clearTetromino = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            console.log(x)
            if (value > 0 && isInGrid(x, y, grid)) {
                field[grid.board[x][y].index].style.background = TRANSPARENT
            }
        })
    });
}

isInGrid = (x, y, grid) => {
    return x < grid.height && x >=0 && y >=0 && y < grid.width
}

moveDown = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    tetromino.x++
    drawTetromino(tetromino, grid)
}

moveRight = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    tetromino.y++
    drawTetromino(tetromino, grid)
}

moveLeft = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    tetromino.y--
    drawTetromino(tetromino, grid)
}

rotate = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    for (let y = 0; y < tetromino.block.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [tetromino.block[x][y], tetromino.block[y][x]] = 
            [tetromino.block[y][x], tetromino.block[x][y]]
        }
    }
    tetromino.block.forEach(row => row.reverse())
    drawTetromino(tetromino, grid)
}

movable = (tetromino, grid, direction) => {
    let newX = tetromino.x + 1
    let newY = direction === DIRECTION.LEFT ? tetromino.y - 1 : tetromino.y + 1
}

// END FUNCTION

// DEFINE OBJECT

let field = document.getElementsByClassName('block')

let grid = newGrid(GRID_WIDTH, GRID_HEIGHT)

let tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)

drawTetromino(tetromino, grid, GRID_HEIGHT, GRID_WIDTH)

// END DEFINE OBJECT

// KEYBOARD EVENT

let btn_theme = document.querySelector('#btn-theme')
btn_theme.addEventListener('click', (e) => {
    let body = document.querySelector('body')
    body.classList.toggle('dark')
})

let btn_up = document.querySelector('#btn-up')
let btn_down = document.querySelector('#btn-down')
let btn_left = document.querySelector('#btn-left')
let btn_right = document.querySelector('#btn-right')
let btn_drop = document.querySelector('#btn-drop')

toggleBtn = (btn) => {
    btn.classList.toggle('active')
}

let btns = document.querySelectorAll('[id*="btn-"]')

console.log(btns)

btns.forEach(e => {
    let btn_id = e.getAttribute('id')
    e.addEventListener('click', () => {
        switch(btn_id) {
            case 'btn-up':
                rotate(tetromino, grid)
                break
            case 'btn-down':
                moveDown(tetromino, grid)
                break
            case 'btn-left':
                moveLeft(tetromino, grid)
                break
            case 'btn-right':
                moveRight(tetromino, grid)
                break
            case 'btn-drop':
                break
        }
    })
})

document.addEventListener('keydown', (e) => {
    let key = e.keyCode
    console.log(key)
    // e.preventDefault()
    switch(key) {
        case KEY.UP:
            toggleBtn(btn_up)
            rotate(tetromino, grid)
            break
        case KEY.DOWN:
            toggleBtn(btn_down)
            moveDown(tetromino, grid)
            break
        case KEY.LEFT:
            toggleBtn(btn_left)
            moveLeft(tetromino, grid)
            break
        case KEY.RIGHT:
            toggleBtn(btn_right)
            moveRight(tetromino, grid)
            break
        case KEY.SPACE:
            toggleBtn(btn_drop)
            break
    }
})

document.addEventListener('keyup', (e) => {
    let key = e.keyCode
    console.log(key)
    // e.preventDefault()
    switch(key) {
        case KEY.UP:
            toggleBtn(btn_up)
            break
        case KEY.DOWN:
            toggleBtn(btn_down)
            // moveDown(tetromino, grid)
            break
        case KEY.LEFT:
            toggleBtn(btn_left)
            // moveLeft(tetromino, grid)
            break
        case KEY.RIGHT:
            toggleBtn(btn_right)
            // moveRight(tetromino, grid)
            break
        case KEY.SPACE:
            toggleBtn(btn_drop)
            break
    }
})

// END KEYBOARD EVENT

// GAME LOOP



// END GAME LOOP

