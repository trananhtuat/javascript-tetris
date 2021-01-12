const iBlock = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
];

const oBlock = [
    [2,2],
    [2,2]
]

const tBlock = [
    [0,3,0],
    [3,3,0],
    [0,3,0]
]

const sBlock = [
    [4,0,0],
    [4,4,0],
    [0,4,0]
]

const zBlock = [
    [0,5,0],
    [5,5,0],
    [5,0,0]
]

const lBlock = [
    [6,6,0],
    [0,6,0],
    [0,6,0]
]

const jBlock = [
    [7,7,0],
    [7,0,0],
    [7,0,0]
]

const BLOCKS = [iBlock, oBlock, tBlock, sBlock, zBlock, lBlock, jBlock]

const COLORS = [
    '#c23616',
    '#0097e6',
    '#44bd32',
    '#e1b12c',
    '#8c7ae6',
    '#e84393',
    '#00cec9'
]

const TRANSPARENT = 'transparent'

const DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    ROTATE: 'ROTATE'
}

//  keycode

const KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    P: 80
}

// board size
const GRID_HEIGHT = 20
const GRID_WIDTH = 10

// start position of block
const START_X = 0
const START_Y = 4

// start speed and score
const START_SCORE = 0
const START_SPEED = 1000

const MAIN_SCORE = 100
const BONUS_SCORE = 30

// game state
const GAME_STATE = {
    PLAY: 'PLAY',
    PAUSE: 'PAUSE',
    END: 'END',
}