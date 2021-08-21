class Tetromino {
	constructor(type, color, posX, posY) {
		this.type = type
		this.blockArr = [new Block(color, type), new Block(color, type), new Block(color, type), new Block(color, type)]
		this.positionX = posX
		this.positionY = posY
		this.currentOrientation = 0
		this.orientations = []
		this.hasFallen = false
	}

	getBlockRelativePositions() {
		let positions = []
		this.orientations[this.currentOrientation].forMatrix((value, row, col) => {
			if (value instanceof Block) {
				positions.push({x: col, y: row})
			}
		})
		return positions
	}

	setBlockPositions() {
		this.orientations[this.currentOrientation].forMatrix((value, row, col) => {
			if (value instanceof Block) {
				value.posX = this.positionX + col
				value.posY = this.positionY + row
			}
		})
	}

	updateBlockPositions(delta, axis) {
		// should be called after a move
		for (const block of this.blockArr) {
			if (axis === "x") {
				block.posX += delta	
			} else if (axis === "y") {
				block.posY += delta
			}
		}
	}

	moveDirection(dir, stack) {
		let movementDelta = dir
		let noCollisions = null

		noCollisions = this.checkCollisionsAfterMove("horizontal", movementDelta, stack)
		
		// TODO: IMPLEMENT SOFT AND SONIC DROPS
		
		if (noCollisions) {
			this.positionX += movementDelta
			this.updateBlockPositions(movementDelta, "x")
		}
	}

	moveDownAndLockCheck(stack) {
		
		let movementDelta = 1
		let noCollisions = this.checkCollisionsAfterMove("vertical", movementDelta, stack)

		if (noCollisions) {
			this.positionY += movementDelta
			this.updateBlockPositions(movementDelta, "y")
			this.hasFallen = true

			return false
		}
		return true
	}

	moveDownXAmount(stack, distance) {
		let validFallDistance = 0
		
		for (let i = 1; i <= distance; i++) {
			let validMove = true
			this.blockArr.forEach((block)=>{
				let curX = block.posX
				let newY = block.posY + i
				
				if (newY > 21) {
					validMove = false
				} else {
					validMove = validMove && !(stack.matrixArray[newY][curX] instanceof Block)
				}
			})
			if (validMove) {
				validFallDistance++
			} else {
				break
			}
		}

		this.positionY += validFallDistance
		this.updateBlockPositions(validFallDistance, "y")
		if (validFallDistance) {
			this.hasFallen = true
			
		}
	}

	checkCollisionsAfterMove(dir, delta, stack) {
		let noCollisions = true
		switch (dir) {
			case "horizontal":
				// check for edges
				this.blockArr.forEach((block) => {
					let newX = block.posX + delta
					let newY = block.posY
					noCollisions = noCollisions && (newX >= 0 && newX < 10) 				// Checks left and right walls
					noCollisions = noCollisions && !(stack.matrixArray[newY][newX] instanceof Block)	// Checks if there's a block where it wants to move to
				})
				
				break
			case "vertical":
				this.blockArr.forEach((block) => {
					let newX = block.posX
					let newY = block.posY + delta
					noCollisions = noCollisions && newY < 22 				// Checks if beyond floor
					noCollisions = noCollisions && !(stack.matrixArray[newY][newX] instanceof Block)	// Checks if there's a block where it wants to move to
				})
				break
		}
		return noCollisions
	}

	checkCollisionsAfterRotation(stack, delta) {
		let relativeBlockPositions = this.getBlockRelativePositions()
		let validRotate = true
		relativeBlockPositions.forEach((item) => {
			let realX = this.positionX + item.x + delta
			let realY = this.positionY + item.y
			validRotate = validRotate && 
							(realX >= 0 && realX < 10) &&
							(realY < 22) &&
							!(stack.matrixArray[realY][realX] instanceof Block)   // checks for overlapping block on stack	
		})

		return validRotate
	}

	IRS(rotationDelta) {
		this.currentOrientation += rotationDelta
		if (this.currentOrientation < 0) {
			this.currentOrientation = this.orientations.length - 1
		} else if (this.currentOrientation >= this.orientations.length) {
			this.currentOrientation = 0
		}
		this.setBlockPositions()
	}


	rotateCCW(stack, DAS, DASDir) {
		let wallkickDelta = 0 // -1 is move left one, 0 is no wallkick, 1 is move right once, 2 is move right twice
		let validWallkick = false
		let validRotate = true
		let oldOrientation = this.currentOrientation

		// Sets the initial rotation position
		if (this.currentOrientation === 0) {
			this.currentOrientation = this.orientations.length - 1
		} else {
			this.currentOrientation--
		}
		
		if (DAS) {
			validRotate = this.checkCollisionsAfterRotation(stack, DASDir)
			if (validRotate) {return}
		}

		// Check if OOB or overlapping block on stack
		// if inital rotation is valid, make no changes
		validRotate = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validRotate) {return}

		// if not a valid rotation, check first wallkick position, once to the right
		wallkickDelta = 1
		validWallkick = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validWallkick) {
			this.positionX += wallkickDelta
			return
		}

		// if first wallkick fails, check 2nd position, once to the left
		wallkickDelta = -1
		validWallkick = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validWallkick) {
			this.positionX += wallkickDelta
			return
		}

		// if 2nd wallkick fails, check final position, twice to the right
		wallkickDelta = 2
		validWallkick = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validWallkick) {
			this.positionX += wallkickDelta
			return
		}

		// Should only happen if both the rotation and all wallkicks fail
		this.currentOrientation = oldOrientation
		
		
	}

