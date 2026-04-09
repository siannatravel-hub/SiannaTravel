// ============================================
// HERO CAROUSEL FUNCTIONALITY
// ============================================

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let autoPlayInterval;

// Show specific slide
function showSlide(index) {
    // Loop around if out of bounds
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.remove('active');
        if (i === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

// Next slide
function nextSlide() {
    showSlide(currentSlide + 1);
}

// Previous slide
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto play carousel
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Event listeners for carousel controls
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay(); // Restart auto play
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay(); // Restart auto play
    });
}

// Event listeners for indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        stopAutoPlay();
        startAutoPlay(); // Restart auto play
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    }
}

// Pause auto play on hover
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
}

// Start auto play when page loads
startAutoPlay();

// ============================================
// MOBILE MENU TOGGLE
// ============================================

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }
});

// Tabs functionality
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tab = btn.dataset.tab;
        console.log(`Tab seleccionado: ${tab}`);
        // Aquí puedes agregar lógica para mostrar diferentes formularios según el tab
    });
});

// Search Form Handler
const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const region = document.getElementById('region').value;
    const mes = document.getElementById('mes').value;
    
    if (!region) {
        alert('Por favor selecciona una región');
        return;
    }
    
    console.log('Búsqueda:', { region, mes });
    
    // Simular búsqueda
    alert(`Buscando tours en ${region}${mes ? ` para el mes ${mes}` : ''}...`);
    
    // Aquí normalmente harías una petición al servidor
    // fetch('/api/search', { method: 'POST', body: JSON.stringify({ region, mes }) })
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tour cards interaction
document.querySelectorAll('.btn-tour').forEach(btn => {
    btn.addEventListener('click', function() {
        const tourCard = this.closest('.tour-card');
        const tourTitle = tourCard.querySelector('h3').textContent;
        alert(`Más información sobre: ${tourTitle}`);
        // Aquí puedes redirigir a una página de detalles o abrir un modal
    });
});

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

const chatbot = document.getElementById('chatbot');
const chatbotLauncher = document.getElementById('chatbotLauncher');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotHeader = document.getElementById('chatbotHeader');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');

// Toggle chatbot visibility
chatbotLauncher.addEventListener('click', () => {
    chatbot.classList.add('active');
    chatbot.classList.remove('minimized');
    chatbotLauncher.classList.add('hidden');
    chatbotInput.focus();
});

// Minimize/Maximize chatbot
chatbotToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    chatbot.classList.toggle('minimized');
    const icon = chatbotToggle.querySelector('i');
    if (chatbot.classList.contains('minimized')) {
        icon.className = 'fas fa-plus';
    } else {
        icon.className = 'fas fa-minus';
    }
});

// Close chatbot when clicking header (only if not clicking toggle button)
chatbotHeader.addEventListener('click', (e) => {
    if (!chatbotToggle.contains(e.target)) {
        chatbot.classList.remove('active');
        chatbot.classList.remove('minimized');
        chatbotLauncher.classList.remove('hidden');
    }
});

// Chatbot message handler
chatbotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;
    
    // Add user message
    addMessage(userMessage, 'user');
    
    // Clear input
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = generateBotResponse(userMessage);
        addMessage(botResponse, 'bot');
    }, 1000 + Math.random() * 1000);
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Typing indicator
let typingIndicator = null;

