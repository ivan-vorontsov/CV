assets.load(["images/treasureHunter.json"]).then(() => setup());
let canvas, stage, dungeon, exit, player, treasure, gameScene, enemies, healthBa, message, gameOverScene, 
		upArrow, rightArrow, downArrow, leftArrow;

function setup() {
	canvas = makeCanvas(500, 500);
	stage = new DisplayObject();
	stage.width = canvas.width;
	stage.height = canvas.height;

	dungeon = sprite(assets["dungeon.png"]);

	exit = sprite(assets["door.png"]);
	exit.x = 32;

	player = sprite(assets["explorer.png"]);
	stage.putCenter(player, -128);

	treasure = sprite(assets["treasure.png"]);

	stage.putRight(treasure, -64);

	gameScene = group(dungeon, exit, player, treasure);

	let numberOfEnemies = 6,
			spacing = 48,
			xOffset = 150,
			speed = 2,
			direction = 1;

	enemies = [];

	for(let i = 0; i < numberOfEnemies; i++) {
		let enemy = sprite(assets["blob.png"]);

		let x = spacing * i + xOffset;

		let y = randomInt(0, canvas.height - enemy.height);

		enemy.x = x;
		enemy.y = y;

		enemy.vy = speed * direction;

		direction *= -1;

		enemies.push(enemy);

		gameScene.addChild(enemy);
	}

	let outerBar = rectangle(128, 9, "black"),
			innerBar = rectangle(128, 8, "red");

	healthBar = group(outerBar, innerBar);

	healthBar.inner = innerBar;

	healthBar.x  = canvas.width - 164;
	healthBar.y = 4;

	gameScene.addChild(healthBar);

	leftArrow = keyboard(37);
  upArrow = keyboard(38);
  rightArrow = keyboard(39);
  downArrow = keyboard(40);

  leftArrow.press = () => {
    //Change the player's velocity when the key is pressed
    player.vx = -5;
    player.vy = 0;
  };
  leftArrow.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the player isn't moving vertically:
    //Stop the player
    if (!rightArrow.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };
  upArrow.press = () => {
    player.vy = -5;
    player.vx = 0;
  };
  upArrow.release = () => {
    if (!downArrow.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };
  rightArrow.press = () => {
    player.vx = 5;
    player.vy = 0;
  };
  rightArrow.release = () => {
    if (!leftArrow.isDown && player.vy === 0) {
      player.vx = 0;
    }
  };
  downArrow.press = () => {
    player.vy = 5;
    player.vx = 0;
  };
  downArrow.release = () => {
    if (!upArrow.isDown && player.vx === 0) {
      player.vy = 0;
    }
  };

	message = text("Game Over!", "64px Futura", "white", 20, 20);
	message.x = 120;
	message.y = canvas.height / 2 - 64;

	gameOverScene = group(message);

	gameOverScene.visible = false;


	gameLoop();
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	let playerHit = false;

	player.x += player.vx;
  player.y += player.vy;

  contain(
		player,
		{
			x: 32, y: 16,
			width: canvas.width - 32,
			height: canvas.height - 32
		}
	);


	enemies.forEach(enemy => {
		enemy.x += enemy.vx;
		enemy.y += enemy.vy;

		let enemyHitsEdges = contain(
			enemy,
			{
				x: 32, y: 16,
				width: canvas.width - 32,
				height: canvas.height - 32
			}
		);

		if (enemyHitsEdges === "top" || enemyHitsEdges === "bottom") {
			enemy.vy *= -1;
		}

		if (hitTestRectangle(player, enemy)) {
			playerHit = true;
		}
	});

	if (playerHit) {
		player.alpha = 0.5;
		healthBar.inner.width -= 1;
	} else {
		player.alpha = 1;
	}

	if (hitTestRectangle(player, treasure)) {
		treasure.x = player.x + 8;
		treasure.y = player.y + 8;
	}

	if (hitTestRectangle(treasure, exit)) {
		gameScene.visible = false;
		gameOverScene.visible = true;
		message.content = "You won!";
	}

	if (healthBar.inner.width < 0) {
		gameScene.visible = false;
		gameOverScene.visible = true;
		message.content =  "You lost!";
	}

	render(canvas);
}