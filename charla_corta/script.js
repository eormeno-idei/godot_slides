// Variables para manejar los slides
const slides = document.querySelectorAll('.slide');
const index = document.getElementById('index');
let currentSlide = 0;
const totalSlides = slides.length;

// Estructura de navegación de slides
const slideStructure = [
    { id: 'index', prev: null, next: 'slide1' },
    { id: 'slide1', prev: 'index', next: 'slide2' },
    { id: 'slide2', prev: 'slide1', next: 'slide3' },
    { id: 'slide3', prev: 'slide2', next: 'slide3.1' },
    { id: 'slide3.1', prev: 'slide3', next: 'slide4' },
    { id: 'slide4', prev: 'slide3.1', next: 'slide5' },
    { id: 'slide5', prev: 'slide4', next: 'slide7' },
    { id: 'slide7', prev: 'slide5', next: null }];

// Función para encontrar la posición actual en la estructura
function getCurrentSlideIndex() {
    // Busca el slide actual por ID directo ya que podemos tener IDs especiales como "slide3.1"
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) {
        return 0; // Si no hay slide activo, asumimos que es el índice
    }
    
    const activeSlideId = activeSlide.id;
    return slideStructure.findIndex(item => item.id === activeSlideId);
}

// Código para suprimir el mensaje de advertencia sobre cookies
(function suppressCookieWarnings() {
    const originalConsoleWarn = console.warn;
    console.warn = function (...args) {
        if (args.length > 0 && typeof args[0] === 'string' &&
            (args[0].includes('third-party cookies') ||
                args[0].includes('moving towards a new experience'))) {
            return; // Suprimir este mensaje específico
        }
        originalConsoleWarn.apply(console, args);
    };
})();

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
    } else {
        currentSlide = 0; // Para el índice
    }

    // Actualiza botones de navegación basados en la estructura
    updateNavigationButtons(id);

    initImageClickHandlers();
}

// Función para actualizar los botones de navegación
function updateNavigationButtons(currentId) {
    // Encuentra la posición en la estructura
    const slideInfo = slideStructure.find(item => item.id === currentId);

    if (!slideInfo) return; // Si no se encuentra en la estructura

    // Obtener todos los botones de navegación
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    // Actualizar visibilidad de botones según la estructura
    nextButtons.forEach(btn => {
        btn.style.display = slideInfo.next ? 'block' : 'none';
    });

    prevButtons.forEach(btn => {
        btn.style.display = slideInfo.prev ? 'block' : 'none';
    });
}

// Función para navegar al slide anterior
function prevSlide() {
    const currentIndex = getCurrentSlideIndex();
    if (currentIndex > 0) {
        const prevSlideId = slideStructure[currentIndex].prev;
        showSlide(prevSlideId);
    }
}

// Función para navegar al slide siguiente
function nextSlide() {
    const currentIndex = getCurrentSlideIndex();
    if (currentIndex >= 0 && currentIndex < slideStructure.length - 1) {
        const nextSlideId = slideStructure[currentIndex].next;
        showSlide(nextSlideId);
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


    // For regular images
    const fullImg = document.createElement('img');
    fullImg.src = src;
    fullImg.alt = alt || 'Fullscreen image';
    overlay.appendChild(fullImg);

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    // closeBtn.setAttribute('aria-label', 'Close fullscreen image');

    // Add close button to overlay
    overlay.appendChild(closeBtn);

    // Add overlay to body
    document.body.appendChild(overlay);

    // Make overlay visible with a small delay for transition effect
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);

    // Add click event to close button with stopPropagation
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        closeFullscreenImage(overlay);
    });

    // Also close on overlay click (but not image click)
    overlay.addEventListener('click', function (e) {
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
document.addEventListener('DOMContentLoaded', function () {
    // Iniciar la presentación mostrando el índice
    showSlide('index');

    // Inicializa los manejadores de imágenes
    initImageClickHandlers();

    // Inicializa la estructura de navegación
    initSlideStructure();
});

// Función para inicializar la estructura de slides
function initSlideStructure() {
    // Verifica que todos los slides en la estructura existan en el DOM
    slideStructure.forEach(item => {
        const slide = document.getElementById(item.id);
        if (!slide && item.id !== 'index') {
            console.warn(`Advertencia: El slide "${item.id}" está en la estructura pero no existe en el DOM`);
        }
    });
}