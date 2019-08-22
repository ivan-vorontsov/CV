assets.load(["fonts/puzzler.otf"]).then(() => setup());

let canvas, stage, ball, bricks, message, pointer;

function setup() {
	canvas = makeCanvas(256, 256);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	let randomDiameter = randomInt(8, 32);

	ball = circle(randomDiameter, "red");

	ball.x = randomInt(0, canvas.width - ball.diameter);
	ball.y = 0;

	ball.vx = randomInt(-3, 6);
	ball.vy = 0;
	ball.gravity = 0.4;
	ball.frictionX = 1;
	ball.frictionY = 0;

	ball.mass = 0.75 + (ball.diameter / 32);

	bricks = grid(
		5, 4, 48, 48,
		true, 0, 0,
		() => {
			let brick = rectangle(randomInt(8, 32), randomInt(8, 32));
			let colors = [
				"#FFABAB", "#FFDAAB", "#DDFFAB", 
      	"#ABE4FF", "#D9ABFF"
			];
			brick.fillStyle = colors[randomInt(0, 4)];
			return brick;
		},
		() => console.log("extra!")
	);

	bricks.setPosition(8, 48);

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	ball.vy += ball.gravity;

	ball.vx *= ball.frictionX;

	ball.x += ball.vx;
	ball.y += ball.vy;

	var stageCollision = contain(ball, stage.localBounds, true);

	if (stageCollision === "bottom") {
		ball.frictionX = 0.96;
	} else {
		ball.frictionX = 1;
	}

	bricks.children.forEach(brick => {
		circleRectangleCollision(ball, brick, true, true);
	});

	render(canvas);
}