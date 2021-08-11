console.log("Tetris Project")

const game = {
	stack: null,
	controls: new InputHandler(),
	currentPiece: null,
	nextPiece: null,
	gameLoop: null,
	readyForNewPiece: true,
	ARE: 30,
	DAS: 14,
	lockDelay: 30,
	lineClear: 41,
	internalGravity: 4,
	gravityCounter: 0,

	start() {
		this._hideStartButton()
		this.createStack()
		this.initGameLoop()
	},
	_hideStartButton() {
		document.querySelector("button").style.display = "none"
	},
	createStack() {
		this.stack = new Matrix(20, 10)
		this.stack.createWellDivs()
	},
	initGameLoop() {
		this.gameLoop = setInterval(()=>{
			// TODO: Check if topped out
			// TODO: Check if line clear delay
			// TODO: Check if delay between next piece 

			// TODO: Only occur if all of the above has finished, and ready for new piece
			if (this.readyForNewPiece) {
				this.currentPiece = new debugBlock()
				this.readyForNewPiece = false
			}

			// TODO: Check for user input -- Rotation
			// TODO: Check for user input -- Direction
			this.moveTetromino()
			// TODO: Check gravity for downwards movement

			// TODO: Make lock boolean to determine if lock needs to happen and perform

			// TODO: Set flags for lock delay, line clear delay if applicable


			// console.log("Inside the game loop")

			game.drawBoard()	
			
		}, 1000/60)
	},
	moveTetromino() {
		if (this.controls.left === 1) {
			this.currentPiece.positionX--
		} else if (this.controls.right === 1) {
			this.currentPiece.positionX++
		}

		// TODO: CHECK FOR COLLISION AND UNDO MOVE 
	},
	drawBoard() {
		this.drawTetromino()
	},
	drawTetromino() {
		let tetroX = this.currentPiece.positionX
		let tetroY = this.currentPiece.positionY
		let blockPositions = this.currentPiece.getBlockRelativePositions()
		blockPositions.forEach((val)=>{
			let realX = tetroX + val.x
			let realY = tetroY + val.y
			document.querySelector(`#row${realY}col${realX}`).classList.add(`has-block`, `${this.currentPiece.type}`)
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


