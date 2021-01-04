let board_section = document.querySelector('.board-section')

for (let index = 0; index < 200; index++) {
    let block = `
        <div class="block">
            <div></div>
        </div>
    `
    board_section.innerHTML += block
}

const iBlock = [
[0, 1, 0, 0],
[0, 1, 0, 0],
[0, 1, 0, 0],
[0, 1, 0, 0]
]

const oBlock = [
[2, 2],
[2, 2]
]

const tBlock = [
[0, 3, 0],
[3, 3, 0],
[0, 3, 0]	
]

const sBlock = [
[4, 0, 0],
[4, 4, 0],
[0, 4, 0]	
]

const zBlock = [
[0, 5, 0],
[5, 5, 0],
[5, 0, 0]	
]

const lBlock = [
[6, 6, 0],
[0, 6, 0],
[0, 6, 0]	
]

const jBlock = [
[7, 7, 0],
[7, 0, 0],
[7, 0, 0]	
]

const blocks = [iBlock, oBlock, tBlock, sBlock, zBlock, lBlock, jBlock]

const colors = [
'#c23616',
'#0097e6',
'#44bd32',
'#e1b12c',
'#8c7ae6',
'#e84393',
'#00cec9'
]

const DIRECTION = {
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
	DOWN: 'DOWN',
	ROTATE: 'ROTATE'
}

const KEY = {
	UP: '38',
	DOWN: '40',
	LEFT: '37',
	RIGHT: '39',
	SPACE: '32'
}

let field = document.getElementsByClassName('block')

class Board {
	grid
	height
	width
	constructor() {
		this.height = 20
		this.width = 10
		this.grid = new Array(this.height)
		for (let i = 0; i < this.grid.length; i++) {
			this.grid[i] = new Array(this.width)
		}
		let index = 0;
		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 10; j++) {
				this.grid[i][j] = {
					index: index++,
					value: 0
				}
			}
		}
	}
	updateBoard(tetromino) {
		tetromino.block.forEach((row, x) => {
			row.forEach((value, y) => {
				if (value > 0 && tetromino.x + x < this.height && tetromino.x + x >= 0) {
					this.grid[tetromino.x + x][tetromino.y + y].value = value
				}
			})
		})
	}
}

class Tetromino {
	x
	y
	block
	color
	ishardDrop
	constructor() {
		this.x = -1
		this.y = 4
		this.ishardDrop = false
		const random = randomBlock()
		this.block = JSON.parse(JSON.stringify(blocks[random]))
		this.color = colors[random]
	}
	draw(board) {
		let grid = board.grid
		this.block.forEach((row, x) => {
			row.forEach((value, y) => {
				if (value > 0 && this.x + x < board.height && this.x + x >= 0) {
					field[grid[this.x + x][this.y + y].index].style.background = this.color
				}
			});
		});
	}
	moveDown(board) {
		if (this.movable(board, DIRECTION.DOWN)) {
			console.log('moveDown')
			this.clear(board)
			this.x++
			this.draw(board)
		}
	}
	moveLeft(board) {
		if (this.movable(board, DIRECTION.LEFT)) {
			this.clear(board)
			this.y--
			this.draw(board)
		}
	}
	moveRight(board) {
		if (this.movable(board, DIRECTION.RIGHT)) {
			this.clear(board)
			this.y++
			this.draw(board)
		}
	}
	clear(board) {
		let grid = board.grid
		this.block.forEach((row, x) => {
			row.forEach((value, y) => {
				if (value > 0 && this.x + x < board.height && this.x + x >= 0) {
					field[grid[this.x + x][this.y + y].index].style.background = 'transparent'
				}
			});
		});
	}
	movable(board, direction) {
		if (direction !== DIRECTION.ROTATE) {
			let newX = this.x + 1
			let newY = direction === DIRECTION.LEFT ? this.y - 1 : this.y + 1
			return this.block.every((row, i) => {
				return row.every((value, j) => {
					switch(direction) {
						case DIRECTION.DOWN:
						return (newX + i < board.height && this.y + j > -1 && this.y + j < board.width && board.grid[newX + i][this.y + j].value === 0) || value === 0
						break
						case DIRECTION.LEFT:
						return (newY + j > -1 && newY + j < board.width && board.grid[this.x + i][newY + j].value === 0) || value === 0
						break
						case DIRECTION.RIGHT:
						return (newY + j < board.width && board.grid[this.x + i][newY + j].value === 0) || value === 0
						break
					}
				})
			})
		} else {
			// 
			// Clone block from main block
			// 
			let cloneBlock = JSON.parse(JSON.stringify(this.block))
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
					return this.x + i < board.height && this.y + j > -1 && this.y + j < board.width && board.grid[this.x + i][this.y + j].value === 0 || value === 0
				})
			})
		}
	}
	rotate(board) {
		if (this.movable(board, DIRECTION.ROTATE)) {
			this.clear(board)
			for (let y = 0; y < this.block.length; ++y) {
				for (let x = 0; x < y; ++x) {
					[this.block[x][y], this.block[y][x]] = 
					[this.block[y][x], this.block[x][y]];
				}
			}
			this.block.forEach(row => row.reverse());
			this.draw(board)
		}
	}
	hardDrop(board) {
		this.clear(board)
		this.ishardDrop = true
		console.log(this.block)
		while(this.collisionCheck(board)) {
			this.x++
		}
		this.draw(board)
	}
	collisionCheck(board) {
		let cloneBlock = JSON.parse(JSON.stringify(this.block))
		let newX = this.x + 1
		// cloneBlock.x++
		console.log({cloneBlock})
		return cloneBlock.every((row, i) => {
			return row.every((value, j) => {
				return (newX + i < board.height && this.y + j > -1 && this.y + j < board.width && board.grid[newX + i][this.y + j].value === 0) || value === 0
			})
		})
	}
}

