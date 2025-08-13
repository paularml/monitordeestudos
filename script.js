document.addEventListener('DOMContentLoaded', function() {
    
    // ##################################################################
    // ## INÍCIO DA ÁREA DE EDIÇÃO: Insira seus dados aqui             ##
    // ##################################################################

    const planStartDate = '2025-08-10'; // FORMATO: 'AAAA-MM-DD'

    const studyData = [
        // Semana 1 (Dias 1-7)
        25, 150, 180,
        // Semana 2 (Dias 8-14)
        
        // Semana 3 (Dias 15-21)
        
    ];

    const pomodoroData = [
        // Semana 1
        1, 0, 4,
        // Semana 2
        
        // Semana 3
        
    ];

    const dailySubjectData = [
        // Dia 1 de estudo por disciplina
        { 'Avaliação': 0, 'Psicologia da educação': 25},
        // Dia 2
        { 'Avaliação': 20, 'Psicologia da educação': 120},
        // Dia 3
        { 'Avaliação': 10, 'Psicologia da educação': 10, 'Teorias Pedagógicas': 120, 'História da Educação': 0},
        // Dia 4
        
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
        new Chart(lineChartCtx, { type: 'line', data: { labels: filteredLabels, datasets: [{ label: 'Minutos Estudados', data: filteredData, backgroundColor: 'rgba(133, 87, 183, 0.2)', borderColor: '#8557B7', borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: '#CD77C0', pointRadius: 3 }] }, options: chartOptions('#f0f0f0') }); // não mudar essas cores
    }

    const totalSubjectMinutes = {};
    dailySubjectData.forEach(dayData => {
        for (const subject in dayData) {
            totalSubjectMinutes[subject] = (totalSubjectMinutes[subject] || 0) + dayData[subject];
        }
    });
    const todaySubjectData = dailySubjectData.length > 0 ? dailySubjectData[dailySubjectData.length - 1] : {};
    const pieChartColors = ['#600e61ff', '#310d75ff', '#a7058eff', '#5b3ab3', '#46736B', '#e489d5', '#50590C'];

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
    // ## PARTE 2: NAVEGAÇÃO DO SITE (COM LÓGICA PARA LINKS EXTERNOS)
    // ==================================================================
    const navLinks = document.querySelectorAll('#navbar a');
    const sections = document.querySelectorAll('main > div[id], main > section[id]');

    // LÓGICA DO CLIQUE (COM A CORREÇÃO)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Verifica se é um link interno (começa com #)
            if (href.startsWith('#')) {
                // Se for, executa a lógica de rolagem suave
                e.preventDefault();

                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // Se não começar com '#', o código não faz nada e deixa o navegador 
            // seguir o link externo normalmente.
        });
    });
    
    // LÓGICA DA ROLAGEM (COM CORREÇÃO PARA O ÚLTIMO ITEM)
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2; 

        if (isAtBottom) {
            currentSectionId = sections[sections.length - 1].id;
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 70) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            // Só adiciona a classe 'active' para links internos
            if (linkHref.startsWith('#') && linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==================================================================
    // ## PARTE 3: FUNCIONALIDADE DO MENU HAMBÚRGUER
    // ==================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('.nav-links');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navMenu.addEventListener('click', (e) => {
        // Fecha o menu se um link interno for clicado
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            navMenu.classList.remove('active');
        }
    });

});