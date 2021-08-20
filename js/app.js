console.log("Tetris Project")

const game = {
	stack: null,
	preview: null,
	controls: new InputHandler(),
	randomizer: new RandomPiece(),
	currentPiece: null,
	nextPiece: null,
	gameLoop: null,
	endingLoop: null,
	endingLoopCounter: 0,
	endingBlockCount: 0,
	gameIsOver: false,
	completedLinesArray: null,
	readyForNewPiece: true,
	readyToLockPiece: false,
	currentPieceActive: true,
	DASDirection: null,
	AREActive: false,
	DASActive: false,
	lockDelayActive: false,
	lineClearActive: false,
	ARETiming: 30,
	DASTiming: 14,
	lockDelayTiming: 30,
	lineClearTiming: 41,
	internalGravity: 4,
	ARECounter: 0,
	DASCounter: 0,
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
			if (!this.AREActive && !this.lineClearActive && !this.readyToLockPiece) {
				if (this.readyForNewPiece) {
					this.currentPiece = this.nextPiece
					this.nextPiece = this.randomizer.getNextPiece()
					this.readyForNewPiece = false
					this.currentPieceActive = true
					this.ARECounter = 0
					this.lineClearCounter = 0
					if (this.controls.A === 1 && this.inputAConsumed === false) {
						this.inputAConsumed = true
						this.currentPiece.IRS(-1)
					} else if (this.controls.B === 1 && this.inputBConsumed === false) {
						this.inputBConsumed = true
						this.currentPiece.IRS(1)
					} else if (this.controls.C === 1 && this.inputCConsumed === false) {
						this.inputCConsumed = true
						this.currentPiece.IRS(-1)
					}
				}
				this.gameIsOver = this.checkForGameOver()
				if (!this.gameIsOver) {
					// TODO: Check gravity for downwards movement
					
					this.chargeDAS()
					this.rotateTetromino()
				} else {
					clearInterval(this.gameLoop)
					this.stack.lockBlocksToStack(this.currentPiece)
					this.startEndingLoop()
				}

			} else {
				if (this.AREActive) {
					this.ARECounter++
					if (this.ARECounter > this.ARETiming) {
						this.AREActive = false
						this.readyForNewPiece = true
					}
				}
				if (this.lineClearActive) {
					this.lineClearCounter++
					if (this.lineClearCounter === Math.floor(this.lineClearTiming/2)) {
						this.stack.clearLines(this.completedLinesArray)
					}
					if (this.lineClearCounter > this.lineClearTiming) {
						this.lineClearActive = false
						
						this.readyForNewPiece = true
					}
				}
				if (this.readyToLockPiece){
					this.readyToLockPiece = false
					this.stack.lockBlocksToStack(this.currentPiece)

					
					this.completedLinesArray = this.stack.getRowsOfFullLines()

					if (this.completedLinesArray.length === 0) {
						this.AREActive = true
					} else {
						this.lineClearActive = true
						this.stack.animateClearLines(this.completedLinesArray)

					}
					
					this.currentPieceActive = false
				}
				this.chargeDAS()
			}
			game.drawBoard()	
			
		}, 1000/60)
	},
	startEndingLoop() {
		this.endingLoop = setInterval(()=>{
			this.endingLoopCounter++

			if (this.endingLoopCounter % 1 === 0) {
				this.endingLoopCounter = 0
				let py = Math.floor(this.endingBlockCount / 10) + 2
				let px = this.endingBlockCount % 10
				if (this.stack.matrixArray[py][px] instanceof Block) {
					document.querySelector(`#row${py}col${px}`).setAttribute("class","cell game-over has-block")
				} else {

				}
				this.endingBlockCount++
			}
			if (this.endingBlockCount >= 200) {
				clearInterval(this.endingLoop)
				this.drawGameOver()
			}
		}, 1000/60)
	},
	drawGameOver() {
		let tag = document.createElement("span")
		tag.setAttribute("id","#overlay")
		tag.innerText = "Game Over"
		document.querySelector("#play-area").append(tag)
		tag.style.top = `${(620 - 147) / 2}px`
		tag.style.left = `${(310 - 636) / 2}px`
		console.log(tag.style.top)
		setTimeout(()=>{
			tag.setAttribute("class","expand-horiz")

			const refreshButton = document.createElement("button")
			refreshButton.innerText = "Reset Game?"
			document.querySelector("#play-area").append(refreshButton)
			refreshButton.style.top = (620 + 150) / 2 + "px"
			refreshButton.style.left = ((310 - refreshButton.clientWidth) / 2) + "px" 

			refreshButton.addEventListener("click", () => {
				location.reload()
			})

		},250)
	},
	checkForGameOver() {
		for (const block of this.currentPiece.blockArr) {
			if (this.stack.matrixArray[block.posY][block.posX] instanceof Block) {
				return true
			}
		}
		return false
	},
	rotateTetromino() {
		if (this.controls.A === 1 && this.controls.inputAConsumed === false) {
			this.controls.inputAConsumed = true
			this.currentPiece.rotateCCW(this.stack, this.DASActive, this.DASDirection)
			this.currentPiece.setBlockPositions()
		} else if (this.controls.B === 1 && this.controls.inputBConsumed === false) {
		    this.controls.inputBConsumed = true
		    this.currentPiece.rotateCW(this.stack, this.DASActive, this.DASDirection)
		    this.currentPiece.setBlockPositions()
		} else if (this.controls.C === 1 && this.controls.inputCConsumed === false) {
			this.controls.inputCConsumed = true
			this.currentPiece.rotateCCW(this.stack, this.DASActive, this.DASDirection)
			this.currentPiece.setBlockPositions()
		}
	},
	chargeDAS() {
		if (this.controls.DASReset) {
			// Resets the DAS counter and flags if a key was lifted on the controls
			this.DASCounter = 0
			this.controls.DASReset = false
			this.DASActive = false
			this.DASDirection = null
		}

		if (this.DASCounter >= this.DASTiming) {
			// sets the DASActive flag if the counter has reached the threshhold for DAS
			this.DASActive = true
		}

		if (this.controls.left === 1) {
			if (this.DASCounter === 0 || this.DASActive){
				this.moveTetromino()
				this.DASCounter++
				this.DASDirection = -1
			} else {
				this.DASCounter++
			}
		} else if (this.controls.right === 1) {
			if (this.DASCounter === 0 || this.DASActive){
				this.moveTetromino()
				this.DASCounter++
				this.DASDirection = 1
			} else {
				this.DASCounter++
			}
		} else if (this.controls.down === 1 && !this.AREActive && !this.lockDelayActive) {
			this.readyToLockPiece = this.currentPiece.moveDownAndLockCheck(this.stack)
		} else if (this.controls.up === 1 && !this.AREActive && !this.lockDelayActive) {
			this.currentPiece.moveDownXAmount(this.stack, 20)
		}
	},
	moveTetromino() {
		if (this.controls.left === 1 && this.currentPieceActive) {
			this.currentPiece.moveDirection(-1, this.stack)
		} else if (this.controls.right === 1 && this.currentPieceActive) {
			this.currentPiece.moveDirection(1, this.stack)
		}
	},
	drawStack() {
		this.stack.forMatrix((value, row, col)=>{
			if (value instanceof Block) {
				if (value.clearFlag && !value.clearTransitionSet) {
					value.clearTransitionSet = true
					document.querySelector(`#play-area #row${row}col${col}`).setAttribute("class",`cell has-block ${value.type} break${value.posX}`)
				} else if (!value.clearFlag) {
					document.querySelector(`#play-area #row${row}col${col}`).setAttribute("class",`cell has-block ${value.type}`)
				}
			} else {
				document.querySelector(`#play-area #row${row}col${col}`).setAttribute("class","cell")
			}
		})
	},
	drawBoard() {
		this.drawStack()
		this.drawPreview()
		if (this.currentPieceActive) {
			this.drawCurrentTetromino()
		}
		
	},
	drawPreview() {
		this.preview.forMatrix((value, row, col)=>{
			document.querySelector(`#preview-row${row}col${col}`).setAttribute("class","cell")
		})

		this.nextPiece.blockArr.forEach((block)=>{
			
			let realX = block.posX + block.previewPosXOffset
			let realY = block.posY + block.previewPosYOffset
	
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


