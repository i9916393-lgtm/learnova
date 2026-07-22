/* ============================================
   LEARNOVA - Match Demo JavaScript
   match.js → assets/js/match.js
   ============================================ */

$(document).ready(function () {

  /* ---- Mock student database ---- */
  var students = [
    { name: 'Ahmed Raza',    dept: 'SECP — Web Dev',       offers: ['javascript','bootstrap','html-css'], wants: ['python','mysql'],        initials: 'AR', color: 'var(--blue)' },
    { name: 'Sara Khan',     dept: 'DIT — Database',        offers: ['python','mysql','php'],              wants: ['bootstrap','javascript'],  initials: 'SK', color: 'var(--purple)' },
    { name: 'Zainab Ali',    dept: 'DGD — Design',          offers: ['figma','html-css'],                  wants: ['javascript','bootstrap'],  initials: 'ZA', color: '#0F6E56' },
    { name: 'Usman Tariq',   dept: 'SECP — Software Eng',   offers: ['csharp','javascript'],               wants: ['figma','html-css'],         initials: 'UT', color: '#854F0B' },
    { name: 'Hira Baig',     dept: 'DIT — IT',              offers: ['mysql','php','python'],              wants: ['csharp','bootstrap'],       initials: 'HB', color: '#185FA5' },
    { name: 'Ali Hassan',    dept: 'SECP — Frontend',       offers: ['bootstrap','html-css','javascript'], wants: ['python','mysql'],           initials: 'AH', color: 'var(--blue)' },
    { name: 'Maham Sheikh',  dept: 'DGD — UI/UX',           offers: ['figma','html-css','bootstrap'],      wants: ['javascript','php'],         initials: 'MS', color: '#E24B4A' },
    { name: 'Bilal Ahmed',   dept: 'DIT — Systems',         offers: ['csharp','mysql','php'],              wants: ['figma','bootstrap'],        initials: 'BA', color: '#0F6E56' },
    { name: 'Nadia Malik',   dept: 'SECP — Data Track',     offers: ['python','javascript'],               wants: ['figma','html-css'],         initials: 'NM', color: 'var(--purple)' },
    { name: 'Omar Farooq',   dept: 'DGD — Creative Media',  offers: ['html-css','bootstrap','figma'],      wants: ['python','mysql'],           initials: 'OF', color: '#185FA5' },
    { name: 'Fatima Noor',   dept: 'SECP — Full Stack',     offers: ['javascript','mysql'],                wants: ['csharp','php'],             initials: 'FN', color: '#854F0B' },
    { name: 'Hassan Qureshi',dept: 'DIT — Backend',         offers: ['php','python','csharp'],             wants: ['javascript','figma'],       initials: 'HQ', color: 'var(--blue)' },
  ];

  var skillLabels = {
    'javascript': 'JavaScript',
    'bootstrap':  'Bootstrap',
    'html-css':   'HTML/CSS',
    'python':     'Python',
    'csharp':     'C#',
    'mysql':      'MySQL',
    'php':        'PHP',
    'figma':      'Figma',
  };

  /* ---- Pill toggle (multi-select) ---- */
  $('#offer-pills .skill-pill').on('click', function () {
    $(this).toggleClass('sel-offer');
  });
  $('#want-pills .skill-pill').on('click', function () {
    $(this).toggleClass('sel-want');
  });

  /* ---- Find Match button ---- */
  $('#find-match-btn').on('click', function () {
    var myOffers = [];
    var myWants  = [];
    $('#offer-pills .skill-pill.sel-offer').each(function () { myOffers.push($(this).data('skill')); });
    $('#want-pills .skill-pill.sel-want').each(function () { myWants.push($(this).data('skill')); });

    if (myOffers.length === 0 || myWants.length === 0) {
      alert('Please select at least one skill you can teach and one you want to learn!');
      return;
    }

    // Show loading
    $('#match-loading').fadeIn(200);
    $('#find-match-btn').prop('disabled', true).text('Searching...');

    // Simulate delay for dramatic effect
    setTimeout(function () {
      $('#match-loading').fadeOut(200);
      findMatches(myOffers, myWants);
      $('#find-match-btn').prop('disabled', false).html('<i class="fa-solid fa-bolt me-1"></i> Find My Match');
    }, 1800);
  });

  /* ---- Matching logic (multi-skill aware) ---- */
  function findMatches(myOffers, myWants) {
    var results = [];

    students.forEach(function (s) {
      // Overlaps: what they offer that I want to learn, and what they want that I can teach
      var theyOfferMatches = s.offers.filter(function (sk) { return myWants.indexOf(sk) !== -1; });
      var theyWantMatches  = s.wants.filter(function (sk) { return myOffers.indexOf(sk) !== -1; });

      if (theyOfferMatches.length && theyWantMatches.length) {
        // Perfect bilateral match — score scales slightly with number of overlapping skills
        var score = Math.min(100, 80 + (theyOfferMatches.length + theyWantMatches.length - 2) * 5);
        results.push({ student: s, score: score, type: 'Perfect', theyOfferMatches: theyOfferMatches, theyWantMatches: theyWantMatches });
      } else if (theyOfferMatches.length) {
        var score2 = Math.min(75, 50 + (theyOfferMatches.length - 1) * 8);
        results.push({ student: s, score: score2, type: 'Partial', theyOfferMatches: theyOfferMatches, theyWantMatches: [] });
      } else if (theyWantMatches.length) {
        var score3 = Math.min(75, 50 + (theyWantMatches.length - 1) * 8);
        results.push({ student: s, score: score3, type: 'Partial', theyOfferMatches: [], theyWantMatches: theyWantMatches });
      }
    });

    // Sort by score
    results.sort(function (a, b) { return b.score - a.score; });

    renderResults(results, myOffers, myWants);
  }

  /* ---- Render result cards ---- */
  function renderResults(results, myOffers, myWants) {
    var $row = $('#match-cards-row').empty();

    if (results.length === 0) {
      $row.html('<div class="col-12 text-center" style="padding:60px;color:var(--gray-500);">' +
        '<i class="fa-solid fa-satellite-dish" style="font-size:2.5rem;display:block;margin-bottom:16px;"></i>' +
        '<p>No matches found for this combination right now.<br>Try different skills!</p></div>');
    } else {
      var shown = results.slice(0, 6); // Max 6 results
      shown.forEach(function (r, i) {
        var s = r.student;
        var isPerfect = r.type === 'Perfect';
        var card = '<div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="' + (i * 80) + '">' +
          '<div class="match-result-card d-flex flex-column justify-content-between h-100">' +
            '<div>' +
              '<div class="d-flex align-items-center gap-3 mb-3">' +
                '<div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,'+s.color+',var(--purple));display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;flex-shrink:0;">' + s.initials + '</div>' +
                '<div>' +
                  '<div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:700;color:var(--white);">' + s.name + '</div>' +
                  '<div style="font-size:0.78rem;color:var(--gray-500);">' + s.dept + '</div>' +
                '</div>' +
                '<div class="ms-auto text-end">' +
                  '<div class="match-score">' + r.score + '%</div>' +
                  '<div style="font-size:0.65rem;color:' + (isPerfect ? 'var(--blue)' : 'var(--gray-500)') + ';font-family:var(--font-heading);letter-spacing:0.08em;">' + r.type.toUpperCase() + '</div>' +
                '</div>' +
              '</div>' +
              '<div style="font-size:0.7rem;color:var(--blue);font-family:var(--font-heading);letter-spacing:0.1em;margin-bottom:6px;">OFFERS</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">' +
                s.offers.map(function(sk){ return '<span class="skill-badge" style="font-size:0.72rem;">' + (skillLabels[sk]||sk) + '</span>'; }).join('') +
              '</div>' +
              '<div style="font-size:0.7rem;color:var(--purple-light);font-family:var(--font-heading);letter-spacing:0.1em;margin-bottom:6px;">WANTS</div>' +
              '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:15px;">' +
                s.wants.map(function(sk){ return '<span class="skill-badge purple" style="font-size:0.72rem;">' + (skillLabels[sk]||sk) + '</span>'; }).join('') +
              '</div>' +
            '</div>' +

            /* ===== FIX: Added Send Request Button to Every Loop Instance ===== */
            '<button class="btn btn-primary w-100 send-request-btn" style="background: linear-gradient(135deg, var(--blue), var(--purple)); border: none; font-weight: 600; font-size: 0.85rem; padding: 10px; margin-top: auto;">' +
              '<i class="fa-solid fa-paper-plane me-1"></i> Send Request' +
            '</button>' +

          '</div>' +
        '</div>';
        $row.append(card);
      });
    }

    // Summary text
    var offerLabels = myOffers.map(function (sk) { return skillLabels[sk] || sk; }).join(', ');
    var wantLabels  = myWants.map(function (sk) { return skillLabels[sk] || sk; }).join(', ');
    var perfectCount = results.filter(function (r) { return r.type === 'Perfect'; }).length;
    $('#match-summary-text').text(
      'You know ' + offerLabels + ' and want to learn ' + wantLabels + '. ' +
      'Found ' + results.length + ' students — ' + perfectCount + ' perfect match' + (perfectCount !== 1 ? 'es' : '') + '.'
    );

    // Show results section
    $('#match-results').slideDown(400);
    AOS.refresh();

    // Scroll to results
    setTimeout(function () {
      $('html,body').animate({ scrollTop: $('#match-results').offset().top - 100 }, 600);
    }, 200);
  }

  /* ===== FIX: Handle Click Event on Dynamically Generated Buttons to Show Popup ===== */
  $(document).on('click', '.send-request-btn', function () {
    var studentName = $(this).closest('.match-result-card').find('div[style*="font-size:0.85rem"]').text();
    alert("Your request has been sent to " + studentName + " successfully!");
  });

  /* ---- Reset button ---- */
  $('#reset-match').on('click', function () {
    $('#match-results').slideUp(300);
    $('#offer-pills .skill-pill, #want-pills .skill-pill').removeClass('sel-offer sel-want');
    $('html,body').animate({ scrollTop: 0 }, 500);
  });

});