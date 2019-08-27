assets.load(["images/star.png"]).then(() => setup());

let canvas, stage, pointer;

function setup() {
	canvas = makeCanvas();
	canvas.style.backgroundColor = "black";
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	pointer = makePointer(canvas);

	pointer.press = () => {
		particleEffect(
			pointer.x,
			pointer.y,
			() => sprite(assets["images/star.png"]),
			20,
			0.1,
			true,
			0, Math.PI * 2,
			12, 24,
			1, 2,
			0.005, 0.01,
			0.005, 0.01,
			0.05, 0.1
		);
	};

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	if (particles.length > 0) {
		for(let i = particles.length - 1; i >= 0; i--) {
			let particle = particles[i];
			particle.update();
		}
	} 

	render(canvas);
}