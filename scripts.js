// scripts.js for GM University BCA Blogging Platform

// 1. Dynamic Welcome Message
function displayWelcomeMessage() {
    var hours = new Date().getHours();
    var welcomeMessage;
    if (hours < 12) {
        welcomeMessage = "Good Morning!";
    } else if (hours < 18) {
        welcomeMessage = "Good Afternoon!";
    } else {
        welcomeMessage = "Good Evening!";
    }
    var welcomeElem = document.getElementById("welcome-message");
    if (welcomeElem) {
        welcomeElem.innerHTML = welcomeMessage;
    }
}

// 2. Interactive Content Filters (used on older pages)
function filterContent(category) {
    var posts = document.getElementsByClassName("content-card");
    for (var i = 0; i < posts.length; i++) {
        posts[i].style.display = (category === "all" || posts[i].classList.contains(category)) ? "block" : "none";
    }
}

// 3. Simple client-side auth mock (no real backend)
function mockLogin(event) {
    if (event && event.preventDefault) event.preventDefault();
    var email = document.getElementById('email') ? document.getElementById('email').value : '';
    var password = document.getElementById('password') ? document.getElementById('password').value : '';
    var role = document.getElementById('role') ? document.getElementById('role').value : 'student';
    var adminToggle = document.getElementById('admin-toggle');
    var isAdmin = adminToggle && adminToggle.checked;

    // basic validation
    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }

    // save a simple auth token in localStorage (mock)
    var user = { email: email, role: role, isAdmin: !!isAdmin, loggedAt: new Date().toISOString() };
    try { localStorage.setItem('gmu-user', JSON.stringify(user)); } catch (e) { console.warn('Could not save auth token', e); }

    // redirect to homepage after login
    window.location.href = 'index.html';
}

function mockSignup(event) {
    if (event && event.preventDefault) event.preventDefault();
    var name = document.getElementById('fullname') ? document.getElementById('fullname').value : '';
    var email = document.getElementById('email') ? document.getElementById('email').value : '';
    var password = document.getElementById('password') ? document.getElementById('password').value : '';
    var confirm = document.getElementById('confirm-password') ? document.getElementById('confirm-password').value : '';
    var role = document.getElementById('role') ? document.getElementById('role').value : 'student';
    if (!name || !email || !password) {
        alert('Please fill all required fields.');
        return;
    }
    if (password !== confirm) {
        alert('Passwords do not match.');
        return;
    }
    // success - mock
    alert('Signup successful. Redirecting to homepage...');
    var user = { email: email, name: name, role: role, loggedAt: new Date().toISOString() };
    try { localStorage.setItem('gmu-user', JSON.stringify(user)); } catch (e) { console.warn('Could not save auth token', e); }
    window.location.href = 'index.html';
}

// 4. Form Validation helpers
function validateField(fieldId, validator, errorMsgId) {
    var el = document.getElementById(fieldId);
    if (!el) return;
    var value = el.value;
    var errorMsgElem = document.getElementById(errorMsgId);
    if (!validator(value)) {
        if (errorMsgElem) errorMsgElem.style.display = 'block';
    } else {
        if (errorMsgElem) errorMsgElem.style.display = 'none';
    }
}

// 5. Footer year and last modified
function updateFooter() {
    var currentYear = new Date().getFullYear();
    var yearElem = document.getElementById('footer-year');
    var modifiedElem = document.getElementById('last-modified');
    if (yearElem) yearElem.textContent = currentYear;
    if (modifiedElem) modifiedElem.textContent = document.lastModified;
}

// 6. Dark mode toggle
function toggleDarkMode(enabled) {
    if (typeof enabled === 'undefined') {
        enabled = !(document.documentElement.getAttribute('data-theme') === 'dark');
    }
    if (enabled) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('gmu-dark', '1');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.removeItem('gmu-dark');
    }
}

// Authentication helpers
function isAuthenticated() {
    try { return !!localStorage.getItem('gmu-user'); } catch (e) { return false; }
}

function logout() {
    try { localStorage.removeItem('gmu-user'); } catch (e) { console.warn(e); }
    window.location.href = 'login.html';
}

function applySavedTheme() {
    if (localStorage.getItem('gmu-dark')) toggleDarkMode(true);
}

