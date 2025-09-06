document.addEventListener('DOMContentLoaded', () => {

    // === Custom Cursor Logic ===
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-dot-outline");
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
    });

    // === Dynamic Constellation Background ===
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resizeCanvas();
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.01;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        const initParticles = () => {
            particles = [];
            let numParticles = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numParticles; i++) particles.push(new Particle());
        };
        initParticles();
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(); particles[i].draw();
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(148, 163, 184, ${1 - distance / 120})`;
                        ctx.lineWidth = 0.3;
                        ctx.moveTo(particles[i].x, particles[j].y); ctx.lineTo(particles[j].x, particles[i].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    }

    // === Navbar & Mobile Menu Logic ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('bg-background/80', window.scrollY > 50);
        navbar.classList.toggle('backdrop-blur-lg', window.scrollY > 50);
    });
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    const toggleMobileMenu = () => {
        mobileMenu.classList.toggle('right-[-100%]');
        mobileMenu.classList.toggle('right-0');
        document.body.classList.toggle('overflow-hidden');
    };
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));

    // === Terminal Typing Animation ===
    const typeText = (element, cursorElement, text, delay = 100, cursorDelay = 500) => {
        let i = 0;
        if (!element || !cursorElement) return;
        element.textContent = '';
        cursorElement.style.opacity = 1; // Show cursor
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i); i++;
            } else {
                clearInterval(typingInterval);
                cursorElement.style.animation = 'blink 1s step-end infinite'; // Start blinking
            }
        }, delay);
    };

    let typingTimeout1, typingTimeout2, typingTimeout3;

    const startTerminalAnimations = () => {
        // Reset before starting
        document.getElementById('cmd1').textContent = '';
        document.getElementById('cmd2').textContent = '';
        document.getElementById('cmd3').textContent = '';
        document.getElementById('cursor1').style.animation = 'none';
        document.getElementById('cursor2').style.animation = 'none';
        document.getElementById('cursor3').style.animation = 'none';

        clearTimeout(typingTimeout1);
        clearTimeout(typingTimeout2);
        clearTimeout(typingTimeout3);

        typingTimeout1 = setTimeout(() => typeText(document.getElementById('cmd1'), document.getElementById('cursor1'), 'php artisan serve --port=8080'), 1000);
        typingTimeout2 = setTimeout(() => typeText(document.getElementById('cmd2'), document.getElementById('cursor2'), 'git add . && git commit -m "feat: new interactive about section"'), 2500);
        typingTimeout3 = setTimeout(() => typeText(document.getElementById('cmd3'), document.getElementById('cursor3'), 'npm run deploy-prod --branch=main'), 4500);
    };

    // Trigger terminal animation when "About" section is visible
    const aboutSection = document.getElementById('about');
    let terminalAnimationStarted = false;
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !terminalAnimationStarted) {
                startTerminalAnimations();
                terminalAnimationStarted = true;
            } else if (!entry.isIntersecting && terminalAnimationStarted) {
                // Optionally reset or stop if user scrolls away
                // terminalAnimationStarted = false; 
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of about section is visible
    terminalObserver.observe(aboutSection);


    // === Scroll Reveal Animation ===
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });

    // === Parallax Effect for Images in About Section ===
    const parallaxImages = document.querySelectorAll('.parallax-img');
    window.addEventListener('scroll', () => {
        parallaxImages.forEach(img => {
            const speed = parseFloat(img.getAttribute('data-speed'));
            const rect = img.getBoundingClientRect();
            const yOffset = (window.innerHeight - rect.top) * speed * 0.1; // Adjust multiplier for intensity
            img.style.transform = `translateY(${yOffset}px) ${img.style.transform.replace(/translateY\(.*?px\)/, '')}`;
        });
    });


    // === Dynamic Content Injection ===
    const skills = [
        { name: 'Laravel', icon: 'fab fa-laravel' }, { name: 'PHP', icon: 'fab fa-php' },
        { name: 'MySQL', icon: 'fas fa-database' }, { name: 'PostgreSQL', icon: 'fas fa-database' },
        { name: 'Git & GitHub', icon: 'fab fa-git-alt' }, { name: 'JavaScript', icon: 'fab fa-js' },
        { name: 'API Design', icon: 'fas fa-code' }, { name: 'Synology NAS', icon: 'fas fa-server' },
        { name: 'Figma', icon: 'fab fa-figma' }, { name: 'Bootstrap', icon: 'fab fa-bootstrap' },
    ];
    const skillsContainer = document.querySelector('#skills .grid');
    if (skillsContainer) {
        skills.forEach(skill => {
            const skillEl = document.createElement('div');
            skillEl.className = 'reveal interactive-card bg-surface p-6 rounded-xl border border-border-color text-center group transition-all duration-300 hover:border-primary/50 hover:-translate-y-2';
            skillEl.innerHTML = `<i class="${skill.icon} text-5xl mb-4 text-primary"></i><h3 class="text-xl font-semibold text-text-heading">${skill.name}</h3>`;
            skillsContainer.appendChild(skillEl);
        });
    }
    const workGrid = document.getElementById('workGrid');
    if (workGrid && typeof projects !== 'undefined') {
        projects.forEach((project, index) => {
            const isReversed = index % 2 !== 0;
            const projectElement = document.createElement('div');
            projectElement.className = `reveal grid md:grid-cols-2 gap-8 md:gap-12 items-center`;
            projectElement.innerHTML = `
                <a href="project-detail.html?id=${index}" class="block group overflow-hidden rounded-lg shadow-2xl interactive-card ${isReversed ? 'md:order-2' : ''}">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out">
                </a>
                <div class="${isReversed ? 'md:order-1' : ''}">
                    <h3 class="text-2xl md:text-3xl font-bold text-text-heading mb-4">${project.title}</h3>
                    <p class="text-lg text-text-body mb-6">${project.description}</p>
                    <div class="flex flex-wrap gap-3 mb-6">
                        ${project.tech.map(tech => `<span class="bg-surface text-secondary text-sm px-4 py-1 rounded-full font-medium border border-border-color">${tech}</span>`).join('')}
                    </div>
                    <a href="project-detail.html?id=${index}" class="text-primary font-semibold text-lg group">
                        View Details <i class="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform"></i>
                    </a>
                </div>
            `;
            workGrid.appendChild(projectElement);
        });
    }

    // Add observer and interactive glow to all new elements
    document.querySelectorAll('.reveal:not(.animate-fade-in-up)').forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        const glowDiv = document.createElement('div');
        glowDiv.className = "card-glow";
        card.appendChild(glowDiv);
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
    });
    const style = document.createElement('style');
    style.innerHTML = `
        .interactive-card .card-glow {
            content: ''; position: absolute; left: var(--mouse-x, 0); top: var(--mouse-y, 0);
            transform: translate(-50%, -50%); width: 300px; height: 300px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(217, 70, 239, 0) 70%);
            pointer-events: none; opacity: 0; transition: opacity 0.3s ease-out;
        }
        .interactive-card:hover .card-glow { opacity: 1; }
    `;
    document.head.appendChild(style);
});