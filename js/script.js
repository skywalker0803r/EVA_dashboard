document.addEventListener('DOMContentLoaded', () => {
    const EVA_Dashboard = {
        // --- 設定 --- 
        config: {
            DATA_UPDATE_INTERVAL: 100, // ms
            LOG_INTERVAL: 1500, // ms
            RADAR_INTERVAL: 5000, // ms
            MAGI_UPDATE_INTERVAL: 3000, // ms
            CHART_MAX_DATA_POINTS: 50,
            heartbeatPattern: [5, 5, 5, 5.5, 5, 4.8, 10, 4, 5, 6, 5, 5], // 心跳波形
            logMessages: [
                "EVA-01 SYNCHRONIZATION RATE STABLE.",
                "A.T. FIELD ACTIVATED.",
                "TARGET ANGEL DETECTED, SECTOR C-7.",
                "INITIATING DEFENSIVE PROTOCOLS.",
                "MAIN POWER AT 95%.",
                "WARNING: CORE TEMPERATURE RISING.",
                "MISSION CONTROL: AWAITING COMMANDS.",
                "LCL DENSITY NORMAL.",
                "ATTENTION: TARGET APPROACHING. PROBABILITY OF ANGEL ATTACK."
            ]
        },

        // --- DOM 元素快取 ---
        elements: {},

        // --- 應用程式狀態 ---
        state: {
            chart: null,
            lastLogUpdate: 0,
            lastRadarUpdate: 0,
            lastDataUpdate: 0,
            heartbeatPatternIndex: 0,
        },

        // --- 初始化函式 ---
        init() {
            this.cacheDOMElements();
                // Wait for user interaction to start the main loop
                this.elements.startOverlay.addEventListener('click', () => this.startSystem(), { once: true });
            },

        startSystem() {
            // Hide overlay
            this.elements.startOverlay.style.display = 'none';

            // Unlock audio context by playing and pausing a sound
            if (this.elements.audioWarning) {
                this.elements.audioWarning.play().catch(() => {});
                this.elements.audioWarning.pause();
            }
            if (this.elements.audioLogBeep) {
                this.elements.audioLogBeep.play().catch(() => {});
                this.elements.audioLogBeep.pause();
            }

            // Start the main loop
            requestAnimationFrame(this.mainLoop.bind(this));
        },

        cacheDOMElements() {
            this.elements.syncRate = document.querySelector('.sync-rate');
            this.elements.tempValue = document.querySelector('.temp-panel .value');
            this.elements.powerBar = document.querySelector('.power-bar');
            this.elements.logMessages = document.getElementById('logMessages');
            this.elements.radarCircle = document.querySelector('.radar-circle');
            this.elements.warningOverlay = document.getElementById('angel-attack-warning');
            this.elements.evaCanvas = document.getElementById('evaCanvas');
            this.elements.audioWarning = document.getElementById('audio-warning');
            this.elements.audioLogBeep = document.getElementById('audio-log-beep');
            this.elements.startOverlay = document.getElementById('start-overlay');
            this.elements.magiCasper = document.getElementById('magi-casper');
            this.elements.magiBalthasar = document.getElementById('magi-balthasar');
            this.elements.magiMelchior = document.getElementById('magi-melchior');
        },

        // --- 更新模組 ---
        updateData() {
            const syncRate = (40.5 + Math.random() * 2).toFixed(2);
            this.elements.syncRate.textContent = syncRate + '%';

            const coreTemp = (82.5 + Math.random() * 5).toFixed(1);
            this.elements.tempValue.textContent = coreTemp + '°C';

            if (parseFloat(coreTemp) > 86) {
                this.elements.tempValue.classList.add('warning');
            } else {
                this.elements.tempValue.classList.remove('warning');
            }

            const mainPower = (95 + Math.random() * 5).toFixed(0);
            this.elements.powerBar.style.width = mainPower + '%';
        },

        drawWaveform() {
            if (!this.elements.evaCanvas) return;
            const canvas = this.elements.evaCanvas;
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

            ctx.clearRect(0, 0, width, height);
            drawGrid();
            drawWaves();
        },

        updateLog() {
            if (this.elements.audioLogBeep) {
                this.elements.audioLogBeep.currentTime = 0;
                this.elements.audioLogBeep.play().catch(() => {});
            }
            const message = this.config.logMessages[Math.floor(Math.random() * this.config.logMessages.length)];
            const newLogEntry = document.createElement('div');
            newLogEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            newLogEntry.classList.add('log-entry');
            
            this.elements.logMessages.prepend(newLogEntry);

            while (this.elements.logMessages.children.length > 10) {
                this.elements.logMessages.removeChild(this.elements.logMessages.lastChild);
            }
        },

        updateRadar() {
            this.elements.radarCircle.querySelectorAll('.target').forEach(t => t.remove());

            const numTargets = Math.floor(Math.random() * 4); // 先決定紅點數量

            if (numTargets > 0) { // 如果有紅點，則觸發警告並生成紅點
                if (this.elements.audioWarning) {
                    this.elements.audioWarning.currentTime = 0;
                    this.elements.audioWarning.play().catch(() => {});
                }
                this.updateLog("WARNING: ANGEL SIGNATURE DETECTED!");
                this.elements.warningOverlay.classList.add('visible');
                setTimeout(() => {
                    this.elements.warningOverlay.classList.remove('visible');
                }, 3000);

                for (let i = 0; i < numTargets; i++) {
                    const target = document.createElement('div');
                    target.classList.add('target');
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = Math.random() * 40 + 5;
                    target.style.left = `${50 + radius * Math.cos(angle)}%`;
                    target.style.top = `${50 + radius * Math.sin(angle)}%`;
                    this.elements.radarCircle.appendChild(target);
                }
            }
        },

        updateMagiStatus() {
            const statuses = ['ONLINE', 'OFFLINE', 'ERROR'];
            const randomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

            if (this.elements.magiCasper) {
                this.elements.magiCasper.textContent = randomStatus();
            }
            if (this.elements.magiBalthasar) {
                this.elements.magiBalthasar.textContent = randomStatus();
            }
            if (this.elements.magiMelchior) {
                this.elements.magiMelchior.textContent = randomStatus();
            }
        },

        // --- 主迴圈 ---
        mainLoop(timestamp) {
            if (timestamp - this.state.lastDataUpdate > this.config.DATA_UPDATE_INTERVAL) {
                this.updateData();
                this.drawWaveform(); // Call the new waveform drawing function
                this.state.lastDataUpdate = timestamp;
            }

            if (timestamp - this.state.lastLogUpdate > this.config.LOG_INTERVAL) {
                this.updateLog();
                this.state.lastLogUpdate = timestamp;
            }

            if (timestamp - this.state.lastRadarUpdate > this.config.RADAR_INTERVAL) {
                this.updateRadar();
                this.state.lastRadarUpdate = timestamp;
            }

            // Update MAGI status less frequently
            if (timestamp - this.state.lastMagiUpdate > this.config.MAGI_UPDATE_INTERVAL) {
                this.updateMagiStatus();
                this.state.lastMagiUpdate = timestamp;
            }

            requestAnimationFrame(this.mainLoop.bind(this));
        }
    };

    EVA_Dashboard.init();
});