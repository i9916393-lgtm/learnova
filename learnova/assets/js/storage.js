/* ============================================
   LEARNOVA - Storage JavaScript
   storage.js → assets/js/storage.js

   YEH FILE DO KAAM KARTI HAI:
   1. Form submit pe data LocalStorage mein save karta hai
   2. Profiles page pe LocalStorage se naye students load karta hai
   3. Admin ko JSON download karne deta hai
   ============================================ */

/* ==========================================
   STORAGE KEY — yahi naam LocalStorage mein use hoga
   ========================================== */
var LN_KEY = 'learnova_students';

/* ==========================================
   HELPER: Saare students localStorage se lo
   ========================================== */
function getStoredStudents() {
  try {
    var data = localStorage.getItem(LN_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/* ==========================================
   HELPER: Students localStorage mein save karo
   ========================================== */
function saveStudents(arr) {
  try {
    localStorage.setItem(LN_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.error('LocalStorage save failed:', e);
    return false;
  }
}

/* ==========================================
   HELPER: Naya student add karo
   ========================================== */
function addStudent(student) {
  var students = getStoredStudents();

  // Unique ID generate karo
  student.id   = 'ln_' + Date.now();
  student.date = new Date().toLocaleDateString('en-PK');

  // Initials banana (first letter of first + last name)
  var parts    = student.name.trim().split(' ');
  student.initials = (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1])).toUpperCase();

  // Random gradient color
  var colors = [
    'linear-gradient(135deg,#3B8BD4,#7B5CF0)',
    'linear-gradient(135deg,#7B5CF0,#E24B4A)',
    'linear-gradient(135deg,#0F6E56,#3B8BD4)',
    'linear-gradient(135deg,#854F0B,#7B5CF0)',
    'linear-gradient(135deg,#185FA5,#0F6E56)',
    'linear-gradient(135deg,#3B8BD4,#185FA5)',
  ];
  student.avatarColor = colors[Math.floor(Math.random() * colors.length)];

  students.push(student);
  return saveStudents(students);
}

/* ==========================================
   HELPER: JSON file download
   ========================================== */
function downloadJSON() {
  var students = getStoredStudents();

  if (students.length === 0) {
    alert('Abhi koi student registered nahi hai!');
    return;
  }

  var json     = JSON.stringify(students, null, 2);
  var blob     = new Blob([json], { type: 'application/json' });
  var url      = URL.createObjectURL(blob);
  var a        = document.createElement('a');
  a.href       = url;
  a.download   = 'learnova_students_' + Date.now() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ==========================================
   CONTACT.HTML — Form submit pe save + download
   Yeh function contact.html pe call hoga
   ========================================== */
function handleFormSubmit(formData) {
  // LocalStorage mein save karo
  var saved = addStudent(formData);

  // JSON download bhi karo
  downloadStudentJSON(formData);

  return saved;
}

/* ==========================================
   Single student ka JSON download (registration pe)
   ========================================== */
function downloadStudentJSON(student) {
  var allStudents = getStoredStudents();
  var json  = JSON.stringify(allStudents, null, 2);
  var blob  = new Blob([json], { type: 'application/json' });
  var url   = URL.createObjectURL(blob);
  var a     = document.createElement('a');
  a.href    = url;
  a.download = 'learnova_profiles.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ==========================================
   PROFILES.HTML — LocalStorage se naye cards banao
   ========================================== */
function loadStoredProfiles() {
  var stored   = getStoredStudents();
  var $grid    = $('#profiles-grid');
  if (!$grid.length || stored.length === 0) return;

  stored.forEach(function (s) {
    // Duplicate check (same id already in grid? skip)
    if ($('#profile-' + s.id).length) return;

    var offersHTML = (s.offers || []).map(function (sk) {
      return '<span class="skill-badge">' + sk + '</span>';
    }).join('');

    var wantsHTML = (s.wants || []).map(function (sk) {
      return '<span class="skill-badge purple">' + sk + '</span>';
    }).join('');

    // Data attributes for search/filter
    var skillsData = (s.offers || []).concat(s.wants || [])
      .map(function(sk){ return sk.toLowerCase().replace(/[^a-z0-9]/g,'-'); })
      .join(' ');

    // Avatar: use uploaded photo if the student added one during signup,
    // otherwise fall back to the initials/gradient avatar
    var avatarHTML = s.avatar ?
      '<img src="' + s.avatar + '" alt="' + s.name + '" class="profile-avatar-img" />' :
      '<div class="profile-avatar" style="background:' + s.avatarColor + ';">' + s.initials + '</div>';

    var card = '' +
      '<div class="col-md-6 col-lg-4 profile-item" ' +
           'id="profile-' + s.id + '" ' +
           'data-skills="' + skillsData + '" ' +
           'data-name="' + s.name.toLowerCase() + '">' +
        '<div class="profile-card card-lift" style="border-color:rgba(123,92,240,0.3);">' +

          // "New" badge
          '<div style="position:absolute;top:12px;right:12px;' +
               'background:var(--purple);color:#fff;' +
               'font-family:var(--font-heading);font-size:0.6rem;' +
               'letter-spacing:0.1em;padding:3px 10px;border-radius:20px;">' +
            'NEW' +
          '</div>' +

          avatarHTML +

          '<div class="profile-name">' + s.name + '</div>' +
          '<div class="profile-dept">' +
            '<i class="fa-solid fa-building me-1"></i>' + (s.dept || 'Aptech') +
          '</div>' +

          '<div class="profile-skills-label">Offers</div>' +
          '<div class="profile-skills">' + (offersHTML || '<span style="font-size:0.8rem;color:var(--gray-500);">Not specified</span>') + '</div>' +

          '<div class="profile-skills-label">Wants to Learn</div>' +
          '<div class="profile-skills">' + (wantsHTML || '<span style="font-size:0.8rem;color:var(--gray-500);">Not specified</span>') + '</div>' +

          '<button class="btn btn-outline w-100 mt-3" ' +
                  'data-bs-toggle="modal" data-bs-target="#profileModal" ' +
                  'data-name="' + s.name + '" ' +
                  'data-dept="' + (s.dept || 'Aptech') + '" ' +
                  'data-offers="' + (s.offers || []).join(', ') + '" ' +
                  'data-wants="' + (s.wants || []).join(', ') + '" ' +
                  'data-bio="' + (s.bio || 'Registered via LearnNova platform.') + '">' +
            'View Profile' +
          '</button>' +

        '</div>' +
      '</div>';

    // Naye students UPAR aayenge (prepend)
    $grid.prepend(card);
  });

  // Filter count update
  if (typeof updateCount === 'function') updateCount();
}

/* ==========================================
   ADMIN PANEL — profiles.html pe "Download All"
   button ke liye
   ========================================== */
function injectAdminBar() {
  var stored = getStoredStudents();
  if (stored.length === 0) return; // No registered users? No bar

  var bar = '' +
    '<div id="admin-bar" style="' +
      'background:rgba(123,92,240,0.08);' +
      'border:1px solid rgba(123,92,240,0.25);' +
      'border-radius:var(--radius-md);' +
      'padding:14px 20px;' +
      'margin-bottom:var(--gap-md);' +
      'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;' +
    '">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<i class="fa-solid fa-database" style="color:var(--purple);"></i>' +
        '<span style="font-family:var(--font-heading);font-size:0.75rem;letter-spacing:0.08em;color:var(--white);">' +
          stored.length + ' REGISTERED STUDENT' + (stored.length > 1 ? 'S' : '') + ' IN LOCALSTORAGE' +
        '</span>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button onclick="downloadJSON()" class="btn btn-outline" style="font-size:0.75rem;padding:8px 16px;">' +
          '<i class="fa-solid fa-download me-1"></i> Download JSON' +
        '</button>' +
        '<button onclick="clearAllStudents()" class="btn btn-outline" style="font-size:0.75rem;padding:8px 16px;border-color:rgba(226,75,74,0.4);color:#E24B4A;">' +
          '<i class="fa-solid fa-trash me-1"></i> Clear All' +
        '</button>' +
      '</div>' +
    '</div>';

  $('#results-count').before(bar);
}

/* ==========================================
   CLEAR ALL (admin use only)
   ========================================== */
function clearAllStudents() {
  if (confirm('Are you sure? This will delete ALL registered student profiles from LocalStorage.')) {
    localStorage.removeItem(LN_KEY);
    $('#admin-bar').fadeOut(300, function(){ $(this).remove(); });
    // Remove "NEW" badged cards
    $('[id^="profile-ln_"]').fadeOut(300, function(){ $(this).remove(); });
    if (typeof updateCount === 'function') updateCount();
  }
}