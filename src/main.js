/* Bibliotheken worden geladen via CDN in index.html:
   window.Lenis, window.AOS, window.gsap */

/* ─── LENIS SMOOTH SCROLL ─── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

/* ─── AOS ─── */
AOS.init({
  duration: 750,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
})

lenis.on('scroll', AOS.refresh)

/* ─── HUIDIGE JAAR FOOTER ─── */
const yearEl = document.getElementById('currentYear')
if (yearEl) yearEl.textContent = new Date().getFullYear()

/* ─── HERO GSAP ANIMATIE ─── */
const heroTl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })

heroTl
  .fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 })
  .fromTo('.hero-title .line', { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, '-=0.4')
  .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
  .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  .fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
  .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')

/* ─── HEADER SCROLL GEDRAG ─── */
const header = document.getElementById('header')

lenis.on('scroll', ({ scroll }) => {
  if (scroll > 60) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger')
const navOverlay = document.getElementById('navOverlay')

function openMenu() {
  hamburger.classList.add('active')
  hamburger.setAttribute('aria-expanded', 'true')
  navOverlay.classList.add('active')
  navOverlay.setAttribute('aria-hidden', 'false')
  lenis.stop()
  const firstLink = navOverlay.querySelector('.overlay-nav-link')
  if (firstLink) firstLink.focus()
}

function closeMenu() {
  hamburger.classList.remove('active')
  hamburger.setAttribute('aria-expanded', 'false')
  navOverlay.classList.remove('active')
  navOverlay.setAttribute('aria-hidden', 'true')
  lenis.start()
}

hamburger.addEventListener('click', () => {
  navOverlay.classList.contains('active') ? closeMenu() : openMenu()
})

document.getElementById('overlayClose')?.addEventListener('click', () => {
  closeMenu()
  hamburger.focus()
})

navOverlay.querySelectorAll('.overlay-nav-link').forEach(link => {
  link.addEventListener('click', closeMenu)
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
    closeMenu()
    hamburger.focus()
  }
})

navOverlay.addEventListener('click', (e) => {
  if (e.target === navOverlay) closeMenu()
})

/* ─── ACTIEVE NAVIGATIELINK ─── */
const sections = document.querySelectorAll('main section[id]')
const allNavLinks = document.querySelectorAll('.desktop-nav .nav-link, .overlay-nav .overlay-nav-link')

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const id = entry.target.getAttribute('id')
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
    })
  })
}, {
  threshold: 0.25,
  rootMargin: '-72px 0px -40% 0px',
})

sections.forEach(s => sectionObserver.observe(s))

/* ─── PRODUCTKAART UITKLAPPEN ─── */
document.querySelectorAll('.product-card-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const card = toggle.closest('.product-card')
    const body = card.querySelector('.product-card-body')
    const isOpen = card.classList.contains('open')

    document.querySelectorAll('.product-card.open').forEach(c => {
      if (c !== card) {
        c.classList.remove('open')
        c.querySelector('.product-card-body').style.maxHeight = '0'
        c.querySelector('.product-card-toggle').setAttribute('aria-expanded', 'false')
      }
    })

    if (isOpen) {
      card.classList.remove('open')
      body.style.maxHeight = '0'
      toggle.setAttribute('aria-expanded', 'false')
    } else {
      card.classList.add('open')
      body.style.maxHeight = body.scrollHeight + 'px'
      toggle.setAttribute('aria-expanded', 'true')
    }
  })
})

/* ─── REVIEWS CARROUSEL ─── */
const reviewsTrack = document.getElementById('reviewsTrack')
const reviewDots = document.querySelectorAll('.review-dot')
const reviewPrev = document.getElementById('reviewPrev')
const reviewNext = document.getElementById('reviewNext')

let currentSlide = 0
let autoplayTimer = null
const totalSlides = reviewDots.length

function goToSlide(index) {
  currentSlide = ((index % totalSlides) + totalSlides) % totalSlides
  if (reviewsTrack) {
    reviewsTrack.style.transform = `translateX(-${currentSlide * 100}%)`
  }
  reviewDots.forEach((dot, i) => {
    const active = i === currentSlide
    dot.classList.toggle('active', active)
    dot.setAttribute('aria-selected', String(active))
  })
}

function startAutoplay() {
  stopAutoplay()
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5500)
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer)
}

reviewPrev?.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoplay() })
reviewNext?.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoplay() })

reviewDots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); startAutoplay() })
})

const carousel = document.querySelector('.reviews-carousel')
if (carousel) {
  carousel.addEventListener('mouseenter', stopAutoplay)
  carousel.addEventListener('mouseleave', startAutoplay)
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goToSlide(currentSlide - 1); startAutoplay() }
    if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startAutoplay() }
  })
}

if (totalSlides > 0) startAutoplay()

/* ─── TERUG NAAR BOVEN ─── */
const backToTop = document.getElementById('backToTop')

lenis.on('scroll', ({ scroll }) => {
  backToTop?.classList.toggle('visible', scroll > 500)
})

backToTop?.addEventListener('click', () => {
  lenis.scrollTo(0, { duration: 1.6 })
})

/* ─── SMOOTH SCROLL VOOR ANKERLINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href')
    if (!href || href.length <= 1) {
      e.preventDefault()
      lenis.scrollTo(0, { duration: 1.4 })
      return
    }
    const target = document.querySelector(href)
    if (target) {
      e.preventDefault()
      lenis.scrollTo(target, { offset: -72, duration: 1.2 })
    }
  })
})

/* ─── PRODUCT KAART HOOGTE BIJ RESIZE ─── */
window.addEventListener('resize', () => {
  document.querySelectorAll('.product-card.open .product-card-body').forEach(body => {
    body.style.maxHeight = body.scrollHeight + 'px'
  })
})
