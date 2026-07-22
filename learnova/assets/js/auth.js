/* ============================================
   LEARNOVA - Auth JavaScript
   auth.js → assets/js/auth.js

   LocalStorage based Login & Signup
   Users array mein store hote hain
   ============================================ */

var USERS_KEY = 'learnova_users';
var SESSION_KEY = 'learnova_session';

/* ---- Helpers ---- */
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch(e) { return []; }
}

function saveUsers(arr) {
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch(e) { return null; }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ---- SIGNUP ---- */
var signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
  signupBtn.addEventListener('click', function () {
    var name     = document.getElementById('signupName').value.trim();
    var email    = document.getElementById('signupEmail').value.trim();
    var password = document.getElementById('signupPassword').value.trim();

    // Remove old messages
    removeMessages();

    if (!name || name.length < 2) {
      showError('Please enter your full name.'); return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.'); return;
    }
    if (!password || password.length < 6) {
      showError('Password must be at least 6 characters.'); return;
    }

    var users = getUsers();

    // Check duplicate email
    if (users.find(function(u){ return u.email === email; })) {
      showError('An account with this email already exists. Please login.'); return;
    }

    // Save new user
    users.push({ name: name, email: email, password: password });
    saveUsers(users);
    setSession({ name: name, email: email });

    showSuccess('Account created! Redirecting...');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1200);
  });
}

/* ---- LOGIN ---- */
var loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', function () {
    var email    = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();

    removeMessages();

    if (!email || !password) {
      showError('Please fill in all fields.'); return;
    }

    var users = getUsers();
    var user  = users.find(function(u){
      return u.email === email && u.password === password;
    });

    if (!user) {
      showError('Invalid email or password. Please try again.'); return;
    }

    setSession(user);
    showSuccess('Login successful! Redirecting...');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1000);
  });
}

/* ---- Enter key support ---- */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    if (signupBtn) signupBtn.click();
    if (loginBtn)  loginBtn.click();
  }
});

/* ---- Message helpers ---- */
function removeMessages() {
  var old = document.querySelectorAll('.auth-error, .auth-success');
  old.forEach(function(el){ el.remove(); });
}

function showError(msg) {
  var div = document.createElement('div');
  div.className = 'auth-error show';
  div.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-2"></i>' + msg;
  var box = document.querySelector('.auth-box');
  box.insertBefore(div, box.querySelector('input, button'));
}

function showSuccess(msg) {
  var div = document.createElement('div');
  div.className = 'auth-success show';
  div.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>' + msg;
  var box = document.querySelector('.auth-box');
  box.insertBefore(div, box.querySelector('input, button'));
}
