		assets.load(["fonts/puzzler.otf", "images/button.json", "images/marbles.png"]).then(() => setup());
		let canvas, stage, pegs;
		let buttons = [];
		let draggableSprites = [];
		let marbles, sling, capturedMarble = null, pointer;

		function setup() {
			canvas = makeCanvas(320, 320);
			stage = new DisplayObject();
			stage.width = canvas.width;
			stage.height = canvas.height;

			sling = line("Yellow", 4);
			sling.visible = false;

			pointer = makePointer(canvas);

			marbles = grid(
				5, 5, 64, 64,
				true, 0, 0,

				() => {
					let marbleFrames = frames(
						assets["images/marbles.png"],
						[
							[0, 0], [32, 0], [64, 0],
							[0, 32], [32, 32], [64, 32]
						],
						32,
						32
					);
					let marble = sprite(marbleFrames);
					marble.gotoAndStop(randomInt(0, 5));
					marble.circular = true;

					let sizes = [9, 12, 16, 20, 24, 28, 32];
					marble.diameter = sizes[randomInt(0, 6)];
					marble.vx = randomInt(-10, 10);
					marble.vy = randomInt(-10, 10);
					marble.frictionX = 0.99;
					marble.frictionY = 0.99;
					marble.mass = 0.75 + (marble.diameter / 32);

					return marble;
				}
			);
			
			gameLoop();
		}

		function gameLoop() {
			requestAnimationFrame(gameLoop);

			if (buttons.length > 0) {
				canvas.style.cursor = "auto";

				buttons.forEach(button => {
					button.update(pointer, canvas);
					if (button.state === "over" || button.state === "down") {
						if(button.parent !== undefined) {
							canvas.style.cursor = "pointer";
						}
					}
				});
			}

			marbles.children.forEach(marble => {
				if (pointer.isDown && capturedMarble === null) {
					if(hitTestPoint(pointer, marble)) {
						capturedMarble = marble;
						capturedMarble.vx = 0;
						capturedMarble.vy = 0;
					}
				}

				marble.vx *= marble.frictionX;
				marble.vy *= marble.frictionY;

				marble.x += marble.vx;
				marble.y += marble.vy;

				contain(marble, stage.localBounds, true);

			});

			if (capturedMarble !== null) {
				sling.visible = true;
				sling.ax = capturedMarble.centerX;
				sling.ay = capturedMarble.centerY;
				sling.bx = pointer.x;
				sling.by = pointer.y;
			}

			if (pointer.isUp) {
				sling.visible = false;

				if (capturedMarble !== null) {
					sling.length = distance(capturedMarble, pointer);

					sling.angle = angle(pointer, capturedMarble);

					let speed = 5;
					capturedMarble.vx = Math.cos(sling.angle) * sling.length / speed;
					capturedMarble.vy = Math.sin(sling.angle) * sling.length / speed;

					capturedMarble = null;
				}
			}

			for(let i = 0; i < marbles.children.length; i++) {
				var c1 = marbles.children[i];

				for(let j = i + 1; j < marbles.children.length; j++) {
					let c2 = marbles.children[j];

					movingCircleCollision(c1, c2);
				}
			}

			render(canvas);
		}