// Portfolio Website JavaScript
// Modern ES6+ implementation with smooth animations and interactions

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupParticleSystem();
        this.setupNavigation();
        this.setupTypingAnimation();
        this.setupScrollAnimations();
        this.setupAnimatedCounters();
        this.setupSkillBars();
        this.setupProjectFilters();
        this.setupContactForm();
        this.setupSmoothScrolling();
    }

    // Loading Screen
    setupLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }

    // Particle System Background
    setupParticleSystem() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Pulse effect
                this.pulsePhase += this.pulseSpeed;
                this.opacity = 0.2 + Math.sin(this.pulsePhase) * 0.3;

                // Boundary check
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Keep particles within bounds
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();

                // Add glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const createParticles = () => {
            const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (100 - distance) / 100 * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();
            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // Navigation
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile navigation toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Active navigation link highlighting
        const sections = document.querySelectorAll('section');
        const updateActiveLink = () => {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos <= bottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();
    }

    // Typing Animation
    setupTypingAnimation() {
        const typedTextSpan = document.querySelector('.typed-text');
        const textArray = [
            'Computer Science Student',
            'Full-Stack Developer',
            'Problem Solver',
            'Innovation Enthusiast',
            'Code Craftsman'
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
                setTimeout(type, typingDelay + 1100);
            }
        };

        // Start typing animation after loading screen
        setTimeout(() => {
            if (textArray.length) setTimeout(type, newTextDelay + 250);
        }, 2000);
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
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Observe skill cards for progressive animation
        document.querySelectorAll('.skill-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }

    // Animated Counters
    setupAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-item');
        let hasAnimated = false;

        const animateCounters = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const numberElement = counter.querySelector('.stat-number');
                let current = 0;
                const increment = target / 100;
                const duration = 2000;
                const stepTime = duration / 100;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        if (current > target) current = target;
                        
                        // Format number based on size
                        if (target >= 1000) {
                            numberElement.textContent = (current / 1000).toFixed(1) + 'K';
                        } else {
                            numberElement.textContent = Math.floor(current);
                        }
                        
                        setTimeout(updateCounter, stepTime);
                    } else {
                        // Final formatting
                        if (target >= 1000) {
                            numberElement.textContent = (target / 1000).toFixed(1) + 'K';
                        } else {
                            numberElement.textContent = target;
                        }
                    }
                };

                updateCounter();
            });
        };

        // Trigger animation when hero stats come into view
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                    }
                });
            });
            observer.observe(heroStats);
        }
    }

    // Skill Bar Animations
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const animateSkillBars = () => {
            skillBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, index * 200);
            });
        };

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                    }
                });
            });
            observer.observe(skillsSection);
        }
    }

    // Project Filtering
    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        const categoryMap = {
            'web': 'web',
            'mobile': 'mobile',
            'ml': 'ml',
            'blockchain': 'blockchain'
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                // Animate cards out
                projectCards.forEach(card => {
                    card.style.transform = 'scale(0.8)';
                    card.style.opacity = '0';
                });

                setTimeout(() => {
                    projectCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.transform = 'scale(1)';
                                card.style.opacity = '1';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }, 300);
            });
        });
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');

                // Simple validation
                if (!name || !email || !subject || !message) {
                    this.showNotification('Please fill in all fields.', 'error');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    this.showNotification('Please enter a valid email address.', 'error');
                    return;
                }

                // Simulate form submission
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;

                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    form.reset();
                    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                }, 2000);
            });

            // Real-time form validation
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remove existing error styling
        field.classList.remove('error');
        
        // Check if field is empty
        if (!value) {
            isValid = false;
        }

        // Email specific validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        if (!isValid) {
            field.classList.add('error');
        }

        return isValid;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Smooth Scrolling - Fixed version
    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    let headerOffset = 80;
                    
                    // Special handling for home section - scroll to very top
                    if (targetId === 'home') {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        return;
                    }
                    
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add scroll indicator animation
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const opacity = Math.max(0, 1 - scrolled / 300);
                scrollIndicator.style.opacity = opacity;
            });
        }
    }
}

// Additional Interactive Features
class InteractiveFeatures {
    constructor() {
        this.setupCursorTracker();
        this.setupTiltEffect();
        this.setupParallaxEffect();
        this.setupKeyboardNavigation();
    }

    setupCursorTracker() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(0, 212, 255, 0.3);
            border: 2px solid rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.background = 'rgba(0, 212, 255, 0.1)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'rgba(0, 212, 255, 0.3)';
            });
        });
    }

    setupTiltEffect() {
        const cards = document.querySelectorAll('.project-card, .skill-card, .timeline-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupKeyboardNavigation() {
        let currentSection = 0;
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && e.ctrlKey) {
                e.preventDefault();
                currentSection = Math.min(currentSection + 1, sections.length - 1);
                
                if (sections[currentSection] === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    document.getElementById(sections[currentSection]).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (e.key === 'ArrowUp' && e.ctrlKey) {
                e.preventDefault();
                currentSection = Math.max(currentSection - 1, 0);
                
                if (sections[currentSection] === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    document.getElementById(sections[currentSection]).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    new InteractiveFeatures();
    
    // Add error handling for missing elements
    console.log('✨ Portfolio website initialized successfully!');
});

// Add additional CSS for notification and cursor via JavaScript
const additionalStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .form-control.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.3) !important;
    }
    
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
    
    .project-card, .skill-card, .timeline-card {
        transition: transform 0.2s ease;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);