document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs
    const selectors = {
        themeToggle: document.getElementById('themeToggle'),
        registrationModal: document.getElementById('registrationModal'),
        confirmationModal: document.getElementById('confirmationModal'),
        closeModal: document.getElementById('closeModal'),
        closeConfirmationModal: document.getElementById('closeConfirmationModal'),
        registrationForm: document.getElementById('registrationForm'),
        confirmationForm: document.getElementById('confirmationForm'),
        loginBtn: document.getElementById('loginBtn'),
        loginBtnModal: document.getElementById('loginBtnModal'),
        phoneNumber: document.getElementById('phoneNumber'),
        confirmationCode: document.getElementById('confirmationCode'),
        displayPhoneNumber: document.getElementById('displayPhoneNumber'),
        submitBtn: document.getElementById('submitBtn'),
        btnText: document.getElementById('btnText'),
        phoneError: document.getElementById('phoneError'),
        codeError: document.getElementById('codeError'),
        timeInput: document.getElementById('timeInput'),
        calculateBtn: document.getElementById('calculateBtn'),
        resetBtn: document.getElementById('resetBtn'),
        autoRefresh: document.getElementById('autoRefresh'),
        predictionValue: document.getElementById('predictionValue'),
        historyList: document.getElementById('historyList'),
        timer: document.getElementById('timer'),
        successRate: document.getElementById('successRate'),
        averageMultiplier: document.getElementById('averageMultiplier'),
        nextCrashTime: document.getElementById('nextCrashTime'),
        secondCrashTime: document.getElementById('secondCrashTime'),
        mainMultiplier: document.getElementById('mainMultiplier'),
        secondMultiplier: document.getElementById('secondMultiplier'),
        riskValue: document.getElementById('riskValue'),
        topTourInput: document.getElementById('topTourInput'),
        calculateTopTour: document.getElementById('calculateTopTour'),
        topTourResults: document.getElementById('topTourResults')
    };

    // État
    let isAuthenticated = false;
    let history = [];
    let countdown = 0;
    let timerInterval;
    let autoRefreshInterval;

    // Initialisation du thème
    function initTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            selectors.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        selectors.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            selectors.themeToggle.innerHTML = document.body.classList.contains('dark-mode')
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        });
    }

    // Gestion des modals
    function initModals() {
        const showModal = (modal) => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const hideModal = (modal) => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        selectors.loginBtn.addEventListener('click', () => {
            if (!isAuthenticated) {
                showModal(selectors.registrationModal);
            } else {
                isAuthenticated = false;
                selectors.loginBtn.textContent = 'Hiditra';
                alert('Niala soa aman-tsara ianao');
            }
        });

        selectors.closeModal.addEventListener('click', () => hideModal(selectors.registrationModal));
        selectors.closeConfirmationModal.addEventListener('click', () => hideModal(selectors.confirmationModal));

        window.addEventListener('click', (e) => {
            if (e.target === selectors.registrationModal) hideModal(selectors.registrationModal);
            if (e.target === selectors.confirmationModal) hideModal(selectors.confirmationModal);
        });

        selectors.registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const phoneRegex = /^[0-9]{2} [0-9]{2} [0-9]{3} [0-9]{2}$/;
            if (!phoneRegex.test(selectors.phoneNumber.value)) {
                selectors.phoneError.style.display = 'block';
                return;
            }
            selectors.phoneError.style.display = 'none';

            selectors.submitBtn.disabled = true;
            selectors.btnText.innerHTML = '<div class="loading"></div> Alefa...';

            await new Promise(resolve => setTimeout(resolve, 1500));

            selectors.displayPhoneNumber.textContent = selectors.phoneNumber.value;
            hideModal(selectors.registrationModal);
            showModal(selectors.confirmationModal);

            selectors.submitBtn.disabled = false;
            selectors.btnText.textContent = 'Hisoratra';
        });

        selectors.confirmationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (selectors.confirmationCode.value.toUpperCase() !== 'TAFA') {
                selectors.codeError.style.display = 'block';
                return;
            }

            selectors.codeError.style.display = 'none';
            isAuthenticated = true;
            selectors.loginBtn.textContent = 'Ny kaontiko';
            hideModal(selectors.confirmationModal);
            alert('Nahomby ny fisoratana anarana! Tonga soa eto TAFA IRAY PRO');
        });

        selectors.loginBtnModal.addEventListener('click', () => {
            hideModal(selectors.registrationModal);
            alert('Ho tonga amin\'ny fanavaozana manaraka io fiasa io');
        });
    }

    // Fonctionnalités principales
    function initAppFeatures() {
        selectors.timeInput.value = getCurrentTime();

        selectors.calculateBtn.addEventListener('click', calculatePrediction);
        selectors.resetBtn.addEventListener('click', resetApp);

        selectors.timeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculatePrediction();
        });

        if (selectors.autoRefresh) {
            selectors.autoRefresh.addEventListener('change', (e) => {
                if (e.target.checked) {
                    autoRefreshInterval = setInterval(() => {
                        selectors.timeInput.value = getCurrentTime();
                        calculatePrediction();
                    }, 60000);
                } else {
                    clearInterval(autoRefreshInterval);
                }
            });
        }

        selectors.calculateTopTour.addEventListener('click', calculateTopTourPredictions);
        selectors.topTourInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateTopTourPredictions();
        });
    }

    function generatePredictionFromTime(time) {
        if (!isAuthenticated) {
            selectors.registrationModal.classList.add('active');
            alert('Misoratra anarana aloha mba hampiasana io fiasa io');
            return null;
        }

        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;

        const now = new Date();
        const dynamicSeed = (totalMinutes * now.getSeconds() * 9301 + 49297) % 233280;
        const random = dynamicSeed / 233280;

        const baseMultiplier = 4 + random;
        const mainMult = parseFloat(baseMultiplier.toFixed(2));

        let secondMult;
        if (mainMult > 4.5) {
            secondMult = parseFloat((5 - (mainMult - 4.5)).toFixed(2));
        } else {
            secondMult = parseFloat((mainMult + 0.5 + random * 0.5).toFixed(2));
        }

        const riskOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 180, 200];
        const risk = riskOptions[Math.floor(random * riskOptions.length)];

        const delayMinutes = 3 + Math.floor(random * 3);
        const delayedMinutes = totalMinutes + delayMinutes;

        const formatTime = (minutes) => {
            const hrs = Math.floor(minutes / 60) % 24;
            const mins = minutes % 60;
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };

        return {
            mainMultiplier: mainMult,
            secondMultiplier: secondMult,
            crashTime: formatTime(delayedMinutes),
            secondCrashTime: formatTime(delayedMinutes + 1),
            riskLevel: risk,
            delay: delayMinutes,
            timestamp: now.getTime()
        };
    }

    function calculatePrediction() {
        const time = selectors.timeInput.value || getCurrentTime();
        selectors.timeInput.value = time;

        const prediction = generatePredictionFromTime(time);
        if (!prediction) return;

        selectors.predictionValue.textContent = `${prediction.mainMultiplier}x`;
        selectors.mainMultiplier.textContent = `${prediction.mainMultiplier}x`;
        selectors.secondMultiplier.textContent = `${prediction.secondMultiplier}x`;
        selectors.nextCrashTime.textContent = prediction.crashTime;
        selectors.secondCrashTime.textContent = prediction.secondCrashTime;
        selectors.riskValue.textContent = `x${prediction.riskLevel}`;

        history.unshift({
            ...prediction,
            time
        });

        if (history.length > 12) history.pop();

        updateHistory();
        updateStats();

        clearInterval(timerInterval);
        countdown = 60 + Math.floor(Math.random() * 60);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function calculateTopTourPredictions() {
        const tourNumber = parseInt(selectors.topTourInput.value);
        if (!tourNumber || tourNumber < 1) {
            alert('Ampidiro nomerao tour mety');
            return;
        }

        if (!isAuthenticated) {
            selectors.registrationModal.classList.add('active');
            alert('Misoratra anarana aloha mba hampiasana io fiasa io');
            return;
        }

        const tour1 = tourNumber + 6;
        const tour2 = tourNumber + 7;

        const time1 = generateTimeFromTour(tour1);
        const time2 = generateTimeFromTour(tour2);

        const prediction1 = generatePredictionFromTime(time1);
        const prediction2 = generatePredictionFromTime(time2);

        const resultElements = selectors.topTourResults.querySelectorAll('.top-tour-result');

        resultElements[0].innerHTML = `
            <div class="tour-number">TOUR ${tour1}</div>
            <div class="multipliers">${prediction1.mainMultiplier}x SA ${prediction1.secondMultiplier}x</div>
            <div class="time">${time1} → ${prediction1.crashTime}</div>
            <div class="risk">Risika: x${prediction1.riskLevel}</div>
        `;

        resultElements[1].innerHTML = `
            <div class="tour-number">TOUR ${tour2}</div>
            <div class="multipliers">${prediction2.mainMultiplier}x SA ${prediction2.secondMultiplier}x</div>
            <div class="time">${time2} → ${prediction2.crashTime}</div>
            <div class="risk">Risika: x${prediction2.riskLevel}</div>
        `;
    }

    function generateTimeFromTour(tourNumber) {
        const totalMinutes = tourNumber;
        const hrs = Math.floor(totalMinutes / 60) % 24;
        const mins = totalMinutes % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    function updateTimer() {
        countdown--;

        if (countdown <= 0) {
            selectors.timer.textContent = 'Vonona ny faminavinana vaovao';
            clearInterval(timerInterval);
            if (selectors.autoRefresh?.checked) {
                calculatePrediction();
            }
        } else {
            const mins = Math.floor(countdown / 60).toString().padStart(2, '0');
            const secs = (countdown % 60).toString().padStart(2, '0');
            selectors.timer.textContent = `Famerenana ao anatin'ny: ${mins}:${secs}`;
        }
    }

    function resetApp() {
        clearInterval(timerInterval);
        clearInterval(autoRefreshInterval);
        selectors.predictionValue.textContent = '--x';
        selectors.timer.textContent = 'Ampidiro ny fotoana hanombohana';
        selectors.mainMultiplier.textContent = '--x';
        selectors.secondMultiplier.textContent = '--x';
        selectors.nextCrashTime.textContent = '--:--';
        selectors.secondCrashTime.textContent = '--:--';
        selectors.riskValue.textContent = '--';
        selectors.timeInput.value = getCurrentTime();
        selectors.autoRefresh.checked = false;
    }

    function updateHistory() {
        selectors.historyList.innerHTML = history.map(item => {
            const bgColor = item.mainMultiplier >= 4.5
                ? 'linear-gradient(135deg, #10b981, #047857)'
                : item.mainMultiplier < 4
                ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                : 'linear-gradient(135deg, var(--primary), var(--secondary))';

            return `
                <div class="history-item" style="background: ${bgColor}">
                    <div class="history-multiplier">${item.mainMultiplier}x/${item.secondMultiplier}x</div>
                    <div class="history-time">${item.time} → ${item.crashTime}/${item.secondCrashTime}</div>
                    <div class="history-time">Risika: x${item.riskLevel}</div>
                </div>
            `;
        }).join('');
    }

    function updateStats() {
        const total = history.length;
        selectors.totalPredictions.textContent = total;

        if (total > 0) {
            const avg = history.reduce((sum, item) => sum + item.mainMultiplier, 0) / total;
            selectors.averageMultiplier.textContent = `${avg.toFixed(1)}x`;

            const successCount = history.filter(item => item.mainMultiplier >= 4.5).length;
            selectors.successRate.textContent = `${Math.round((successCount / total) * 100)}%`;
        }
    }

    function getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    function init() {
        initTheme();
        initModals();
        initAppFeatures();
    }

    init();
});
