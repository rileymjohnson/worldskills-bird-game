var canvas = document.getElementById("gameCanvas")
var ctx = canvas.getContext("2d")

var paused = true
var stopped = false
started = false
var time = 0
var fuelCount = 10
var starCount = 0
var muted = false

var mainAudio = new Audio("audio/background.mp3")
mainAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    if (!muted) {
    	this.play();
    }
}, false);

var endAudio = new Audio("audio/finish.mp3")
var hitAudio = new Audio("audio/hit.mp3")
var starAudio = new Audio("audio/star.mp3")

/*
plane
*/

var planeImage = new Image()
planeImage.src = "img/plane.png"

function Plane(width, height, speed) {
	this.x = 0
	this.y = 359
	this.speed = speed || 3
	this.height = height
	this.width = width
}

Plane.prototype.render = function() {
	// ctx.beginPath()
	// ctx.rect(this.x, this.y, this.width, this.height)
	// ctx.fillStyle = "red"
	// ctx.fill()
	// ctx.closePath()
	ctx.drawImage(planeImage, 0, 0,564, 301, this.x, this.y, this.width, this.height)
}
Plane.prototype.move = function() {
	if (keys.up && this.y > 0) this.setY(this.y - this.speed)
	if (keys.down && this.y < canvas.height - this.height) this.setY(this.y + this.speed)
	if (keys.left && this.x > 0) this.setX(this.x - this.speed)
	if (keys.right && this.x < canvas.width - this.width) this.setX(this.x + this.speed)
}

Plane.prototype.setX = function(x) {
	this.x = x
}

Plane.prototype.setY = function(y) {
	this.y = y
}

var plane = new Plane(188, 100.3333333, 5)

/*
clouds
*/

function Cloud(width, height, stagger, speed, cloud) {
	this.x = stagger
	this.y = 0
	this.speed = speed || 2
	this.width = width
	this.height = height
	this.cloud = cloud
}

Cloud.prototype.render = function() {
	// ctx.beginPath()
	// ctx.rect(this.x, this.y, this.width, this.height)
	// ctx.fillStyle = "blue"
	// ctx.fill()
	// ctx.closePath()
	ctx.drawImage(this.cloud, 0, 0,833, 388, this.x, this.y, this.width, this.height)
}

Cloud.prototype.move = function() {
	if (this.x + this.width <= 0) { //start this over
		this.x = canvas.width
	}
	this.setX(this.x - this.speed)
}

Cloud.prototype.setX = function(x) {
	this.x = x
}

var cloud1Image = new Image()
cloud1Image.src = "img/cloud1.jpg"

var cloud2Image = new Image()
cloud2Image.src = "img/cloud2.jpg"

var cloud3Image = new Image()
cloud3Image.src = "img/cloud3.jpg"

var cloud4Image = new Image()
cloud4Image.src = "img/cloud4.jpg"

var cloud1 = new Cloud(166.6, 77.6, 0, 5, cloud1Image)
var cloud2 = new Cloud(166.6, 77.6, 306, 5, cloud2Image)
var cloud3 = new Cloud(166.6, 77.6, 612, 5, cloud3Image)
var cloud4 = new Cloud(166.6, 77.6, 918, 5, cloud4Image)

/*
birds
*/

var spriteCounter = 0
function getSpriteNums() {
	var count = Math.floor(spriteCounter)
	var x = 240 * (count % 5)
	var y = 314 * Math.floor(count / 5)
	if (spriteCounter == 21) {
		spriteCounter = 0
	} else {
		spriteCounter += 1/8
	}
	return {
		x: x,
		y: y
	}
}

var birdImage = new Image()
birdImage.src = "img/bird.png"

function Birds(width, height, speed, numberOfBirds) {
	this.speed = speed || 2
	this.width = width
	this.height = height
	this.ys = {}
	this.xs = {}

	this.numberOfBirds = numberOfBirds
	for (i = 0; i < this.numberOfBirds; i++) {
		this.resetBird(i)
	}
}

Birds.prototype.resetBird = function(i) {
	this.ys[i] = Math.round(Math.random()*(canvas.height - this.height))
	this.xs[i] = canvas.width + Math.round(Math.random()*(canvas.width))
}

Birds.prototype.render = function() {
	for (i = 0; i < this.numberOfBirds; i++) {
		// ctx.beginPath()
		// ctx.rect(this.xs[i], this.ys[i], this.width, this.height)
		// ctx.fillStyle = "pink"
		// ctx.fill()
		// ctx.closePath()
		var spriteNums = getSpriteNums()
		ctx.drawImage(birdImage, spriteNums.x, spriteNums.y, 240, 314, this.xs[i], this.ys[i], this.width, this.height)
	}
}

Birds.prototype.move = function() {
	for (i = 0; i < this.numberOfBirds; i++) {
		this.setX(i, this.xs[i] - this.speed)
	}
}

