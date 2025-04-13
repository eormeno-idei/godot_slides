// Variables para manejar los slides
const slides = document.querySelectorAll('.slide');
const index = document.getElementById('index');
let currentSlide = 0;
const totalSlides = slides.length;

// Función para mostrar un slide específico
function showSlide(id) {
    // Oculta todos los slides y el índice
    document.querySelectorAll('#presentation > section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Muestra el slide o índice solicitado
    document.getElementById(id).classList.add('active');
    
    // Actualiza el índice actual si es un slide
    if (id !== 'index') {
        // Extrae el número del slide del id (por ejemplo, 'slide1' -> 1)
        currentSlide = parseInt(id.replace('slide', ''));
    }
    initImageClickHandlers();
}

// If showSlide isn't defined elsewhere, define it here
if (typeof window.showSlide !== 'function') {
    window.showSlide = function(slideId) {
        // Hide all slides
        document.querySelectorAll('.slide, #index').forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show the requested slide
        document.getElementById(slideId).classList.add('active');
    };
}

// Función para navegar al slide anterior
function prevSlide() {
    if (currentSlide > 1) {
        showSlide('slide' + (currentSlide - 1));
    } else {
        // Si estamos en el primer slide, volvemos al índice
        showSlide('index');
    }
}

// Función para navegar al slide siguiente
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide('slide' + (currentSlide + 1));
    } else {
        // Si estamos en el último slide, volvemos al índice
        showSlide('index');
    }
}

// Escuchar eventos de teclado para navegación
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        // Flecha derecha o espacio para avanzar
        if (document.getElementById('index').classList.contains('active')) {
            showSlide('slide1'); // Del índice al primer slide
        } else {
            nextSlide();
        }
    } else if (e.key === 'ArrowLeft') {
        // Flecha izquierda para retroceder
        if (!document.getElementById('index').classList.contains('active')) {
            prevSlide();
        }
    } else if (e.key === 'Escape' || e.key === 'Home') {
        // Tecla escape o inicio para volver al índice
        showSlide('index');
    }
});

// Iniciar la presentación mostrando el índice
document.addEventListener('DOMContentLoaded', () => {
    showSlide('index');
});

// Function to initialize image click handlers
function initImageClickHandlers() {
    // Get all slide images
    const slideImages = document.querySelectorAll('.slide-image img');
    
    // Add click event to each image
    slideImages.forEach(img => {
        // Remove existing click handlers to prevent duplicates
        img.removeEventListener('click', imageClickHandler);
        // Add click event
        img.addEventListener('click', imageClickHandler);
    });
}

// Handler function for image clicks
function imageClickHandler() {
    showFullscreenImage(this.src, this.alt);
}

// Function to create and show fullscreen image
function showFullscreenImage(src, alt) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    
    // Create image
    const fullImg = document.createElement('img');
    fullImg.src = src;
    fullImg.alt = alt || 'Fullscreen image';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close fullscreen image');
    
    // Add elements to overlay
    overlay.appendChild(fullImg);
    overlay.appendChild(closeBtn);
    
    // Add overlay to body
    document.body.appendChild(overlay);
    
    // Make overlay visible with a small delay for transition effect
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // Add click event to close button with stopPropagation
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        closeFullscreenImage(overlay);
    });
    
    // Also close on overlay click (but not image click)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeFullscreenImage(overlay);
        }
    });
    
    // Add ESC key handler
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeFullscreenImage(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// Function to close fullscreen image
function closeFullscreenImage(overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 300); // Match transition duration
}

// Initialize image handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImageClickHandlers();
});