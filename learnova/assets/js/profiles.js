/* ============================================
   LEARNOVA - Profiles Page JavaScript
   profiles.js → assets/js/profiles.js
   ============================================ */

$(document).ready(function () {

  /* ---- Update results count display ---- */
  function updateCount() {
    var visible = $('.profile-item:visible').length;
    $('#count-num').text(visible);
    if (visible === 0) {
      $('#no-results').fadeIn(200);
    } else {
      $('#no-results').fadeOut(200);
    }
  }

  /* ---- Active skill filter ---- */
  var activeFilter = 'all';

  /* ---- Search + Filter combined ---- */
  function applyFilters() {
    var searchVal = $('#search-input').val().toLowerCase().trim();

    $('.profile-item').each(function () {
      var skills  = $(this).data('skills').toLowerCase();
      var name    = $(this).data('name').toLowerCase();

      var matchesFilter = (activeFilter === 'all') || skills.includes(activeFilter);
      var matchesSearch = (searchVal === '') || name.includes(searchVal) || skills.includes(searchVal);

      if (matchesFilter && matchesSearch) {
        $(this).fadeIn(200);
      } else {
        $(this).fadeOut(150);
      }
    });

    // Delay count update till animations settle
    setTimeout(updateCount, 250);
  }

  /* ---- Skill filter button click ---- */
  $(document).on('click', '.filter-btn', function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    activeFilter = $(this).data('filter');
    applyFilters();
  });

  /* ---- Live search input ---- */
  $('#search-input').on('input', function () {
    applyFilters();
  });

  /* ---- Reset filters button (inside no-results) ---- */
  $('#reset-filter').on('click', function () {
    activeFilter = 'all';
    $('#search-input').val('');
    $('.filter-btn').removeClass('active');
    $('.filter-btn[data-filter="all"]').addClass('active');
    applyFilters();
  });

  // Initial count
  updateCount();
});