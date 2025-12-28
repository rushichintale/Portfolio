// script.js
window.addEventListener('load', function() {
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        if (loader) loader.classList.add('hidden');
    }, 2000);
});

document.addEventListener('DOMContentLoaded', function() {
    // Custom Cursor with Spring Physics
    const cursor = document.querySelector('.cursor');
    const glow = document.querySelector('.glow');
    
    if (!cursor || !glow) return;

    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    let velX = 0, velY = 0;
    const particleColors = ['#6c5ce7', '#fd79a8', '#00cec9', '#a29bfe', '#ffeaa7'];
    const spring = 0.2;
    const friction = 0.85;

    // Mouse move event for cursor and particles
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        createParticles(mouseX, mouseY);
        
        if(Math.random() > 0.7) {
            createSparkle(mouseX, mouseY);
        }
    });

    // Mouse click effect
    document.addEventListener('mousedown', function() {
        cursor.classList.add('click');
        createSparkleBurst(mouseX, mouseY);
    });

    document.addEventListener('mouseup', function() {
        cursor.classList.remove('click');
    });

    function createParticles(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 3;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            --random-x: ${randomX}px;
            --random-y: ${randomY}px;
            left: ${x}px;
            top: ${y}px;
            animation-duration: ${Math.random() * 3 + 2}s;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    function createSparkleBurst(x, y) {
        for(let i = 0; i < 8; i++) {
            setTimeout(() => {
                createSparkle(
                    x + (Math.random() - 0.5) * 30,
                    y + (Math.random() - 0.5) * 30
                );
            }, i * 50);
        }
    }

    // Active state for cursor
    const interactiveElements = document.querySelectorAll('a, button, .hamburger, .nav-links li, .mobile-links li, .logo-container');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            if (glow) glow.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            if (glow) glow.style.opacity = '0';
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('toggle');
            mobileMenu.classList.toggle('active');
            const rect = hamburger.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width/2, rect.top + rect.height/2);
        });
    }

    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('toggle');
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('toggle');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        updateActiveSection();
    });
    
    // Smooth scrolling
    document.querySelectorAll('.nav-links a, .mobile-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                    setTimeout(updateActiveSection, 1000);
                }
            }
        });
    });
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a, .mobile-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        const rect = link.getBoundingClientRect();
                        createSparkleBurst(rect.left + rect.width/2, rect.top + rect.height/2);
                    }
                });
            }
        });
    }
    
    updateActiveSection();
    createFloatingParticles();
    
    // Spring-based cursor animation
    function animateCursor() {
        const dx = mouseX - posX;
        const dy = mouseY - posY;
        
        velX += dx * spring;
        velY += dy * spring;
        
        velX *= friction;
        velY *= friction;
        
        posX += velX;
        posY += velY;
        
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
        
        if (glow) {
            glow.style.left = `${posX - 50}px`;
            glow.style.top = `${posY - 50}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Create background particles
    function createParticlesBackground() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        const particleCount = 25;
        const colors = ['#6c5ce7', '#fd79a8', '#00cec9', '#a29bfe', '#ffeaa7'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 15 + 8;
            const posX = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 10 + Math.random() * 20;
            const colorIndex = Math.floor(Math.random() * 5);
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}vw;
                background: ${colors[colorIndex]};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;
            
            container.appendChild(particle);
        }
    }

    function createFloatingParticles() {
        const container = document.getElementById('floatingParticles');
        if (!container) return;
        
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 20 + 10;
            const posX = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 10 + Math.random() * 20;
            const colorIndex = Math.floor(Math.random() * particleColors.length);
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}vw;
                background: ${particleColors[colorIndex]};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;
            
            container.appendChild(particle);
        }
    }

    // 3D tilt effect for profile image
    const imageWrapper = document.querySelector('.image-wrapper');
    const imageInner = document.querySelector('.image-inner');
    
    if (imageWrapper && imageInner) {
        imageWrapper.addEventListener('mousemove', (e) => {
            const rect = imageWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const xAxis = (centerX - x) / 20;
            const yAxis = (centerY - y) / 20;
            
            imageInner.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        imageWrapper.addEventListener('mouseenter', () => {
            imageInner.style.transition = 'none';
            const profileImage = document.querySelector('.profile-image');
            if (profileImage) profileImage.style.transform = 'translateZ(40px)';
            const borderAnim = document.querySelector('.image-border-animation');
            if (borderAnim) borderAnim.style.animationPlayState = 'paused';
        });
        
        imageWrapper.addEventListener('mouseleave', () => {
            imageInner.style.transition = 'transform 0.5s ease';
            imageInner.style.transform = 'rotateY(0) rotateX(0)';
            const profileImage = document.querySelector('.profile-image');
            if (profileImage) profileImage.style.transform = 'translateZ(30px)';
            const borderAnim = document.querySelector('.image-border-animation');
            if (borderAnim) borderAnim.style.animationPlayState = 'running';
        });
    }
    
    // Simple image hover effect
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        aboutImage.addEventListener('mouseenter', () => {
            const img = aboutImage.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        });
        
        aboutImage.addEventListener('mouseleave', () => {
            const img = aboutImage.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
        });
    }

    // Initialize
    createParticlesBackground();
});



 document.addEventListener('DOMContentLoaded', function() {
            // Enhanced 3D Hover Effect
            const educationCards = document.querySelectorAll('.education-card');
            
            educationCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const angleX = (y - centerY) / 30;
                    const angleY = (centerX - x) / 30;
                    
                    card.style.transform = `perspective(1200px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
                    card.style.boxShadow = `0 25px 50px rgba(108, 92, 231, 0.3)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
                    card.style.boxShadow = '0 15px 40px rgba(108, 92, 231, 0.15)';
                });
            });

            // Scroll Animation
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.education-card').forEach(card => {
                card.style.opacity = "0";
                card.style.transform = "translateY(50px)";
                card.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                observer.observe(card);
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
    // Animate progress bars on scroll
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const value = bar.getAttribute('data-value');
            bar.style.width = value + '%';
        });
    }

    // 3D hover effect for skill card
    const skillCard = document.querySelector('.skill-category');
    
    if (skillCard) {
        skillCard.addEventListener('mousemove', (e) => {
            const rect = skillCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            skillCard.style.transform = `translateY(-10px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            skillCard.style.boxShadow = '0 30px 70px rgba(108, 92, 231, 0.3)';
        });
        
        skillCard.addEventListener('mouseleave', () => {
            skillCard.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            skillCard.style.boxShadow = '0 20px 50px rgba(108, 92, 231, 0.2)';
        });
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBars();
                }
            }
        });
    }, { threshold: 0.1 });

    // Observe skill card and progress bars
    document.querySelectorAll('.skill-category, .progress-bar').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        observer.observe(el);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // 3D tilt effect for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `translateY(-10px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            card.style.boxShadow = '0 30px 70px rgba(108, 92, 231, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
            card.style.boxShadow = '0 20px 50px rgba(108, 92, 231, 0.2)';
        });
    });

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    // Observe all project cards
    document.querySelectorAll('.project-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        observer.observe(el);
    });

   

    // Infinite scroll reset
    const track = document.querySelector('.projects-track');
    track.addEventListener('animationiteration', () => {
        // This ensures smooth continuous scrolling
    });

        // Simple typing effect
        document.addEventListener('DOMContentLoaded', function() {
            const texts = ['Web Developer', 'Programmer', 'Problem Solver'];
            let count = 0;
            let index = 0;
            let currentText = '';
            let letter = '';
            
            function type() {
                if (count === texts.length) {
                    count = 0;
                }
                currentText = texts[count];
                letter = currentText.slice(0, ++index);
                
                document.querySelector('.typing-text').textContent = letter;
                if (letter.length === currentText.length) {
                    setTimeout(erase, 1500);
                } else {
                    setTimeout(type, 100);
                }
            }
            
            function erase() {
                letter = currentText.slice(0, --index);
                document.querySelector('.typing-text').textContent = letter;
                if (letter.length === 0) {
                    count++;
                    index = 0;
                    setTimeout(type, 500);
                } else {
                    setTimeout(erase, 50);
                }
            }
            
            // Start the typing effect
            type();
        });
});
