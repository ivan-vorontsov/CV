let mousePosition = { x: 0, y: 0 },
    mousePressed = false,
    isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

window.addEventListener('mousemove', (evt) => {
    let canvasBounds = canvas.getBoundingClientRect(),
        offsetLeft = canvasBounds.left,
        offsetTop = canvasBounds.top;

    mousePosition = { x: (evt.clientX - offsetLeft), y: (evt.clientY - offsetTop) };
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