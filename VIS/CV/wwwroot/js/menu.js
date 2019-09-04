class Menu {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.visible = false;
        this.items = [];
    }

    get width() {
        return this.items.length > 0 ? this.items[0].width : 0;
    }

    get height() {
        if (this.items.length === 0) {
            return 0;
        }
        let h = 0;
        this.items.forEach(item => {
            h += item.height;
        });
        return h;
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.save();
        ctx.translate(this.x * APP.scaleX, this.y * APP.scaleY);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.moveTo(0, 15);
        ctx.quadraticCurveTo(0, 0, 15, 0);
        ctx.lineTo(this.width * APP.scaleX - 15, 0);
        ctx.quadraticCurveTo(this.width * APP.scaleX, 0, this.width * APP.scaleX, 15);
        ctx.lineTo(this.width * APP.scaleX, this.height * APP.scaleY - 15);
        ctx.quadraticCurveTo(this.width * APP.scaleX, this.height * APP.scaleY, this.width * APP.scaleX - 15, this.height * APP.scaleY);
        ctx.lineTo(15, this.height * APP.scaleY);
        ctx.quadraticCurveTo(0, this.height * APP.scaleY, 0, this.height * APP.scaleY - 15);
        ctx.lineTo(0, 15);
        ctx.closePath();
        ctx.fillStyle = "#e5e5e5";
        ctx.fill();
        ctx.clip();

        this.items.forEach(item => {
            item.render(ctx);
        });

        ctx.restore();
    }

    update() {
        this.items.forEach(item => {
            item.update();
        });
    }

    handleInput() {
        if (!this.visible) return;
        this.items.forEach(item => {
            item.handleInput();
        });
    }

    addItem(button) {
        this.items.push(button);
        button.parent = this;
    }
}