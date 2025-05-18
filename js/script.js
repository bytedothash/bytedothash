// Initialize Feather Icons
feather.replace();

// Section switching with slide animation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // e.g., "profile"
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section
        const targetSection = document.getElementById(targetId);
        targetSection.classList.add('active');
    });
});

// Show the profile section by default
document.getElementById('profile').classList.add('active');

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'light') {
    themeIcon.setAttribute('data-feather', 'sun');
} else {
    themeIcon.setAttribute('data-feather', 'moon');
}
feather.replace();

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Update theme
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    themeIcon.setAttribute('data-feather', newTheme === 'light' ? 'sun' : 'moon');
    feather.replace();
});

// Particle Background Animation (matching https://codepen.io/yuanfux/pen/mGQRXa)
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particlesArray = [];
const numberOfParticles = 150; // Match the CodePen's density
let mouse = {
    x: null,
    y: null,
    radius: 150 // Radius of mouse influence
};

// Mouse movement tracking
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Clear mouse position when mouse leaves the window
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Dot size between 1 and 3
        this.baseX = this.x; // Base position for mouse attraction
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1; // Affects speed of movement
        this.speedX = Math.random() * 3 - 1.5; // Random speed between -1.5 and 1.5
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        // Handle mouse attraction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance; // Closer = stronger force
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius && mouse.x !== null && mouse.y !== null) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Return to base position if not influenced by mouse
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20; // Smoothly return to base
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }

        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray.length = 0; // Clear existing particles
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    let maxDistance = 120; // Match CodePen's connection distance
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();