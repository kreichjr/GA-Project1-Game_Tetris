console.log("Tetris Project")

const game = {
	stack: null,
	preview: null,
	controls: new InputHandler(),
	randomizer: new RandomPiece(),
	currentPiece: null,
	nextPiece: null,
	gameLoop: null,
	readyForNewPiece: true,
	readyToLockPiece: false,
	AREActive: false,
	DASActive: false,
	lockDelayActive: false,
	lineClearActive: false,
	ARE: 30,
	DAS: 14,
	lockDelay: 30,
	lineClear: 41,
	internalGravity: 4,
	AREcounter: 0,
	DAScounter: 0,
	lockDelayCounter: 0,
	lineClearCounter: 0,
	gravityCounter: 0,

	start() {
		this._hideStartButton()
		this.createStack()
		this.createPreview()
		this.nextPiece = this.randomizer.getNextPiece()
		this.initGameLoop()
	},
	_hideStartButton() {
		document.querySelector("button").style.display = "none"
	},
	createPreview() {
		this.preview = new Matrix(2, 4)
		this.preview.createPreviewDivs()
	},
	createStack() {
		this.stack = new Matrix(22, 10)
		this.stack.createWellDivs()
	},
	initGameLoop() {
		this.gameLoop = setInterval(()=>{
			// TODO: Check if topped out
			// TODO: Check if line clear delay
			// TODO: Check if delay between next piece 

			// TODO: Only occur if all of the above has finished, and ready for new piece
			if (!this.AREActive && !this.lockDelayActive && !this.lineClearActive) {
				if (this.readyForNewPiece) {
					this.currentPiece = this.nextPiece
					this.nextPiece = this.randomizer.getNextPiece()
					this.readyForNewPiece = false
				}

				
				this.moveTetromino()
				
				this.rotateTetromino()
				// TODO: Check gravity for downwards movement

				

				// TODO: Set flags for lock delay, line clear delay if applicable


				// console.log("Inside the game loop")
			}
			game.drawBoard()	
			
		}, 1000/60)
	},
	rotateTetromino() {
		if (this.controls.A === 1 && this.controls.inputAConsumed === false) {
			this.controls.inputAConsumed = true
			this.currentPiece.rotateCCW(this.stack)
			this.currentPiece.setBlockPositions()
		} else if (this.controls.B === 1 && this.controls.inputBConsumed === false) {
			this.controls.inputBConsumed = true
			this.currentPiece.rotateCW(this.stack)
			this.currentPiece.setBlockPositions()
		} else if (this.controls.C === 1 && this.controls.inputCConsumed === false) {
			this.controls.inputCConsumed = true
			this.currentPiece.rotateCCW(this.stack)
			this.currentPiece.setBlockPositions()
		}
	},
	moveTetromino() {
		if (this.controls.left === 1) {
			// this.currentPiece.positionX--
			this.currentPiece.moveDirection("left", this.stack)
		} else if (this.controls.right === 1) {
			// this.currentPiece.positionX++
			this.currentPiece.moveDirection("right", this.stack)
		} else if (this.controls.down === 1) {
			this.currentPiece.moveDirection("down", this.stack)
		}
	},
	setLockPieceFlag() {
		this.readyToLockPiece = true
	},
	drawStack() {
		this.stack.forMatrix((value, row, col)=>{
			document.querySelector(`#play-area #row${row}col${col}`).setAttribute("class","cell")
		})
	},
	drawBoard() {
		this.drawStack()
		this.drawPreview()
		this.drawCurrentTetromino()
	},
	drawPreview() {
		this.nextPiece.blockArr.forEach((block)=>{
			
			let realX = block.posX + block.previewPosXOffset
			let realY = block.posY + block.previewPosYOffset
			console.log(`${realX}, ${realY}`)
			document.querySelector(`#preview-row${realY}col${realX}`).classList.add(`has-block`, `${this.nextPiece.type}`)
		})
	},
	drawCurrentTetromino() {
		this.currentPiece.blockArr.forEach((block)=>{
			document.querySelector(`#row${block.posY}col${block.posX}`).classList.add(`has-block`, `${this.currentPiece.type}`)
		})	
	},
	_arrayEquals: function(a, b) {
  		return Array.isArray(a) &&
    			Array.isArray(b) &&
    			a.length === b.length &&
    			a.every((val, index) => val === b[index]);
	},
	_easterEgg: function(event) {
		console.log(event) // visual display of capturing key inputs
		const konamiCode = [
				"ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", 
				"ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", 
				"KeyB", "KeyA", "Enter"]
		this.inputBuffer.shift()
		this.inputBuffer.push(event.code)
		// TODO: NEED A NEW EASTER EGG/CODE

		// if (game._arrayEquals(konamiCode, this.inputBuffer)) {
		// 	this.music.init()
		// }
		
	}
}

document.onkeydown = (event) => {game.controls.keydownHandler(event)}
document.onkeyup = (event) => {game.controls.keyupHandler(event)}

const startButton = document.createElement("button")
startButton.innerText = "Start Game!"
document.body.append(startButton)
startButton.style.top = innerHeight / 2 + "px"
startButton.style.left = ((innerWidth - startButton.clientWidth) / 2) + "px" 

startButton.addEventListener("click", (event)=>{
	game.start()
})


