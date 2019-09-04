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
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width, 0);
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(0, this.height);
        ctx.lineTo(0, 0);

        ctx.fillStyle = "#e5e5e5";
        ctx.fill();

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