console.log("Tetris Project")

const game = {
	stack: null,
	start() {
		this._hideStartButton()
		this.createStack()
	},
	_hideStartButton() {
		document.querySelector("button").style.display = "none"
	},
	createStack() {
		this.stack = new Matrix(20, 10)
		this.stack.createWellDivs()
	}
}

const startButton = document.createElement("button")
startButton.innerText = "Start Game!"
document.body.append(startButton)
startButton.style.top = innerHeight / 2 + "px"
startButton.style.left = ((innerWidth - startButton.clientWidth) / 2) + "px" 

startButton.addEventListener("click", (event)=>{
	game.start()
})


