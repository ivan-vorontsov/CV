class Sprite extends DisplayObject {

	constructor(
		source,
		x = 0,
		y = 0
	) {

		super();

		Object.assign(this, {x, y});

		if (source instanceof Image) {
			this.createFromImage(source);
		} 

		else if (source.frame) {
			this.createFromAtlas(source);
		}

		else if (source.image && !source.data) {
			this.createFromTileset(source);
		}

		else if (source.image && source.data) {
			this.createFromTilesetFrames(source);
		}

		else if (source instanceof Array) {
			if (source[0] && source[0].source) {
				this.createFromAtlasFrames(source);
			}

			else if (source[0] instanceof Image) {
				this.createFromImages(source);
			}

			else {
				throw new Error(`The image sources in ${source} are not recognized`);
			}
		}

		else {
			throw new Error(`The image sources in ${source} are not recognized`);
		}
	}

	createFromImage(source) {
		if (!(source instanceof Image)) {
			throw new Error(`${source} is not an image object`);
		}
		else {
			this.source = source;
			this.sourceX = 0;
			this.sourceY = 0;
			this.width = source.width;
			this.height = source.height;
			this.sourceWidth = source.width;
			this.sourceHeight = source.height;
		}
	}

	createFromAtlas(source) {
		this.tilesetFrame = source;
		this.source = this.tilesetFrame.source;
		this.sourceX = this.tilesetFrame.frame.x;
		this.sourceY = this.tilesetFrame.frame.y;
		this.width = this.tilesetFrame.frame.w;
		this.height = this.tilesetFrame.frame.h;
		this.sourceWidth = this.tilesetFrame.frame.w;
		this.sourceHeight = this.tilesetFrame.frame.h;
	}

	createFromTileset(source) {
		if (!(source.image instanceof Image)) {
			throw new Error(`${source} is not an image object`);
		} else {
			this.source = source.image;
			this.sourceX = source.x;
			this.sourceY = source.y;
			this.width = source.width;
			this.height = source.height;
			this.sourceWidth = source.width;
			this.sourceHeight = source.height;
		}
	}

	createFromTilesetFrames(source) {
		if (!(source.image instanceof Image)) {
			throw new Error(`${source} is not an image object`);
		} else { 
			this.source = source.image;
			this.frames = source.data;

			this.sourceX = this.frames[0][0];
			this.sourceY = this.frames[0][1];
			this.width = source.width;
			this.height = source.height;
			this.sourceWidth = source.width;
			this.sourceHeight = source.height;
		}
	}

	createFromAtlasFrames(source) {
		this.frames = source;
		this.source = source[0].source;
		this.sourceX = source[0].frame.x;
		this.sourceY = source[0].frame.y;
		this.width = source[0].frame.w;
		this.height = source[0].frame.h;
		this.sourceWidth = source[0].frame.w;
		this.sourceHeight = source[0].frame.h;
	}

	createFromImages(source) {
		this.frames = source;
		this.source = source[0];
		this.sourceX =  0;
		this.sourceY = 0;
		this.width = source[0].width;
		this.height = source[0].height;
		this.sourceWidth = source[0].width;
		this.sourceHeight = source[0].height;
	}

	gotoAndStop(frameNumber) {
		if (this.frames.length > 0 && frameNumber < this.frames.length) {

			if (this.frames[0] instanceof Array) {
				this.sourceX = this.frames[frameNumber][0];
				this.sourceY = this.frames[frameNumber][1];
			} 

			else if (this.frames[frameNumber].frame) {
				this.sourceX = this.frames[frameNumber].frame.x;
				this.sourceY = this.frames[frameNumber].frame.y;
				this.sourceWidth = this.frames[frameNumber].frame.w;
				this.sourceHeight = this.frames[frameNumber].frame.h;
				this.width = this.frames[frameNumber].frame.w;
				this.height = this.frames[frameNumber].frame.h;
			}

			else {
				this.source = this.frames[frameNumber];
				this.sourceX = 0; 
				this.sourceY = 0;
				this.width = this.source.width;
				this.height = this.source.height;
				this.sourceWidth = this.source.width;
				this.sourceHeight = this.source.height;
			}

			this._currentFrame = frameNumber;
		}
		else {
			throw new Error(`Frame number ${frameNumber} does not exist`);
		}
	}

	render(ctx) {
		ctx.drawImage(
			this.source,
			this.sourceX, this.sourceY,
			this.sourceWidth, this.sourceHeight,
			-this.width * this.pivotX,
			-this.height * this.pivotY,
			this.width, this.height
		);
	}
}

function sprite(source, x, y) {
	let sprite = new Sprite(source, x, y);
	if (sprite.frames.length > 0) addStatePlayer(sprite);
	stage.addChild(sprite);
	return sprite;
}

function addStatePlayer(sprite) {
	let frameCounter = 0,
			numberOfFrames = 0,
			startFrame = 0,
			endFrame = 0,
			timerInterval = undefined;


	function show(frameNumber) {
		reset();

		sprite.gotoAndStop(frameNumber);
	}

	function play() {
		playSequence([0, sprite.frames.length - 1]);
	}

	function stop() {
		reset();

		sprite.gotoAndStop(sprite.currentFrame);
	}

	function playSequence(sequenceArray) {
		reset();

		startFrame = sequenceArray[0];
		endFrame = sequenceArray[1];
		numberOfFrames = endFrame - startFrame;

		if (startFrame === 0) {
			numberOfFrames += 1;
			frameCounter += 1;
		}
		if (numberOfFrames === 1) {
			numberOfFrames = 2;
			frameCounter += 1;
		}

		if (!sprite.fps) sprite.fps = 12;
		let frameRate = 1000 / sprite.fps;

		sprite.gotoAndStop(startFrame);

		if (!sprite.playing) {
			timerInterval = setInterval(advanceFrame.bind(this), frameRate);
			sprite.playing = true;
		}
	}

	function advanceFrame() {

		if (frameCounter < numberOfFrames) {
			sprite.gotoAndStop(sprite.currentFrame + 1);
			frameCounter += 1;
		} else {
			if (sprite.loop) {
				sprite.gotoAndStop(startFrame);
				frameCounter = 1;
			}
		}
	}

	function reset() {
		if (timerInterval !== undefined && sprite.playing === true) {
			sprite.playing = false;
			frameCounter = 0;
			startFrame = 0;
			endFrame = 0;
			numberOfFrames = 0;
			clearInterval(timerInterval);
		}
	}

	sprite.show = show;
	sprite.play = play;
	sprite.stop = stop;
	sprite.playSequence = playSequence;
}