class Button extends Sprite {
	constructor(source, x = 0, y = 0) {
		super(source, x, y);
		this.interactive = true;
	}
}

function button(source, x, y) {
	let sprite = new Button(source, x, y);
	stage.addChild(sprite);
	return sprite;
}