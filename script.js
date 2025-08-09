document.addEventListener('DOMContentLoaded', function() {
    
    // ##################################################################
    // ## INÍCIO DA ÁREA DE EDIÇÃO: Insira seus dados aqui             ##
    // ##################################################################

    const planStartDate = '2025-08-10'; // FORMATO: 'AAAA-MM-DD'

    const studyData = [
        // Semana 1 (Dias 1-7)
        240, 300, 280, 350, 400, 200, 0,
        // Semana 2 (Dias 8-14)
        250, 310, 290, 250, 310, 290, 200,
        // Semana 3 (Dias 15-21)
        400, 300, 200, 0, 0, 0, 0,
    ];

    const pomodoroData = [
        // Semana 1
        8, 10, 9, 12, 14, 7, 0,
        // Semana 2
        8, 10, 9, 8, 10, 9, 1,
        // Semana 3
        1, 5, 0, 0, 0, 0, 0,
    ];

    const dailySubjectData = [
        // Dia 1 de estudo por disciplina
        { 'Direito Constitucional': 120, 'Português': 60, 'Raciocínio Lógico': 60 },
        // Dia 2
        { 'Direito Administrativo': 150, 'Informática': 100, 'Português': 60 },
        // Dia 3
        { 'Direito Constitucional': 130, 'Português': 80, 'Raciocínio Lógico': 100 },
        // Dia 4
        { 'Informática': 130, 'Português': 80, 'Raciocínio Lógico': 100 },
    ];
    
    // ##################################################################
    // ## FIM DA ÁREA DE EDIÇÃO: Não altere o código abaixo            ##
    // ##################################################################

    const TOTAL_DAYS = 70;

    while (studyData.length < TOTAL_DAYS) studyData.push(0);
    while (pomodoroData.length < TOTAL_DAYS) pomodoroData.push(0);
    studyData.length = TOTAL_DAYS;
    pomodoroData.length = TOTAL_DAYS;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const startDate = new Date(planStartDate + 'T00:00:00'); 

    let totalMinutesMonth = 0;
    let daysCompleted = 0;
    studyData.forEach((minutes, index) => {
        if (minutes > 0) {
            daysCompleted++;
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            if (dayDate.getMonth() === currentMonth) {
                totalMinutesMonth += minutes;
            }
        }
    });

    const lastMinuteIndex = studyData.map(m => m > 0).lastIndexOf(true);
    const minutesToday = lastMinuteIndex !== -1 ? studyData[lastMinuteIndex] : 0;
    let totalMinutesWeek = 0;
    if (lastMinuteIndex > -1) {
        const weekNumber = Math.floor(lastMinuteIndex / 7);
        const startOfWeekIndex = weekNumber * 7;
        const endOfWeekIndex = startOfWeekIndex + 6;
        for (let i = startOfWeekIndex; i <= endOfWeekIndex && i < TOTAL_DAYS; i++) {
            totalMinutesWeek += studyData[i];
        }
    }

    let totalPomodorosMonth = 0;
    pomodoroData.forEach((pomodoros, index) => {
        if (pomodoros > 0) {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            if (dayDate.getMonth() === currentMonth) {
                totalPomodorosMonth += pomodoros;
            }
        }
    });

    const lastPomodoroIndex = pomodoroData.map(p => p > 0).lastIndexOf(true);
    const pomodorosToday = lastPomodoroIndex !== -1 ? pomodoroData[lastPomodoroIndex] : 0;
    let totalPomodorosWeek = 0;
    if (lastPomodoroIndex > -1) {
        const weekNumber = Math.floor(lastPomodoroIndex / 7);
        const startOfWeekIndex = weekNumber * 7;
        const endOfWeekIndex = startOfWeekIndex + 6;
        for (let i = startOfWeekIndex; i <= endOfWeekIndex && i < TOTAL_DAYS; i++) {
            totalPomodorosWeek += pomodoroData[i];
        }
    }
    
    document.getElementById('minutos-hoje').textContent = `${minutesToday} min`;
    document.getElementById('minutos-semana').textContent = `${totalMinutesWeek} min`;
    document.getElementById('minutos-mes').textContent = `${totalMinutesMonth} min`;
    document.getElementById('pomodoros-hoje').textContent = pomodorosToday;
    document.getElementById('pomodoros-semana').textContent = totalPomodorosWeek;
    document.getElementById('pomodoros-mes').textContent = totalPomodorosMonth;

    const totalProgress = (daysCompleted / TOTAL_DAYS) * 100;
    if(document.getElementById('total-progress-bar')) {
        document.getElementById('total-progress-bar').style.width = `${totalProgress}%`;
        document.getElementById('total-progress-text').textContent = `${daysCompleted}/${TOTAL_DAYS} dias`;
    }
    const daysGrid = document.getElementById('days-grid');
    if(daysGrid) {
        daysGrid.innerHTML = ''; 
        studyData.forEach((minutes, index) => {
            const dayItem = document.createElement('div');
            dayItem.classList.add('day-item');
            if (minutes > 0) dayItem.classList.add('checked');
            dayItem.innerHTML = `<input type="checkbox" id="day-${index + 1}" ${minutes > 0 ? 'checked' : ''} disabled><label for="day-${index + 1}">Dia ${index + 1}</label>`;
            daysGrid.appendChild(dayItem);
        });
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

    const totalSubjectMinutes = {};
    dailySubjectData.forEach(dayData => {
        for (const subject in dayData) {
            totalSubjectMinutes[subject] = (totalSubjectMinutes[subject] || 0) + dayData[subject];
        }
    });
    const todaySubjectData = dailySubjectData.length > 0 ? dailySubjectData[dailySubjectData.length - 1] : {};
    const pieChartColors = ['#3E2A79', '#8557B7', '#CD77C0', '#5b3ab3', '#a56de2', '#e489d5', '#7d5cce'];

    const pieTotalCtx = document.getElementById('subject-chart-total')?.getContext('2d');
    if (pieTotalCtx) {
        new Chart(pieTotalCtx, { type: 'pie', data: { labels: Object.keys(totalSubjectMinutes), datasets: [{ label: 'Minutos Totais', data: Object.values(totalSubjectMinutes), backgroundColor: pieChartColors, borderColor: '#21212C', borderWidth: 2 }] }, options: pieChartOptions() });
    }

    const pieTodayCtx = document.getElementById('subject-chart-today')?.getContext('2d');
    if (pieTodayCtx) {
        new Chart(pieTodayCtx, { type: 'pie', data: { labels: Object.keys(todaySubjectData), datasets: [{ label: 'Minutos na Sessão', data: Object.values(todaySubjectData), backgroundColor: pieChartColors, borderColor: '#21212C', borderWidth: 2 }] }, options: pieChartOptions() });
    }

    function pieChartOptions() { return { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top', labels: { color: '#f0f0f0', font: { size: 12 } } } } }; }
    function chartOptions(textColor) { return { scales: { y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: textColor }, grid: { display: false } } }, plugins: { legend: { labels: { color: textColor } } } }; }

    // ==================================================================
    // ## PARTE 2: NAVEGAÇÃO DO SITE (COM CORREÇÃO FINAL)
    // ==================================================================
    const navLinks = document.querySelectorAll('#navbar a');
    const sections = document.querySelectorAll('main > div[id], main > section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        // --- INÍCIO DA CORREÇÃO ---
        // Verifica se o usuário rolou até o final da página
        const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2; // -2px de margem de erro
        
        if (isAtBottom) {
            // Se estiver no final, força a última seção a ser a ativa
            currentSectionId = sections[sections.length - 1].id;
        } else {
            // Se não, usa a lógica normal
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 70) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }
        // --- FIM DA CORREÇÃO ---

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

});