class Matrix {
	constructor(row, col) {
		this.matrixArray = []
		for (let rows = 0; rows < row; rows++) {
			let rowArray = []
			for (let cols = 0; cols < col; cols++) {
				rowArray.push(null)
			}
			this.matrixArray.push(rowArray)
		}
		// console.log(this.matrixArray)
	}
	createWellDivs() {
		this.forMatrix((value, row, col)=>{
			const newDiv = document.createElement('div')
			newDiv.classList.add("cell")
			// newDiv.classList.add("has-block")  // Used to debug and confirm cells are in correct spot
			newDiv.setAttribute("id",`row${row}col${col}`)
			document.querySelector("#play-area").append(newDiv)

		})
	}
	forMatrix(callback) {
		this.matrixArray.forEach((arr, row)=>{
			arr.forEach((value, col)=>{
				callback(value, row, col)
			})
		})
	}

}