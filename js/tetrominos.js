class Tetromino {
	constructor(type, color, posX, posY) {
		this.type = type
		this.blockArr = [new Block(color), new Block(color), new Block(color), new Block(color)]
		this.positionX = posX
		this.positionY = posY
		this.currentOrientation = 0
		this.orientations = []
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
		let movementDelta = 0
		let noCollisions = null
		

		if (dir === "left") {
			movementDelta = -1
		} else if (dir === "right") {
			movementDelta = 1
		}

		if (dir === "down") {
			movementDelta = -1
			noCollisions = this.checkCollisionsAfterMove("vertical", movementDelta, stack)
		} else {
			noCollisions = this.checkCollisionsAfterMove("horizontal", movementDelta, stack)
		}
		// TODO: IMPLEMENT SOFT AND SONIC DROPS
		
		if (noCollisions && (dir === "left" || dir === "right")) {

			this.positionX += movementDelta
			this.updateBlockPositions(movementDelta, "x")
		} else if (noCollisions && dir === "down") {
			// TODO: CODE FOR SOFT DROP / LOCK
		} else if (dir === "up") {
			// TODO: CODE FOR SONIC DROP
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
					console.log("x", newX, "y", newY)
					noCollisions = noCollisions && (newX >= 0 && newX < 10) 				// Checks left and right walls
					noCollisions = noCollisions && !(stack.matrixArray[newY][newX] instanceof Block)	// Checks if there's a block where it wants to move to
				})
				
				break
			case "vertical":
				// TODO: IMPLEMENT SOFT AND SONIC DROPS
				break
		}
		return noCollisions
	}
}

class iPiece extends Tetromino {
	constructor() {
		super("i-piece", "red", 3, 0)
		
		
		this.orientations = 
			[
				new Matrix(4, 4),
				new Matrix(4, 4)
			]
		this.orientations[0].setBlocks(this.blockArr, ["0 2", "1 2", "2 2", "3 2"])
		this.orientations[1].setBlocks(this.blockArr, ["2 0", "2 1", "2 2", "2 3"])

		this.setBlockPositions()

	}
}
