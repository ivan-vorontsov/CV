let canvas, stage, level, world, player, message, score, leftArrow, rightArrow, space;

assets.load(["fonts/puzzler.otf", "images/platforms.json"]).then(() => setup());

function setup() {
	canvas = makeCanvas(512, 512);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	level = {
		widthInTiles: 16,
		heightInTiles: 16,

		tileWidth: 32,
		tileHeight: 32
	};

	world = makeWorld(level);

	player = world.player;

	message = text("score: ", "16px puzzler", "white", 32, 8);

	score = 0;

	leftArrow = keyboard(37);
	rightArrow = keyboard(39);
	space = keyboard(32);

	leftArrow.press = () => {
		if (rightArrow.isUp) {
			player.accelerationX = -0.2;
		}
	};
	leftArrow.release = () => {
		if (rightArrow.isUp) {
			player.accelerationX = 0;
		}
	};

	rightArrow.press = () => {
		if (leftArrow.isUp) {
			player.accelerationX = 0.2;
		}
	};
	rightArrow.release = () => {
		if (leftArrow.isUp) {
			player.accelerationX = 0;
		}
	};

	space.press = () => {
		if (player.isOnGround) {
			player.vy += player.jumpForce;
			player.isOnGround = false;
			player.frictionX = 1;
		}
	};

	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	play();

	render(canvas);
}

function play() {

	if (player.isOnGround) {
		player.frictionX = 0.92;
	} else {
		player.frictionX = 0.97;
	}

	player.vx += player.accelerationX;
	player.vy += player.accelerationY;

	player.vx *= player.frictionX;

	player.vy += player.gravity;

	player.x += player.vx;
	player.y += player.vy;

	world.platforms.forEach(platform => {

		let collision = rectangleCollision(player, platform);

		if (collision) {
			if (collision === "bottom" && player.vy >= 0) {
				player.isOnGround = true;
				player.vy = -player.gravity;
			}
			else if (collision === "top" && player.vy <= 0) {
				player.vy = 0;
			}
			else if (collision === "right" && player.vx >= 0) {
				player.vx = 0;
			}
			else if (collision === "left" && player.vx <= 0) {
				player.vx = 0;
			}

			if (collision !== "bottom" && player.vy > 0) {
				player.isOnGround = false;
			}
		}
	});

	world.treasure = world.treasure.filter(box => {
		if (hitTestRectangle(player, box)) {
			score += 1;

			remove(box);

			return false;
		} else {
			return true;
		}
	});

	message.content = `score: ${score}`;
}

