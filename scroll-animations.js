'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────────────────
       GSAP SETUP
    ───────────────────────────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);


    /* ─────────────────────────────────────────────────────────
       SCROLL PROGRESS BAR
    ───────────────────────────────────────────────────────── */
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
    }, { passive: true });


    /* ─────────────────────────────────────────────────────────
       NAV — border sharpens on scroll
    ───────────────────────────────────────────────────────── */
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        }, { passive: true });
    }


    /* ─────────────────────────────────────────────────────────
       CUSTOM CURSOR — dot + lagging ring (pointer devices only)
    ───────────────────────────────────────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.classList.add('has-custom-cursor');

        const dot  = document.createElement('div');
        const ring = document.createElement('div');
        dot.className  = 'cur-dot';
        ring.className = 'cur-ring';
        document.body.append(dot, ring);

        let mx = -200, my = -200;
        let rx = -200, ry = -200;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
        });

        (function tick() {
            dot.style.transform  = `translate(${mx}px,${my}px)`;
            rx += (mx - rx) * 0.1;
            ry += (my - ry) * 0.1;
            ring.style.transform = `translate(${rx}px,${ry}px)`;
            requestAnimationFrame(tick);
        })();

        // Expand ring + hide dot when hovering interactive elements
        const hovers = 'a, button, .project-card, .project-card-static, .service-card, .skill-item, [role="button"], input, textarea, label';
        document.querySelectorAll(hovers).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
        });
    }


    /* ─────────────────────────────────────────────────────────
       HERO TIMELINE — runs once on home page load
    ───────────────────────────────────────────────────────── */
    if (document.querySelector('.hero')) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.from('.hero-badge', {
            y: 30, opacity: 0, duration: 0.9
        })
        .from('.reveal-word > span', {
            yPercent: 115,
            opacity: 0,
            duration: 1.1,
            stagger: 0.14
        }, '-=0.55')
        .from('.hero-tagline', {
            y: 28, opacity: 0, duration: 0.85
        }, '-=0.65')
        .from('.hero-sub', {
            y: 28, opacity: 0, duration: 0.85
        }, '-=0.68')
        .from('.hero-cta', {
            y: 28, opacity: 0, duration: 0.85
        }, '-=0.68')
        .from('.hero-stats', {
            y: 20, opacity: 0, duration: 0.7
        }, '-=0.55')
        .from('.hero-photo-wrap', {
            scale: 0.55,
            opacity: 0,
            rotation: -12,
            duration: 1.3,
            ease: 'power4.out'
        }, 0.25);


        // Hero photo glow pulse after load
        gsap.to('.hero-photo-wrap::after', {
            opacity: 0.6,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.5
        });
    }


    /* ─────────────────────────────────────────────────────────
       PAGE HERO (non-home) — animate in on load
    ───────────────────────────────────────────────────────── */
    gsap.utils.toArray('.page-hero .section-label, .page-hero .section-title, .page-hero .section-subtitle').forEach((el, i) => {
        gsap.from(el, {
            y: 55, opacity: 0,
            duration: 1,
            delay: i * 0.13,
            ease: 'power4.out'
        });
    });


    /* ─────────────────────────────────────────────────────────
       SCROLL-TRIGGERED REVEALS
    ───────────────────────────────────────────────────────── */

    // Section labels — slide from left
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            x: -35, opacity: 0,
            duration: 0.75,
            ease: 'power3.out'
        });
    });

    // Section titles — rise from below
    gsap.utils.toArray('.section-title').forEach(el => {
        if (el.closest('.page-hero')) return; // already handled above
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            y: 55, opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
    });

    // Section subtitles
    gsap.utils.toArray('.section-subtitle').forEach(el => {
        if (el.closest('.page-hero')) return;
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            y: 35, opacity: 0,
            duration: 0.85,
            delay: 0.1,
            ease: 'power3.out'
        });
    });

    // Featured work header
    if (document.querySelector('.featured-work-header')) {
        gsap.from('.featured-work-header', {
            scrollTrigger: { trigger: '.featured-work-header', start: 'top 90%', once: true },
            y: 40, opacity: 0, duration: 0.9, ease: 'power4.out'
        });
    }

    // Project + featured cards — staggered scale fade
    gsap.utils.toArray('.project-card, .project-card-static').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            y: 80, opacity: 0, scale: 0.88,
            duration: 0.95,
            delay: (i % 3) * 0.11,
            ease: 'power4.out'
        });
    });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            y: 60, opacity: 0,
            duration: 0.9,
            delay: i * 0.13,
            ease: 'power3.out'
        });
    });

    // Skill items — fast stagger
    gsap.utils.toArray('.skill-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 93%', once: true },
            y: 40, opacity: 0,
            duration: 0.65,
            delay: (i % 6) * 0.065,
            ease: 'power3.out'
        });
    });

    // About intro — two-col slide in from opposite sides
    if (document.querySelector('.about-intro')) {
        gsap.from('.about-intro-image', {
            scrollTrigger: { trigger: '.about-intro', start: 'top 82%', once: true },
            x: -90, opacity: 0, duration: 1.25, ease: 'power4.out'
        });
        gsap.from('.about-intro-text', {
            scrollTrigger: { trigger: '.about-intro', start: 'top 82%', once: true },
            x: 90, opacity: 0, duration: 1.25, delay: 0.14, ease: 'power4.out'
        });
        gsap.utils.toArray('.about-intro-text p').forEach((p, i) => {
            gsap.from(p, {
                scrollTrigger: { trigger: p, start: 'top 88%', once: true },
                y: 28, opacity: 0, duration: 0.75, delay: i * 0.09, ease: 'power3.out'
            });
        });
    }

    // Contact items — slide from left, staggered
    gsap.utils.toArray('.contact-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 92%', once: true },
            x: -45, opacity: 0, duration: 0.75, delay: i * 0.1, ease: 'power3.out'
        });
    });

    // Contact two-col
    if (document.querySelector('.contact-grid')) {
        gsap.from('.contact-info-block', {
            scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
            x: -90, opacity: 0, duration: 1.2, ease: 'power4.out'
        });
        gsap.from('.contact-form-section', {
            scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
            x: 90, opacity: 0, duration: 1.2, delay: 0.13, ease: 'power4.out'
        });
        gsap.from('.contact-form-section h3', {
            scrollTrigger: { trigger: '.contact-form-section', start: 'top 88%', once: true },
            y: 25, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
        gsap.utils.toArray('.form-group').forEach((g, i) => {
            gsap.from(g, {
                scrollTrigger: { trigger: g, start: 'top 92%', once: true },
                y: 20, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out'
            });
        });
    }

    // Resume CTA
    gsap.utils.toArray('.resume-cta .section-label, .resume-cta .section-title, .resume-cta p, .resume-cta .btn-primary').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            y: 40, opacity: 0, duration: 0.85, delay: i * 0.12, ease: 'power3.out'
        });
    });


    /* ─────────────────────────────────────────────────────────
       HERO PARALLAX — photo drifts as you leave hero section
    ───────────────────────────────────────────────────────── */
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        gsap.to(heroVisual, {
            y: 120,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });
    }

    // Section label parallax accent
    gsap.utils.toArray('.service-card, .project-card-static').forEach(card => {
        gsap.to(card, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    });


    /* ─────────────────────────────────────────────────────────
       HERO STATS COUNTER
    ───────────────────────────────────────────────────────── */
    document.querySelectorAll('.hero-stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const obj    = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 1.5,
                    ease: 'power3.out',
                    onUpdate: () => { el.textContent = Math.floor(obj.val) + suffix; },
                    onComplete: () => { el.textContent = target + suffix; }
                });
            }
        });
    });


    /* ─────────────────────────────────────────────────────────
       MAGNETIC BUTTONS — attract to cursor, snap back elastic
    ───────────────────────────────────────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.28;
                const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
                gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
            });
        });
    }


    /* ─────────────────────────────────────────────────────────
       3D CARD TILT — perspective tilt on mouse move
    ───────────────────────────────────────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.project-card, .project-card-static, .service-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
                const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
                gsap.to(card, {
                    rotateX: dy * -5,
                    rotateY: dx *  5,
                    scale: 1.03,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 900
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0, rotateY: 0, scale: 1,
                    duration: 0.55,
                    ease: 'elastic.out(1, 0.5)',
                    transformPerspective: 900
                });
            });
        });
    }


    /* ─────────────────────────────────────────────────────────
       THEME TOGGLE — dark / light mode
    ───────────────────────────────────────────────────────── */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const html = document.documentElement;
            const isLight = html.getAttribute('data-theme') === 'light';
            if (isLight) {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

});