rotateCW(stack, DAS, DASDir) {
		let wallkickDelta = 0 // -1 is move left one, 0 is no wallkick, 1 is move right once, 2 is move right twice
		let validWallkick = false
		let validRotate = true
		let oldOrientation = this.currentOrientation

		// Sets the initial rotation position
		if (this.currentOrientation === (this.orientations.length - 1)) {
			this.currentOrientation = 0
		} else {
			this.currentOrientation++
		}
		
		if (DAS) {
			validRotate = this.checkCollisionsAfterRotation(stack, DASDir)
			if (validRotate) {return}
		}

		// Check if OOB or overlapping block on stack
		// if inital rotation is valid, make no changes
		validRotate = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validRotate) {return}

		// if not a valid rotation, check first wallkick position, once to the right
		wallkickDelta = 1
		validWallkick = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validWallkick) {
			this.positionX += wallkickDelta
			return
		}

		// if first wallkick fails, check 2nd position, once to the left
		wallkickDelta = -1
		validWallkick = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validWallkick) {
			this.positionX += wallkickDelta
			return
		}

		// if 2nd wallkick fails, check final position, twice to the right
		wallkickDelta = 2
		validWallkick = this.checkCollisionsAfterRotation(stack, wallkickDelta)
		if (validWallkick) {
			this.positionX += wallkickDelta
			return
		}

		// Should only happen if both the rotation and all wallkicks fail
		this.currentOrientation = oldOrientation
		
		
	}
}

class iPiece extends Tetromino {
	constructor() {
		super("i-piece", "red", 3, 1)
		
		this.orientations = 
			[
				new Matrix(4, 4),
				new Matrix(4, 4)
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["0 1", "1 1", "2 1", "3 1"])
		this.orientations[1].setBlocks(this.blockArr, ["2 0", "2 1", "2 2", "2 3"])

		this.setBlockPositions()
	}

	rotateCCW(stack) {
		let validRotate = true
		let oldOrientation = this.currentOrientation

		// Sets the initial rotation position
		if (this.currentOrientation === 0) {
			this.currentOrientation = this.orientations.length - 1
		} else {
			this.currentOrientation--
		}
		
		// Check if OOB or overlapping block on stack
		// if inital rotation is valid, make no changes
		validRotate = this.checkCollisionsAfterRotation(stack, 0)
		if (validRotate) {return}

		this.currentOrientation = oldOrientation
	}

	rotateCW(stack) {
		let validRotate = true
		let oldOrientation = this.currentOrientation

		// Sets the initial rotation position
		if (this.currentOrientation === (this.orientations.length - 1)) {
			this.currentOrientation = 0
		} else {
			this.currentOrientation++
		}
		
		// Check if OOB or overlapping block on stack
		// if inital rotation is valid, make no changes
		validRotate = this.checkCollisionsAfterRotation(stack, 0)
		if (validRotate) {return}

		this.currentOrientation = oldOrientation
	}


}

class sPiece extends Tetromino {
	constructor() {
		super("s-piece", "purple", 3, 1)
		
		this.orientations = 
			[
				new Matrix(3, 3),
				new Matrix(3, 3)
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["0 2", "1 2", "1 1", "2 1"])
		this.orientations[1].setBlocks(this.blockArr, ["0 0", "0 1", "1 1", "1 2"])

		this.setBlockPositions()
	}
}

