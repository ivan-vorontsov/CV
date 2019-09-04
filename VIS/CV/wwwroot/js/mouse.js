let mousePosition = { x: 0, y: 0 },
    mousePressed = false,
    isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

function handleMouseMove(evt) {
    let canvasBounds = canvas.getBoundingClientRect(),
        offsetLeft = canvasBounds.left,
        offsetTop = canvasBounds.top;

    mousePosition = { x: (evt.clientX - offsetLeft) / APP.scaleX, y: (evt.clientY - offsetTop) / APP.scaleY };
}

function handleMouseDown(evt) {
    mousePressed = true;
}

function handleMouseUp(evt) {
    mousePressed = false;
}

function handleTouchStart(evt) {
    mousePressed = true;
    mousePosition.x = evt.touches[0].clientX;
    mousePosition.y = evt.touches[0].clientY;
}

function handleTouchEnd(evt) {
    mousePressed = false;
}