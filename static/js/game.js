let field = document.getElementsByClassName('block')

// FUNCTION

newGrid = (width, height) => {
    let grid = new Array(height)
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(width)
    }
    let index = 0;
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

resetGrid = (grid) => {
    for (let i = 0; i < grid.height; i++) {
        for (let j = 0; j < grid.width; j++) {
            grid.board[i][j].value = 0
        }
    }
    Array.from(field).forEach(e => {
        e.style.background = TRANSPARENT
    })
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
        if (checkFilledRow(row)) {
            deleteRow(i, grid)
            row_count++
        }
    })
    if (row_count > 0) {
        updateGame(game, row_count, score_span)
    }
}

updateGame = (game, row_count, score_span) => {
    game.score += (row_count*MAIN_SCORE + (row_count - 1)*BONUS_SCORE)

    game.level = Math.floor(game.score / 800) + 1

    let new_speed = game.speed < 200 ? 50 : (START_SPEED - game.level * 100)

    if (new_speed !== game.speed) {
        game.speed = new_speed
        clearInterval(game.interval)
        game.interval = setInterval(gameLoop, game.speed)
    }

    level_span.innerHTML = 'lv. ' + game.level
    score_span.innerHTML = game.score
}

// END FUNCTION

// GAME LOOP

let game = {
    score: 0,
    speed: START_SPEED,
    level: 1,
    state: GAME_STATE.END,
    interval: null
}

let score_span = document.querySelector('#score')
let level_span = document.querySelector('#level')

score_span.innerHTML = game.score

let grid = newGrid(GRID_WIDTH, GRID_HEIGHT)

let tetromino = null

// drawTetromino(tetromino, grid, GRID_HEIGHT, GRID_WIDTH)

gamePause = () => {
    game.state = GAME_STATE.PAUSE
}

gameResume = () => {
    game.state = GAME_STATE.PLAY
}

gameEnd = () => {
    
}

gameLoop = () => {
    // DEFINE OBJECT

    if (game.state === GAME_STATE.PLAY) {
        if (movable(tetromino, grid, DIRECTION.DOWN)) {
            moveDown(tetromino, grid)
        } else {
            updateGrid(tetromino, grid)
            checkGrid(grid, game, score_span)
            tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)
            if (movable(tetromino, grid, DIRECTION.DOWN)) {
                drawTetromino(tetromino, grid, GRID_HEIGHT, GRID_WIDTH)
            } else {
                game.state = GAME_STATE.END
                let body = document.querySelector('body')
                body.classList.toggle('end')
                body.classList.toggle('play')

                let rs_level = document.querySelector('#result-level')
                let rs_score = document.querySelector('#result-score')

                rs_level.innerHTML = game.level
                rs_score.innerHTML = game.score
            }
        }
    }

    // END DEFINE OBJECT
}

gameStart = () => {
    game.state = GAME_STATE.PLAY
    tetromino = newTetromino(BLOCKS, COLORS, START_X, START_Y)
    drawTetromino(tetromino, grid, GRID_HEIGHT, GRID_WIDTH)
    game.interval = setInterval(gameLoop, game.speed)
}

gameReset = () => {
    
    clearInterval(game.interval)
    resetGrid(grid)
    game.score = START_SCORE
    game.speed = START_SPEED
    game.state = GAME_STATE.PLAY
    game.level = 1
    game.interval = null
    tetromino = null

    level_span.innerHTML = 'lv. ' + game.level
    score_span.innerHTML = game.score
}

// gameStart()

// END GAME LOOP

// KEYBOARD EVENT

let btn_up = document.querySelector('#btn-up')
let btn_down = document.querySelector('#btn-down')
let btn_left = document.querySelector('#btn-left')
let btn_right = document.querySelector('#btn-right')
let btn_drop = document.querySelector('#btn-drop')

let btn_play = document.querySelector('#btn-play')

toggleBtn = (btn) => {
    btn.classList.toggle('active')
}

let btns = document.querySelectorAll('[id*="btn-"]')

btns.forEach(e => {
    let btn_id = e.getAttribute('id')
    let body = document.querySelector('body')
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
            case 'btn-theme':
                body.classList.toggle('dark')
                let status_bar = document.querySelector("meta[name='theme-color'")
                status_bar.setAttribute("content", body.classList.contains('dark') ? "#243441" : "#ECF0F3")
                break
            case 'btn-pause':
                console.log(game)
                let curr_state = game.state
                if (curr_state === GAME_STATE.PLAY) {
                    body.classList.add('pause')
                    btn_play.innerHTML = 'resume'
                    body.classList.remove('play')
                    gamePause()
                } 
                if (curr_state === GAME_STATE.PAUSE) {
                    body.classList.remove('pause')
                    body.classList.add('play')
                    gameResume()
                }
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
            case 'btn-new-game':
                gameReset()
                body.classList.remove('pause')
                body.classList.remove('end')
                body.classList.add('play')
                gameStart()
                break
            case 'btn-help':
                let how_to = document.querySelector('.how-to')
                how_to.classList.toggle('active')
                break
        }
    })
})

// let btn_theme = document.querySelector('#btn-theme')
// btn_theme.addEventListener('click', (e) => {
    
// })

document.addEventListener('keydown', (e) => {
    let body = document.querySelector('body')
    e.preventDefault()
    let key = e.which
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
            hardDrop(tetromino, grid)
            break
        case KEY.P:
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

console.log('%c GAME READY', 'color: #0AFFEF');
