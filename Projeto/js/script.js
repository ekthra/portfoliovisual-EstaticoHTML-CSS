// Smooth scrolling with offset for fixed header
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const headerOffset = 100;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Enhanced carousel functionality
const carousel = document.querySelector('.carousel');
let isDown = false;
let startX;
let scrollLeft;
let scrollTimeout;

// Touch events for mobile
carousel.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('touchend', () => {
    isDown = false;
});

carousel.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
});

// Mouse events for desktop
carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
});

carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
});

// Auto-scroll pause on hover
carousel.addEventListener('mouseenter', () => {
    clearTimeout(scrollTimeout);
});

// Enhanced lightbox with keyboard controls
function createLightbox(img) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="${img.src}" alt="${img.alt}">
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Show lightbox
    setTimeout(() => lightbox.classList.add('active'), 10);

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => lightbox.remove(), 300);
    };

    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard controls
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Initialize lightbox for all images
document.querySelectorAll('.feedbacks-gallery img, .carousel-item img').forEach(img => {
    img.addEventListener('click', () => createLightbox(img));
});

// Enhanced scroll animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with staggered animation
document.querySelectorAll('.services, .contact-info, .feedbacks, .carousel-item').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// Smooth scroll progress indicator
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

// Variable to prevent multiple highlightNavItem calls on a single scroll event
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
            
            highlightNavItem();

            ticking = false;
        });
        ticking = true;
    }
});

// Image loading management with fade effect
document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
});

// Active menu item highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function highlightNavItem() {
    const scrollY = window.pageYOffset;
    const headerOffset = 100;
    let activeSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollY >= sectionTop - 100 && scrollY < sectionBottom - 100) {
            activeSectionId = section.getAttribute('id');
        }
    });
    
    if (scrollY < 100) {
        activeSectionId = 'sobre';
    }

    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        activeSectionId = 'contato';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', highlightNavItem);
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            highlightNavItem();
            ticking = false;
        });
        ticking = true;
    }
}); 