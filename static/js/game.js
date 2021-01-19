
let field = document.getElementsByClassName('block')

// initial new game grid
newGrid = (width, height) => {
    let grid = new Array(height)
    for (let i = 0; i < height; i++) {
        grid[i] = new Array(width)
    }

    let index = 0
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
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

// reset grid and field color
resetGrid = (grid) => {
    for (let i = 0; i < grid.height; i++) { // row
        for (let j = 0; j < grid.width; j++) { // col
           grid.board[i][j].value = 0
        }
    }

    // reset field background
    Array.from(field).forEach(e => {
        e.style.background = TRANSPARENT
    })
} 

// create new Tetromino
newTetromino = (blocks, colors, start_x, start_y) => {
    let index = Math.floor(Math.random() * blocks.length)

    return {
        block: JSON.parse(JSON.stringify(blocks[index])),
        color: colors[index],
        x: start_x,
        y: start_y
    }
}

// draw tetromino on field
drawTetromino = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            if (value > 0) {
                field[grid.board[x][y].index].style.background = tetromino.color
            }
        })
    })
}

// clear tetromino
clearTetromino = (tetromino, grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            if (value > 0) {
                field[grid.board[x][y].index].style.background = TRANSPARENT
            }
        })
    })
}

// check point is in grid
isInGrid = (x, y, grid) => {
    return x < grid.height && x >=0 && y >= 0 && y < grid.width
}

// check point is filled or blank
isFilled = (x, y, grid) => {
    if (!isInGrid(x, y, grid)) {
        return false
    } else {
        return grid.board[x][y].value !== 0
    }
}

// check tetromino is movable?
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

// move tetromino down
moveDown = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.DOWN)) return
    clearTetromino(tetromino, grid)
    tetromino.x++
    drawTetromino(tetromino, grid)
}

// move tetromino left
moveLeft = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.LEFT)) return
    clearTetromino(tetromino, grid)
    tetromino.y--
    drawTetromino(tetromino, grid)
}

// move tetromino right
moveRight = (tetromino, grid) => {
    if (!movable(tetromino, grid, DIRECTION.RIGHT)) return
    clearTetromino(tetromino, grid)
    tetromino.y++
    drawTetromino(tetromino, grid)
}

// check rotatable
rotatable = (tetromino, grid) => {
    // clone block
    let cloneBlock = JSON.parse(JSON.stringify(tetromino.block))
    
    // rotate clone block
    for (let y = 0; y < cloneBlock.length; y++) {
        for (let x = 0; x < y; ++x) {
            [cloneBlock[x][y], cloneBlock[y][x]] = [cloneBlock[y][x], cloneBlock[x][y]]
        }
    }
    cloneBlock.forEach(row => row.reverse())

    // check rotated block is visible
    return cloneBlock.every((row, i) => {
        return row.every((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
            return value === 0 || (isInGrid(x, y, grid) && !isFilled(x, y, grid))
        })
    })
}

// rotate tetromino
rotate = (tetromino, grid) => {
    if (!rotatable(tetromino, grid)) return
    clearTetromino(tetromino, grid)
    for (let y = 0; y < tetromino.block.length; y++) {
        for (let x = 0; x < y; ++x) {
            [tetromino.block[x][y], tetromino.block[y][x]] = [tetromino.block[y][x], tetromino.block[x][y]]
        }
    }
    tetromino.block.forEach(row => row.reverse())
    drawTetromino(tetromino, grid)
}

// hard drop tetromino
hardDrop = (tetromino, grid) => {
    clearTetromino(tetromino, grid)
    while (movable(tetromino, grid, DIRECTION.DOWN)) {
        tetromino.x++
    }
    drawTetromino(tetromino, grid)
}

// update grid when tetromino down
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

// check full row
checkFilledRow = (row) => {
    return row.every(v => {
        return v.value !== 0
    })
}

// delete filled row
deleteRow = (row_index, grid) => {
    for (let row = row_index; row > 0; row--) {
        for (let col = 0; col < 10; col++) {
            grid.board[row][col].value = grid.board[row - 1][col].value
            let value = grid.board[row][col].value
            // update field
            field[grid.board[row][col].index].style.background = value === 0 ? TRANSPARENT : COLORS[value - 1]
        }
    }
}

// check grid for delete row
checkGrid = (grid) => {
    let row_count = 0
    grid.board.forEach((row, i) => {
        if (checkFilledRow(row)) {
            deleteRow(i, grid)
            row_count++
        }
    })
    if (row_count > 0) updateGame(row_count)
}

// game objects

let game = {
    score: START_SCORE,
    speed: START_SPEED,
    level: 1,
    state: GAME_STATE.END,
    interval: null
}

let grid = newGrid(GRID_WIDTH, GRID_HEIGHT)

let tetromino = null

