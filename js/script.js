document.addEventListener('DOMContentLoaded', () => {
    const EVA_Dashboard = {
        // --- 設定 --- 
        config: {
            DATA_UPDATE_INTERVAL: 100, // ms
            LOG_INTERVAL: 1500, // ms
            RADAR_INTERVAL: 5000, // ms
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
            this.initChart();
            requestAnimationFrame(this.mainLoop.bind(this));
        },

        cacheDOMElements() {
            this.elements.syncRate = document.querySelector('.sync-rate');
            this.elements.tempValue = document.querySelector('.temp-panel .value');
            this.elements.powerBar = document.querySelector('.power-bar');
            this.elements.logMessages = document.getElementById('logMessages');
            this.elements.radarCircle = document.querySelector('.radar-circle');
            this.elements.warningOverlay = document.getElementById('angel-attack-warning');
            this.elements.heartbeatCanvas = document.getElementById('heartbeat-chart');
        },

        initChart() {
            if (!this.elements.heartbeatCanvas) return;
            const ctx = this.elements.heartbeatCanvas.getContext('2d');
            this.state.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Heartbeat',
                        data: [],
                        borderColor: '#ffd700',
                        borderWidth: 1,
                        pointRadius: 0,
                        tension: 0.2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { display: false },
                        y: { display: false, min: 0, max: 12 } // 調整Y軸讓波形置中
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    animation: {
                        duration: 0 // 完全關閉動畫，追求效能
                    }
                }
            });
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

        updateChart() {
            if (!this.state.chart) return;

            // 使用預設波形來產生數據
            const pattern = this.config.heartbeatPattern;
            const patternIndex = this.state.heartbeatPatternIndex;
            const baseValue = pattern[patternIndex];
            const dataPoint = baseValue + (Math.random() - 0.5) * 0.2; // 加入微小抖動

            const data = this.state.chart.data.datasets[0].data;
            const labels = this.state.chart.data.labels;

            data.push(dataPoint);
            labels.push('');

            if (data.length > this.config.CHART_MAX_DATA_POINTS) {
                data.shift();
                labels.shift();
            }
            
            this.state.chart.update('none');

            // 更新下一次的波形位置
            this.state.heartbeatPatternIndex = (patternIndex + 1) % pattern.length;
        },

        updateLog() {
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

        // --- 主迴圈 ---
        mainLoop(timestamp) {
            if (timestamp - this.state.lastDataUpdate > this.config.DATA_UPDATE_INTERVAL) {
                this.updateData();
                this.updateChart();
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

            requestAnimationFrame(this.mainLoop.bind(this));
        }
    };

    EVA_Dashboard.init();
});