function showTypingIndicator() {
    typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing-indicator';
    typingIndicator.innerHTML = '<p>Escribiendo...</p>';
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

// Generate bot response based on user input
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Respuestas sobre tours
    if (message.includes('tour') || message.includes('viaje') || message.includes('paquete')) {
        return '¡Tenemos tours increíbles! 🌍 ¿Te interesa alguna región en particular? Contamos con destinos en Europa, Asia, América y más. También tenemos promociones 2x1.';
    }
    
    // Respuestas sobre precios
    if (message.includes('precio') || message.includes('costo') || message.includes('cuanto') || message.includes('cuánto')) {
        return 'Nuestros precios varían según el destino y temporada. 💰 Tenemos tours desde $12,999 MXN. Puedes pagar hasta en 24 meses sin intereses. ¿Te gustaría ver algún destino específico?';
    }
    
    // Respuestas sobre promociones
    if (message.includes('promocion') || message.includes('promoción') || message.includes('oferta') || message.includes('descuento')) {
        return '¡Tenemos ofertas espectaculares! 🎉 2x1 en tours seleccionados, hasta 50% de descuento y financiamiento hasta 24 MSI. ¿Qué destino te interesa?';
    }
    
    // Respuestas sobre vuelos
    if (message.includes('vuelo') || message.includes('avion') || message.includes('avión')) {
        return '✈️ Ofrecemos vuelos a todos los destinos del mundo con las mejores tarifas. ¿A dónde quieres volar?';
    }
    
    // Respuestas sobre hoteles
    if (message.includes('hotel') || message.includes('hospedaje') || message.includes('alojamiento')) {
        return '🏨 Reservamos hoteles en todo el mundo. Desde opciones económicas hasta hoteles de lujo. ¿Tienes algún destino en mente?';
    }
    
    // Respuestas sobre seguros
    if (message.includes('seguro')) {
        return '🛡️ Contamos con seguros de viaje que te protegen en caso de cualquier eventualidad. ¿Necesitas más información sobre coberturas?';
    }
    
    // Respuestas sobre Europa
    if (message.includes('europa')) {
        return '🇪🇺 ¡Europa es maravillosa! Tenemos tours a España, Francia, Italia, Alemania y más. Nuestro tour "Europa Clásica" incluye 15 días visitando las principales ciudades. ¿Te interesa?';
    }
    
    // Respuestas sobre Japón/Asia
    if (message.includes('japon') || message.includes('japón') || message.includes('asia') || message.includes('tokio')) {
        return '🇯🇵 ¡Japón es increíble! Tenemos el tour "Japón Imperial" de 12 días que incluye Tokio, Kioto, Osaka y más. Precio desde $68,999. ¿Te gustaría más detalles?';
    }
    
    // Respuestas sobre Caribe
    if (message.includes('caribe') || message.includes('playa') || message.includes('cancun') || message.includes('cancún')) {
        return '🏖️ El Caribe es perfecto para descansar. Tenemos paquetes todo incluido desde $18,999 para 7 días. ¿Prefieres Cancún, Punta Cana o el Caribe colombiano?';
    }
    
    // Respuestas sobre México
    if (message.includes('mexico') || message.includes('méxico') || message.includes('nacional')) {
        return '🇲🇽 ¡Descubre México! Tenemos tours a Oaxaca, Chiapas, Yucatán y más. Desde $12,999. ¿Qué región te gustaría conocer?';
    }
    
    // Respuestas sobre contacto
    if (message.includes('contacto') || message.includes('telefono') || message.includes('teléfono') || message.includes('llamar')) {
        return '📞 Puedes contactarnos al (55) 54 82 82 82 o visitarnos en cualquiera de nuestras sucursales. ¿Necesitas la dirección de alguna sucursal?';
    }
    
    // Respuestas sobre sucursales
    if (message.includes('sucursal') || message.includes('oficina') || message.includes('direccion') || message.includes('dirección')) {
        return '🏢 Tenemos sucursales en toda la Ciudad de México y la República Mexicana. ¿De qué zona necesitas información?';
    }
    
    // Respuestas sobre el Mundo Joven Fest
    if (message.includes('fest') || message.includes('expo') || message.includes('evento')) {
        return '🎪 ¡No te pierdas el Sianna Travel Fest 2026! Los días 28 de febrero y 1 de marzo en el Centro Banamex. ¡Regístrate GRATIS! Habrá ofertas exclusivas.';
    }
    
    // Respuestas sobre financiamiento
    if (message.includes('msi') || message.includes('meses') || message.includes('pago') || message.includes('financiamiento')) {
        return '💳 ¡Puedes pagar tu viaje hasta en 24 meses sin intereses! Aceptamos todas las tarjetas de crédito participantes. ¿Te gustaría cotizar algún tour?';
    }
    
    // Respuestas sobre cruceros
    if (message.includes('crucero')) {
        return '🚢 ¡Los cruceros son una experiencia única! Tenemos opciones por el Caribe, Mediterráneo y más. ¿Te interesa alguna naviera en particular?';
    }
    
    // Respuestas sobre parques
    if (message.includes('parque') || message.includes('disney') || message.includes('universal')) {
        return '🎢 ¡Los parques temáticos son lo máximo! Tenemos paquetes a Disney, Universal, y más. ¿Para cuántas personas necesitas el paquete?';
    }
    
    // Respuestas sobre grupos
    if (message.includes('grupo') || message.includes('familia')) {
        return '👨‍👩‍👧‍👦 ¡Tenemos tarifas especiales para grupos! A partir de 10 personas obtienes descuentos adicionales. ¿Para cuántas personas es el viaje?';
    }
    
    // Respuestas de saludo
    if (message.includes('hola') || message.includes('buenos') || message.includes('buenas')) {
        return '¡Hola! 👋 Bienvenido a Sianna Travel. Estoy aquí para ayudarte a planear tu próximo viaje. ¿Qué destino te gustaría conocer?';
    }
    
    // Respuestas de agradecimiento
    if (message.includes('gracias')) {
        return '¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?';
    }
    
    // Respuestas de despedida
    if (message.includes('adios') || message.includes('adiós') || message.includes('hasta luego') || message.includes('bye')) {
        return '¡Hasta pronto! 👋 No dudes en contactarnos cuando quieras viajar. ¡Buen día!';
    }
    
    // Respuesta por defecto
    return 'Interesante pregunta. 🤔 Te recomiendo contactar a uno de nuestros asesores al (55) 54 82 82 82 para darte información más detallada. ¿Te gustaría saber sobre tours, vuelos, hoteles o seguros?';
}