Birds.prototype.setX = function(i, x) {
	this.xs[i] = x
}

var birds = new Birds(80, 104.66666666666, 8, 3)

/*
fuel
*/

var fuelImage = new Image()
fuelImage.src = "img/parachute.png"

function Fuel(width, height, speed, number) {
	this.speed = speed || 2
	this.width = width
	this.height = height
	this.ys = {}
	this.xs = {}

	this.number = number
	for (i = 0; i < this.number; i++) {
		this.reset(i)
	}
}

Fuel.prototype.reset = function(i) {
	this.xs[i] = Math.round(Math.random()*(canvas.width - this.width))
	this.ys[i] = 0 - Math.round(Math.random()*(canvas.height))*2
}

Fuel.prototype.render = function() {
	for (i = 0; i < this.number; i++) {
		// ctx.beginPath()
		// ctx.rect(this.xs[i], this.ys[i], this.width, this.height)
		// ctx.fillStyle = "orange"
		// ctx.fill()
		// ctx.closePath()
		ctx.drawImage(fuelImage, 0, 0,512, 512, this.xs[i], this.ys[i], this.width, this.height)
	}
}

Fuel.prototype.move = function() {
	for (i = 0; i < this.number; i++) {
		this.setY(i, this.ys[i] + this.speed)
	}
}

Fuel.prototype.setY = function(i, y) {
	this.ys[i] = y
}

var fuel = new Fuel(50, 50, 12, 2)

/*
stars
*/

var starImage = new Image()
starImage.src = "img/star.png"

function Stars(width, height, speed, number) {
	this.speed = speed || 2
	this.width = width
	this.height = height
	this.ys = {}
	this.xs = {}

	this.number = number
	for (i = 0; i < this.number; i++) {
		this.reset(i)
	}
}

Stars.prototype.reset = function(i) {
	this.xs[i] = Math.round(Math.random()*(canvas.width - this.width))
	this.ys[i] = 0 - Math.round(Math.random()*(canvas.height))
}

Stars.prototype.render = function() {
	for (i = 0; i < this.number; i++) {
		// ctx.beginPath()
		// ctx.rect(this.xs[i], this.ys[i], this.width, this.height)
		// ctx.fillStyle = "yellow"
		// ctx.fill()
		// ctx.closePath()
		ctx.drawImage(starImage, 0, 0, 40, 38, this.xs[i], this.ys[i], this.width, this.height)
	}
}

Stars.prototype.move = function() {
	for (i = 0; i < this.number; i++) {
		this.setY(i, this.ys[i] + this.speed)
	}
}

Stars.prototype.setY = function(i, y) {
	this.ys[i] = y
}

var stars = new Stars(50, 50, 12, 1)

/*
main animation loop
*/
function mainLoop() {
	if (!paused) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)

	//render and move clouds
	cloud1.render()
	cloud1.move()
	cloud2.render()
	cloud2.move()
	cloud3.render()
	cloud3.move()
	cloud4.render()
	cloud4.move()

	//render bird
	birds.render()
	birds.move()
	for (i = 0; i < birds.numberOfBirds; i++) {
		//check for collisions
		if (plane.x + plane.width > birds.xs[i] && plane.x < birds.xs[i] + birds.width) {
			if (plane.y + plane.height > birds.ys[i] && plane.y < birds.ys[i] + birds.height) {
				if (!muted) {
					hitAudio.play()
				}
				endGame()
			}
		}

		//check if the bird has reached the end
		if (birds.xs[i] + birds.width <= 0) {
			birds.resetBird(i)
		}
	}

	//render fuel
	fuel.render()
	fuel.move()

	for (i = 0; i < fuel.number; i++) {
		//check for collisions
		if (plane.x + plane.width > fuel.xs[i] && plane.x < fuel.xs[i] + fuel.width) {
			if (plane.y + plane.height > fuel.ys[i] && plane.y < fuel.ys[i] + fuel.height) {
				fuel.reset(i)
				fuelCount += 10
				fuelCounter.innerHTML = fuelCount
			}
		}

		//check if the fuel/stars have reached the end
		if (fuel.ys[i] >= canvas.height) {
			fuel.reset(i)
		}
	}

	//render stars
	stars.render()
	stars.move()

	for (i = 0; i < stars.number; i++) {
		//check for collisions
		if (plane.x + plane.width > stars.xs[i] && plane.x < stars.xs[i] + stars.width) {
			if (plane.y + plane.height > stars.ys[i] && plane.y < stars.ys[i] + stars.height) {
				if (!muted) {
					starAudio.currentTime = 0
					starAudio.play()
				}
				stars.reset(i)
				starCount++
				starCounter.innerHTML = starCount
			}
		}

		//check if the stars/stars have reached the end
		if (stars.ys[i] >= canvas.height) {
			stars.reset(i)
		}
	}

	//render plane
	plane.move()
	plane.render()
	}
	//recursively call next frame
	requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)

