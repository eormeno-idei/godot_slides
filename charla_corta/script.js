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
    initGifControls();
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
    
    // Create image or gif container
    if (src.toLowerCase().endsWith('.gif')) {
        // For GIFs, create a container with controls
        const gifContainer = document.createElement('div');
        gifContainer.className = 'gif-container';
        
        const fullImg = document.createElement('img');
        fullImg.src = src;
        fullImg.alt = alt || 'Fullscreen image';
        fullImg.setAttribute('data-original-src', src);
        
        // Create controls
        const controls = createGifControls(fullImg);
        
        gifContainer.appendChild(fullImg);
        gifContainer.appendChild(controls);
        overlay.appendChild(gifContainer);
    } else {
        // For regular images
        const fullImg = document.createElement('img');
        fullImg.src = src;
        fullImg.alt = alt || 'Fullscreen image';
        overlay.appendChild(fullImg);
    }
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close fullscreen image');
    
    // Add close button to overlay
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
    initGifControls();
});

// Function to initialize GIF controls
function initGifControls() {
    // Find all GIF images in slides
    const gifImages = document.querySelectorAll('.slide-image img[src$=".gif"]');
    
    gifImages.forEach(img => {
        // Create container for the GIF
        const container = document.createElement('div');
        container.className = 'gif-container';
        
        // Clone the image
        const imgClone = img.cloneNode(true);
        imgClone.setAttribute('data-original-src', img.src);
        
        // Create controls
        const controls = createGifControls(imgClone);
        
        // Replace the image with the container
        container.appendChild(imgClone);
        container.appendChild(controls);
        img.parentNode.replaceChild(container, img);
    });
}

// Function to create GIF controls
function createGifControls(imgElement) {
    const controls = document.createElement('div');
    controls.className = 'gif-controls';
    
    // Play button
    const playBtn = document.createElement('button');
    playBtn.className = 'gif-btn play-btn';
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.setAttribute('aria-label', 'Play GIF');
    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        playGif(imgElement);
    });
    
    // Pause button
    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'gif-btn pause-btn';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    pauseBtn.setAttribute('aria-label', 'Pause GIF');
    pauseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        pauseGif(imgElement);
    });
    
    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'gif-btn reset-btn';
    resetBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
    resetBtn.setAttribute('aria-label', 'Reset GIF');
    resetBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        resetGif(imgElement);
    });
    
    // Add buttons to controls
    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(resetBtn);
    
    return controls;
}

// Function to play a GIF
function playGif(imgElement) {
    const originalSrc = imgElement.getAttribute('data-original-src');
    if (imgElement.src !== originalSrc) {
        imgElement.src = originalSrc;
    }
}

// Function to pause a GIF
function pauseGif(imgElement) {
    const originalSrc = imgElement.getAttribute('data-original-src');
    if (imgElement.src === originalSrc) {
        // Create a canvas to capture the current frame
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        context.drawImage(imgElement, 0, 0);
        
        // Replace GIF with the static image
        imgElement.src = canvas.toDataURL('image/png');
    }
}

// Function to reset a GIF (restart from beginning)
function resetGif(imgElement) {
    const originalSrc = imgElement.getAttribute('data-original-src');
    imgElement.src = 'about:blank';
    setTimeout(() => {
        imgElement.src = originalSrc;
    }, 10);
}

// Add this to your existing showSlide function to handle dynamic content
// This ensures images in newly displayed slides also have click handlers
const originalShowSlide = window.showSlide;
window.showSlide = function(slideId) {
    if (typeof originalShowSlide === 'function') {
        originalShowSlide(slideId);
    } else {
        // Hide all slides
        document.querySelectorAll('#presentation > section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the requested slide
        document.getElementById(slideId).classList.add('active');
        
        // Update the current slide index if it's a slide
        if (slideId !== 'index') {
            // Extract the number from the slide id (e.g. 'slide1' -> 1)
            currentSlide = parseInt(slideId.replace('slide', ''));
        }
    }
    
    initImageClickHandlers();
    initGifControls();
};