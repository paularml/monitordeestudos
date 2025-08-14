document.addEventListener('DOMContentLoaded', () => {
    
    // ==================================================================
    // ## PARTE 1: LÓGICA DO TIMER POMODORO
    // ==================================================================
    
    // Referências aos elementos do HTML
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const alarmSound = document.getElementById('alarm-sound');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // Configurações de tempo em segundos
    const times = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    let timer; // Variável para o setInterval
    let timeLeft = times.pomodoro; // Tempo restante em segundos
    let currentMode = 'pomodoro'; // Modo atual
    let isRunning = false; // Flag para verificar se o timer está rodando

    // Função para formatar o tempo (ex: 1500 segundos -> "25:00")
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Função principal que atualiza o timer a cada segundo
    function updateTimer() {
        timeLeft--;
        const formattedTime = formatTime(timeLeft);
        timerDisplay.textContent = formattedTime;
        document.title = `${formattedTime} - Foco Total`; // Atualiza o título da página

        if (timeLeft < 0) {
            clearInterval(timer);
            isRunning = false;
            if (alarmSound) {
                alarmSound.play();
            }
            // Reseta para o início do mesmo modo
            timeLeft = times[currentMode];
            updateDisplay();
        }
    }

    // Funções de controle
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

    // Função para trocar de modo (Pomodoro, Pausa Curta, etc.)
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

    // Função para atualizar o display inicial
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        document.title = 'Pomodoro Timer';
    }

    // Adiciona os eventos aos botões do timer
    if (startBtn && pauseBtn && resetBtn) {
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
    }

    document.getElementById('pomodoro-mode')?.addEventListener('click', () => switchMode('pomodoro'));
    document.getElementById('short-break-mode')?.addEventListener('click', () => switchMode('shortBreak'));
    document.getElementById('long-break-mode')?.addEventListener('click', () => switchMode('longBreak'));

    // Inicia o display com o tempo padrão
    updateDisplay();

});