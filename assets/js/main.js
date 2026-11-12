/* Leão Comunicação — interações do site */

// >>> CONFIRMAR ANTES DE PUBLICAR: número de WhatsApp com DDI e DDD, só números.
const WHATSAPP = '5562994080118';
const MSG_PADRAO = 'Olá! Vim pelo site da Leão Comunicação e gostaria de um orçamento.';

document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG_PADRAO)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Cabeçalho ganha fundo ao rolar
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu do celular
const toggle = document.querySelector('.nav__toggle');
const mobile = document.getElementById('menu-mobile');
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobile.hidden = !open;
  nav.classList.toggle('is-open', open);
};
toggle.addEventListener('click', () => setMenu(mobile.hidden));
mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduz) document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

// Slide da abertura
const slides = [...document.querySelectorAll('.hero .slide')];
const dots = document.querySelector('.hero__dots');
if (slides.length > 1 && dots) {
  let atual = 0;
  let timer;
  const botoes = slides.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Foto ${i + 1}: ${s.querySelector('figcaption')?.textContent || ''}`);
    b.addEventListener('click', () => { mostrar(i); reiniciar(); });
    dots.appendChild(b);
    return b;
  });
  const mostrar = (i) => {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === atual));
    botoes.forEach((b, k) => b.setAttribute('aria-selected', String(k === atual)));
  };
  const reiniciar = () => {
    clearInterval(timer);
    if (!reduz) timer = setInterval(() => mostrar(atual + 1), 5500);
  };
  mostrar(0);
  reiniciar();
  document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : reiniciar()));
}

// Vídeos em loop (sem som)
const videos = [...document.querySelectorAll('.reel video, .why__media video')];
const tocar = (v) => {
  v.muted = true;
  const p = v.play();
  if (p && p.catch) p.then(() => v.parentElement.classList.remove('needs-tap')).catch(() => v.parentElement.classList.add('needs-tap'));
};
videos.forEach((v) => {
  v.muted = true;
  v.parentElement.addEventListener('click', () => { if (v.paused) tocar(v); });
  if (reduz) { v.removeAttribute('autoplay'); v.pause(); }
});

if ('IntersectionObserver' in window) {
  // Item do menu acompanha a seção visível
  const links = [...document.querySelectorAll('.nav__links a')];
  const secoes = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const sObs = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach((s) => sObs.observe(s));

  // Vídeos dos bastidores: tocam quando aparecem; se o celular bloquear, mostra botão de play
  const vObs = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !reduz) tocar(target);
      else target.pause();
    });
  }, { threshold: 0.25 });
  videos.forEach((v) => vObs.observe(v));

  // Entrada suave
  const alvos = document.querySelectorAll('.head, .card, .consult__item, .stats, .why > *, .founder > *, .reel, .gallery img, .clients li, .cta');
  alvos.forEach((el) => el.classList.add('reveal'));
  const rObs = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.add('is-in'); rObs.unobserve(target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  alvos.forEach((el) => rObs.observe(el));
}
