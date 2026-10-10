function toggleProject(card) {
    card.classList.toggle('active');
}

function switchPage(pageId) {
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Toggle floating skill logos canvas only for Skills page
    const skillsCanvas = document.getElementById('skills-canvas');
    if (pageId === 'skills') {
        skillsCanvas.style.display = 'block';
    } else {
        skillsCanvas.style.display = 'none';
    }

    window.scrollTo(0, 0);
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.add('hidden');
}

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Background Particle Canvas (Standard Network background)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 65;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
init();

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) {
                ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 - distance / 1300})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

// Canvas for Floating Skill Logos with Strict Window Containment
const sCanvas = document.getElementById('skills-canvas');
const sCtx = sCanvas.getContext('2d');

function resizeSkillsCanvas() {
    sCanvas.width = window.innerWidth;
    sCanvas.height = window.innerHeight;
}
resizeSkillsCanvas();
window.addEventListener('resize', resizeSkillsCanvas);

// Unique List of Logos (Each logo appears exactly once)
const logoUrls = [
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ansible/ansible-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grafana/grafana-original.svg'
];

const loadedImages = [];
logoUrls.forEach(url => {
    const img = new Image();
    img.src = url;
    loadedImages.push(img);
});

class FloatingSVGLogo {
    constructor(img) {
        this.img = img;
        this.size = 42;
        this.x = Math.random() * (sCanvas.width - 100) + 50;
        this.y = Math.random() * (sCanvas.height - 100) + 50;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
        this.opacity = 0.22;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const padding = 10;
        if (this.x <= padding) {
            this.x = padding;
            this.speedX *= -1;
        } else if (this.x >= sCanvas.width - this.size - padding) {
            this.x = sCanvas.width - this.size - padding;
            this.speedX *= -1;
        }

        if (this.y <= padding + 80) {
            this.y = padding + 80;
            this.speedY *= -1;
        } else if (this.y >= sCanvas.height - this.size - padding - 40) {
            this.y = sCanvas.height - this.size - padding - 40;
            this.speedY *= -1;
        }
    }
    draw() {
        if (this.img.complete && this.img.naturalWidth !== 0) {
            sCtx.globalAlpha = this.opacity;
            sCtx.drawImage(this.img, this.x, this.y, this.size, this.size);
            sCtx.globalAlpha = 1.0;
        }
    }
}

let floatingSVGArray = [];
function initFloatingSVGLogos() {
    floatingSVGArray = [];
    loadedImages.forEach(img => {
        floatingSVGArray.push(new FloatingSVGLogo(img));
    });
}
initFloatingSVGLogos();

function handleCollisions() {
    for (let i = 0; i < floatingSVGArray.length; i++) {
        for (let j = i + 1; j < floatingSVGArray.length; j++) {
            let logoA = floatingSVGArray[i];
            let logoB = floatingSVGArray[j];

            let dx = logoB.x - logoA.x;
            let dy = logoB.y - logoA.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let minDistance = logoA.size + 15;

            if (distance < minDistance) {
                let tempX = logoA.speedX;
                let tempY = logoA.speedY;
                logoA.speedX = logoB.speedX;
                logoA.speedY = logoB.speedY;
                logoB.speedX = tempX;
                logoB.speedY = tempY;

                let overlap = minDistance - distance;
                let angle = Math.atan2(dy, dx);
                logoA.x -= Math.cos(angle) * overlap * 0.5;
                logoA.y -= Math.sin(angle) * overlap * 0.5;
                logoB.x += Math.cos(angle) * overlap * 0.5;
                logoB.y += Math.sin(angle) * overlap * 0.5;
            }
        }
    }
}

function animateFloatingSVGLogos() {
    sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
    handleCollisions();
    for (let i = 0; i < floatingSVGArray.length; i++) {
        floatingSVGArray[i].update();
        floatingSVGArray[i].draw();
    }
    requestAnimationFrame(animateFloatingSVGLogos);
}
animateFloatingSVGLogos();