assets.load([
	"images/star.png"
]).then(() => setup());

let pointer, canvas, stage;

function setup() {
	canvas = makeCanvas(256, 256);
	canvas.style.backgroundColor = "black";
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	pointer = makePointer(canvas);

	let particleStream = emitter(
		100, 
		() => particleEffect(
			pointer.x, pointer.y,
			() => sprite(assets["images/star.png"]),
			10, 
			0.1,
			false,
			3.14, 6.28,
			16, 32,
			2, 5
		)
	);

	pointer.press = () => {
		particleStream.play();
	};

	pointer.release = () => {
		particleStream.stop();
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