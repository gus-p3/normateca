// Navigation functionality
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const buttons = document.querySelectorAll('.carousel-btn');
const totalSlides = slides.length;

function updateCarousel() {
    // Hide all slides first
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Show the active slide
    slides[currentSlide].classList.add('active');

    // Update navigation buttons
    buttons.forEach((btn, index) => {
        btn.classList.toggle('active', index === currentSlide);
    });
    
    // Update carousel track position for the new design
    const track = document.getElementById('carousel-track');
    const slideWidth = slides[0].offsetWidth + (parseFloat(window.getComputedStyle(slides[0]).marginLeft) * 2);
    track.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Auto-slide functionality
let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

carouselContainer.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
});

// Touch/swipe support for mobile
let startX = 0;
let isDragging = false;
let startTouchTime = 0;

carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startTouchTime = new Date().getTime();
    isDragging = true;
    clearInterval(autoSlideInterval);
});

carouselContainer.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const swipeTime = new Date().getTime() - startTouchTime;
    
    const minDistance = 50;
    const maxTime = 300;
    
    if (Math.abs(diffX) > minDistance && swipeTime < maxTime) {
        if (diffX > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
    
    isDragging = false;
    autoSlideInterval = setInterval(nextSlide, 5000);
});

// Initialize
updateCarousel();

// Modal functionality with fallback
const modal = document.getElementById('modal');
const modalIframe = document.getElementById('modal-iframe');
const closeModal = document.querySelector('.close');

// Lista de dominios que permiten iframe
const allowedIframeDomains = [
    'iso.org',
    'isaca.org',
    'nist.gov',
    'axelos.com'
];

function canUseIframe(url) {
    return allowedIframeDomains.some(domain => url.includes(domain));
}

function openFloatingWindow(url, title = 'Documento') {
    // Calcular posición centrada
    const width = Math.min(1200, window.screen.availWidth * 0.8);
    const height = Math.min(800, window.screen.availHeight * 0.8);
    const left = (window.screen.availWidth - width) / 2;
    const top = (window.screen.availHeight - height) / 2;
    
    // Configuración de la ventana flotante
    const windowFeatures = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'resizable=yes',
        'scrollbars=yes',
        'toolbar=no',
        'menubar=no',
        'location=yes',
        'status=yes'
    ].join(',');
    
    // Abrir ventana flotante
    const newWindow = window.open(url, title, windowFeatures);
    
    // Enfocar la ventana si se abrió correctamente
    if (newWindow) {
        newWindow.focus();
        showNotification(`${title} abierto en ventana flotante`);
    } else {
        showNotification('Por favor, permite ventanas emergentes para ver el documento', 'warning');
    }
    
    return newWindow;
}

document.querySelectorAll('.neon-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const url = e.target.closest('.neon-button').getAttribute('data-url');
        if (url) {
            // Verificar si el dominio permite iframe
            if (url.includes('gob.mx') || url.includes('diputados.gob.mx') || url.includes('wordpress.com') || url.includes('nqa.com')) {
                openFloatingWindow(url, 'Documento Legal');
            } else {
                modalIframe.src = url;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                showNotification('Documento cargado en ventana modal');
            }
        }
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalIframe.src = '';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalIframe.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Sistema de notificaciones mejorado
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Icono según el tipo
    let icon = '<i class="fas fa-info-circle"></i>';
    let bgColor = 'linear-gradient(45deg, rgba(0, 255, 255, 0.9), rgba(0, 150, 255, 0.9))';
    
    if (type === 'warning') {
        icon = '<i class="fas fa-exclamation-triangle"></i>';
        bgColor = 'linear-gradient(45deg, rgba(255, 195, 0, 0.9), rgba(255, 152, 0, 0.9))';
    } else if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
        bgColor = 'linear-gradient(45deg, rgba(0, 255, 150, 0.9), rgba(0, 200, 100, 0.9))';
    }
    
    notification.innerHTML = `${icon} ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: #000;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: bold;
        z-index: 3000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3.5s forwards;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Agregar estilos para la notificación
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification i {
        font-size: 1.2em;
    }
`;
document.head.appendChild(notificationStyle);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0s';
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        previousSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        modalIframe.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add scroll to top functionality
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 255, 255, 0.2);
    border: 2px solid #00ffff;
    color: #00ffff;
    padding: 15px;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    font-size: 18px;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.background = '#00ffff';
    scrollToTopBtn.style.color = '#000';
    scrollToTopBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.background = 'rgba(0, 255, 255, 0.2)';
    scrollToTopBtn.style.color = '#00ffff';
    scrollToTopBtn.style.boxShadow = 'none';
});

// Add particle effect (optional)
function createParticles() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    particles.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ffff;
            border-radius: 50%;
            animation: float ${Math.random() * 6 + 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        particles.appendChild(particle);
    }
    
    document.body.appendChild(particles);
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
        100% { transform: translateY(0px) rotate(360deg); }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles
createParticles();

// Console log for developers
console.log('%c🚀 Normateca Digital', 'color: #00ffff; font-size: 20px; font-weight: bold;');
console.log('%cDesarrollado por Brandon Mendoza & Gerardo Manzano - GIDS6072', 'color: #fff; font-size: 14px;');