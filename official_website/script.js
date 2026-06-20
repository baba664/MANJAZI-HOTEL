/* ============================================================
   EGITAL SOLUTIONS — script.js
   Preloader, nav, counters, canvas mesh, filters, carousel, form
   ============================================================ */
(function(){
  'use strict';

  /* ---------------- Preloader ---------------- */
  window.addEventListener('load', function(){
    var pre = document.getElementById('preloader');
    setTimeout(function(){
      if(pre){ pre.classList.add('is-hidden'); }
      document.body.classList.add('is-loaded');
    }, 500);
  });

  /* ---------------- AOS init ---------------- */
  if(window.AOS){
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ---------------- Sticky header ---------------- */
  var header = document.getElementById('header');
  function onScrollHeader(){
    if(window.scrollY > 30){ header.classList.add('is-scrolled'); }
    else{ header.classList.remove('is-scrolled'); }
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------- Active nav link on scroll ---------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  function onScrollSpy(){
    var pos = window.scrollY + 140;
    sections.forEach(function(sec){
      if(pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight){
        navLinks.forEach(function(l){
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }
  window.addEventListener('scroll', onScrollSpy, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    hamburger.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', function(){
    var isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  /* ---------------- Smooth scroll w/ header offset ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var id = this.getAttribute('href');
      if(id.length < 2) return;
      var target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      var headerH = header.classList.contains('is-scrolled') ? 72 : 84;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------------- Animated counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(function(c){ counterObserver.observe(c); });

  function animateCounter(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1700;
    var startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if(progress < 1){ requestAnimationFrame(step); }
      else{ el.textContent = target; }
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Hero canvas — connecting node mesh ---------------- */
  var canvas = document.getElementById('heroCanvas');
  if(canvas){
    var ctx = canvas.getContext('2d');
    var w, h, nodes = [];
    var NODE_COUNT = window.innerWidth < 768 ? 26 : 46;

    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }
    function makeNodes(){
      nodes = [];
      for(var i=0;i<NODE_COUNT;i++){
        nodes.push({
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*0.35,
          vy: (Math.random()-0.5)*0.35,
          r: Math.random()*1.6 + 1
        });
      }
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
      for(var i=0;i<nodes.length;i++){
        for(var j=i+1;j<nodes.length;j++){
          var a = nodes[i], b = nodes[j];
          var dx = a.x-b.x, dy = a.y-b.y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          var maxDist = w < 600 ? 90 : 130;
          if(dist < maxDist){
            var op = (1 - dist/maxDist) * 0.35;
            ctx.strokeStyle = 'rgba(0,194,255,' + op + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(function(n){
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(124,58,237,0.55)';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize();
    makeNodes();
    draw();
    window.addEventListener('resize', function(){
      resize();
      NODE_COUNT = window.innerWidth < 768 ? 26 : 46;
      makeNodes();
    });
  }

  /* ---------------- Mouse parallax on hero chips ---------------- */
  var heroVisual = document.querySelector('.hero-visual');
  if(heroVisual && window.matchMedia('(pointer:fine)').matches){
    var chips = heroVisual.querySelectorAll('.float-chip');
    heroVisual.addEventListener('mousemove', function(e){
      var rect = heroVisual.getBoundingClientRect();
      var px = (e.clientX - rect.left)/rect.width - 0.5;
      var py = (e.clientY - rect.top)/rect.height - 0.5;
      chips.forEach(function(chip, idx){
        var depth = (idx+1) * 6;
        chip.style.transform = 'translate(' + (px*depth) + 'px,' + (py*depth) + 'px)';
      });
    });
    heroVisual.addEventListener('mouseleave', function(){
      chips.forEach(function(chip){ chip.style.transform = ''; });
    });
  }

  /* ---------------- Service card cursor glow ---------------- */
  document.querySelectorAll('.service-card').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX-rect.left)+'px');
      card.style.setProperty('--my', (e.clientY-rect.top)+'px');
    });
  });

  /* ---------------- Light parallax on hero grid/blobs (scroll) ---------------- */
  var heroGrid = document.querySelector('.hero-grid');
  var heroOrbits = document.querySelectorAll('.hero-orbit');
  window.addEventListener('scroll', function(){
    var sc = window.scrollY;
    if(sc < window.innerHeight){
      if(heroGrid) heroGrid.style.transform = 'translateY(' + (sc*0.15) + 'px)';
      heroOrbits.forEach(function(o, i){ o.style.marginTop = (sc * (0.06 + i*0.03)) + 'px'; });
    }
  }, { passive: true });

  /* =================================================================
     PORTFOLIO FILTER
  ================================================================= */
  var pfPills = document.querySelectorAll('.portfolio-filters .filter-pill');
  var pfItems = document.querySelectorAll('.portfolio-item');
  pfPills.forEach(function(pill){
    pill.addEventListener('click', function(){
      pfPills.forEach(function(p){ p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      var filter = pill.getAttribute('data-filter');
      pfItems.forEach(function(item){
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* =================================================================
     PRICING EXPLORER — search + category filter
  ================================================================= */
  var priceData = [
    /* Graphic Design */
    { cat:'graphic-design', name:'Logo Design', price:'K500 – K2,500' },
    { cat:'graphic-design', name:'Business Card Design', price:'K150 – K400' },
    { cat:'graphic-design', name:'Flyer Design', price:'K200 – K600' },
    { cat:'graphic-design', name:'Poster Design', price:'K250 – K800' },
    { cat:'graphic-design', name:'Social Media Post Design', price:'K80 – K200', per:'/ design' },
    { cat:'graphic-design', name:'Social Media Package (15 Designs)', price:'K1,000 – K2,500' },
    { cat:'graphic-design', name:'Company Profile Design', price:'K1,500 – K5,000' },
    { cat:'graphic-design', name:'Brochure Design', price:'K800 – K3,000' },
    { cat:'graphic-design', name:'Menu Design', price:'K300 – K1,000' },
    { cat:'graphic-design', name:'Banner Design', price:'K300 – K1,200' },
    /* Website Development */
    { cat:'website-development', name:'One Page Website', price:'K1,500 – K3,500' },
    { cat:'website-development', name:'Business Website (5 Pages)', price:'K3,500 – K8,000' },
    { cat:'website-development', name:'Corporate Website', price:'K8,000 – K20,000' },
    { cat:'website-development', name:'E-Commerce Website', price:'K10,000 – K30,000' },
    { cat:'website-development', name:'Restaurant Website', price:'K3,000 – K7,000' },
    { cat:'website-development', name:'Hotel / Lodge Website', price:'K5,000 – K15,000' },
    { cat:'website-development', name:'Website Redesign', price:'K2,500 – K10,000' },
    { cat:'website-development', name:'Website Maintenance', price:'K500 – K2,000', per:'/ month' },
    { cat:'website-development', name:'Domain Setup', price:'K300 – K800' },
    { cat:'website-development', name:'Hosting Setup', price:'K500 – K2,000', per:'/ year' },
    /* Social Media Management */
    { cat:'social-media', name:'SMM Starter Package', price:'K1,500', per:'/ month' },
    { cat:'social-media', name:'SMM Growth Package', price:'K3,000', per:'/ month' },
    { cat:'social-media', name:'SMM Premium Package', price:'K5,000+', per:'/ month' },
    /* Creative Media */
    { cat:'creative-media', name:'Professional Photography', price:'K500 – K3,000' },
    { cat:'creative-media', name:'Promotional Video Production', price:'K1,000 – K10,000' },
    { cat:'creative-media', name:'Reel / TikTok Editing', price:'K100 – K500' },
    { cat:'creative-media', name:'Event Coverage', price:'K2,000 – K15,000' },
    /* Digital Marketing */
    { cat:'digital-marketing', name:'Facebook Ads Setup', price:'K500 – K1,500' },
    { cat:'digital-marketing', name:'Google Ads Setup', price:'K1,000 – K3,000' },
    { cat:'digital-marketing', name:'SEO Optimization', price:'K2,000 – K10,000' },
    { cat:'digital-marketing', name:'Marketing Strategy Consultation', price:'K500 – K2,500' }
  ];

  var catLabels = {
    'graphic-design': 'Graphic Design',
    'website-development': 'Website Development',
    'social-media': 'Social Media Mgmt',
    'creative-media': 'Creative Media',
    'digital-marketing': 'Digital Marketing'
  };

  var priceGrid = document.getElementById('priceGrid');
  var priceEmpty = document.getElementById('priceEmpty');
  var searchInput = document.getElementById('serviceSearch');
  var explorerPills = document.querySelectorAll('.explorer-controls .filter-pill');
  var activeCat = 'all';

  function renderPriceGrid(){
    var q = (searchInput.value || '').trim().toLowerCase();
    var html = '';
    var count = 0;
    priceData.forEach(function(item){
      var matchesCat = activeCat === 'all' || item.cat === activeCat;
      var matchesQuery = item.name.toLowerCase().indexOf(q) !== -1;
      if(matchesCat && matchesQuery){
        count++;
        html += '' +
          '<div class="price-card glass" data-aos="fade-up">' +
            '<div class="price-card-top">' +
              '<span class="price-card-cat">' + catLabels[item.cat] + '</span>' +
            '</div>' +
            '<h4>' + item.name + '</h4>' +
            '<span class="amount">' + item.price + (item.per ? ' <span class="per">' + item.per + '</span>' : '') + '</span>' +
            '<button type="button" class="btn btn-outline btn-sm btn-block js-request-quote" data-service="' + item.name.replace(/"/g,'&quot;') + '">Request Quote</button>' +
          '</div>';
      }
    });
    priceGrid.innerHTML = html;
    priceEmpty.classList.toggle('is-visible', count === 0);
    priceGrid.querySelectorAll('.js-request-quote').forEach(wireQuoteButton);
  }

  explorerPills.forEach(function(pill){
    pill.addEventListener('click', function(){
      explorerPills.forEach(function(p){ p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      activeCat = pill.getAttribute('data-filter');
      renderPriceGrid();
    });
  });
  if(searchInput){
    searchInput.addEventListener('input', renderPriceGrid);
  }
  if(priceGrid){ renderPriceGrid(); }

  /* "Request Quote" / "Choose Plan" buttons -> scroll to contact + prefill service select */
  function wireQuoteButton(btn){
    btn.addEventListener('click', function(){
      var service = btn.getAttribute('data-service');
      var select = document.getElementById('serviceNeeded');
      if(select && service){
        var found = false;
        Array.prototype.forEach.call(select.options, function(opt){
          if(opt.value === service){ found = true; }
        });
        if(!found){
          var newOpt = document.createElement('option');
          newOpt.value = service; newOpt.textContent = service;
          select.appendChild(newOpt);
        }
        select.value = service;
      }
      var contact = document.getElementById('contact');
      if(contact){
        var headerH = header.classList.contains('is-scrolled') ? 72 : 84;
        var top = contact.getBoundingClientRect().top + window.scrollY - headerH + 1;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  }
  /* Bind static quote buttons (e.g. pricing package cards) once on load */
  document.querySelectorAll('#packagesGrid .js-request-quote').forEach(wireQuoteButton);

  /* =================================================================
     TESTIMONIALS CAROUSEL
  ================================================================= */
  var track = document.getElementById('testimonialTrack');
  var slides = track ? track.children.length : 0;
  var dotsWrap = document.getElementById('testimonialDots');
  var current = 0;
  var autoTimer;

  if(track && slides > 0){
    for(var i=0;i<slides;i++){
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 't-dot' + (i===0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
      dot.addEventListener('click', function(idx){ return function(){ goTo(idx); resetAuto(); }; }(i));
      dotsWrap.appendChild(dot);
    }
    function update(){
      track.style.transform = 'translateX(-' + (current*100) + '%)';
      dotsWrap.querySelectorAll('.t-dot').forEach(function(d, idx){
        d.classList.toggle('is-active', idx === current);
      });
    }
    function goTo(idx){ current = (idx + slides) % slides; update(); }
    function next(){ goTo(current+1); }
    function prev(){ goTo(current-1); }
    function resetAuto(){ clearInterval(autoTimer); autoTimer = setInterval(next, 5500); }

    var nextBtn = document.getElementById('tNext');
    var prevBtn = document.getElementById('tPrev');
    if(nextBtn) nextBtn.addEventListener('click', function(){ next(); resetAuto(); });
    if(prevBtn) prevBtn.addEventListener('click', function(){ prev(); resetAuto(); });
    resetAuto();

    /* swipe support */
    var startX = null;
    track.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', function(e){
      if(startX === null) return;
      var diff = e.changedTouches[0].clientX - startX;
      if(diff > 50) prev();
      else if(diff < -50) next();
      startX = null;
      resetAuto();
    }, {passive:true});
  }

  /* =================================================================
     CONTACT FORM (front-end only — placeholder submit)
  ================================================================= */
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var successBox = document.getElementById('formSuccess');
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'Sending...';
      setTimeout(function(){
        successBox.classList.add('is-visible');
        form.reset();
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = 'Send Message';
      }, 900);
    });
  }

  /* =================================================================
     SCROLL TO TOP
  ================================================================= */
  var topBtn = document.getElementById('toTop');
  window.addEventListener('scroll', function(){
    topBtn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  topBtn.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

})();
