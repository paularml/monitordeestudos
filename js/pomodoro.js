document.addEventListener('DOMContentLoaded', () => {
    
    // ==================================================================
    // ## PARTE 1: LÓGICA DO TIMER POMODORO
    // ==================================================================
    
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const alarmSound = document.getElementById('alarm-sound');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // --- LÓGICA DO CONTADOR DE POMODOROS ---
    const pomodoroCountDisplay = document.getElementById('pomodoro-count');
    const resetCountBtn = document.getElementById('reset-count-btn');
    let pomodoroCount = 0;

    // Função para carregar o contador do localStorage
    function loadPomodoroCount() {
        const savedCount = localStorage.getItem('pomodoroCount');
        pomodoroCount = savedCount ? parseInt(savedCount, 10) : 0;
        updateCountDisplay();
    }

    // Função para atualizar o display do contador
    function updateCountDisplay() {
        if (pomodoroCountDisplay) {
            pomodoroCountDisplay.textContent = pomodoroCount;
        }
    }
    // ------------------------------------

    const times = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    let timer;
    let timeLeft = times.pomodoro;
    let currentMode = 'pomodoro';
    let isRunning = false;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTimer() {
        timeLeft--;
        const formattedTime = formatTime(timeLeft);
        timerDisplay.textContent = formattedTime;        

        if (timeLeft < 0) {
            clearInterval(timer);
            isRunning = false;
            if (alarmSound) {
                alarmSound.play();
            }

            // --- INCREMENTA O CONTADOR AUTOMATICAMENTE ---
            if (currentMode === 'pomodoro') {
                pomodoroCount++;
                localStorage.setItem('pomodoroCount', pomodoroCount);
                updateCountDisplay();
            }
            // --------------------------------------------
            
            timeLeft = times[currentMode];
            updateDisplay();
        }
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timer);
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = times[currentMode];
        updateDisplay();
    }

    function switchMode(mode) {
        currentMode = mode;
        timeLeft = times[mode];
        resetTimer();

        modeButtons.forEach(btn => {
            if (btn.id.includes(mode)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        document.title = 'Pomodoro Timer';
    }

    if (startBtn && pauseBtn && resetBtn) {
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
    }

    document.getElementById('pomodoro-mode')?.addEventListener('click', () => switchMode('pomodoro'));
    document.getElementById('short-break-mode')?.addEventListener('click', () => switchMode('shortBreak'));
    document.getElementById('long-break-mode')?.addEventListener('click', () => switchMode('longBreak'));

    // --- LÓGICA PARA ZERAR O CONTADOR ---
    if (resetCountBtn) {
        resetCountBtn.addEventListener('click', () => {
            // Pede confirmação para evitar cliques acidentais
            const confirmReset = confirm('Tem certeza que deseja zerar a contagem de pomodoros?');
            if (confirmReset) {
                pomodoroCount = 0;
                localStorage.setItem('pomodoroCount', 0);
                updateCountDisplay();
            }
        });
    }
    // ------------------------------------

    // Inicia o display e carrega a contagem salva
    updateDisplay();
    loadPomodoroCount();
  

});