//holds which keys are pressed
keys = {
	up: false,
	down: false,
	left: false,
	right: false
}

window.addEventListener("keydown", function(e) {
	if (e.keyCode == 37) keys.left = true
	if (e.keyCode == 39) keys.right = true
	if (e.keyCode == 38) keys.up = true
	if (e.keyCode == 40) keys.down = true
})

window.addEventListener("keyup", function(e) {
	if (e.keyCode == 37) keys.left = false
	if (e.keyCode == 39) keys.right = false
	if (e.keyCode == 38) keys.up = false
	if (e.keyCode == 40) keys.down = false
})

var pauseButton = document.getElementById("pauseButton")

pauseButton.addEventListener("click", function() {
	startOrStop()
	if (paused) {
		pauseButton.innerHTML = "&#x23f5;"
	} else {
		pauseButton.innerHTML = "||"
	}
})

var startButton = document.getElementById("startButton")

startButton.addEventListener("click", function() {
	document.getElementById("infoBox").style.display = "none"
	document.getElementById("gameInfo").style.display = "block"
	document.getElementById("controlsBox").style.display = "block"
	pauseButton.style.display = "block"
	startCount()
	paused = false
	started = true
	if (!muted) {
		mainAudio.play()
	}
})

window.addEventListener("keypress", function(e) {
	if (e.keyCode == 32) {
		if (started) {
			startOrStop()
			if (paused) {
				pauseButton.innerHTML = "&#x23f5;"
			} else {
				pauseButton.innerHTML = "||"
			}
		}
	}
})

var fontSize = document.getElementById("fontSize")

fontSize.addEventListener("change", function(e) {
	if (e.target.value == "big") {
		document.getElementById("fuelIcon").className = "fuelIconBig"
		document.getElementById("fuelCounter").className = "fuelCounterBig"
		document.getElementById("starIcon").className = "starIconBig"
		document.getElementById("starCounter").className = "starCounterBig"
		document.getElementById("timer").className = "timerBig"
		document.getElementById("pauseButton").className = "pauseButtonBig"
		document.getElementById("muteButton").className = "muteButtonBig"
		document.getElementById("fontSize").className = "fontSizeBig"
	} else {
		document.getElementById("fuelIcon").className = ""
		document.getElementById("fuelCounter").className = ""
		document.getElementById("starIcon").className = ""
		document.getElementById("starCounter").className = ""
		document.getElementById("timer").className = ""
		document.getElementById("pauseButton").className = ""
		document.getElementById("muteButton").className = ""
		document.getElementById("fontSize").className = ""
	}
})

var muteButton = document.getElementById("muteButton")

muteButton.addEventListener("click", function() {
	muted = !muted
	if (muted) {
		mainAudio.pause()
		muteButton.innerHTML = "Unmute"
	} else {
		mainAudio.play()
		muteButton.innerHTML = "Mute"
	}
})

var timeCounter = document.getElementById("timer")
var fuelCounter = document.getElementById("fuelCounter")
var starCounter = document.getElementById("starCounter")

var counter;

function startCount() {
	counter = setInterval(function() {
		time += 1
		timeCounter.innerHTML = time
		fuelCount -= 1
		fuelCounter.innerHTML = fuelCount
		if (fuelCount <= 0) {
			endGame()
		}
	}, 1000)
}

function startOrStop() {
	if (!stopped) {
		paused = !paused
		if (paused) {
			clearInterval(counter)
			mainAudio.pause()
		} else {
			startCount()
			if (!muted) {
				mainAudio.play()
			}
		}
	}
}

//deal with resizing issues
window.addEventListener("load", function() {
	moveControlsOnResize()
})

window.addEventListener("resize", function() {
	moveControlsOnResize()
})

function moveControlsOnResize() {
	var gameInfoTop = ((window.innerHeight/2) - 384) > 10? ((window.innerHeight/2) - 384) : 10
	document.getElementById("gameInfo").style.top = gameInfoTop + "px"
	var controlsBoxTop = (window.innerHeight - ((window.innerHeight/2) - 384)) - 30 > 10? (window.innerHeight - ((window.innerHeight/2) - 384)) - 30 : 10
	document.getElementById("controlsBox").style.top = controlsBoxTop + "px"
}

function endGame() {
	stopped = true
	paused = true
	clearInterval(counter)
	pauseButton.style.display = "none"
	muteButton.style.display = "none"
	fontSize.style.display = "none"
	mainAudio.pause()
	if (!muted) {
		endAudio.play()
	}
	document.getElementById("endBox").style.display = "block"
}

document.getElementById("endButton").addEventListener("click", function() {
	alert("I didn't add in this feature and nobody cares about rankings anyway")
})