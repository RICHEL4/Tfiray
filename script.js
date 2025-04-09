// Stockage des données
let users = JSON.parse(localStorage.getItem('tifa_users')) || {};
let pendingActivations = JSON.parse(localStorage.getItem('tifa_pending')) || {};
let currentUser = null;
const ADMIN_PHONE = "261346086885"; // Ton numéro admin

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('show-login').addEventListener('click', showLoginForm);
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
    document.getElementById('show-login-from-activation').addEventListener('click', showLoginForm);
    document.getElementById('register-btn').addEventListener('click', registerUser);
    document.getElementById('login-btn').addEventListener('click', loginUser);
    document.getElementById('activate-btn').addEventListener('click', activateAccount);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('admin-logout-btn').addEventListener('click', logout);
    document.getElementById('update-btn')?.addEventListener('click', updatePredictions);
});

// Fonctions de navigation
function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('activation-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('activation-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showActivationForm(phone = '') {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('activation-form').style.display = 'block';
    document.getElementById('activation-phone').value = phone;
}

// Fonctions d'authentification
function registerUser() {
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!/^261[0-9]{9}$/.test(phone)) {
        alert('Numéro invalide (commencez par 261)');
        return;
    }

    if (users[phone]) {
        alert('Ce numéro est déjà enregistré');
        return;
    }

    users[phone] = { password, activated: false, registrationDate: new Date().toISOString() };
    pendingActivations[phone] = { phone, timestamp: new Date().toLocaleString(), activationCode: null, activated: false };
    
    localStorage.setItem('tifa_users', JSON.stringify(users));
    localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
    
    alert('Inscription réussie! Attendez votre code d\'activation de l\'administrateur.');
    showActivationForm(phone);
}

function loginUser() {
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (phone === ADMIN_PHONE && password === users[phone]?.password) {
        showAdminPanel();
        return;
    }

    if (!users[phone] || users[phone].password !== password) {
        alert('Identifiants incorrects');
        return;
    }

    if (!users[phone].activated) {
        if (confirm('Compte non activé. Entrer votre code d\'activation?')) {
            showActivationForm(phone);
        }
        return;
    }

    currentUser = phone;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
}

function activateAccount() {
    const phone = document.getElementById('activation-phone').value.trim();
    const code = document.getElementById('activation-code').value.trim();

    if (!users[phone]) {
        alert('Numéro non enregistré');
        return;
    }

    if (pendingActivations[phone]?.activationCode === code && code !== null) {
        users[phone].activated = true;
        pendingActivations[phone].activated = true;
        localStorage.setItem('tifa_users', JSON.stringify(users));
        localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
        alert('Compte activé! Vous pouvez vous connecter.');
        showLoginForm();
    } else {
        alert('Code invalide ou non attribué par l\'administrateur');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
    showLoginForm();
}

// Fonctions Admin
function showAdminPanel() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    updatePendingList();
}

