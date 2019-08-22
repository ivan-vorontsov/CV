function frame(source, x, y, width, height) {
	var o = {};
	o.image = source;
	o.x = x;
	o.y = y;
	o.width = width;
	o.height = height;
	return o;
}

function frames(source, arrayOfPositions, width, height) {
	var o = {};
	o.image = source;
	o.data = arrayOfPositions;
	o.width = width;
	o.height = height;
	return o;
}

function render(canvas) {
	let ctx = canvas.ctx;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	stage.children.forEach(sprite => {
		displaySprite(sprite);
	});

	function displaySprite(sprite) {
		if (
			sprite.visible
			&& sprite.gx < canvas.width + sprite.width
			&& sprite.gx + sprite.width >= -sprite.width
			&& sprite.gy < canvas.height + sprite.height
			&& sprite.gy + sprite.height >= -sprite.height) {

			ctx.save();

			ctx.translate(
				sprite.x + (sprite.width * sprite.pivotX),
				sprite.y + (sprite.height * sprite.pivotY)
			);

			ctx.rotate(sprite.rotation);
			ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
			ctx.scale(sprite.scaleX, sprite.scaleY);

			if (sprite.shadow) {
				ctx.shadowColor = sprite.shadowColor;
				ctx.shadowOffsetX = sprite.shadowOffsetX;
				ctx.shadowOffsetY = sprite.shadowOffsetY;
				ctx.shadowBlur = sprite.shadowBlur;
			}

			if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;

			if (sprite.render) sprite.render(ctx);

			if (sprite.children && sprite.children.length > 0) {
				ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);

				sprite.children.forEach(child => {
					displaySprite(child);
				});
			}
			ctx.restore();
 		}
	}
}

function renderWithInterpolation(canvas, lagOffset) {
	let ctx = canvas.ctx;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	stage.children.forEach(sprite => {
		displaySprite(sprite);
	});

	function displaySprite(sprite) {
		if (
			sprite.visible
			&& sprite.gx < canvas.width + sprite.width
			&& sprite.gx + sprite.width >= -sprite.width
			&& sprite.gy < canvas.height + sprite.height
			&& sprite.gy + sprite.height >= -sprite.height) {

			ctx.save();

			//Interpolate the position
			if (sprite.previousX) {
				sprite.renderX = (sprite.x - sprite.previousX) * lagOffset + sprite.previousX;
			} else {
				sprite.renderX = sprite.x;
			}
			if (sprite.previousY) {
				sprite.renderY = (sprite.y - sprite.previousY) * lagOffset + sprite.previousY;
			} else {
				sprite.renderY = sprite.y;
			}

			ctx.translate(
				sprite.renderX + (sprite.width * sprite.pivotX),
				sprite.renderY + (sprite.height * sprite.pivotY)
			);

			ctx.rotate(sprite.rotation);
			ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
			ctx.scale(sprite.scaleX, sprite.scaleY);

			if (sprite.shadow) {
				ctx.shadowColor = sprite.shadowColor;
				ctx.shadowOffsetX = sprite.shadowOffsetX;
				ctx.shadowOffsetY = sprite.shadowOffsetY;
				ctx.shadowBlur = sprite.shadowBlur;
			}

			if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;

			if (sprite.render) sprite.render(ctx);

			if (sprite.children && sprite.children.length > 0) {
				ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);

				sprite.children.forEach(child => {
					displaySprite(child);
				});
			}
			ctx.restore();
 		}
	}
}

function makeCanvas(
			width = 256, height = 256,
			border = "1px solid black",
			backgroundColor = "white"
		) {
			let canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.style.border = border;
			canvas.style.backgroundColor = backgroundColor;
			document.body.appendChild(canvas);

			canvas.ctx = canvas.getContext("2d");

			return canvas;
		} 

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
	return min + Math.random() (max - min);
}

function contain(sprite, bounds, bounce = false, extra = undefined) {
	let x = bounds.x,
			y = bounds.y,
			width = bounds.width,
			height = bounds.height;

		let collision;

		if (sprite.x < x) {
			if (bounce) sprite.vx *= -1;

			if (sprite.mass) sprite.vx /= sprite.mass;
			sprite.x = x;
			collision = "left";
		}

		if (sprite.y < y) {
			if (bounce) sprite.vy *= -1;
			if (sprite.mass) sprite.vy /= sprite.mass;
			sprite.y = y;
			collision = "top";
		}

		if (sprite.x + sprite.width > width) {
			if (bounce) sprite.vx *= -1;
			if (sprite.mass) sprite.vx /= sprite.mass;
			sprite.x = width - sprite.width;
			collision = "rigth";
		}

		if (sprite.y + sprite.height > height) {
			if (bounce) sprite.vy *= -1;
			if (sprite.mass) sprite.vy /= sprite.mass;
			sprite.y = height - sprite.height;
			collision = "bottom";
		}

		if (collision && extra) extra(collision);

		return collision;
}

