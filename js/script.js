// =====================================================
// JavaScript für die Bewerbungsseite
// Funktionen: Hamburger-Menü, Dark/Light Mode, Tageszeit-Begrüßung
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // Alle wichtigen DOM-Elemente referenzieren
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const greeting = document.getElementById('greeting');

    // =====================================================
    // Hamburger-Menü Funktionalität
    // =====================================================
    
    // Funktion zum Öffnen/Schließen des Menüs
    function toggleMenu() {
        hamburger.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Verhindere Scrollen wenn Menü offen ist
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Event-Listener für Hamburger-Button
    hamburger.addEventListener('click', toggleMenu);

    // Event-Listener für Overlay (Menü schließen beim Klick außerhalb)
    overlay.addEventListener('click', toggleMenu);

    // Menü schließen bei Klick auf einen Navigationslink
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Kurze Verzögerung für bessere UX
            setTimeout(toggleMenu, 100);
        });
    });

    // Menü schließen bei ESC-Taste
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleMenu();
        }
    });

    // =====================================================
    // Dark/Light Mode Toggle Funktionalität
    // =====================================================
    
    // Gespeicherten Theme-Status aus localStorage laden
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Verwende gespeicherten Wert oder Browser-Präferenz
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Theme anwenden
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
        
        console.log(`Theme geladen: ${theme}`);
    }

    // Theme speichern und anwenden
    function saveTheme(theme) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        console.log(`Theme gespeichert: ${theme}`);
    }

    // Event-Listener für Theme-Toggle
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        saveTheme(newTheme);
        
        // Sanfte Animation beim Wechsel
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });

    // Browser-Theme-Änderungen erkennen
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Nur anwenden wenn kein manueller Wert gespeichert ist
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.checked = newTheme === 'dark';
        }
    });

    // =====================================================
    // Tageszeit-abhängige Begrüßung
    // =====================================================
    
    function updateGreeting() {
        if (!greeting) return; // Nur auf Startseite sichtbar
        
        const now = new Date();
        const hour = now.getHours();
        let greetingText = '';
        let timeOfDay = '';

        // Tageszeit bestimmen und entsprechende Begrüßung wählen
        if (hour >= 5 && hour < 12) {
            timeOfDay = 'Morgen';
            greetingText = 'Guten Morgen!';
        } else if (hour >= 12 && hour < 17) {
            timeOfDay = 'Tag';
            greetingText = 'Guten Tag!';
        } else if (hour >= 17 && hour < 22) {
            timeOfDay = 'Abend';
            greetingText = 'Guten Abend!';
        } else {
            timeOfDay = 'Nacht';
            greetingText = 'Gute Nacht!';
        }

        // Vollständige Begrüßung zusammenstellen
        const fullGreeting = `${greetingText} Willkommen auf meiner Bewerbungsseite`;
        greeting.textContent = fullGreeting;
        
        console.log(`Begrüßung aktualisiert für ${timeOfDay}: ${greetingText}`);
        
        // CSS-Klasse für eventuelle spezielle Styling je Tageszeit
        greeting.className = `greeting-${timeOfDay.toLowerCase()}`;
    }

    // =====================================================
    // Smooth Scrolling für interne Links
    // =====================================================
    
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // =====================================================
    // Scroll-to-Top Funktionalität
    // =====================================================
    
    function createScrollToTopButton() {
        // Button erstellen
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'Nach oben scrollen');
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: 0 4px 12px var(--shadow-color);
        `;
        
        document.body.appendChild(scrollButton);

        // Button anzeigen/verstecken basierend auf Scroll-Position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        });

        // Scroll-to-Top Funktionalität
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover-Effekte
        scrollButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.backgroundColor = 'var(--secondary-color)';
        });

        scrollButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'var(--primary-color)';
        });
    }

    // =====================================================
    // Intersection Observer für Animationen
    // =====================================================
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    observer.unobserve(entry.target); // Animation nur einmal abspielen
                }
            });
        }, observerOptions);

        // Alle animierbaren Elemente beobachten
        const animatableElements = document.querySelectorAll('.feature-card, .content-section h2, .content-section p');
        animatableElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }

    // =====================================================
    // Performance Monitoring (optional für Entwicklung)
    // =====================================================
    
    function logPerformance() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Seite geladen in: ${loadTime}ms`);
        }
    }

    // =====================================================
    // Initialisierung aller Funktionen
    // =====================================================
    
    // Theme laden
    loadTheme();
    
    // Begrüßung aktualisieren
    updateGreeting();
    
    // Weitere Funktionen initialisieren
    initSmoothScrolling();
    createScrollToTopButton();
    initScrollAnimations();
    
    // Performance loggen (nur in Entwicklung)
    logPerformance();

    // Begrüßung alle 30 Sekunden aktualisieren (für lange Sitzungen)
    setInterval(updateGreeting, 30000);

    console.log('Bewerbungsseite erfolgreich initialisiert!');
});

// =====================================================
// Globale Utility-Funktionen
// =====================================================

// Funktion zum sicheren Ausführen von Code nach DOM-Laden
function whenReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Funktion für Formular-Validierung (wird in kontakt.html verwendet)
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Email-Validierung
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Telefonnummer-Validierung (deutsche Nummern)
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}
