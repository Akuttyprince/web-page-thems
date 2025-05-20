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