class Text extends DisplayObject {
	constructor(
		content = "Hello!", 
		font = "12px sans-serif",
		fillStyle = "red",
		x = 0,
		y = 0
	) {

		super();

		Object.assign(this, {content, font, fillStyle, x, y});
		this.textBaseline = "top";
		this.strokeStyle = "none";
	}

	render(ctx) {
		ctx.font = this.font;
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		if (this.width === 0) this.width = ctx.measureText(this.content).width;
		if (this.height === 0) this.height = ctx.measureText("M").width;

		ctx.translate(
			-this.width * this.pivotX,
			-this.height * this.pivotX
		);
		ctx.textBaseline = this.textBaseline;
		ctx.fillText(
			this.content,
			0, 
			0
		);
		if (this.strokeStyle !== "none") ctx.strokeText();
	}
}

function text(content, font, fillStyle, x, y) {
	let sprite = new Text(content, font, fillStyle, x, y);
	stage.addChild(sprite);
	return sprite;
}