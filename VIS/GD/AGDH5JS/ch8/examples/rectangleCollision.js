let canvas, stage, r1, r2, message, pointer;
let draggableSprites = [];

assets.load(["fonts/puzzler.otf"]).then(() => setup());

function setup() {
	canvas = makeCanvas(256, 256);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	r1 = rectangle(64, 64, "red");
	r1.draggable = true;
	stage.putCenter(r1, -64);

	r2 = rectangle(64, 64, "blue");
	r2.draggable = true;
	stage.putCenter(r2, 16);

	message = text("No collision...", "12px puzzler", "black", 12, 12);

	pointer = makePointer(canvas);

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	pointer.updateDragAndDrop(draggableSprites);

	let collision = rectangleCollision(r1, r2, true);

	if (collision) {
		message.content = `Collision on: ${collision}`;
	} else {
		message.content = "No collision...";
	}

	render(canvas);
}