class zPiece extends Tetromino {
	constructor() {
		super("z-piece", "green", 3, 1)
		
		this.orientations = 
			[
				new Matrix(3, 3),
				new Matrix(3, 3)
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["0 1", "1 1", "1 2", "2 2"])
		this.orientations[1].setBlocks(this.blockArr, ["2 0", "2 1", "1 1", "1 2"])

		this.setBlockPositions()
	}
}

class tPiece extends Tetromino {
	constructor() {
		super("t-piece", "teal", 3, 1)
		
		this.orientations = 
			[
				new Matrix(3, 3),
				new Matrix(3, 3),
				new Matrix(3, 3),
				new Matrix(3, 3)				
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["0 1", "1 1", "2 1", "1 2"])
		this.orientations[1].setBlocks(this.blockArr, ["1 0", "1 1", "1 2", "0 1"])
		this.orientations[2].setBlocks(this.blockArr, ["2 2", "1 2", "0 2", "1 1"])
		this.orientations[3].setBlocks(this.blockArr, ["1 2", "1 1", "1 0", "2 1"])

		this.setBlockPositions()
	}
}

class lPiece extends Tetromino {
	constructor() {
		super("l-piece", "orange", 3, 1)
		
		this.orientations = 
			[
				new Matrix(3, 3),
				new Matrix(3, 3),
				new Matrix(3, 3),
				new Matrix(3, 3)				
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["0 2", "0 1", "1 1", "2 1"])
		this.orientations[1].setBlocks(this.blockArr, ["0 0", "1 0", "1 1", "1 2"])
		this.orientations[2].setBlocks(this.blockArr, ["2 2", "1 2", "0 2", "2 1"])
		this.orientations[3].setBlocks(this.blockArr, ["1 0", "1 1", "1 2", "2 2"])

		this.setBlockPositions()
	}
}

class jPiece extends Tetromino {
	constructor() {
		super("j-piece", "blue", 3, 1)
		
		this.orientations = 
			[
				new Matrix(3, 3),
				new Matrix(3, 3),
				new Matrix(3, 3),
				new Matrix(3, 3)				
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["2 2", "2 1", "1 1", "0 1"])
		this.orientations[1].setBlocks(this.blockArr, ["0 2", "1 2", "1 1", "1 0"])
		this.orientations[2].setBlocks(this.blockArr, ["0 1", "0 2", "1 2", "2 2"])
		this.orientations[3].setBlocks(this.blockArr, ["2 0", "1 0", "1 1", "1 2"])

		this.setBlockPositions()
	}
}

class oPiece extends Tetromino {
	constructor() {
		super("o-piece", "yellow", 3, 1)
		
		this.orientations = 
			[
				new Matrix(3, 3)				
			]
		
		this.orientations[0].setBlocks(this.blockArr, ["1 1", "1 2", "2 1", "2 2"])
		

		this.setBlockPositions()
	}

	rotateCW() {
		return
	}

	rotateCCW() {
		return
	}
}

class RandomPiece {
	constructor() {
		this.listOfPieces = [iPiece, oPiece, tPiece, sPiece, zPiece, lPiece, jPiece]
		this.pieceHistory = [zPiece, sPiece, sPiece, zPiece]
		this.firstPieceSelected = false
	}
	getNextPiece() {
		let newPiece = null
		let retryCounter = 0
		while (!newPiece) {
			newPiece = this.listOfPieces[Math.floor(Math.random() * this.listOfPieces.length)]
			if (!this.firstPieceSelected) {
				if (newPiece === oPiece || newPiece === sPiece || newPiece === zPiece) {
					newPiece = null
					continue
				} else {
					this.firstPieceSelected = true
					return this.returnPieceAndUpdateHistory(newPiece)
				}
			}

			if (this.pieceHistory.indexOf(newPiece) !== -1) {
				if (retryCounter === 5) {
					return this.returnPieceAndUpdateHistory(newPiece)
				} else {
					newPiece = null
					retryCounter++
					continue
				}
			}

			return this.returnPieceAndUpdateHistory(newPiece)
		}
	}
	returnPieceAndUpdateHistory(newPiece) {
		this.pieceHistory.shift()
		this.pieceHistory.push(newPiece)

		return new newPiece()
	}
}

