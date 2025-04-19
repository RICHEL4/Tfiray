document.addEventListener('DOMContentLoaded', function() {
    // Fampidirana ny singa
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const registrationModal = document.getElementById('registrationModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.getElementById('closeModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const registrationForm = document.getElementById('registrationForm');
    const confirmationForm = document.getElementById('confirmationForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnModal = document.getElementById('loginBtnModal');
    const phoneNumber = document.getElementById('phoneNumber');
    const confirmationCode = document.getElementById('confirmationCode');
    const displayPhoneNumber = document.getElementById('displayPhoneNumber');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const phoneError = document.getElementById('phoneError');
    const codeError = document.getElementById('codeError');
    const timeInput = document.getElementById('timeInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const autoRefresh = document.getElementById('autoRefresh');
    const predictionValue = document.getElementById('predictionValue');
    const historyList = document.getElementById('historyList');
    const timer = document.getElementById('timer');
    const successRate = document.getElementById('successRate');
    const averageMultiplier = document.getElementById('averageMultiplier');
    const nextCrashTime = document.getElementById('nextCrashTime');
    const secondCrashTime = document.getElementById('secondCrashTime');
    const mainMultiplier = document.getElementById('mainMultiplier');
    const secondMultiplier = document.getElementById('secondMultiplier');
    const riskValue = document.getElementById('riskValue');
    const topTourInput = document.getElementById('topTourInput');
    const calculateTopTour = document.getElementById('calculateTopTour');
    const topTourResults = document.getElementById('topTourResults');

    // Variable d'état
    let isAuthenticated = false;
    let history = [];
    let countdown = 0;
    let timerInterval;
    let autoRefreshInterval;

    // Fanombohana ny loko
    function initTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeToggle.innerHTML = body.classList.contains('dark-mode') 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        });
    }

    // Fikarakarana ny modal
    function initModals() {
        function showModal(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function hideModal(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        loginBtn.addEventListener('click', () => {
            if (!isAuthenticated) {
                showModal(registrationModal);
            } else {
                isAuthenticated = false;
                loginBtn.textContent = 'Hiditra';
                alert('Niala soa aman-tsara ianao');
            }
        });

        closeModal.addEventListener('click', () => hideModal(registrationModal));
        closeConfirmationModal.addEventListener('click', () => hideModal(confirmationModal));

        window.addEventListener('click', (e) => {
            if (e.target === registrationModal) hideModal(registrationModal);
            if (e.target === confirmationModal) hideModal(confirmationModal);
        });

        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phoneRegex = /^[0-9]{2} [0-9]{2} [0-9]{3} [0-9]{2}$/;
            if (!phoneRegex.test(phoneNumber.value)) {
                phoneError.style.display = 'block';
                return;
            }
            phoneError.style.display = 'none';
            
            submitBtn.disabled = true;
            btnText.innerHTML = '<div class="loading"></div> Alefa...';
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            displayPhoneNumber.textContent = phoneNumber.value;
            hideModal(registrationModal);
            showModal(confirmationModal);
            
            submitBtn.disabled = false;
            btnText.textContent = 'Hisoratra';
            
            console.log(`Kaody nalefa tamin'ny +261${phoneNumber.value}: TAFA`);
        });

        confirmationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (confirmationCode.value.toUpperCase() !== 'TAFA') {
                codeError.style.display = 'block';
                return;
            }
            
            codeError.style.display = 'none';
            isAuthenticated = true;
            loginBtn.textContent = 'Ny kaontiko';
            hideModal(confirmationModal);
            alert('Nahomby ny fisoratana anarana! Tonga soa eto TAFA IRAY PRO');
        });

        loginBtnModal.addEventListener('click', () => {
            hideModal(registrationModal);
            alert('Ho tonga amin'ny fanavaozana manaraka io fiasa io');
        });
    }

    // Fampiasana fototra
    function initAppFeatures() {
        timeInput.value = getCurrentTime();

        calculateBtn.addEventListener('click', calculatePrediction);
        resetBtn.addEventListener('click', resetApp);
        
        timeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculatePrediction();
        });
        
        if (autoRefresh) {
            autoRefresh.addEventListener('change', (e) => {
                if (e.target.checked) {
                    autoRefreshInterval = setInterval(() => {
                        timeInput.value = getCurrentTime();
                        calculatePrediction();
                    }, 60000);
                } else {
                    clearInterval(autoRefreshInterval);
                }
            });
        }

        // Top Tour
        calculateTopTour.addEventListener('click', calculateTopTourPredictions);
        
        topTourInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateTopTourPredictions();
        });
    }

    function generatePredictionFromTime(time) {
        if (!isAuthenticated) {
            showModal(registrationModal);
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
        const time = timeInput.value || getCurrentTime();
        timeInput.value = time;
        
        const prediction = generatePredictionFromTime(time);
        if (!prediction) return;
        
        predictionValue.textContent = `${prediction.mainMultiplier}x`;
        mainMultiplier.textContent = `${prediction.mainMultiplier}x`;
        secondMultiplier.textContent = `${prediction.secondMultiplier}x`;
        nextCrashTime.textContent = prediction.crashTime;
        secondCrashTime.textContent = prediction.secondCrashTime;
        riskValue.textContent = `x${prediction.riskLevel}`;
        
        history.unshift({
            ...prediction,
            time: time
        });
        
        if (history.length > 12) history.pop();
        
        updateHistory();
        updateStats();
        
        clearInterval(timerInterval);
        countdown = 60 + Math.floor(Math.random() * 60);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function calculateTopTourPredictions() {
        const tourNumber = parseInt(topTourInput.value);
        if (!tourNumber || tourNumber < 1) {
            alert('Ampidiro nomerao tour mety');
            return;
        }

        if (!isAuthenticated) {
            showModal(registrationModal);
            alert('Misoratra anarana aloha mba hampiasana io fiasa io');
            return;
        }

        const tour1 = tourNumber + 6;
        const tour2 = tourNumber + 7;

        const time1 = generateTimeFromTour(tour1);
        const time2 = generateTimeFromTour(tour2);

        const prediction1 = generatePredictionFromTime(time1);
        const prediction2 = generatePredictionFromTime(time2);

        const resultElements = topTourResults.querySelectorAll('.top-tour-result');
        
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
            timer.textContent = "Vonona ny faminavinana vaovao";
            clearInterval(timerInterval);
            if (autoRefresh?.checked) {
                calculatePrediction();
            }
        } else {
            const mins = Math.floor(countdown / 60).toString().padStart(2, '0');
            const secs = (countdown % 60).toString().padStart(2, '0');
            timer.textContent = `Famerenana ao anatin'ny: ${mins}:${secs}`;
        }
    }

    function resetApp() {
        clearInterval(timerInterval);
        clearInterval(autoRefreshInterval);
        predictionValue.textContent = '--x';
        timer.textContent = 'Ampidiro ny fotoana hanombohana';
        mainMultiplier.textContent = '--x';
        secondMultiplier.textContent = '--x';
        nextCrashTime.textContent = '--:--';
        secondCrashTime.textContent = '--:--';
        riskValue.textContent = '--';
        timeInput.value = getCurrentTime();
    }

    function updateHistory() {
        historyList.innerHTML = history.map(item => {
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
        document.getElementById('totalPredictions').textContent = total;
        
        if (total > 0) {
            const avg = history.reduce((sum, item) => sum + item.mainMultiplier, 0) / total;
            averageMultiplier.textContent = `${avg.toFixed(1)}x`;
            
            const successCount = history.filter(item => item.mainMultiplier >= 4.5).length;
            successRate.textContent = `${Math.round((successCount / total) * 100)}%`;
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
