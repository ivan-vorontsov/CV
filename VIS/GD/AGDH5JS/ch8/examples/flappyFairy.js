assets.load(["images/flappyFairy.json"]).then(() => setup());

let canvas, stage, sky, blocks, pointer, finish, fairy, dustFrames, dust;

function setup() {
	canvas = makeCanvas(910, 512);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	sky = tilingSprite(canvas.width, canvas.height, assets["sky.png"]);

	blocks = group();

	let gapSize = 4;
	let numberOfPillars = 15;

	for(let i = 0; i < numberOfPillars; i++) {
		let startGapNumber = randomInt(0, 8 - gapSize);

		if (i > 0 && i % 5 === 0) gapSize -= 1;

		for(let j = 0; j < 8; j++) {
			if (j < startGapNumber || j > startGapNumber + gapSize - 1) {
				let block = sprite(assets["greenBlock.png"]);
				blocks.addChild(block);

				block.x = (i * 384) + 512;
				block.y = j * 64;
			}
		}

		if (i === numberOfPillars - 1) {
			finish = sprite(assets["finish.png"]);
			blocks.addChild(finish);
			finish.x = (i * 384) + 896;
			finish.y = 192;
		}
	}

	let fairyFrames = [
		assets["0.png"],
		assets["1.png"],
		assets["2.png"]
	];

	fairy = sprite(fairyFrames);
	fairy.fps = 24;
	fairy.setPosition(232, 32);
	fairy.vy = 0;
	fairy.oldVy = 0;

	pointer = makePointer(canvas);
	pointer.tap = () => {
		fairy.vy += 1.5;
	};

	dustFrames = [
		assets["pink.png"],
		assets["yellow.png"],
		assets["green.png"],
		assets["violet.png"]
	];

	dust = emitter(
		300,
		() => particleEffect(
			fairy.x + 8,
			fairy.y + fairy.halfHeight + 8,
			() => sprite(dustFrames),
			3,
			0,
			true,
			2.4, 3.6,
			12, 18,
			1, 2,
			0.005, 0.01,
			0.005, 0.01,
			0.05, 0.1
		)
	);

	dust.play();

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	sky.tileX -= 1;

	if (finish.gx > 256) {
		blocks.x -= 2;
	}

	if (fairy.vy > fairy.oldVy) {
		if (!fairy.playing) {
			fairy.play();
			if (fairy.visible && !dust.playing) dust.play();
		}
	}

	if (fairy.vy < 0 && fairy.oldVy > 0) {
		if (fairy.playing) fairy.stop();
		fairy.show(0);
		if (dust.playing) dust.stop();
	}

	fairy.oldVy = fairy.vy;

	fairy.vy += -0.05;
	fairy.y -= fairy.vy;

	if (particles.length > 0) {
		for(let i = particles.length - 1; i >= 0; i--) {
			let particle = particles[i];
			particle.update();
		}
	}

	let fairyVsStage = contain(fairy, stage.localBounds);
	if (fairyVsStage === "bottom" || fairyVsStage === "top") {
		fairy.vy = 0;
	}

	let fairyVsBlock = blocks.children.some(block => {
		return hitTestRectangle(fairy, block, true);
	});

	if (fairyVsBlock && fairy.visible) {
		fairy.visible = false;

		particleEffect(
			fairy.centerX, fairy.centerY,
			() => sprite(dustFrames),
			20, 
			0,
			false,
			0, 6.28,
			16, 32,
			1, 3
		);

		dust.stop();

		wait(3000).then(() => reset());
	}

	render(canvas);
}

function reset() {
	fairy.visible = true;
	fairy.y = 32;
	dust.play();
	blocks.x = 0;
}