function makeCanvas() {
    let canvas = document.createElement("canvas");
    let appArea = document.querySelector("#appArea");
    canvas.context = canvas.getContext("2d");
    canvas.setAttribute('id', 'appCanvas');
    let resize = () => {
        canvas.width = appArea.clientWidth;
        canvas.height = appArea.clientHeight;
    };
    resize();
    appArea.appendChild(canvas);
    window.addEventListener('resize', resize);
    return canvas;
}

let canvas, positions = [], dencity = 999, scales = [], _scaleMax = 1, _scaleStep = 0.05, radius = 14;

window.addEventListener('load', () => {
    canvas = makeCanvas();
    for (let i = 0; i < dencity; i++) {
        positions.push(createRandomPosition(canvas));
        scales.push(0);
    }

    appLoop();
});

function appLoop() {
    requestAnimationFrame(appLoop);

    update();
    render(canvas.context)
}

function render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < scales.length; i += 1) {
        let scale = scales[i];
        if (scales[i] > _scaleMax) {
            scale = _scaleMax * 2 - scales[i];
        }
        let pos = positions[i];
        drawStar(pos, scale, ctx);
    }
}

function update() {
    for (let i = 0; i < scales.length; i += 1) {
        if (scales[i] === 0 && Math.random() < 0.01) {
            scales[i] += _scaleStep;
        } else if (scales[i] !== 0) {
            scales[i] += _scaleStep;
        }
        if (scales[i] >= _scaleMax * 2) {
            scales[i] = 0;
            positions[i] = createRandomPosition(canvas);
        }
    }
}

function createRandomPosition(canvas) {
    return { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
}

function drawStar(pos, scale, ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(256, 256, 256, 0.95)";
    ctx.beginPath();
    ctx.moveTo(pos.x + radius * scale, pos.y);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x, pos.y + radius * scale);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x - radius * scale, pos.y);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x, pos.y - radius * scale);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius * scale, pos.y);
    ctx.fill();
    ctx.restore();
}
