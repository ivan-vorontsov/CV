assets.load(["images/states.png"]).then(() => setup());

let canvas, stage, elf;

function setup() {
	canvas = makeCanvas();
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	let elfFrames = frames(
		assets["images/states.png"],
		[[0, 0], [0, 64], [0, 128], [0, 192]],
		64, 64
	);

	elf = sprite(elfFrames);
	elf.states = {
		up: 0,
		left: 1,
		down: 2,
		right: 3
	};

	addStatePlayer(elf);

	let leftArrow = keyboard(37),
			upArrow = keyboard(38),
			rightArrow = keyboard(39),
			downArrow = keyboard(40);

	leftArrow.press = () => {
		elf.show(elf.states.left);
		elf.vx = -1;
		elf.vy = 0;
	};

	upArrow.press = () => {
		elf.show(elf.states.up);
		elf.vy = -1;
		elf.vx = 0;
	};

	rightArrow.press = () => {
		elf.show(elf.states.right);
		elf.vx = 1;
		elf.vy = 0;
	};

	downArrow.press = () => {
		elf.show(elf.states.down);
		elf.vy = 1;
		elf.vx = 0;
	};

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	elf.x += elf.vx;
	elf.y += elf.vy;

	render(canvas);
}