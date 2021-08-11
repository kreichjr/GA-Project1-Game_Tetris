class Tetromino {
	constructor(type, color) {
		this.type = type
		this.blockA = new Block(color)
		this.blockB = new Block(color)
		this.blockC = new Block(color)
		this.blockD = new Block(color)
	}
}

class iPiece extends Tetromino {
	constructor() {
		super("i-piece", "red")
		this.positionX = 3
		this.positionY = 2
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