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
        D = canvas.height / 2;
    };
    resize();
    appArea.appendChild(canvas);
    window.addEventListener('resize', resize);
    return canvas;
}

// ------------

let canvas, radius, offset, step = 5, positions = [], A = 30, D, k = 10,
    omega = 5000, phi = 1, p = 0.0005, starPositions = [], scales = [],
    dencity = 9999, _scaleMax = 1, _scaleStep = 0.05;

window.addEventListener('load', () => {
    canvas = makeCanvas();
    for (let i = 0; i < dencity; i++) {
        starPositions.push(createRandomPosition(canvas));
        scales.push(0);
    }
    appLoop();
});

function appLoop(elapsed) {
    requestAnimationFrame(appLoop);

    positions = [];

    for (let x = 0; x <= canvas.width; x += step) {
        let t = elapsed * 0.001;
        let y = sineWave(x, t);
        positions.push([x, y]);
    }

    update(elapsed);

    render(canvas.context, elapsed * 0.001);
}

function sineWave(x, t) {
    let y = A * Math.sin(p * (k * x - omega * t + phi)) + D;
    return y;
}

function render(ctx, t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(positions[0][0], positions[0][1]);
    for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i][0], positions[i][1]);
    }
    ctx.stroke();
    ctx.fillStyle = "blue";
    for (let i = 0; i < positions.length - 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(positions[i][0], 0);
        ctx.lineTo(positions[i + 1][0], 0);
        ctx.lineTo(positions[i + 1][0], positions[i + 1][1]);
        ctx.lineTo(positions[i][0], positions[i][1]);
        ctx.closePath();
        ctx.fill();
    }

    for (let i = 0; i < scales.length; i += 1) {
        let scale = scales[i];
        if (scales[i] > _scaleMax) {
            scale = _scaleMax * 2 - scales[i];
        }
        let pos = starPositions[i];
        if (pos.y < sineWave(pos.x, t)) {
            ctx.fillStyle = "white";
        } else {
            ctx.fillStyle = "blue";
        }
        drawStar(pos, scale, ctx);
    }
}



// ------------

function update() {
    for (let i = 0; i < scales.length; i += 1) {
        if (scales[i] === 0 && Math.random() < 0.01) {
            scales[i] += _scaleStep;
        } else if (scales[i] !== 0) {
            scales[i] += _scaleStep;
        }
        if (scales[i] >= _scaleMax * 2) {
            scales[i] = 0;
            starPositions[i] = createRandomPosition(canvas);
        }
    }
}

function createRandomPosition(canvas) {
    let dr = Math.random() * Math.min(canvas.height, canvas.width) / 2,
        omega = Math.random() * 2 * Math.PI,
        x = dr * Math.cos(omega),
        y = dr * Math.sin(omega);
    return { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
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

//function bezierCurve(t, p0, p1, p2, p3) {
//    let x = Math.pow(1 - t, 3) * p0.x + 3 * t * Math.pow(1 - t, 2) * p1.x + 3 * t * t * (1 - t) * p2.x + Math.pow(t, 3) * p3.x;
//    let y = Math.pow(1 - t, 3) * p0.y + 3 * t * Math.pow(1 - t, 2) * p1.y + 3 * t * t * (1 - t) * p2.y + Math.pow(t, 3) * p3.y;
//    return { x: x, y: y };
//}
