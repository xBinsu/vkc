// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Role rotator — typewriter effect
// ============================================================
const roles = [
  'web experiences',
  'full stack apps',
  'clean interfaces',
  'practical tools'
];

const rotatorEl = document.getElementById('roleRotator');
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = true;

function tick(){
  const current = roles[roleIndex];

  if (deleting){
    charIndex--;
    if (charIndex <= 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  } else {
    charIndex++;
    if (charIndex >= roles[roleIndex].length){
      deleting = true;
      setTimeout(tick, 1400); // pause on full word
      rotatorEl.textContent = roles[roleIndex];
      return;
    }
  }

  rotatorEl.textContent = roles[roleIndex].slice(0, charIndex);
  const speed = deleting ? 35 : 55;
  setTimeout(tick, speed);
}

if (rotatorEl){
  setTimeout(tick, 900);
}

// ============================================================
// Mobile menu toggle
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle){
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.classList.toggle('active', isOpen);
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// Scroll reveal
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => io.observe(el));

// ============================================================
// Active nav link on scroll
// ============================================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));

// ============================================================
// Respect user motion / input preferences
// ============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const enhanceInteractions = hasFinePointer && !prefersReducedMotion;

// ============================================================
// Scroll progress bar
// ============================================================
const progressBar = document.getElementById('scrollProgress');

function updateProgress(){
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${pct}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ============================================================
// Live local clock — San Pablo City, PH (Asia/Manila)
// ============================================================
const clockEl = document.getElementById('localClock');

function updateClock(){
  if (!clockEl) return;
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date());
  clockEl.textContent = `${formatted} PHT`;
}
updateClock();
setInterval(updateClock, 30000);

// ============================================================
// Copy email to clipboard + toast
// ============================================================
const emailLink = document.getElementById('emailLink');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message){
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

if (emailLink){
  emailLink.addEventListener('click', () => {
    if (navigator.clipboard){
      navigator.clipboard.writeText('calayagvk@gmail.com')
        .then(() => showToast('Email copied to clipboard'))
        .catch(() => {});
    }
  });
}

// ============================================================
// Enhanced interactions — desktop / fine-pointer only
// ============================================================
if (enhanceInteractions){

  // ---- Custom cursor ----
  document.documentElement.classList.add('has-custom-cursor');

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  });

  function animateRing(){
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .tag, .work-card, .fact-card, .timeline-content')
    .forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring--active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring--active'));
    });

  // ---- Magnetic pull on primary CTAs ----
  function addMagnetic(el, strength = 0.3){
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transition = 'transform .12s ease-out';
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.16,.84,.44,1)';
      el.style.transform = 'translate(0,0)';
    });
  }
  document.querySelectorAll('.hero-ctas .btn, .contact-actions .btn')
    .forEach(btn => addMagnetic(btn, 0.25));

  // ---- 3D tilt on project cards ----
  function addTilt(el, max = 7){
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = 'transform .1s ease-out';
      el.style.transform =
        `translateY(-6px) perspective(800px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.16,.84,.44,1)';
      el.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  }
  document.querySelectorAll('.work-card').forEach(card => addTilt(card, 6));

  // ---- Subtle tilt on hero portrait ----
  const heroPortrait = document.querySelector('.hero-portrait');
  const portraitFrame = document.querySelector('.portrait-frame');
  if (heroPortrait && portraitFrame){
    heroPortrait.addEventListener('mousemove', (e) => {
      const rect = heroPortrait.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      portraitFrame.style.transition = 'transform .1s ease-out';
      portraitFrame.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
    });
    heroPortrait.addEventListener('mouseleave', () => {
      portraitFrame.style.transition = 'transform .6s cubic-bezier(.16,.84,.44,1)';
      portraitFrame.style.transform = 'perspective(700px) rotateX(0) rotateY(0)';
    });
  }
}

// ============================================================
// Console easter egg for fellow developers
// ============================================================
console.log(
  '%cHey, fellow developer 👋',
  'font-size:16px; font-weight:700; color:#C89238; padding:4px 0;'
);
console.log(
  '%cLiked what you saw under the hood? Let\'s talk — calayagvk@gmail.com',
  'font-size:12px; color:#3E5C50;'
);