init()

function init() {

	let board = new Board()
	// let nextBoard = new NextBoard()
	let nextBlocks = new Array(3)
	for (let i = 0; i < nextBlocks.length; i++) {
		const ran = randomBlock()
		nextBlocks[i] = new Tetromino()
	}
	let currBlock = nextBlocks[0]
	currBlock.draw(board)
	for (let i = 0; i < nextBlocks.length - 1; i++) {
		nextBlocks[i] = nextBlocks[i + 1]
	}
	nextBlocks[2] = new Tetromino()
	// nextBoard.draw(nextBlocks)
	let speed = 500
	let gameLoop = setInterval(function() {
		if (currBlock.movable(board, DIRECTION.DOWN)) {
			currBlock.moveDown(board)
		} else {
			board.updateBoard(currBlock)
			// currBlock = new Tetromino()
			currBlock = nextBlocks[0]
			for (let i = 0; i < nextBlocks.length - 1; i++) {
				nextBlocks[i] = nextBlocks[i + 1]
			}
			nextBlocks[2] = new Tetromino()
			nextBoard.draw(nextBlocks)
		}
	}, speed)

	document.addEventListener('keydown', function(event) {

		if (event.keyCode == KEY.UP) {
			if (currBlock.movable(board, DIRECTION.ROTATE)) {
				currBlock.rotate(board)
			}
		}
		if (event.keyCode == KEY.DOWN) {
			if (currBlock.movable(board, DIRECTION.DOWN)) {
				currBlock.moveDown(board)
			}
		}
		if (event.keyCode == KEY.LEFT) {
			if (currBlock.movable(board, DIRECTION.LEFT)) {
				currBlock.moveLeft(board)
			}
		}
		if (event.keyCode == KEY.RIGHT) {
			console.log('right')
			if (currBlock.movable(board, DIRECTION.RIGHT)) {
				currBlock.moveRight(board)
			}
		}
		if (event.keyCode == KEY.SPACE) {
			console.log('space')
			currBlock.hardDrop(board)
			// if (currBlock.movable(board, DIRECTION.RIGHT)) {
			// 	currBlock.moveRight(board)
			// }
		}
	})
}

function randomBlock() {
	return Math.floor(Math.random() * 7 )
}