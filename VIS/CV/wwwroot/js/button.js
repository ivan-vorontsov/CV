class Button {
    constructor(text, x = 0, y = 0, width = 60, height = 40) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hover = false;
        this.pressed = false;
        this.clicked = false;
        this.fillStyle = undefined;
        this.timer = 0;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = "white";
        ctx.font = "30px puzzler";
        ctx.textBaseline = "top";
        let dx = 0, dy = 0,
            textWidth = ctx.measureText(this.text).width,
            textHeight = ctx.measureText("M").width;
        dx = this.width / 2 - textWidth / 2;
        dy = this.height / 2 - textHeight / 2;
        ctx.fillText(this.text, dx, dy);
        ctx.restore();
    }

    update() {
        if (this.hover) {
            this.fillStyle = "darkgrey";
        } else if (this.pressed) {
            this.fillStyle = "lightgrey";
        } else {
            this.fillStyle = "black";
        }
    }

    handleInput() {
        this.clicked = false;
        let mx = mousePosition.x,
            my = mousePosition.y;
        if (this.x < mx && this.x + this.width > mx
            && this.y < my && this.y + this.height > my) {
            if (!isTouchDevice) {
                this.hover = true;
            }
            if (mousePressed) {
                this.hover = false;
                this.pressed = true;
                if (this.timer === 0) {
                    this.timer = new Date();
                }
            } else {
                if (this.pressed) {
                    let dt = new Date() - this.timer;
                    if (dt < 200) {
                        this.clicked = true;
                    }
                    this.timer = 0;
                    this.pressed = false;
                }
            }
        } else {
            this.hover = false;
            this.pressed = false;
        }

    }
}

let mousePosition = { x: 0, y: 0 },
    mousePressed = false,
    isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

window.addEventListener('mousemove', (evt) => {
    mousePosition = { x: evt.clientX, y: evt.clientY };
});
window.addEventListener('mousedown', () => {
    mousePressed = true;
});
window.addEventListener('mouseup', () => {
    mousePressed = false;
});
window.addEventListener('touchstart', (evt) => {
    mousePressed = true;
    mousePosition.x = evt.touches[0].clientX;
    mousePosition.y = evt.touches[0].clientY;
});
window.addEventListener('touchend', () => {
    mousePressed = false;
});