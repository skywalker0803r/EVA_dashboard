// js/script.js

// 取得 HTML 中的元素
const syncRateEl = document.querySelector('.sync-rate');
const tempValueEl = document.querySelector('.temp-panel .value');
const powerBarEl = document.querySelector('.power-bar');
const logMessagesEl = document.getElementById('logMessages');
const radarCircleEl = document.querySelector('.radar-circle');

// 載入音效檔案 (請確保您已準備好這些檔案並放在 audio/ 資料夾中)
const tickSound = new Audio('audio/tick.mp3');
const alertSound = new Audio('audio/alert.mp3');

// 設定音量
tickSound.volume = 0.5;
alertSound.volume = 0.7;

// 定義初始數據
let syncRate = 0.0;
let coreTemp = 25.0;
let mainPower = 100;

// 設定更新間隔（毫秒）
const updateInterval = 100;
const logInterval = 1500;
const radarInterval = 2000;

// 數據更新函式
function updateData() {
    // 將同步率穩定在 41.5% ± 1%
    syncRate = (40.5 + Math.random() * 2).toFixed(2);
    syncRateEl.textContent = syncRate + '%';

    // 將核心溫度穩定在 85°C ± 2.5°C
    coreTemp = (82.5 + Math.random() * 5).toFixed(1);
    tempValueEl.textContent = coreTemp + '°C';
    
    // 播放數據更新音效
    // 為了避免音效中斷，可使用 play() 方法
    // tickSound.currentTime = 0;
    // tickSound.play();

    // 判斷是否超過警告閾值 (將閾值設為 86，使其偶爾觸發)
    if (parseFloat(coreTemp) > 86) {
        tempValueEl.classList.add('warning');
        // 播放警報音效
        // alertSound.currentTime = 0;
        // alertSound.play();
    } else {
        tempValueEl.classList.remove('warning');
        // 停止警報音效 (如果正在播放)
        // alertSound.pause();
        // alertSound.currentTime = 0;
    }

    // 將電力穩定在 95-100%
    mainPower = (95 + Math.random() * 5).toFixed(0);
    powerBarEl.style.width = mainPower + '%';
}

// 滾動日誌
const logMessages = [
    "EVA-01 SYNCHRONIZATION RATE STABLE.",
    "A.T. FIELD ACTIVATED.",
    "TARGET ANGEL DETECTED, SECTOR C-7.",
    "INITIATING DEFENSIVE PROTOCOLS.",
    "MAIN POWER AT 80%.",
    "WARNING: CORE TEMPERATURE RISING.",
    "MISSION CONTROL: AWAITING COMMANDS.",
    "EVA-02 STANDBY MODE.",
    "ATTENTION: TARGET APPROACHING. PROBABILITY OF ANGEL ATTACK."
];

function updateLog(message) {
    const newLogEntry = document.createElement('div');
    newLogEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    newLogEntry.classList.add('log-entry');
    
    logMessagesEl.prepend(newLogEntry);

    while (logMessagesEl.children.length > 10) {
        logMessagesEl.removeChild(logMessagesEl.lastChild);
    }
}

// 心跳圖 (Chart.js)
const heartbeatCanvas = document.getElementById('heartbeat-chart');
const heartbeatChart = new Chart(heartbeatCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Heartbeat',
            data: [],
            borderColor: '#39ff14',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false, suggestedMin: 0, suggestedMax: 10 }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }
});

function addHeartbeatData() {
    let dataPoint = Math.random() * 2 + 1;
    if (Math.random() > 0.8) {
        dataPoint += Math.random() * 5;
    }
    heartbeatChart.data.labels.push('');
    heartbeatChart.data.datasets[0].data.push(dataPoint);
    const maxDataPoints = 30;
    if (heartbeatChart.data.datasets[0].data.length > maxDataPoints) {
        heartbeatChart.data.labels.shift();
        heartbeatChart.data.datasets[0].data.shift();
    }
    heartbeatChart.update();
}

// 動態雷達
const targets = [];
function updateRadar() {
    // 移除舊的目標
    radarCircleEl.querySelectorAll('.target').forEach(t => t.remove());

    const numTargets = Math.floor(Math.random() * 5) + 1;
    if (numTargets > 0) {
        // 如果有紅點出現，顯示「使徒來襲」
        updateLog("使徒來襲！");

        // 顯示警告畫面
        const warningEl = document.getElementById('angel-attack-warning');
        if (warningEl) {
            warningEl.style.display = 'flex';
            setTimeout(() => {
                warningEl.style.display = 'none';
            }, 3000); // 3秒後自動隱藏
        }
    }

    // 生成隨機數量的新目標
    for (let i = 0; i < numTargets; i++) {
        const target = document.createElement('div');
        target.classList.add('target');

        // 隨機定位目標
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 40 + 5; // 5%到45%的半徑
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);

        target.style.left = `${x}%`;
        target.style.top = `${y}%`;
        
        radarCircleEl.appendChild(target);
    }
}

// 啟動所有更新
setInterval(updateData, updateInterval);
setInterval(() => updateLog(logMessages[Math.floor(Math.random() * logMessages.length)]), logInterval);
setInterval(addHeartbeatData, 100);
setInterval(updateRadar, radarInterval);