// Initialization on page load
window.onload = function() {
    displayWelcomeMessage();
    updateFooter();
    applySavedTheme();

    // contact form (if present): save submissions to localStorage so they can be exported as CSV
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e){
            e.preventDefault();
            try {
                var name = (document.getElementById('name') || {}).value || '';
                var email = (document.getElementById('email') || {}).value || '';
                var phone = (document.getElementById('phone') || {}).value || '';
                var subject = (document.getElementById('subject') || {}).value || '';
                var message = (document.getElementById('message') || {}).value || '';
                var contact = {
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message,
                    submittedAt: new Date().toISOString()
                };
                // load existing
                var raw = localStorage.getItem('gmu-contacts');
                var arr = [];
                if (raw) {
                    try { arr = JSON.parse(raw) || []; } catch (e) { arr = []; }
                }
                arr.push(contact);
                localStorage.setItem('gmu-contacts', JSON.stringify(arr));
                alert('Contact saved locally. You can export contacts from the header button.');
                contactForm.reset();
            } catch (ex) {
                console.warn('contact save error', ex);
                alert('Could not save contact locally.');
            }
        });
    }

    // Export contacts CSV button (if present)
    var exportBtn = document.getElementById('export-contacts');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e){
            e.preventDefault();
            exportContactsCSV();
        });
    }

    // login form
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', mockLogin);
    }

    // signup form
    var signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', mockSignup);
    }

    // wire up dark mode toggle button
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(){ toggleDarkMode(); });
    }

    // wire logout links
    var els = document.querySelectorAll('a.logout');
    els.forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); logout(); }); });

    // update auth link(s) on pages (e.g. homepage link)
    function updateAuthLinks() {
        try {
            var authLink = document.getElementById('auth-link');
            var raw = localStorage.getItem('gmu-user');
            // handle auth link if present
            if (authLink) {
                if (raw) {
                    var user = JSON.parse(raw || '{}');
                    // show logout and optionally show user's short name
                    var display = 'Logout';
                    if (user.name) display = 'Logout (' + (user.name.split(' ')[0] || user.email) + ')';
                    authLink.textContent = display;
                    authLink.href = '#';
                    authLink.classList.add('logout');
                    authLink.addEventListener('click', function(e){ e.preventDefault(); logout(); });
                } else {
                    authLink.textContent = 'Login / Signup';
                    authLink.href = 'login.html';
                    authLink.classList.remove('logout');
                }
            }
            // show/hide faculty link depending on logged-in user's role
            try {
                var facultyLink = document.getElementById('faculty-link');
                var facultyCta = document.getElementById('faculty-cta');
                // detect homepage by presence of the hero section
                var isHome = !!document.querySelector('.hero');
                if (facultyLink) {
                    var roleOk = false;
                    if (raw) {
                        try {
                            var u = JSON.parse(raw || '{}');
                            if (u && (u.role === 'faculty' || u.isAdmin)) roleOk = true;
                        } catch (ee) { roleOk = false; }
                    }
                    // show the header faculty link only on the homepage and only for faculty/admin
                    facultyLink.style.display = (roleOk && isHome) ? '' : 'none';
                }
                if (facultyCta) {
                    try {
                        var u2 = raw ? JSON.parse(raw || '{}') : null;
                        facultyCta.style.display = (isHome && u2 && (u2.role === 'faculty' || u2.isAdmin)) ? '' : 'none';
                    } catch (ee) { facultyCta.style.display = 'none'; }
                }
                // admin CTA (visible only to admins, on homepage)
                var adminCta = document.getElementById('admin-cta');
                if (adminCta) {
                    try {
                        var u3 = raw ? JSON.parse(raw || '{}') : null;
                        adminCta.style.display = (isHome && u3 && u3.isAdmin) ? '' : 'none';
                    } catch (ee) { adminCta.style.display = 'none'; }
                }
                // header CTA for Faculty Admin (button-style in nav) - show only on homepage and only for faculty/admin
                var facultyHeaderCta = document.getElementById('faculty-header-cta');
                if (facultyHeaderCta) {
                    try {
                        var u4 = raw ? JSON.parse(raw || '{}') : null;
                        facultyHeaderCta.style.display = (isHome && u4 && (u4.role === 'faculty' || u4.isAdmin)) ? '' : 'none';
                    } catch (ee) { facultyHeaderCta.style.display = 'none'; }
                }
            } catch (ee) { /* ignore */ }
        } catch (e) { console.warn('updateAuthLinks error', e); }
    }

    updateAuthLinks();
};

