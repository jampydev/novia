


// =============================================
// FUNCIONES PRINCIPALES
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Configurar fecha de inicio
    setStartDate('2024-03-01'); // Cambia esta fecha por tu fecha real
    
    // 2. Crear efecto de corazones flotantes
    createFloatingHearts(25); // 25 corazones
    
    // 3. Configurar animaciones del timeline
    setupTimelineAnimation();
    
    // 4. Configurar el sobre interactivo con efecto de escritura
    setupInteractiveEnvelope();
    
    // 5. Iniciar el countdown
    setupCountdown();
    
    // 6. Configurar mapa (si existe)
    setupMapIfExists();
});








// =============================================
// FUNCIONES ESPECÍFICAS
// =============================================

function setStartDate(dateString) {
    const startDate = new Date(dateString);
    const dateElement = document.getElementById('start-date');
    if (dateElement) {
        dateElement.textContent = startDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}










function createFloatingHearts(count) {
    const container = document.querySelector('.hearts-container');
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'floating-heart';
        heart.style.setProperty('--random-left', Math.random());
        heart.style.setProperty('--random-top', Math.random());
        heart.style.setProperty('--random-size', Math.random() * 0.5 + 0.5);
        heart.style.setProperty('--random-speed', Math.random() * 4 + 3);
        heart.style.setProperty('--random-delay', Math.random() * 2);
        container.appendChild(heart);
    }
}












function setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => observer.observe(item));
}

function setupInteractiveEnvelope() {
    const envelope = document.getElementById('envelope');
    if (!envelope) return;
    
    // Mensaje de amor con formato
    const loveMessage = 
`"Mi amor,

Un mes a tu lado ha sido el mejor regalo que la vida me ha dado.

❤️ Por tu sonrisa que ilumina mis días
❤️ Por tu paciencia cuando soy complicado
❤️ Por esos abrazos que lo curan todo
❤️ Por amarme tal como soy

Eres mi persona favorita en este mundo.
Para siempre, mi amor"`;
    
    envelope.addEventListener('click', function() {
        // Cambiar estado del sobre
        this.classList.toggle('open');
        
        // Forzar reflow para asegurar la animación
        void this.offsetWidth;
        
        if (this.classList.contains('open')) {
            // Efecto de máquina de escribir
            const typedMessage = document.getElementById('typed-message');
            if (typedMessage) {
                typeWriterEffect(typedMessage, loveMessage, 30);
            }
            
            // Efecto confeti
            triggerConfetti();
            
            // Cerrar automáticamente después de 15 segundos
            setTimeout(() => {
                if (this.classList.contains('open')) {
                    this.classList.remove('open');
                }
            }, 15000);
        }
    });
}







function typeWriterEffect(element, text, speed = 30) {
    let i = 0;
    element.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    element.appendChild(cursor);
    
    function typing() {
        if (i < text.length) {
            // Manejar saltos de línea
            if (text.charAt(i) === '\n') {
                element.insertBefore(document.createElement('br'), cursor);
            } 
            // Manejar corazones especiales
            else if (text.substr(i, 2) === '❤️') {
                const heart = document.createElement('span');
                heart.innerHTML = '❤️';
                heart.style.color = '#e84393';
                element.insertBefore(heart, cursor);
                i++; // Saltar un carácter adicional
            }
            // Texto normal
            else {
                const span = document.createElement('span');
                span.textContent = text.charAt(i);
                element.insertBefore(span, cursor);
            }
            
            i++;
            setTimeout(typing, speed);
        } else {
            // Eliminar cursor al finalizar
            cursor.remove();
        }
    }
    
    typing();
}







function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b8b', '#ffb8c6', '#ff4757', '#e84393'],
        shapes: ['heart', 'circle']
    });
}

function setupCountdown() {
    // Actualizar inmediatamente
    updateCountdown();
    
    // Actualizar cada segundo
    setInterval(updateCountdown, 1000);
}







function startFourDayCountdown() {
    // 4 días en segundos (días * horas * minutos * segundos)
    let totalSeconds = 4 * 24 * 60 * 60;
    
    // Obtenemos elementos (sin tocar el título)
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    
    // Creamos elemento de segundos solo si no existe
    let secondsEl = document.getElementById('seconds');
    if (!secondsEl) {
        const secondsContainer = document.createElement('div');
        secondsContainer.className = 'countdown-item';
        secondsContainer.innerHTML = `
            <span id="seconds">00</span>
            <small>Segundos</small>
        `;
        document.querySelector('.countdown-container').appendChild(secondsContainer);
        secondsEl = document.getElementById('seconds');
    }
    
    // Función de actualización
    function update() {
        totalSeconds--;
        
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Actualizamos elementos
        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Efecto cuando queden menos de 10 minutos
        if (totalSeconds < 600) {
            document.querySelectorAll('.countdown-item span').forEach(el => {
                el.style.color = '#ff7675';
                el.style.animation = 'pulse 0.5s infinite alternate';
            });
        }
        
        // Detener cuando llegue a cero
        if (totalSeconds <= 0) clearInterval(interval);
    }
    
    // Iniciar
    update(); // Llamada inmediata
    const interval = setInterval(update, 1000);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', startFourDayCountdown);












function setupMapIfExists() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    




    // Solo se ejecutará si hay un elemento con id "map"
    const map = new google.maps.Map(mapElement, {
        center: { lat: 40.7128, lng: -74.0060 }, // Cambia estas coordenadas
        zoom: 15,
        styles: [
            { featureType: "all", stylers: [{ saturation: -50 }] },
            { elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] }
        ],
        disableDefaultUI: true
    });
    
    new google.maps.Marker({
        position: { lat: 40.7128, lng: -74.0060 },
        map: map,
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40)
        },
        title: "Nuestro lugar especial"
    });
}






// =============================================
// CSS DINÁMICO PARA CORAZONES FLOTANTES
// =============================================

const style = document.createElement('style');
style.textContent = `
.floating-heart {
    position: absolute;
    left: calc(var(--random-left) * 100vw);
    top: calc(var(--random-top) * 100vh);
    font-size: calc(var(--random-size) * 20px);
    opacity: calc(var(--random-size) * 0.6);
    animation: float calc(var(--random-speed) * 1s) ease-in-out calc(var(--random-delay) * 1s) infinite;
    pointer-events: none;
    user-select: none;
    z-index: 1;
}

@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
}
`;
document.head.appendChild(style);












// Animación al hacer scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Efecto confeti para hitos importantes
            if(entry.target.querySelector('.timeline-icon').textContent === '❤️') {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff6b8b', '#ffb8c6', '#ff4757']
                });
            }
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach(item => observer.observe(item));