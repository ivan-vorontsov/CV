function grid(
		columns = 0, rows = 0, cellWidth = 32, cellHeight = 32,
		centerCell = false, xOffset = 0, yOffset = 0,
		makeSprite = undefined,
		extra = undefined
) {
	let container = group();

	let createGrid = () => {
		let length = columns * rows;

		for(let i = 0; i < length; i++) {
			let x = (i % columns) * cellWidth,
					y = Math.floor(i / columns) * cellHeight;

			let sprite = makeSprite();

			container.addChild(sprite);

			if (!centerCell) {
				sprite.x = x + xOffset;
				sprite.y = y + yOffset;
			}

			else {
				sprite.x
					= x + (cellWidth / 2)
					- sprite.halfWidth + xOffset;
				sprite.y 
					= y + (cellHeight / 2)
					- sprite.halfHeight + yOffset;
			}

			if(extra) extra(sprite);
		}
	};

	createGrid();

	return container;
}