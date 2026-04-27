// Portfolio Website JavaScript
// Modern ES6+ implementation with smooth animations and interactions

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTypingAnimation();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupSmoothScrolling();
    }

    // Navigation
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile navigation toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
            navMenu.classList.toggle('flex-col');
            navMenu.classList.toggle('absolute');
            navMenu.classList.toggle('top-full');
            navMenu.classList.toggle('left-0');
            navMenu.classList.toggle('w-full');
            navMenu.classList.toggle('bg-white');
            navMenu.classList.toggle('dark:bg-gray-950');
            navMenu.classList.toggle('p-8');
            navMenu.classList.toggle('shadow-xl');
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!navMenu.classList.contains('hidden') && window.innerWidth < 768) {
                    navMenu.classList.add('hidden');
                    navMenu.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'dark:bg-gray-950', 'p-8', 'shadow-xl');
                }
            });
        });
    }

    // Typing Animation
    setupTypingAnimation() {
        const typedTextSpan = document.querySelector('.typed-text');
        if (!typedTextSpan) return;

        const textArray = [
            'Full Stack Developer',
            'ML Enthusiast',
            'Flutter Developer',
            'Problem Solver',
            'Open Source Learner'
        ];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        const type = () => {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        };

        const erase = () => {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 500);
            }
        };

        // Start typing animation
        setTimeout(() => {
            if (textArray.length) setTimeout(type, newTextDelay);
        }, 500);
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply base styles and observe elements
        const animatedElements = document.querySelectorAll('.section, .skill-card, .project-card, .timeline-item');
        
        animatedElements.forEach((el, index) => {
            // Apply initial styles for animation
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            // Stagger animations for lists
            if (el.classList.contains('skill-card')) {
                el.style.transitionDelay = `${(index % 10) * 0.1}s`;
            } else if (el.classList.contains('timeline-item')) {
                el.style.transitionDelay = `${(index % 4) * 0.2}s`;
            }
            
            observer.observe(el);
        });
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.innerHTML = 'Sending...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';

                setTimeout(() => {
                    submitButton.innerHTML = 'Message Sent ✓';
                    submitButton.style.backgroundColor = '#10b981'; // Success green
                    
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.style.opacity = '1';
                        submitButton.style.backgroundColor = ''; // Reset
                        form.reset();
                    }, 3000);
                }, 1500);
            });
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    let headerOffset = 100; // Account for fixed navbar
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    console.log('✨ Articulate Portfolio initialized successfully!');
});