function distance(s1, s2) {
	let vx = s2.centerX - s1.centerX,
			vy = s2.centerY - s1.centerY;
	return Math.sqrt(vx * vx + vy * vy);
}

function followEase(follower, leader, speed) {
	let vx = leader.centerX - follower.centerX,
			vy = leader.centerY - follower.centerY,
			distance = Math.sqrt(vx * vx, vy * vy);
	if (distance >= 1) {
		follower.x += vx * speed;
		follower.y += vy * speed;
	}
}

function followConstant(follower, leader, speed) {
	let vx = leader.centerX - follower.centerX,
			vy = leader.centerY - follower.centerY,
			distance = Math.sqrt(vx * vx, vy * vy);

	if (distance >= speed) {
		follower.x += (vx / distance) * speed;
		follower. y += (vy / distance) * speed;
	}
}

function angle(s1, s2) {
	return Math.atan2(
		s2.centerY - s1.centerY,
		s2.centerX - s1.centerX
	);
}

function rotateSprite(rotatingSprite, centerSprite, distance, angle) {
	rotatingSprite.x = 
		centerSprite.centerX - rotatingSprite.parent.x 
		+ (distance * Math.cos(angle))
		- rotatingSprite.halfWidth;

	rotatingSprite.y = 
		centerSprite.centerY -rotatingSprite.parent.y
		+ (distance * Math.sin(angle))
		- rotatingSprite.halfHeight;
}

function rotatePoint(pointX, pointY, distanceX, distanceY, angle) {
	let point = {};
	point.x = pointY + Math.cos(angle) * distanceX;
	point.y = pointY + Math.sin(angle) * distanceY;
	return point;
}

function outsideBounds(sprite, bounds, extra = undefined) {
	let x = bounds.x, 
			y = bounds.y,
			width = bounds.width,
			height = bounds.height;

	let collision;

	if (sprite.x < x - sprite.width) {
		collision = "left";
	}
	if (sprite.y < y - sprite.height) {
		collision = "top";
	}
	if (sprite.x > width) {
		collision = "right";
	}
	if (sprite.y > height) {
		collision = "bottom";
	}

	if (collision && extra) extra(collision);

	return collision;
}

function shoot(
	shooter, angle, offsetFromCenter,
	bulletSpeed, bulletArray, bulletSprite
) {
	let bullet = bulletSprite();
	bullet.x = 
		shooter.centerX - bullet.halfWidth
		+ (offsetFromCenter * Math.cos(angle));
	bullet.y = 
		shooter.centerY -bullet.halfHeight
		+ (offsetFromCenter * Math.sin(angle));
	bullet.vx = Math.cos(angle) * bulletSpeed;
	bullet.vy = Math.sin(angle) * bulletSpeed;

	bulletArray.push(bullet);
}

function makeInteractive(o) {
	o.press = o.press || undefined;
	o.release = o.release || undefined;
	o.over = o.over || undefined;
	o.out = o.out || undefined;
	o.tap = o.tap || undefined;

	o.state = "up";

	o.action = "";

	o.pressed = false;

	o.hoverOver = false;

	o.update = (pointer, canvas) => {
		let hit = pointer.hitTestSprite(o);

		if (pointer.isUp) {
			o.state = "up";
			if (o instanceof Button) o.gotoAndStop(0);
		}

		if (hit) {
			o.state = "over";

			if (o.frames && o.frames.length === 3 && o instanceof Button) {
				o.gotoAndStop(1);
			}

			if (pointer.isDown) {
				o.state = "down";
				if (o instanceof Button) {
					if (o.frames.length === 3) {
						o.gotoAndStop(2);
					} else {
						o.gotoAndStop(1);
					}
				}
			}
		}

		if (o.state === "down") {
			if (!o.pressed) {
				if (o.press) o.press();
				o.pressed = true;
				o.action = "pressed";
			}
		}

		if (o.state === "over") {
			if (o.pressed) {
				if (o.release) o.release();
				o.pressed = false;
				o.action = "released";

				if (pointer.tapped && o.tap) o.tap();
			}
			if (!o.hoverOver) {
				if (o.over) o.over();
				o.hoverOver = true;
			}
		}

		if (o.state === "up") {
			if (o.pressed) {
				if (o.release) o.release();
				o.pressed = false;
				o.action = "released";
			}

			if (o.hoverOver) {
				if (o.out) o.out();
				o.hoverOver = false;
 			}
		}
	}
}