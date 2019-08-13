function makeCanvas() {
    let canvas = document.createElement("canvas");
    let appArea = document.querySelector("#appArea");
    canvas.context = canvas.getContext("2d");
    canvas.setAttribute('id', 'appCanvas');
    let resize = () => {
        canvas.width = appArea.clientWidth;
        canvas.height = appArea.clientHeight;
        radius = Math.max(canvas.width, canvas.height) / 180;
        offset = canvas.width / 16;
    };
    resize();
    appArea.appendChild(canvas);
    window.addEventListener('resize', resize);
    return canvas;
}

let canvas, positions = [], dencity = 999, scales = [], _scaleMax = 1, _scaleStep = 0.05, radius, offset;

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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height / 2 - offset);
    ctx.bezierCurveTo(canvas.width, canvas.height / 2, 0, canvas.height / 2, 0, canvas.height / 2 + offset);
    ctx.lineTo(0, 0);
    ctx.fill();
    let point0 = { x: 0, y: canvas.height / 2 + offset },
        point1 = { x: 0, y: canvas.height / 2 },
        point2 = { x: canvas.width, y: canvas.height / 2 },
        point3 = { x: canvas.width, y: canvas.height / 2 - offset };
    for (let i = 0; i < scales.length; i += 1) {
        let scale = scales[i];
        if (scales[i] > _scaleMax) {
            scale = _scaleMax * 2 - scales[i];
        }
        let pos = positions[i];
        let t = pos.x / canvas.width;
        let point = bezierCurve(t, point0, point1, point2, point3);
        if (pos.y < point.y) {
            ctx.fillStyle = "white";
        } else {
            ctx.fillStyle = "black";
        }
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
    let dr = Math.random() * Math.min(canvas.height, canvas.width) / 2,
        omega = Math.random() * 2 * Math.PI,
        x = dr * Math.cos(omega),
        y = dr * Math.sin(omega);
    return { x: x + canvas.width / 2, y: y + canvas.height / 2 };
}

function drawStar(pos, scale, ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pos.x + radius * scale, pos.y);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x, pos.y + radius * scale);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x - radius * scale, pos.y);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x, pos.y - radius * scale);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius * scale, pos.y);
    ctx.fill();
    ctx.restore();
}

function bezierCurve(t, p0, p1, p2, p3) {
    let x = Math.pow(1 - t, 3) * p0.x + 3 * t * Math.pow(1 - t, 2) * p1.x + 3 * t * t * (1 - t) * p2.x + Math.pow(t, 3) * p3.x;
    let y = Math.pow(1 - t, 3) * p0.y + 3 * t * Math.pow(1 - t, 2) * p1.y + 3 * t * t * (1 - t) * p2.y + Math.pow(t, 3) * p3.y;
    return { x: x, y: y };
}
