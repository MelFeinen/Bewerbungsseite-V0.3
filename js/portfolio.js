// =====================================================
// JavaScript für Portfolio-Seite
// Funktionen: Filter-System, Modal-Ansicht, Projekt-Details
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // =====================================================
    // Portfolio-Filter System
    // =====================================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const noResults = document.querySelector('.no-results');
    
    // Filter-Button Event-Listener hinzufügen
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Aktiven Button aktualisieren
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Projekte filtern
            filterProjects(filter);
        });
    });
    
    // Projekte basierend auf Filter anzeigen/verstecken
    function filterProjects(filter) {
        let visibleCount = 0;
        
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category').split(' ');
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // "Keine Ergebnisse" Meldung anzeigen/verstecken
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    // =====================================================
    // Projekt-Details Modal System
    // =====================================================
    
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Projekt-Daten (normalerweise würde das von einer API kommen)
    const projectData = {
        project1: {
            title: 'E-Commerce Platform',
            description: 'Eine vollständige E-Commerce-Lösung, die von Grund auf mit modernen Webtechnologien entwickelt wurde.',
            longDescription: `
                Diese E-Commerce-Platform wurde für einen mittelständischen Einzelhändler entwickelt, 
                der seinen Verkauf in den Online-Bereich ausweiten wollte. Die Plattform bietet eine 
                umfassende Lösung für den Online-Verkauf mit allen wichtigen Features.
                
                Das Projekt umfasste die Entwicklung einer benutzerfreundlichen Frontend-Anwendung 
                mit React, einem robusten Backend mit Node.js und Express, sowie einer effizienten 
                Datenbankstruktur mit MongoDB.
            `,
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Redux'],
            features: [
                'Responsives Design für alle Geräte',
                'Produktkatalog mit Suchfunktion',
                'Warenkorb und Checkout-Prozess',
                'Sichere Zahlungsabwicklung mit Stripe',
                'Benutzerkonto-Verwaltung',
                'Admin-Dashboard für Produktverwaltung',
                'E-Mail-Benachrichtigungen',
                'Inventory-Management'
            ],
            challenges: [
                'Integration verschiedener Zahlungsanbieter',
                'Optimierung der Ladezeiten bei großen Produktkatalogen',
                'Implementierung einer sicheren Authentifizierung',
                'Responsive Design für komplexe E-Commerce-Workflows'
            ],
            results: [
                '40% Steigerung der Online-Verkäufe',
                '25% Verbesserung der Conversion-Rate',
                '60% Reduzierung der Ladezeiten',
                '95% positive Nutzerbewertungen'
            ],
            duration: '4 Monate',
            team: 'Frontend Developer (Lead), Backend Developer, UI/UX Designer',
            client: 'Mittelständischer Einzelhändler',
            year: '2023'
        },
        
        project2: {
            title: 'Task Manager App',
            description: 'Eine cross-platform mobile Anwendung für effiziente Aufgabenverwaltung und Team-Kollaboration.',
            longDescription: `
                Diese Task Manager App entstand aus der persönlichen Notwendigkeit, ein besseres 
                Tool für die Verwaltung von Projekten und Aufgaben zu haben. Die App kombiniert 
                eine intuitive Benutzeroberfläche mit leistungsstarken Funktionen für die 
                Team-Zusammenarbeit.
                
                Entwickelt mit React Native für maximale Kompatibilität zwischen iOS und Android, 
                mit Firebase als Backend-Service für Echtzeitdaten und Offline-Synchronisation.
            `,
            technologies: ['React Native', 'Firebase', 'Redux', 'AsyncStorage', 'Push Notifications'],
            features: [
                'Cross-platform (iOS & Android)',
                'Offline-Funktionalität mit Synchronisation',
                'Team-Kollaboration und Sharing',
                'Push-Benachrichtigungen',
                'Drag & Drop Interface',
                'Kategorisierung und Tags',
                'Zeiterfassung und Reporting',
                'Dark/Light Mode'
            ],
            challenges: [
                'Offline-First Architektur implementieren',
                'Konfliktlösung bei gleichzeitigen Änderungen',
                'Optimierung der App-Performance',
                'Konsistente UX zwischen den Plattformen'
            ],
            results: [
                '10.000+ Downloads in den ersten 6 Monaten',
                '4.8 Sterne Bewertung im App Store',
                '85% tägliche Nutzeraktivität',
                'Aufnahme in "Best Productivity Apps" Liste'
            ],
            duration: '6 Monate',
            team: 'Solo-Projekt mit UX-Beratung',
            client: 'Persönliches Projekt / Open Source',
            year: '2023'
        },
        
        project3: {
            title: 'Portfolio Website',
            description: 'Eine moderne, responsive Portfolio-Website mit fokussiertem Design und optimaler Performance.',
            longDescription: `
                Dieses Portfolio-Projekt wurde für einen Fotografen entwickelt, der seine Arbeiten 
                auf eine professionelle und ansprechende Weise präsentieren wollte. Der Fokus lag 
                auf minimalistischem Design, das die Fotografien in den Vordergrund stellt.
                
                Entwickelt mit Vue.js und Nuxt.js für optimale Performance und SEO, mit einem 
                besonderen Fokus auf Bildoptimierung und schnelle Ladezeiten.
            `,
            technologies: ['Vue.js', 'Nuxt.js', 'SCSS', 'Webpack', 'Netlify', 'ImageKit'],
            features: [
                'Responsive Design mit Mobile-First Ansatz',
                'Lazy Loading für Bilder',
                'SEO-Optimierung',
                'Dark/Light Mode Toggle',
                'Smooth Scroll Animationen',
                'Kontaktformular mit Validierung',
                'Admin-Bereich für Content-Updates',
                'Performance Score: 95+/100'
            ],
            challenges: [
                'Optimierung großer Bilddateien',
                'Implementierung eines effizienten Image-Lazy-Loading',
                'Cross-Browser Kompatibilität für Animationen',
                'SEO-Optimierung für Single Page Application'
            ],
            results: [
                '300% Steigerung der Website-Besucher',
                '50% längere Verweildauer',
                '95+ Google PageSpeed Score',
                '40% mehr Kundenanfragen'
            ],
            duration: '2 Monate',
            team: 'Frontend Developer, Designer (Kollaboration)',
            client: 'Freiberuflicher Fotograf',
            year: '2022'
        },
        
        project4: {
            title: 'Microservices API',
            description: 'Eine skalierbare REST API mit Microservices-Architektur für Enterprise-Anwendungen.',
            longDescription: `
                Diese API wurde als Teil einer größeren digitalen Transformationsinitiative 
                für ein mittelständisches Unternehmen entwickelt. Das Ziel war es, die veraltete 
                monolithische Architektur durch eine moderne, skalierbare Microservices-Lösung 
                zu ersetzen.
                
                Das System umfasst mehrere unabhängige Services für Benutzerverwaltung, 
                Datenverarbeitung und Business Logic, die über eine einheitliche API-Gateway 
                zugänglich sind.
            `,
            technologies: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'JWT'],
            features: [
                'Microservices-Architektur',
                'API Gateway mit Rate Limiting',
                'JWT-basierte Authentifizierung',
                'Automatische API-Dokumentation',
                'Docker Containerization',
                'Horizontal Skalierbarkeit',
                'Monitoring und Logging',
                'Automated Testing Pipeline'
            ],
            challenges: [
                'Service-Discovery und Load Balancing',
                'Datenintegrität zwischen Services',
                'Monitoring und Debugging in verteilten Systemen',
                'Automatisierte Deployment-Pipeline'
            ],
            results: [
                '70% Verbesserung der API-Response-Zeit',
                '99.9% Uptime über 12 Monate',
                '50% Reduzierung der Infrastruktur-Kosten',
                'Erfolgreiche Migration ohne Downtime'
            ],
            duration: '8 Monate',
            team: 'Backend-Team (4 Entwickler), DevOps Engineer',
            client: 'Mittelständisches Unternehmen',
            year: '2022'
        },
        
        project5: {
            title: 'Analytics Dashboard',
            description: 'Ein interaktives Dashboard für Datenvisualisierung mit Echtzeit-Updates und benutzerdefinierten Widgets.',
            longDescription: `
                Dieses Analytics Dashboard wurde für ein Marketing-Team entwickelt, um komplexe 
                Datenmengen aus verschiedenen Quellen zu visualisieren und analysieren. Das 
                Dashboard bietet Echtzeit-Einblicke in Kampagnen-Performance, Nutzerverhalten 
                und Geschäftskennzahlen.
                
                Die Anwendung integriert Daten aus verschiedenen APIs und stellt sie in 
                interaktiven Charts und Widgets dar, die von Benutzern individuell 
                konfiguriert werden können.
            `,
            technologies: ['React', 'D3.js', 'Chart.js', 'WebSockets', 'Material-UI', 'Node.js'],
            features: [
                'Echtzeit-Datenvisualisierung',
                'Drag & Drop Dashboard-Builder',
                'Benutzerdefinierte Widgets',
                'Datenexport in verschiedene Formate',
                'Mobile-responsive Design',
                'Automatische Berichte via E-Mail',
                'Multi-Source Datenintegration',
                'Benutzer-Rechteverwaltung'
            ],
            challenges: [
                'Performance bei großen Datenmengen',
                'Echtzeit-Updates ohne Performance-Verlust',
                'Komplexe Datenvisualisierungen',
                'Responsive Design für verschiedene Chart-Typen'
            ],
            results: [
                '80% Zeitersparnis bei der Datenanalyse',
                '45% schnellere Entscheidungsfindung',
                '60% Steigerung der Datennutzung im Team',
                'Integration in 15+ bestehende Tools'
            ],
            duration: '5 Monate',
            team: 'Frontend Developer (Lead), Data Engineer, UX Designer',
            client: 'Digital Marketing Agentur',
            year: '2021'
        },
        
        project6: {
            title: 'Brand Identity Design',
            description: 'Komplette Brand Identity für ein Tech-Startup inklusive Logo, Style Guide und Marketing-Materialien.',
            longDescription: `
                Dieses Branding-Projekt umfasste die komplette visuelle Identität für ein 
                neu gegründetes Tech-Startup im Bereich künstliche Intelligenz. Von der 
                Konzeption bis zur finalen Umsetzung wurde eine kohärente Markenidentität 
                entwickelt, die Innovation und Vertrauen vermittelt.
                
                Das Projekt beinhaltete umfangreiche Research-Phase, Konzeptentwicklung, 
                Design-Iterationen und die Erstellung eines umfassenden Style Guides 
                für die konsistente Anwendung der Marke.
            `,
            technologies: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Zeplin'],
            features: [
                'Logo-Design und Variationen',
                'Farbpalette und Typografie',
                'Business Card und Briefpapier',
                'Website-Design Guidelines',
                'Social Media Templates',
                'Präsentations-Templates',
                'Icon-Set und Illustrations',
                'Brand Guidelines Dokument'
            ],
            challenges: [
                'Differenzierung in saturiertem Tech-Markt',
                'Balance zwischen Innovation und Vertrauen',
                'Skalierbarkeit der Brand Elements',
                'Konsistenz über verschiedene Medien'
            ],
            results: [
                '200% Steigerung der Brand Recognition',
                'Erfolgreiche Seed-Funding Runde (2M€)',
                'Award für "Best Startup Brand Design"',
                '90% positive Feedback von Zielgruppe'
            ],
            duration: '3 Monate',
            team: 'Brand Designer (Lead), Marketing Strategist',
            client: 'AI Tech Startup',
            year: '2021'
        }
    };
    
    // =====================================================
    // Modal-Funktionen
    // =====================================================
    
    // Modal öffnen und Projekt-Details laden
    window.openProjectModal = function(projectId) {
        const project = projectData[projectId];
        if (!project) return;
        
        modalTitle.textContent = project.title;
        modalBody.innerHTML = createProjectModalContent(project);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Modal schließen
    window.closeProjectModal = function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    // Modal bei ESC-Taste schließen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
    
    // =====================================================
    // Modal-Content Generator
    // =====================================================
    
    function createProjectModalContent(project) {
        return `
            <div class="project-details">
                <div class="project-overview">
                    <p class="project-description">${project.description}</p>
                    <div class="project-info-grid">
                        <div class="info-item">
                            <strong>Jahr:</strong>
                            <span>${project.year}</span>
                        </div>
                        <div class="info-item">
                            <strong>Dauer:</strong>
                            <span>${project.duration}</span>
                        </div>
                        <div class="info-item">
                            <strong>Team:</strong>
                            <span>${project.team}</span>
                        </div>
                        <div class="info-item">
                            <strong>Kunde:</strong>
                            <span>${project.client}</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-section">
                    <h3>Projektbeschreibung</h3>
                    <div class="section-content">
                        ${project.longDescription.split('\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('')}
                    </div>
                </div>
                
                <div class="project-section">
                    <h3>Verwendete Technologien</h3>
                    <div class="section-content">
                        <div class="tech-stack-modal">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="project-section">
                    <h3>Features & Funktionen</h3>
                    <div class="section-content">
                        <ul class="feature-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="project-section">
                    <h3>Herausforderungen</h3>
                    <div class="section-content">
                        <ul class="challenge-list">
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="project-section">
                    <h3>Ergebnisse & Impact</h3>
                    <div class="section-content">
                        <ul class="results-list">
                            ${project.results.map(result => `<li>${result}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    // =====================================================
    // Portfolio-Animationen
    // =====================================================
    
    // Intersection Observer für Scroll-Animationen
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Alle Portfolio-Items für Animation vorbereiten
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
    console.log('Portfolio-Seite erfolgreich initialisiert!');
});
