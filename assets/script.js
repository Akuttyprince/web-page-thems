const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('.bg-gray-900').forEach(el => {
        el.classList.toggle('bg-gray-100', !isDark);
        el.classList.toggle('bg-gray-900', isDark);
    });
    document.querySelectorAll('.text-white').forEach(el => {
        el.classList.toggle('text-gray-900', !isDark);
        el.classList.toggle('text-white', isDark);
    });
};

const playSound = (type) => {
    const audio = new Audio(`assets/${type}.mp3`);
    audio.play().catch(() => console.log('Audio playback failed'));
};

const applyPageContent = (pageId, titleEl, descEl, wrapperEl, buttonEl) => {
    const content = JSON.parse(localStorage.getItem('pageContent') || '{}');
    const pageData = content[pageId] || {};
    if (titleEl) titleEl.textContent = pageData.title || `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Vibe`;
    if (descEl) descEl.textContent = pageData.desc || 'Default description';
    if (wrapperEl && pageData.bgImage) wrapperEl.style.backgroundImage = `url(${pageData.bgImage})`;
    if (buttonEl && pageData.buttonColor) buttonEl.style.backgroundColor = pageData.buttonColor;
    if (titleEl && pageData.animation) {
        titleEl.classList.remove('pulse', 'spin', 'bounce');
        titleEl.classList.add(pageData.animation);
        gsap.fromTo(titleEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.3)' });
    }
    if (pageData.particleType) initParticles(pageId, pageData.particleType);
};

const initParticles = (pageId, type) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById(`${pageId}-canvas`), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const particles = new THREE.Group();
    scene.add(particles);
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: type === 'hearts' ? 0xff69b4 : type === 'explosions' ? 0xff4500 : type === 'pixels' ? 0x00ff00 : 0xffff00 });

    function addParticle() {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        particles.add(mesh);
        gsap.to(mesh.position, { z: -5, duration: 2, onComplete: () => particles.remove(mesh) });
    }

    setInterval(addParticle, 200);
    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
};

const initCanvasBackground = (canvasId, type) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 2,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            color: type === 'stars' ? '#ffff00' : type === 'smoke' ? '#666666' : '#00ff00'
        });
    }

    function animateBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(animateBackground);
    }
    animateBackground();
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme + '-mode');
    if (savedTheme === 'light') {
        document.querySelectorAll('.bg-gray-900').forEach(el => el.classList.add('bg-gray-100'));
        document.querySelectorAll('.text-white').forEach(el => el.classList.add('text-gray-900'));
    }
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => playSound('click'));
    });
});