function makeWorld(level) {
	let world = group();

	world.map = [];
	world.itemLocations = [];
	world.platforms = [];
	world.treasure = [];

	world.player = null;

	makeMap();

	terraformMap();

	addItems();

	//makeSprites();
	makeImageSprites();

	function makeMap() {
		let cellIsAlive = () => randomInt(0, 3) === 0;

		let numberOfCells = level.heightInTiles * level.widthInTiles;

		for (let i = 0; i < numberOfCells; i++) {
			let x = i % level.widthInTiles,
					y = Math.floor(i / level.widthInTiles);

			let cell = {
				x: x,
				y: y,
				item: ""
			};
			if (cellIsAlive()) {
				cell.terrain = "rock";
			} else {
				cell.terrain = "sky";
			}

			world.map.push(cell);
		}
	}

	function terraformMap() {
		let getIndex = (x, y) => x + (y * level.widthInTiles);

		world.map.forEach((cell, index, map) => {

			let cellToTheLeft = world.map[getIndex(cell.x - 1, cell.y)],
					cellToTheRight = world.map[getIndex(cell.x + 1, cell.y)],
					cellBelow = world.map[getIndex(cell.x, cell.y + 1)],
					cellAbove = world.map[getIndex(cell.x, cell.y - 1)],
					cellTwoAbove = world.map[getIndex(cell.x, cell.y - 2)];

			if(cell.x === 0 || cell.y === 0
				|| cell.x === level.widthInTiles - 1
				|| cell.y === level.heightInTiles - 1) {
				cell.terrain = "border";
			}

			else {
				if (cell.terrain === "rock") {
					if (cellAbove && cellAbove.terrain === "sky") {
						cell.terrain = "grass";
						if (cellTwoAbove) {
							if (cellTwoAbove.terrain === "rock"
								|| cellTwoAbove.terrain === "grass") {
								cellTwoAbove.terrain = "sky";
							}
						}
					}
				}
			}
		});

		world.map.forEach((cell, index, map) => {
			if (cell.terrain === "grass") {
				let cellAbove = world.map[getIndex(cell.x, cell.y - 1)];
				world.itemLocations.push(cellAbove);
			}
		});
	}

	function addItems() {

		let findStartLocation = () => {

			let randomIndex = randomInt(0, world.itemLocations.length - 1);
			let location = world.itemLocations[randomIndex];

			world.itemLocations.splice(randomIndex, 1);
			return location;
		};

		let cell = findStartLocation();
		cell.item = "player";

		for (let i = 0; i < 3; i++) {
			cell = findStartLocation();
			cell.item = "treasure";
		}
	}

	function makeSprites() {
		world.map.forEach(cell => {
			let mapSprite = rectangle();
			mapSprite.x = cell.x * level.tileWidth;
			mapSprite.y = cell.y * level.tileHeight;
			mapSprite.width = level.tileWidth;
			mapSprite.height = level.tileHeight;

			switch(cell.terrain) {
				case "rock": 
					mapSprite.fillStyle = "black";
					world.platforms.push(mapSprite);
					break;

				case "grass":
					mapSprite.fillStyle = "green";
					world.platforms.push(mapSprite);
					break;

				case "sky":
					mapSprite.fillStyle = "cyan";
					break;

				case "border":
					mapSprite.fillStyle = "blue";
					world.platforms.push(mapSprite);
					break;
			}
		});

		world.map.forEach(cell => {
			if (cell.item !== "") {
				let mapSprite = rectangle();
				mapSprite.x = cell.x * level.tileWidth + level.tileWidth / 4;
				mapSprite.y = cell.y * level.tileHeight + level.tileWidth / 2;
				mapSprite.width = level.tileWidth / 2;
				mapSprite.height = level.tileHeight / 2;

				switch (cell.item) {
					case "player": 
						mapSprite.fillStyle = "red";
						mapSprite.accelerationX = 0;
						mapSprite.accelerationY = 0;
						mapSprite.frictionX = 1;
						mapSprite.frictionY = 1;
						mapSprite.gravity = 0.3;
						mapSprite.jumpForce = -6.8;
						mapSprite.vx = 0;
						mapSprite.vy = 0;
						mapSprite.isOnGround = true;
						world.player = mapSprite;
						break;

					case "treasure":
						mapSprite.fillStyle = "gold";
						world.treasure.push(mapSprite);
						break;

				}
			}
		});
	}

	function makeImageSprites() {
		world.map.forEach((cell, index, map) => {
			let mapSprite,
					x = cell.x * level.tileWidth,
					y = cell.y * level.tileHeight;

			switch (cell.terrain) {
				case "rock":
					mapSprite = sprite(assets["rock.png"]);
					mapSprite.setPosition(x, y);
					world.platforms.push(mapSprite);
					break;

				case "grass":
					mapSprite = sprite(assets["grass.png"]);
					mapSprite.setPosition(x, y);
					world.platforms.push(mapSprite);
					break;

				case "sky":
					let sourceY = 0;
					if (index % 6 === 0 && index < map.length * 0.8) {
						mapSprite = sprite(assets["cloud.png"]);
					} else {
						mapSprite = sprite(assets["sky.png"]);
					}
					mapSprite.setPosition(x, y);
					break;

				case "border":
					mapSprite = rectangle(level.tileWidth, level.tileHeight, "black");
					mapSprite.setPosition(x, y);
					world.platforms.push(mapSprite);
					break;
			}
		});

		world.map.forEach(cell => {
			if (cell.item !== "") {
				let mapSprite,
						x = cell.x * level.tileWidth + level.tileWidth / 4,
						y = cell.y * level.tileHeight + level.tileWidth / 2,
						width = level.tileWidth / 2,
						height = level.tileHeight / 2;

				switch (cell.item) {
					case "player":
						mapSprite = sprite(assets["cat.png"]);
						mapSprite.width = width;
						mapSprite.height = height;
						mapSprite.setPosition(x, y);
						mapSprite.accelerationX = 0;
						mapSprite.accelerationY = 0;
						mapSprite.frictionX = 1;
						mapSprite.frictionY = 1;
						mapSprite.gravity = 0.3;
						mapSprite.jumpForce = -6.8;
						mapSprite.vx = 0;
						mapSprite.vy = 0;
						mapSprite.isOnGround = true;
						world.player = mapSprite;
						break;

					case "treasure":
						mapSprite = sprite(assets["star.png"]);
						mapSprite.width = width;
						mapSprite.height = height;
						mapSprite.setPosition(x, y);

						world.treasure.push(mapSprite);
						break;
				}
			}
		});
	}

	return world;
}