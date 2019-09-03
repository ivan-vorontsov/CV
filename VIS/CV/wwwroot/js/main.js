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
        imageWidth = canvas.width / 5;
    };
    resize();
    appArea.appendChild(canvas);
    window.addEventListener('resize', resize);
    return canvas;
}

// ------------

let canvas, radius, offset, step = 5, positions = [], A = 55, D, k = 0.001,
    omega = 1, phi = 1, p = 0.0005, starPositions = [], scales = [],
    dencity = 99, _scaleMax = 1, _scaleStep = 0.05, fullScreenButton, image, imageWidth;

window.addEventListener('load', () => {
    image = new Image();
    image.onload = () => {
        canvas = makeCanvas();
        for (let i = 0; i < dencity; i++) {
            starPositions.push(createRandomPosition(canvas));
            scales.push(0);
        }
        fullScreenButton = new Button("+", 30, 30, 50, 50);
        appLoop();
    };
    image.src = "/images/IMG_1232.jpg";
});

function appLoop(elapsed) {
    requestAnimationFrame(appLoop);

    positions = [];

    for (let x = 0; x <= canvas.width; x += step) {
        let t = elapsed * 0.001;
        let y = sineWave(x, t);
        positions.push([x, y]);
    }

    handleInput();

    update(elapsed);

    render(canvas.context, elapsed * 0.001);
}

function render(ctx, t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(positions[0][0], positions[0][1]);
    for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i][0], positions[i][1]);
    }
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fill();

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

    fullScreenButton.render(ctx);
    renderImage(ctx);
}

function handleInput() {
    fullScreenButton.handleInput();
    if (fullScreenButton.clicked) {
        toggleFullscreeen();
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
            starPositions[i] = createRandomPosition(canvas);
        }
    }
    fullScreenButton.update();
    if (!document.fullscreenElement) {
        fullScreenButton.text = "+";
    } else {
        fullScreenButton.text = "-";
    }
}

function renderImage(ctx) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, imageWidth / 2, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(image,
        0,
        0,
        image.width,
        image.height,
        -imageWidth * 0.5,
        -imageWidth * 0.5,
        imageWidth,
        imageWidth
    );
    ctx.restore();
}

function createRandomPosition(canvas) {
    let dr = Math.random() * imageWidth * 0.2 + imageWidth / 2,
        omega = Math.random() * 2 * Math.PI,
        x = dr * Math.cos(omega) + canvas.width / 2,
        y = dr * Math.sin(omega) + canvas.height / 2;
    return { x: x, y: y };
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


function sineWave(x, t) {
    let y = A * Math.sin(k * x - omega * t + phi) + D;
    return y;
}

function toggleFullscreeen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
