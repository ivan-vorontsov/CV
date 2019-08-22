assets.load(["fonts/puzzler.otf"]).then(() => setup());

let canvas, stage, ball, box, message, pointer, draggableSprites = [];

function setup() {
	canvas = makeCanvas(256, 256);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	ball = circle(64, "red");
	ball.draggable = true;
	stage.putCenter(ball, -64);

	box = rectangle(64, 64, "blue");
	box.draggable = true;
	stage.putCenter(box, 64);

	message = text("No collision...", "12px puzzler", "black", 12, 12);

	pointer = makePointer(canvas);

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	pointer.updateDragAndDrop(draggableSprites);

	let collision = hitTestCircleRectangle(ball, box);
	if (collision) {
		message.content = collision;
	} else {
		message.content = "No collision...";
	}

	render(canvas);
}