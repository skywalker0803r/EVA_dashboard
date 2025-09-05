const canvas = document.getElementById('evaCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// 繪製網格
function drawGrid() {
    ctx.strokeStyle = '#00c6ff';
    ctx.lineWidth = 0.5;

    // 橫線
    for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    // 豎線
    for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
}

// 繪製波形
function drawWaves() {
    const waveHeight = 100;
    const waveLength = 0.05;
    const waveSpeed = 0.02;
    const offset = 10;

    // 藍色波形
    ctx.strokeStyle = '#00c6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height / 2 - offset);
    for (let x = 0; x < width; x++) {
        const y = height / 2 - offset + Math.sin(x * waveLength + Date.now() * waveSpeed) * waveHeight;
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 粉色波形
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height / 2 + offset);
    for (let x = 0; x < width; x++) {
        const y = height / 2 + offset + Math.cos(x * waveLength - Date.now() * waveSpeed) * waveHeight;
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawWaves();
    requestAnimationFrame(animate);
}

animate();