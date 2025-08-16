
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
    
    console.log('Mobile-first navigation initialized successfully');
});
