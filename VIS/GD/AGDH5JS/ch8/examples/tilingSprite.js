assets.load([
	"images/tile.png"
]).then(() => setup());

let canvas, stage, box;

function setup() {
	canvas = makeCanvas();
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	box = tilingSprite(128, 128, assets["images/tile.png"]);
	stage.putCenter(box);

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	box.tileX += 1;
	box.tileY += 1;

	render(canvas);
}