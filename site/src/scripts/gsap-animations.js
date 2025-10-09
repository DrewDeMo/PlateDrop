/**
 * GSAP Animations for PlateDrop
 * Optimized for performance with only core + ScrollTrigger
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all animations
 */
export function initAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        gsap.globalTimeline.clear();
        return;
    }

    // Initialize hero animations
    initHeroAnimations();

    // Initialize deal cards animations
    initDealCardsAnimations();

    // Initialize hover effects
    initHoverEffects();
}

/**
 * Hero Section Animations
 */
function initHeroAnimations() {
    // Check if hero elements exist
    const heroLabel = document.querySelector('.hero-label');
    if (!heroLabel) {
        console.log('Hero elements not found, skipping hero animations');
        return;
    }

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: 'power3.out'
        }
    });

    // Animate hero label
    heroTimeline.from('.hero-label', {
        opacity: 0,
        y: 20,
        duration: 0.6
    });

    // Animate hero title
    heroTimeline.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 0.8
    }, '-=0.3');

    // Animate hero title accent
    heroTimeline.from('.hero-title-accent', {
        opacity: 0,
        x: -20,
        duration: 0.6
    }, '-=0.4');

    // Animate hero description
    heroTimeline.from('.hero-description', {
        opacity: 0,
        y: 20,
        duration: 0.6
    }, '-=0.3');

    // Animate hero stats with stagger
    heroTimeline.from('.hero-stat', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5
    }, '-=0.2');

    // Animate stats values with counter effect
    gsap.from('.hero-stat-value', {
        textContent: 0,
        duration: 1.2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.1,
        delay: 0.8,
        onUpdate: function () {
            // Keep non-numeric values as-is
            const target = this.targets()[0];
            const originalText = target.getAttribute('data-original-text') || target.textContent;
            if (!/^\d+$/.test(originalText)) {
                target.textContent = originalText;
            }
        }
    });

    // Animate CTA buttons
    heroTimeline.from('.hero-cta-primary', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'back.out(1.7)'
    }, '-=0.3');

    heroTimeline.from('.hero-date-badge', {
        opacity: 0,
        x: -20,
        duration: 0.5
    }, '-=0.4');

    // Animate hero visual
    gsap.from('.hero-visual', {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
    });
}

/**
 * Deal Cards Scroll Animations
 */
function initDealCardsAnimations() {
    // Check if deals section exists
    const dealsSection = document.querySelector('.deals-section');
    if (!dealsSection) {
        console.log('Deals section not found, skipping deal animations');
        return;
    }

    // Animate section header
    gsap.from('.deals-section .section-header-modern', {
        scrollTrigger: {
            trigger: '.deals-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Animate deal cards with stagger
    const dealCards = gsap.utils.toArray('.deal-wrapper');

    if (dealCards.length > 0) {
        gsap.from(dealCards, {
            scrollTrigger: {
                trigger: '.deals-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out'
        });
    }

    // Animate no-deals message if present
    const noDeals = document.querySelector('.no-deals');
    if (noDeals) {
        gsap.from(noDeals, {
            scrollTrigger: {
                trigger: noDeals,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
    }
}

/**
 * Hover Effects using GSAP
 */
function initHoverEffects() {
    // Deal card hover effects
    const dealCards = document.querySelectorAll('.deal-wrapper');

    dealCards.forEach(card => {
        const cardElement = card.querySelector('.deal-card') || card;

        card.addEventListener('mouseenter', () => {
            gsap.to(cardElement, {
                scale: 1.03,
                y: -8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(cardElement, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // CTA button hover effects
    const ctaButtons = document.querySelectorAll('.hero-cta-primary, .btn-primary');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Category card hover effects
    const categoryCards = document.querySelectorAll('.category-compact, .category-large');

    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                x: 8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Refresh ScrollTrigger on window resize
 */
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

/**
 * Initialize animations when DOM is ready
 */
console.log('GSAP animations script loaded');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing animations');
        initAnimations();
    });
} else {
    console.log('DOM already loaded, initializing animations immediately');
    initAnimations();
}
