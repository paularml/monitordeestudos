document.addEventListener('DOMContentLoaded', function() {
    
    // ##################################################################
    // ## INÍCIO DA ÁREA DE EDIÇÃO: Insira seus dados aqui             ##
    // ##################################################################

    // ÁREA DE EDIÇÃO 1: DADOS DE ESTUDO DIÁRIO (MINUTOS)
    const studyData = [
        // Semana 1
        240, 300, 280, 350, 400, 200, 0,
        // Semana 2
        250, 310, 290, 360, 410, 220, 0,
        // ...continue até o dia 70
    ];

    // ÁREA DE EDIÇÃO 2: DADOS DE POMODORO (UNIDADES)
    const pomodoroData = [
        // Semana 1
        8, 10, 9, 12, 14, 7, 0,
        // Semana 2
        8, 11, 10, 12, 14, 8, 0,
        
        // ...continue até o dia 70
    ];

    // ÁREA DE EDIÇÃO 3: DADOS DAS DISCIPLINAS (PARA GRÁFICO DE PIZZA)
    const subjectData = {
        'Direito Constitucional': 750,
        'Direito Administrativo': 620,
        'Português': 480,
        'Raciocínio Lógico': 450,
        'Informática': 390,
    };
    
    // ##################################################################
    // ## FIM DA ÁREA DE EDIÇÃO: Não altere o código abaixo            ##
    // ##################################################################


    // ==================================================================
    // ## PARTE 1: CÁLCULOS E GRÁFICOS
    // ==================================================================
    const TOTAL_DAYS = 70;

    while (studyData.length < TOTAL_DAYS) studyData.push(0);
    while (pomodoroData.length < TOTAL_DAYS) pomodoroData.push(0);
    studyData.length = TOTAL_DAYS;
    pomodoroData.length = TOTAL_DAYS;

    const today = new Date();
    const currentDayOfWeek = today.getDay(); 
    const currentMonth = today.getMonth();

    let totalMinutesWeek = 0, totalMinutesMonth = 0, totalPomodorosWeek = 0, totalPomodorosMonth = 0, daysCompleted = 0;

    const daysGrid = document.getElementById('days-grid');

    studyData.forEach((minutes, index) => {
        const pomodoros = pomodoroData[index] || 0;
        if (minutes > 0) {
            daysCompleted++;
            const dayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (studyData.length - 1 - index));
            if (dayDate.getMonth() === currentMonth) {
                totalMinutesMonth += minutes;
                totalPomodorosMonth += pomodoros;
            }
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - currentDayOfWeek);
            if (dayDate >= weekStart) {
                totalMinutesWeek += minutes;
                totalPomodorosWeek += pomodoros;
            }
        }
        if(daysGrid) {
            const dayItem = document.createElement('div');
            dayItem.classList.add('day-item');
            if (minutes > 0) dayItem.classList.add('checked');
            dayItem.innerHTML = `<input type="checkbox" id="day-${index + 1}" ${minutes > 0 ? 'checked' : ''} disabled><label for="day-${index + 1}">Dia ${index + 1}</label>`;
            daysGrid.appendChild(dayItem);
        }
    });

    const lastStudiedMinutes = [...studyData].reverse().find(m => m > 0) || 0;
    const lastPomodoros = [...pomodoroData].reverse().find(p => p > 0) || 0;
    document.getElementById('minutos-hoje').textContent = `${lastStudiedMinutes} min`;
    document.getElementById('minutos-semana').textContent = `${totalMinutesWeek} min`;
    document.getElementById('minutos-mes').textContent = `${totalMinutesMonth} min`;
    document.getElementById('pomodoros-hoje').textContent = lastPomodoros;
    document.getElementById('pomodoros-semana').textContent = totalPomodorosWeek;
    document.getElementById('pomodoros-mes').textContent = totalPomodorosMonth;

    const totalProgress = (daysCompleted / TOTAL_DAYS) * 100;
    if(document.getElementById('total-progress-bar')) {
        document.getElementById('total-progress-bar').style.width = `${totalProgress}%`;
        document.getElementById('total-progress-text').textContent = `${daysCompleted}/${TOTAL_DAYS} dias`;
    }

    const lineChartCtx = document.getElementById('study-chart')?.getContext('2d');
    if (lineChartCtx) {
        const filteredLabels = [];
        const filteredData = [];
        studyData.forEach((minutes, index) => {
            if (minutes > 0) {
                filteredLabels.push(`Dia ${index + 1}`);
                filteredData.push(minutes);
            }
        });
        new Chart(lineChartCtx, { type: 'line', data: { labels: filteredLabels, datasets: [{ label: 'Minutos Estudados', data: filteredData, backgroundColor: 'rgba(133, 87, 183, 0.2)', borderColor: '#8557B7', borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: '#CD77C0', pointRadius: 3 }] }, options: chartOptions('#f0f0f0') });
    }

    const pieChartCtx = document.getElementById('subject-pie-chart')?.getContext('2d');
    if (pieChartCtx && Object.keys(subjectData).length > 0) {
        new Chart(pieChartCtx, { type: 'pie', data: { labels: Object.keys(subjectData), datasets: [{ label: 'Minutos por Disciplina', data: Object.values(subjectData), backgroundColor: ['#3E2A79', '#8557B7', '#CD77C0', '#5b3ab3', '#a56de2', '#e489d5', '#7d5cce'], borderColor: '#21212C', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top', labels: { color: '#f0f0f0', font: { size: 14 } } } } } });
    }

    function chartOptions(textColor) { return { scales: { y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: textColor }, grid: { display: false } } }, plugins: { legend: { labels: { color: textColor } } } }; }


    // ==================================================================
    // ## PARTE 2: NAVEGAÇÃO DO SITE
    // ==================================================================
    const navLinks = document.querySelectorAll('#navbar a');
    const sections = document.querySelectorAll('main > div[id], main > section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 70) { // 70px de offset para ativar um pouco antes
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Usamos querySelector para tratar o href="#id"
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

});