// Add some sample quick responses
function addQuickResponses() {
    const quickResponsesDiv = document.createElement('div');
    quickResponsesDiv.className = 'quick-responses';
    quickResponsesDiv.innerHTML = `
        <p style="font-size: 12px; color: #9E9E9E; margin-bottom: 10px;">Respuestas rápidas:</p>
        <button class="quick-response-btn">Ver tours a Europa</button>
        <button class="quick-response-btn">Promociones actuales</button>
        <button class="quick-response-btn">Información de contacto</button>
    `;
    
    const firstMessage = chatbotMessages.querySelector('.message');
    if (firstMessage) {
        firstMessage.appendChild(quickResponsesDiv);
    }
    
    // Handle quick response clicks
    document.querySelectorAll('.quick-response-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            chatbotInput.value = this.textContent;
            chatbotForm.dispatchEvent(new Event('submit'));
        });
    });
}

// Initialize quick responses after a short delay
setTimeout(addQuickResponses, 500);

// Add styles for quick responses dynamically
const style = document.createElement('style');
style.textContent = `
    .quick-responses {
        margin-top: 10px;
    }
    
    .quick-response-btn {
        display: block;
        width: 100%;
        background-color: white;
        border: 1px solid var(--primary-blue, #4DADC9);
        color: var(--primary-blue, #4DADC9);
        padding: 8px 12px;
        margin-bottom: 8px;
        border-radius: 15px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    }
    
    .quick-response-btn:hover {
        background-color: var(--primary-blue, #4DADC9);
        color: white;
    }
`;
document.head.appendChild(style);

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        alert('🎉 ¡Código activado! Obtén un 5% de descuento adicional en tu próximo viaje. Código: KONAMI2026');
        konamiCode = [];
    }
});

// Log page load time for performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Página cargada en ${loadTime.toFixed(2)}ms`);
});

// Add animation on scroll for tour cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.tour-card').forEach(card => {
    observer.observe(card);
});

console.log('🌍 Sianna Travel - Website cargado correctamente');
console.log('💬 Chatbot activado y listo para ayudarte');
