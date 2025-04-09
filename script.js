// Stockage des données
let users = JSON.parse(localStorage.getItem('tifa_users')) || {};
let pendingActivations = JSON.parse(localStorage.getItem('tifa_pending')) || {};
let currentUser = null;
const ADMIN_PHONE = "261346086885"; // Ton numéro admin

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const showLoginFromActivation = document.getElementById('show-login-from-activation');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const activateBtn = document.getElementById('activate-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const updateBtn = document.getElementById('update-btn');

    if (showLogin) showLogin.addEventListener('click', showLoginForm);
    if (showRegister) showRegister.addEventListener('click', showRegisterForm);
    if (showLoginFromActivation) showLoginFromActivation.addEventListener('click', showLoginForm);
    if (registerBtn) registerBtn.addEventListener('click', registerUser);
    if (loginBtn) loginBtn.addEventListener('click', loginUser);
    if (activateBtn) activateBtn.addEventListener('click', activateAccount);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', logout);
    if (updateBtn) updateBtn.addEventListener('click', updatePredictions);
});

// Fonctions de navigation
function showLoginForm() {
    const registerForm = document.getElementById('register-form');
    const activationForm = document.getElementById('activation-form');
    const loginForm = document.getElementById('login-form');
    if (registerForm) registerForm.style.display = 'none';
    if (activationForm) activationForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
}

function showRegisterForm() {
    const loginForm = document.getElementById('login-form');
    const activationForm = document.getElementById('activation-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm) loginForm.style.display = 'none';
    if (activationForm) activationForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
}

function showActivationForm(phone = '') {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const activationForm = document.getElementById('activation-form');
    const activationPhone = document.getElementById('activation-phone');
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'none';
    if (activationForm) activationForm.style.display = 'block';
    if (activationPhone) activationPhone.value = phone;
}

// Fonctions d'authentification
function registerUser() {
    const phoneInput = document.getElementById('register-phone');
    const passwordInput = document.getElementById('register-password');
    if (!phoneInput || !passwordInput) return;

    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();

    if (!/^261[0-9]{9}$/.test(phone)) {
        alert('Numéro invalide (commencez par 261)');
        return;
    }

    if (users[phone]) {
        alert('Ce numéro est déjà enregistré');
        return;
    }

    // Générer un code d’activation unique à 6 chiffres
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Enregistrer l’utilisateur et le code dans localStorage
    users[phone] = { password, activated: false, registrationDate: new Date().toISOString() };
    pendingActivations[phone] = { phone, timestamp: new Date().toLocaleString(), activationCode, activated: false };

    localStorage.setItem('tifa_users', JSON.stringify(users));
    localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));

    alert('Inscription réussie ! Un admin vous contactera avec votre code d’activation.');
    showActivationForm(phone);
}

function loginUser() {
    const phoneInput = document.getElementById('login-phone');
    const passwordInput = document.getElementById('login-password');
    if (!phoneInput || !passwordInput) return;

    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();

    if (phone === ADMIN_PHONE && password === users[phone]?.password) {
        showAdminPanel();
        return;
    }

    if (!users[phone] || users[phone].password !== password) {
        alert('Identifiants incorrects');
        return;
    }

    if (!users[phone].activated) {
        if (confirm('Compte non activé. Entrer votre code d\'activation ?')) {
            showActivationForm(phone);
        }
        return;
    }

    currentUser = phone;
    const authContainer = document.getElementById('auth-container');
    const mainContainer = document.getElementById('main-container');
    if (authContainer) authContainer.style.display = 'none';
    if (mainContainer) mainContainer.style.display = 'block';
}

function activateAccount() {
    const phoneInput = document.getElementById('activation-phone');
    const codeInput = document.getElementById('activation-code');
    if (!phoneInput || !codeInput) return;

    const phone = phoneInput.value.trim();
    const code = codeInput.value.trim();

    if (!users[phone]) {
        alert('Numéro non enregistré');
        return;
    }

    if (pendingActivations[phone]?.activationCode === code) {
        users[phone].activated = true;
        pendingActivations[phone].activated = true;
        localStorage.setItem('tifa_users', JSON.stringify(users));
        localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
        alert('Compte activé ! Vous pouvez vous connecter.');
        showLoginForm();
    } else {
        alert('Code invalide ou non attribué pour ce numéro');
    }
}

function logout() {
    currentUser = null;
    const authContainer = document.getElementById('auth-container');
    const mainContainer = document.getElementById('main-container');
    const adminPanel = document.getElementById('admin-panel');
    if (authContainer) authContainer.style.display = 'block';
    if (mainContainer) mainContainer.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';
    showLoginForm();
}

// Fonctions Admin
function showAdminPanel() {
    const authContainer = document.getElementById('auth-container');
    const adminPanel = document.getElementById('admin-panel');
    if (authContainer) authContainer.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    updatePendingList();
}

function updatePendingList() {
    const list = document.getElementById('pending-users-list');
    if (!list) return;

    list.innerHTML = '';

    for (const [phone, data] of Object.entries(pendingActivations)) {
        if (!data.activated) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${phone}</span>
                <span>${data.timestamp}</span>
                <span>Code: <strong>${data.activationCode}</strong></span>
                <button class="copy-btn" data-code="${data.activationCode}">Copier</button>
            `;
            list.appendChild(li);
        }
    }

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code);
            alert(`Code ${code} copié ! Envoie-le à l’utilisateur avec le numéro ${this.parentElement.querySelector('span').textContent}.`);
        });
    });
}

// Fonctions principales
function updatePredictions() {
    const timeInput = document.getElementById('time-input');
    if (!timeInput) return;

    const time = timeInput.value;
    if (!time) return;

    const response = document.getElementById('response');
    if (response) {
        response.innerHTML = `
            <p>${time} + 3min - ${Math.random() < 0.5 ? 'x5' : 'x10+'}</p>
            <p>${time} + 4min30 - ${Math.random() < 0.5 ? 'x5' : 'x10+'}</p>
        `;
    }
}
