
/**
 * Mobile-First Navigation Handler
 * Handles hamburger menu toggle and accessibility features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get navigation elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Check if elements exist before adding functionality
    if (!hamburger || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }
    
    // Toggle menu function
    function toggleMenu() {
        const isOpen = navMenu.classList.contains('active');
        
        // Toggle classes
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', !isOpen);
        
        // Add/remove body scroll lock when menu is open
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close menu function
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    // Hamburger click event
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = hamburger.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            hamburger.focus(); // Return focus to hamburger button
        }
    });
    
    // Handle window resize - close menu if screen gets larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Focus management for accessibility
    hamburger.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });
    
    // Trap focus within menu when open
    function trapFocus(event) {
        if (!navMenu.classList.contains('active')) return;
        
        const focusableElements = navMenu.querySelectorAll('a[href]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
    
    document.addEventListener('keydown', trapFocus);
    
    // Smooth scroll behavior for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Only handle same-page navigation
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                event.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add loading state management
    function showLoadingState() {
        hamburger.style.opacity = '0.7';
        hamburger.style.pointerEvents = 'none';
    }
    
    function hideLoadingState() {
        hamburger.style.opacity = '1';
        hamburger.style.pointerEvents = 'auto';
    }
    
    // Enhanced accessibility announcements
    function announceMenuState(isOpen) {
        const announcement = isOpen ? 'Navigation menu opened' : 'Navigation menu closed';
        
        // Create or update live region for screen readers
        let liveRegion = document.getElementById('nav-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'nav-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = announcement;
    }
    
    // Update toggle function to include announcements
    const originalToggleMenu = toggleMenu;
    toggleMenu = function() {
        const wasOpen = navMenu.classList.contains('active');
        originalToggleMenu();
        announceMenuState(!wasOpen);
    };

    // Work page: video modal preview + private live demo handling
    const videoModal = document.getElementById('video-modal');
    const videoModalPlayer = document.getElementById('video-modal-player');
    const videoModalTitle = document.getElementById('video-modal-title');
    const videoModalMessage = document.getElementById('video-modal-message');
    const videoModalCloseEls = document.querySelectorAll('[data-video-modal-close]');
    const videoCards = document.querySelectorAll('.card-video-bg[role="button"]');
    const privateProjectMessage = 'This project was freelanced and is not for public viewing. To see it live in action, <a href="contact.html">contact me</a>.';
    const privateCodeMessage = 'This project\'s code is not available for public viewing. If you would like to learn more, <a href="contact.html">contact me</a>.';
    let previousBodyOverflow = '';

    let activeModalVideo = null;
    let activeModalVideoOriginalParent = null;
    let activeModalVideoOriginalNextSibling = null;
    let activeModalVideoOriginalState = null;

    function getProjectContext(el) {
        const card = el.closest('.project-card');
        if (!card) return { title: '', videoEl: null };
        const title = (card.querySelector('.project-content h3') || card.querySelector('h3'))?.textContent?.trim() || '';
        const videoEl = card.querySelector('.card-bg-video');
        const liveLink = card.querySelector('.project-links .btn-primary');
        const isPrivateLiveDemo = !!(liveLink && liveLink.getAttribute('href') === '#');
        return { title, videoEl, card, isPrivateLiveDemo };
    }

    function ensurePrivateProjectNote(card) {
        if (!card) return;

        const content = card.querySelector('.project-content');
        const liveLink = card.querySelector('.project-links .btn-primary');
        if (!content || !liveLink || liveLink.getAttribute('href') !== '#') return;

        if (content.querySelector('.project-private-note')) return;

        const note = document.createElement('p');
        note.className = 'project-private-note';
        note.innerHTML = 'Not currently live (freelance). To see it live in action, <a href="contact.html">contact me</a>.';

        const links = content.querySelector('.project-links');
        if (links) {
            content.insertBefore(note, links);
        } else {
            content.appendChild(note);
        }
    }

    function openVideoModal({ title, videoEl, messageHtml }) {
        if (!videoModal || !videoModalPlayer) return;

        videoModalTitle.textContent = title || '';
        videoModalMessage.innerHTML = messageHtml || '';

        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        videoModal.classList.add('is-open');
        videoModal.setAttribute('aria-hidden', 'false');

        // Clear any previous content (in case modal was closed by DOM changes)
        videoModalPlayer.innerHTML = '';

        // Move the already-loaded thumbnail video into the modal for instant playback
        if (videoEl && videoEl.tagName && videoEl.tagName.toLowerCase() === 'video') {
            activeModalVideo = videoEl;
            activeModalVideoOriginalParent = videoEl.parentElement;
            activeModalVideoOriginalNextSibling = videoEl.nextSibling;

            activeModalVideoOriginalState = {
                controls: videoEl.controls,
                muted: videoEl.muted,
                loop: videoEl.loop,
                autoplay: videoEl.autoplay,
                playsInline: videoEl.playsInline
            };

            videoEl.controls = true;
            videoEl.muted = false;
            videoEl.loop = false;
            videoEl.autoplay = false;
            videoEl.playsInline = true;

            videoModalPlayer.appendChild(videoEl);

            const playPromise = videoEl.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        }
    }

    function closeVideoModal() {
        if (!videoModal || !videoModalPlayer) return;

        videoModal.classList.remove('is-open');
        videoModal.setAttribute('aria-hidden', 'true');

        // Restore moved thumbnail video back to its card
        if (activeModalVideo && activeModalVideoOriginalParent) {
            activeModalVideo.pause();

            if (activeModalVideoOriginalState) {
                activeModalVideo.controls = activeModalVideoOriginalState.controls;
                activeModalVideo.muted = activeModalVideoOriginalState.muted;
                activeModalVideo.loop = activeModalVideoOriginalState.loop;
                activeModalVideo.autoplay = activeModalVideoOriginalState.autoplay;
                activeModalVideo.playsInline = activeModalVideoOriginalState.playsInline;
            }

            if (activeModalVideoOriginalNextSibling) {
                activeModalVideoOriginalParent.insertBefore(activeModalVideo, activeModalVideoOriginalNextSibling);
            } else {
                activeModalVideoOriginalParent.appendChild(activeModalVideo);
            }

            const playPromise = activeModalVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {});
            }
        }

        // Clear modal container
        videoModalPlayer.innerHTML = '';

        activeModalVideo = null;
        activeModalVideoOriginalParent = null;
        activeModalVideoOriginalNextSibling = null;
        activeModalVideoOriginalState = null;

        videoModalTitle.textContent = '';
        videoModalMessage.textContent = '';

        document.body.style.overflow = previousBodyOverflow;
    }

    if (videoModal) {
        videoModalCloseEls.forEach(el => {
            el.addEventListener('click', closeVideoModal);
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && videoModal.classList.contains('is-open')) {
                closeVideoModal();
            }
        });
    }

    if (videoCards.length) {
        videoCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const ctx = getProjectContext(this);
                if (ctx.card) ensurePrivateProjectNote(ctx.card);
                openVideoModal({ title: ctx.title, videoEl: ctx.videoEl, messageHtml: ctx.isPrivateLiveDemo ? privateProjectMessage : '' });
            });

            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const ctx = getProjectContext(this);
                    if (ctx.card) ensurePrivateProjectNote(ctx.card);
                    openVideoModal({ title: ctx.title, videoEl: ctx.videoEl, messageHtml: ctx.isPrivateLiveDemo ? privateProjectMessage : '' });
                }
            });
        });
    }

    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length) {
        projectCards.forEach(card => ensurePrivateProjectNote(card));
    }

    const projectLinks = document.querySelectorAll('.project-links a[href="#"]');
    if (projectLinks.length) {
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const ctx = getProjectContext(this);
                const messageHtml = this.classList.contains('btn-primary') ? privateProjectMessage : privateCodeMessage;
                openVideoModal({ title: ctx.title, videoEl: ctx.videoEl, messageHtml });
            });
        });
    }
    
    console.log('Mobile-first navigation initialized successfully');
});
