class Tetromino {
	constructor(type, color, posX, posY) {
		this.type = type
		this.blockA = new Block(color)
		this.blockB = new Block(color)
		this.blockC = new Block(color)
		this.blockD = new Block(color)
		this.positionX = posX
		this.positionY = posY
	}


}

class iPiece extends Tetromino {
	constructor() {
		super("i-piece", "red", 3, 0)
		
		this.currentOrientation = 0
		this.orientations = 
			[
				[
					[null,null,null,null],
					[null,null,null,null],
					[blockA, blockB, blockC, blockD],
					[null,null,null,null]
				],
				[
					[null,null,blockA,null],
					[null,null,blockB,null],
					[null,null,blockC,null],
					[null,null,blockD,null]

				]
			]

	}
}

class debugBlock extends Tetromino {
	constructor() {
		super("i-piece", "red", 0, 0)
		this.currentOrientation = 0
		this.orientations = [
								[null, null, null],
								[null, null, null],
								[null, this.blockA, null]
							]
	}

	getBlockRelativePositions() {
		let positions = []
		for (let i = 0; i < this.orientations.length; i++) {
			
			for (let j = 0; j < this.orientations[i].length; j++) {
				
				let blk = this.orientations[i][j]
				
				if (blk instanceof Block)
					positions.push({x: j, y: i})
			}
		}
		return positions
	}
}