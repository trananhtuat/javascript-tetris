let board_section = document.querySelector('.board-section')

for (let index = 0; index < 200; index++) {
    let block = `
        <div class="block">
            <div></div>
        </div>
    `
    board_section.innerHTML += block
}

let field = document.getElementsByClassName('block')

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
            if (value > 0 && isInGrid(x, y, grid)) {
                field[grid.board[x][y].index].style.background = TRANSPARENT
            }
        })
    });
}

isInGrid = (x, y, grid) => {
    return x < grid.height && x >=0 && y >=0 && y < grid.width
}

isFilled = (x, y, grid) => {
    if (!isInGrid(x, y, grid)) {
        return false
    } else {
        // console.log('x = ',x)
        // console.log('y = ',y)
        // console.log(grid.board)
        return grid.board[x][y].value !== 0
    }
}

moveDown = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.DOWN)) return
    clearTetromino(tetromino, grid)
    tetromino.x++
    drawTetromino(tetromino, grid)
}

moveRight = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.RIGHT)) return
    clearTetromino(tetromino, grid)
    tetromino.y++
    drawTetromino(tetromino, grid)
}

moveLeft = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.LEFT)) return
    clearTetromino(tetromino, grid)
    tetromino.y--
    drawTetromino(tetromino, grid)
}

rotate = (tetromino, grid) => {
    if (!rotatable(tetromino, grid)) return
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

hardDrop = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    while (movable(tetromino, grid, DIRECTION.DOWN)) {
        tetromino.x++
    }
    drawTetromino(tetromino, grid)
}

updateGrid = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            if (value > 0 && isInGrid(x, y, grid)) {
                grid.board[x][y].value = value
            }
        })
    })
}

// CHECK COLLISION

movable = (tetromino, grid, direction) => {
    let newX = tetromino.x
    let newY = tetromino.y

    switch(direction) {
        case DIRECTION.DOWN:
            newX = tetromino.x + 1
            break
        case DIRECTION.LEFT:
            newY = tetromino.y - 1
            break
        case DIRECTION.RIGHT:
            newY = tetromino.y + 1
            break
    }

    return tetromino.block.every((row, i) => {
        return row.every((value, j) => {
            let x = newX + i
            let y = newY + j
            return value === 0 || (isInGrid(x, y, grid) && !isFilled(x, y, grid))
        })
    })
}

rotatable = (tetromino, grid) => {
    // 
    // Clone block from main block
    // 
    let cloneBlock = JSON.parse(JSON.stringify(tetromino.block))
    // 
    // Rotate clone block
    // 
    for (let y = 0; y < cloneBlock.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [cloneBlock[x][y], cloneBlock[y][x]] = 
            [cloneBlock[y][x], cloneBlock[x][y]];
        }
    }
    cloneBlock.forEach(row => row.reverse());
    // 
    // Check rotated clone block is visible
    // 
    return cloneBlock.every((row, i) => {
        return row.every((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            return value === 0 || (isInGrid(x, y, grid) && !isFilled(x, y, grid))
        })
    })
}

// END CHECK COLLISION

checkFilledRow = (row) => {
    return row.every((v) => {
        return v.value !== 0
    })
}

deleteRow = (row_index, grid) => {
    for (let index = row_index; index > 0; index--) {
        for (let i = 0; i < 10; i++) {
            grid.board[index][i].value = grid.board[index-1][i].value
            let value = grid.board[index][i].value
            field[grid.board[index][i].index].style.background = value === 0 ? TRANSPARENT : COLORS[value - 1]
        }
    }
}

checkGrid = (grid, game, score_span) => {
    let row_count = 0
    grid.board.forEach((row, i) => {
        // console.log(checkFilledRow(row))
        if (checkFilledRow(row)) {
            deleteRow(i, grid)
            row_count++
        }
    })
    if (row_count > 0) {
        updateScore(game, row_count, score_span)
    }
}

updateScore = (game, row_count, score_span) => {
    game.score += (row_count*MAIN_SCORE + (row_count - 1)*BONUS_SCORE)
    score_span.innerHTML = game.score
}

// END FUNCTION

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
                hardDrop(tetromino, grid)
                break
        }
    })
})

document.addEventListener('keydown', (e) => {
    let key = e.keyCode
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
            e.preventDefault()
            toggleBtn(btn_drop)
            hardDrop(tetromino, grid)
            break
    }
})

document.addEventListener('keyup', (e) => {
    let key = e.keyCode
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

let game = {
    score: 0,
    speed: 1000,
}

let score = 0

let score_span = document.querySelector('#score')

score_span.innerHTML = game.score

let speed = 1000

let grid = newGrid(GRID_WIDTH, GRID_HEIGHT)

let tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)

drawTetromino(tetromino, grid, GRID_HEIGHT, GRID_WIDTH)

gameLoop = setInterval(() => {
    // DEFINE OBJECT

    console.log(game.score)

    if (movable(tetromino, grid, DIRECTION.DOWN)) {
        moveDown(tetromino, grid)
    } else {
        updateGrid(tetromino, grid)
        checkGrid(grid, game, score_span)
        tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)
        drawTetromino(tetromino, grid, GRID_HEIGHT, GRID_WIDTH)
    }

    // END DEFINE OBJECT
}, speed);

// END GAME LOOP