let score_span = document.querySelector('#score')
let level_span = document.querySelector('#level')

score_span.innerHTML = game.score

// end game objects

// game loop
gameLoop = () => {
    if (game.state === GAME_STATE.PLAY) {
        if (movable(tetromino, grid, DIRECTION.DOWN)) {
            moveDown(tetromino, grid)
        } else {
            updateGrid(tetromino, grid)
            checkGrid(grid)
            tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)

            // check grid is full -> game end
            if (movable(tetromino, grid, DIRECTION.DOWN)) {
                drawTetromino(tetromino, grid)
            } else {
                // game end
                game.state = GAME_STATE.END
                let body = document.querySelector('body')
                body.classList.add('end')
                body.classList.remove('play')

                let rs_level = document.querySelector('#result-level')
                let rs_score = document.querySelector('#result-score')

                rs_level.innerHTML = game.level
                rs_score.innerHTML = game.score
            }
            
        }
    }
}

// game start
gameStart = () => {
    game.state = GAME_STATE.PLAY
    level_span.innerHTML = 'lv. 1'
    score_span.innerHTML = '0'
    tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)
    drawTetromino(tetromino, grid)
    // interval
    game.interval = setInterval(gameLoop, game.speed);
}

updateGame = (row_count) => {
    game.score += row_count * MAIN_SCORE + (row_count - 1) * BONUS_SCORE

    game.level = Math.floor(game.score / 800) + 1

    let new_speed = game.speed < 200 ? 50 : (START_SPEED - game.level * 50)

    if (new_speed !== game.speed) {
        game.speed = new_speed
        clearInterval(game.interval)
        game.interval = setInterval(gameLoop, game.speed)
    }

    level_span.innerHTML = 'lv. ' + game.level
    score_span.innerHTML = game.score
}

gamePause = () => {
    game.state = GAME_STATE.PAUSE
}

gameResume = () => {
    game.state = GAME_STATE.PLAY
}

gameReset = () => {
    clearInterval(game.interval)
    resetGrid(grid)
    game.score = START_SCORE
    game.speed = START_SPEED
    game.state = GAME_STATE.END
    game.level = 1
    game.interval = null
    tetromino = null
}


// add keyboard event
document.addEventListener('keydown', e => {
    let body = document.querySelector('body')
    e.preventDefault()
    let key = e.which
    switch(key) {
        case KEY.DOWN:
            moveDown(tetromino, grid)
            break
        case KEY.LEFT:
            moveLeft(tetromino, grid)
            break
        case KEY.RIGHT:
            moveRight(tetromino, grid)
            break
        case KEY.UP:
            rotate(tetromino, grid)
            break
        case KEY.SPACE:
            hardDrop(tetromino, grid)
            break
        case KEY.P:
            let btn_play = document.querySelector('#btn-play')
            if (game.state !== GAME_STATE.PAUSE) {
                gamePause()
                body.classList.add('pause')
                body.classList.remove('play')
                btn_play.innerHTML = 'resume'
            } else {
                body.classList.remove('pause')
                body.classList.add('play')
                gameResume()
            }
    }
})

let btns = document.querySelectorAll('[id*="btn-"]')

btns.forEach(e => {
    let btn_id = e.getAttribute('id')
    let body = document.querySelector('body')
    e.addEventListener('click', () => {
        switch(btn_id) {
            case 'btn-drop':
                hardDrop(tetromino, grid)
                break
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
            case 'btn-play':
                body.classList.add('play')
                if (game.state === GAME_STATE.PAUSE) {
                    body.classList.remove('pause')
                    gameResume()
                    return
                }
                gameStart()
                break
            case 'btn-theme':
                body.classList.toggle('dark')
                let status_bar_chrome = document.querySelector("meta[name='theme-color'")
                status_bar_chrome.setAttribute("content", body.classList.contains('dark') ? "#243441" : "#ECF0F3")

                let status_bar_win = document.querySelector("meta[name='msapplication-navbutton-color'")
                status_bar_win.setAttribute("content", body.classList.contains('dark') ? "#243441" : "#ECF0F3")

                let status_bar_ios = document.querySelector("meta[name='apple-mobile-web-app-status-bar-style'")
                status_bar_ios.setAttribute("content", body.classList.contains('dark') ? "#243441" : "#ECF0F3")
                break
            case 'btn-pause':
                gamePause()
                let btn_play = document.querySelector('#btn-play')
                btn_play.innerHTML = 'resume'
                body.classList.remove('play')
                body.classList.add('pause')
                break
            case 'btn-new-game':
                gameReset()
                body.classList.add('play')
                body.classList.remove('pause')
                body.classList.remove('end')
                gameStart()
                break
            case 'btn-help':
                let how_to = document.querySelector('.how-to')
                how_to.classList.toggle('active')
                break
        }
    })
})