function updatePendingList() {
    const list = document.getElementById('pending-users-list');
    list.innerHTML = '';

    for (const [phone, data] of Object.entries(pendingActivations)) {
        if (!data.activated) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${phone}</span>
                <span>${data.timestamp}</span>
                <input type="text" class="activation-code-input" placeholder="Entrez un code (6 chiffres)" maxlength="6">
                <button class="set-code-btn" data-phone="${phone}">Définir Code</button>
                <button class="approve-btn" data-phone="${phone}">Approuver</button>
            `;
            list.appendChild(li);
        }
    }

    document.querySelectorAll('.set-code-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            const codeInput = this.previousElementSibling;
            const code = codeInput.value.trim();

            if (!/^\d{6}$/.test(code)) {
                alert('Le code doit être un nombre de 6 chiffres');
                return;
            }

            pendingActivations[phone].activationCode = code;
            localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
            alert(`Code ${code} défini pour ${phone}`);
        });
    });

    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            if (!pendingActivations[phone].activationCode) {
                alert('Veuillez d\'abord définir un code d\'activation');
                return;
            }
            pendingActivations[phone].activated = true;
            localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
            updatePendingList();
            alert('Utilisateur approuvé! Il peut utiliser son code.');
        });
    });
}

// Fonctions principales
function updatePredictions() {
    const time = document.getElementById('time-input').value;
    if (!time) return;

    document.getElementById('response').innerHTML = `
        <p>${time} + 3min - ${Math.random() < 0.5 ? 'x5' : 'x10+'}</p>
        <p>${time} + 4min30 - ${Math.random() < 0.5 ? 'x5' : 'x10+'}</p>
    `;
}// Stockage des données
let users = JSON.parse(localStorage.getItem('tifa_users')) || {};
let pendingActivations = JSON.parse(localStorage.getItem('tifa_pending')) || {};
let currentUser = null;
const ADMIN_PHONE = "261346086885"; // Ton numéro admin

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('show-login').addEventListener('click', showLoginForm);
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
    document.getElementById('show-login-from-activation').addEventListener('click', showLoginForm);
    document.getElementById('register-btn').addEventListener('click', registerUser);
    document.getElementById('login-btn').addEventListener('click', loginUser);
    document.getElementById('activate-btn').addEventListener('click', activateAccount);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('admin-logout-btn').addEventListener('click', logout);
    document.getElementById('update-btn')?.addEventListener('click', updatePredictions);
});

// Fonctions de navigation
function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('activation-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('activation-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function showActivationForm(phone = '') {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('activation-form').style.display = 'block';
    document.getElementById('activation-phone').value = phone;
}

// Fonctions d'authentification
function registerUser() {
    const phone = document.getElementById('register-phone').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!/^261[0-9]{9}$/.test(phone)) {
        alert('Numéro invalide (commencez par 261)');
        return;
    }

    if (users[phone]) {
        alert('Ce numéro est déjà enregistré');
        return;
    }

    users[phone] = { password, activated: false, registrationDate: new Date().toISOString() };
    pendingActivations[phone] = { phone, timestamp: new Date().toLocaleString(), activationCode: null, activated: false };
    
    localStorage.setItem('tifa_users', JSON.stringify(users));
    localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
    
    alert('Inscription réussie! Attendez votre code d\'activation de l\'administrateur.');
    showActivationForm(phone);
}

function loginUser() {
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (phone === ADMIN_PHONE && password === users[phone]?.password) {
        showAdminPanel();
        return;
    }

    if (!users[phone] || users[phone].password !== password) {
        alert('Identifiants incorrects');
        return;
    }

    if (!users[phone].activated) {
        if (confirm('Compte non activé. Entrer votre code d\'activation?')) {
            showActivationForm(phone);
        }
        return;
    }

    currentUser = phone;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
}

function activateAccount() {
    const phone = document.getElementById('activation-phone').value.trim();
    const code = document.getElementById('activation-code').value.trim();

    if (!users[phone]) {
        alert('Numéro non enregistré');
        return;
    }

    if (pendingActivations[phone]?.activationCode === code && code !== null) {
        users[phone].activated = true;
        pendingActivations[phone].activated = true;
        localStorage.setItem('tifa_users', JSON.stringify(users));
        localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
        alert('Compte activé! Vous pouvez vous connecter.');
        showLoginForm();
    } else {
        alert('Code invalide ou non attribué par l\'administrateur');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('main-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
    showLoginForm();
}

// Fonctions Admin
function showAdminPanel() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    updatePendingList();
}

function updatePendingList() {
    const list = document.getElementById('pending-users-list');
    list.innerHTML = '';

    for (const [phone, data] of Object.entries(pendingActivations)) {
        if (!data.activated) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${phone}</span>
                <span>${data.timestamp}</span>
                <input type="text" class="activation-code-input" placeholder="Entrez un code (6 chiffres)" maxlength="6">
                <button class="set-code-btn" data-phone="${phone}">Définir Code</button>
                <button class="approve-btn" data-phone="${phone}">Approuver</button>
            `;
            list.appendChild(li);
        }
    }

    document.querySelectorAll('.set-code-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            const codeInput = this.previousElementSibling;
            const code = codeInput.value.trim();

            if (!/^\d{6}$/.test(code)) {
                alert('Le code doit être un nombre de 6 chiffres');
                return;
            }

            pendingActivations[phone].activationCode = code;
            localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
            alert(`Code ${code} défini pour ${phone}`);
        });
    });

    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phone = this.getAttribute('data-phone');
            if (!pendingActivations[phone].activationCode) {
                alert('Veuillez d\'abord définir un code d\'activation');
                return;
            }
            pendingActivations[phone].activated = true;
            localStorage.setItem('tifa_pending', JSON.stringify(pendingActivations));
            updatePendingList();
            alert('Utilisateur approuvé! Il peut utiliser son code.');
        });
    });
}

// Fonctions principales
function updatePredictions() {
    const time = document.getElementById('time-input').value;
    if (!time) return;

    document.getElementById('response').innerHTML = `
        <p>${time} + 3min - ${Math.random() < 0.5 ? 'x5' : 'x10+'}</p>
        <p>${time} + 4min30 - ${Math.random() < 0.5 ? 'x5' : 'x10+'}</p>
    `;
                            }