// CSV helpers: read saved contacts and trigger CSV download
function csvEscape(value) {
    if (value === null || typeof value === 'undefined') return '';
    var s = String(value);
    // double any quotes
    s = s.replace(/"/g, '""');
    return '"' + s + '"';
}

function exportContactsCSV() {
    try {
        var raw = localStorage.getItem('gmu-contacts');
        if (!raw) { alert('No contacts saved yet. Submit the contact form first.'); return; }
        var arr = JSON.parse(raw || '[]');
        if (!arr || !arr.length) { alert('No contacts saved yet.'); return; }
        var headers = ['Name','Email','Phone','Subject','Message','SubmittedAt'];
        var rows = [headers.map(csvEscape).join(',')];
        arr.forEach(function(c){
            var row = [c.name, c.email, c.phone, c.subject, c.message, c.submittedAt];
            rows.push(row.map(csvEscape).join(','));
        });
        var csv = rows.join('\r\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var now = new Date();
        var fn = 'gmu-contacts-' + now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate() + '-' + now.getHours() + now.getMinutes() + now.getSeconds() + '.csv';
        if (navigator.msSaveBlob) { // IE10+
            navigator.msSaveBlob(blob, fn);
        } else {
            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fn);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (ex) {
        console.warn('exportContactsCSV error', ex);
        alert('Could not export contacts.');
    }
}

// Contacts helper: return saved contacts array
function getSavedContacts() {
    try { return JSON.parse(localStorage.getItem('gmu-contacts') || '[]') || []; } catch (e) { return []; }
}

// Render contacts into table with tbody selector or element id
function renderContactsTable(targetId) {
    try {
        var tbl = typeof targetId === 'string' ? document.getElementById(targetId) : targetId;
        if (!tbl) return;
        var tbody = tbl.querySelector('tbody');
        if (!tbody) return;
        var arr = getSavedContacts();
        tbody.innerHTML = '';
        arr.forEach(function(c){
            var tr = document.createElement('tr');
            tr.innerHTML = '<td style="padding:8px;border:1px solid #eee">'+(c.name||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(c.email||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(c.phone||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(c.subject||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(c.message||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(c.submittedAt||'')+'</td>';
            tbody.appendChild(tr);
        });
    } catch (e) { console.warn('renderContactsTable', e); }
}

// Marks helpers
function getSavedMarks() {
    try { return JSON.parse(localStorage.getItem('gmu-marks') || '[]') || []; } catch (e) { return []; }
}

function saveMarkEntry(entry) {
    try {
        var arr = getSavedMarks();
        arr.push(entry);
        localStorage.setItem('gmu-marks', JSON.stringify(arr));
        return true;
    } catch (e) { console.warn('saveMarkEntry', e); return false; }
}

function renderMarksTable(targetId) {
    try {
        var tbl = typeof targetId === 'string' ? document.getElementById(targetId) : targetId;
        if (!tbl) return;
        var tbody = tbl.querySelector('tbody');
        if (!tbody) return;
        var arr = getSavedMarks();
        tbody.innerHTML = '';
        arr.forEach(function(m){
            var tr = document.createElement('tr');
            tr.innerHTML = '<td style="padding:8px;border:1px solid #eee">'+(m.name||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(m.roll||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(m.course||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(m.marks||'')+'</td>'+
                           '<td style="padding:8px;border:1px solid #eee">'+(m.savedAt||'')+'</td>';
            tbody.appendChild(tr);
        });
    } catch (e) { console.warn('renderMarksTable', e); }
}

function exportMarksCSV() {
    try {
        var arr = getSavedMarks();
        if (!arr || !arr.length) { alert('No marks saved yet.'); return; }
        var headers = ['Name','Roll','Course','Marks','SavedAt'];
        var rows = [headers.map(csvEscape).join(',')];
        arr.forEach(function(c){
            var row = [c.name, c.roll, c.course, c.marks, c.savedAt];
            rows.push(row.map(csvEscape).join(','));
        });
        var csv = rows.join('\r\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var now = new Date();
        var fn = 'gmu-marks-' + now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate() + '-' + now.getHours() + now.getMinutes() + now.getSeconds() + '.csv';
        var link = document.createElement('a');
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fn);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (ex) { console.warn('exportMarksCSV error', ex); alert('Could not export marks.'); }
}

// Faculty helper: check faculty auth (short-lived flag set after correct password entry)
function isFacultyAuthenticated() {
    try { return !!localStorage.getItem('gmu-faculty-auth'); } catch (e) { return false; }
}

// Optional: helper to require faculty auth on pages (redirect to faculty-admin.html if not authed)
function requireFacultyAuth() {
    if (!isFacultyAuthenticated()) {
        window.location.href = 'faculty-admin.html';
    }
}

// facultyLogout helper - clears only faculty auth flag
function facultyLogout() {
    try { localStorage.removeItem('gmu-faculty-auth'); } catch (e) { console.warn(e); }
    window.location.href = 'faculty-admin.html';
}
