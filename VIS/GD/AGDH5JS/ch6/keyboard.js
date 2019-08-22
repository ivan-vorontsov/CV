let space = {
	code: 32,
	isDown: false,
	isUp: true,
	downHandler(event) {
		if (event.keyCode === this.code) {
			this.isDown = true;
			this.isUp = false;
		}
	},
	upHandler(event) {
		if (event.keyCode === this.code) {
			this.isUp = true;
			this.isDown = false;
		}
	}
};

function keyboard(keyCode) {
	let key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	key.downHandler = function (event) {
		if (event.keyCode === key.code) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	key.upHandler = function(event) {
		if (event.keyCode == key.code) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
		}
	}

	window.addEventListener(
		'keydown', key.downHandler.bind(key), false
	);
	window.addEventListener(
		'keyup', key.upHandler.bind(key), false
	);

	return key;
}