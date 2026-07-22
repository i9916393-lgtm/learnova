/* ============================================
   LEARNOVA - Main JavaScript
   Team: NovaSync | Eisha Fatima & Ibrahim Kamran
   main.js → assets/js/main.js
   
   YEH FILE HAR PAGE PE LINK KARO:
   <script src="assets/js/main.js"></script>
   ============================================ */

$(document).ready(function () {

  /* ==========================================
     1. NAVBAR — Scroll pe background aaye
     ========================================== */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }
  });

  /* ==========================================
     2. HAMBURGER MENU — Mobile toggle
     ========================================== */
  $('.navbar-toggler').on('click', function () {
    $(this).toggleClass('open');
    $('.navbar-collapse').toggleClass('open');
  });

  // Nav link click pe mobile menu band ho jaye
  $('.nav-link').on('click', function () {
    $('.navbar-toggler').removeClass('open');
    $('.navbar-collapse').removeClass('open');
  });

  // Bahar click karo to menu band ho jaye
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.navbar').length) {
      $('.navbar-toggler').removeClass('open');
      $('.navbar-collapse').removeClass('open');
    }
  });

  /* ==========================================
     3. ACTIVE NAV LINK — Current page highlight
     ========================================== */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-link').each(function () {
    var href = $(this).attr('href');
    if (href === currentPage) {
      $(this).addClass('active');
    }
  });

  /* ==========================================
     4. SMOOTH SCROLL — Anchor links
     ========================================== */
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this).attr('href');
    if ($(target).length) {
      e.preventDefault();
      var offset = $(target).offset().top - 80;
      $('html, body').animate({ scrollTop: offset }, 700, 'swing');
    }
  });

  /* ==========================================
     5. AOS — Scroll animations initialize
     ========================================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  /* ==========================================
     6. COUNTER ANIMATION — Stats section
     Jis element pe class="counter" ho uski
     value 0 se animate hogi
     ========================================== */
  function animateCounters() {
    $('.counter').each(function () {
      var $el = $(this);
      var target = parseInt($el.data('target'));
      var suffix = $el.data('suffix') || '';
      var duration = 1800;
      var start = 0;
      var increment = target / (duration / 16);

      var timer = setInterval(function () {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        $el.text(Math.floor(start) + suffix);
      }, 16);
    });
  }

  // Counter sirf ek baar chale jab section screen pe aaye
  var counterDone = false;
  $(window).on('scroll', function () {
    if (counterDone) return;
    var statsSection = $('.stats-section');
    if (statsSection.length === 0) return;
    var sectionTop = statsSection.offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();
    if (windowBottom > sectionTop + 100) {
      counterDone = true;
      animateCounters();
    }
  });

  /* ==========================================
     7. PROGRESS BAR ANIMATION
     class="progress-fill" data-width="85"
     ========================================== */
  var progressDone = false;
  $(window).on('scroll', function () {
    if (progressDone) return;
    $('.progress-fill').each(function () {
      var $bar = $(this);
      var barTop = $bar.offset().top;
      var windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > barTop) {
        progressDone = true;
        $('.progress-fill').each(function () {
          var w = $(this).data('width') || 0;
          $(this).css('width', w + '%');
        });
      }
    });
  });

  /* ==========================================
     8. ACCORDION — FAQ section
     ========================================== */
  $(document).on('click', '.accordion-btn', function () {
    var $btn = $(this);
    var $body = $btn.next('.accordion-body');
    var isOpen = $btn.hasClass('open');

    // Pehle sab band karo
    $('.accordion-btn').removeClass('open');
    $('.accordion-body').removeClass('open');

    // Agar pehle se band tha to kholo
    if (!isOpen) {
      $btn.addClass('open');
      $body.addClass('open');
    }
  });

  /* ==========================================
     9. PARTICLES — Simple canvas particles
     (Sirf index.html pe kaam karega jab
      #particles-canvas element ho)
     ========================================== */
  var canvas = document.getElementById('particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 60;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    $(window).on('resize', resizeCanvas);

    // Particle object
    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 139, 212, ' + this.opacity + ')';
      ctx.fill();
    };

    // Particles create karo
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Particles ke beech lines draw karo (agar qareeb hon)
    function drawLines() {
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(59, 139, 212, ' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      drawLines();
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================
     10. TYPED TEXT EFFECT
     (Sirf agar element #typed-text ho)
     ========================================== */
  var typedEl = document.getElementById('typed-text');
  if (typedEl) {
    var texts = [
      'Transforming Students Into Collaborative Learners',
      'Breaking The Silos — One Skill At A Time',
      'Your Campus. Your Network. Your Future.',
    ];
    var textIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 60;

    function typeLoop() {
      var current = texts[textIndex];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 30;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 60;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 1800; // Ruko thoda
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 400;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    setTimeout(typeLoop, 800);
  }

  /* ==========================================
     11. SCROLL TO TOP BUTTON
     ========================================== */
  // HTML mein yeh daal do footer ke upar:
  // <button id="scroll-top" title="Scroll to top">↑</button>
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      $('#scroll-top').fadeIn(300);
    } else {
      $('#scroll-top').fadeOut(300);
    }
  });

  $('#scroll-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

}); // END document.ready
