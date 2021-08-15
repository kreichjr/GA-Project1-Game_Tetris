class InputHandler {
	constructor() {
		this.left = 0
		this.right = 0
		this.up = 0
		this.down = 0
		this.A = 0
		this.B = 0
		this.C = 0
		this.inputAConsumed = false
		this.inputBConsumed = false
		this.inputCConsumed = false
		this.DASReset = false
	}

	keydownHandler(event) {
		if (event.repeat) {
			return 				// leave the function if it's a repeated keypress
		}
		switch (event.code) {
			case "KeyA":
				// Input Left - update right to prevent two opposite keys at once
				this.left = 1
				this.right = 0
				break
			case "KeyD":
				// Input Right - update left to prevent two opposite keys at once
				this.right = 1
				this.left = 0
				break
			case "KeyW":
				// Input Up - Used for sonic drop
				this.up = 1
				this.down = 0
				break
			case "KeyS":
				// Input Down - Used to lock and move piece down
				this.down = 1
				this.up = 0
				break
			case "KeyM":
				// Button A - CCW rotation
				this.A = 1
				break
			case "Comma":
				// Button B - CW Rotation
				this.B = 1
				break
			case "Period":
				// Button C - CCW Rotation
				this.C = 1
				break
		}

	}

	keyupHandler(event) {
		switch (event.code) {
			case "KeyA":
				// Input Left - update right to prevent two opposite keys at once
				this.left = 0
				this.DASReset = true
				break
			case "KeyD":
				// Input Right - update left to prevent two opposite keys at once
				this.right = 0
				this.DASReset = true
				break
			case "KeyW":
				// Input Up - Used for sonic drop
				this.up = 0
				break
			case "KeyS":
				// Input Down - Used to lock and move piece down
				this.down = 0
				break
			case "KeyM":
				// Button A - CCW rotation
				this.A = 0
				this.inputAConsumed = false
				break
			case "Comma":
				// Button B - CW Rotation
				this.B = 0
				this.inputBConsumed = false
				break
			case "Period":
				// Button C - CCW Rotation
				this.C = 0
				this.inputCConsumed = false
				break
		}
	}
}