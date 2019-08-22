assets.load(["images/walkcycle.png", "images/forest.png"]).then(() => setup());

let canvas, stage, elf, forest

function setup() {
	canvas = makeCanvas(256, 256);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	forest = sprite(assets["images/forest.png"]);

	let elfFrames = filmstrip(assets["images/walkcycle.png"], 64, 64);

	elf = sprite(elfFrames);

	elf.states = {
		up: 0,
		left: 9,
		down: 18,
		right: 27,
		walkUp: [1, 8],
		walkLeft: [10, 17],
		walkDown: [19, 26],
		walkRight: [28, 35]
	};

	elf.fps = 12;

	let leftArrow = keyboard(37),
			upArrow = keyboard(38),
			rightArrow = keyboard(39),
			downArrow = keyboard(40);

	leftArrow.press = function () {
		elf.playSequence(elf.states.walkLeft);
		elf.vx = -1;
		elf.vy = 0;
	};

	leftArrow.release = function () {
		if (!rightArrow.isDown && elf.vy === 0) {
			elf.show(elf.states.left);
			elf.vx = 0;
		}
	};

	rightArrow.press = function () {
		elf.playSequence(elf.states.walkRight);
		elf.vx = 1;
		elf.vy = 0;
	};

	rightArrow.release = function () {
		if (!leftArrow.isDown && elf.vy === 0) {
			elf.show(elf.states.right);
			elf.vx = 0;
		}
	};

	upArrow.press = function () {
		elf.playSequence(elf.states.walkUp);
		elf.vx = 0;
		elf.vy = -1;
	};

	upArrow.release = function () {
		if (!downArrow.isDown && elf.vx === 0) {
			elf.show(elf.states.up);
			elf.vy = 0;
		}
	};

	downArrow.press = function () {
		elf.playSequence(elf.states.walkDown);
		elf.vx = 0;
		elf.vy = 1;
	};

	downArrow.release = function () {
		if (!upArrow.isDown && elf.vx === 0) {
			elf.show(elf.states.down);
			elf.vy = 0;
		}
	};

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	elf.x = Math.max(-18, Math.min(elf.x + elf.vx, canvas.width - elf.width + 18));
	elf.y = Math.max(64, Math.min(elf.y + elf.vy, canvas.height - elf.height));

	render(canvas);
}