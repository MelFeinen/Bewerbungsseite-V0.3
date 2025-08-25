// =====================================================
// JavaScript für Lebenslauf-Filter System
// Funktionen: Live-Filter, Mehrfachauswahl, Tag-Verwaltung
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // =====================================================
    // Filter-System Initialisierung
    // =====================================================
    
    // Filter-Status verfolgen
    const activeFilters = {
        category: [],
        tech: [],
        period: [],
        level: []
    };
    
    // DOM-Elemente referenzieren
    const filterButtons = document.querySelectorAll('.filter-btn[data-category], .filter-btn[data-tech], .filter-btn[data-period], .filter-btn[data-level]');
    const resetButton = document.getElementById('reset-filters');
    const activeFiltersContainer = document.getElementById('active-filters');
    const filterTagsContainer = document.getElementById('filter-tags');
    
    // Aufklappbare Filter-Leiste
    const filterToggleBtn = document.getElementById('filter-toggle');
    const filterPanel = document.getElementById('filter-panel');
    const filterToggleBar = document.querySelector('.filter-toggle-bar');
    const filterStatus = document.getElementById('filter-count');
    
    // Alle filterbaren Elemente
    const filterableElements = {
        sections: document.querySelectorAll('.cv-section[data-category]'),
        timelineItems: document.querySelectorAll('.timeline-item'),
        skillCategories: document.querySelectorAll('.skill-category'),
        skillItems: document.querySelectorAll('.skill-item'),
        languageItems: document.querySelectorAll('.language-item'),
        certificateItems: document.querySelectorAll('.certificate-item')
    };
    
    // =====================================================
    // Filter Event-Listener
    // =====================================================
    
    // Filter-Toggle Event-Listener
    filterToggleBtn.addEventListener('click', function() {
        toggleFilterPanel();
    });
    
    // Optional: Toggle bei Klick auf die ganze Bar
    filterToggleBar.addEventListener('click', function(e) {
        // Nur wenn nicht auf den Button geklickt wurde
        if (e.target !== filterToggleBtn && !filterToggleBtn.contains(e.target)) {
            toggleFilterPanel();
        }
    });
    
    // Filter-Button Event-Listener
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = getFilterType(this);
            const filterValue = getFilterValue(this);
            
            if (!filterType || !filterValue) return;
            
            // Toggle Filter
            if (this.classList.contains('active')) {
                removeFilter(filterType, filterValue);
                this.classList.remove('active');
            } else {
                addFilter(filterType, filterValue);
                this.classList.add('active');
            }
            
            // Filter anwenden und UI aktualisieren
            applyFilters();
            updateActiveFiltersDisplay();
            updateFilterStatus();
        });
    });
    
    // Reset-Button Event-Listener
    resetButton.addEventListener('click', function() {
        resetAllFilters();
    });
    
    // =====================================================
    // Filter-Hilfsfunktionen
    // =====================================================
    
    // Filter-Panel auf-/zuklappen
    function toggleFilterPanel() {
        const isExpanded = filterPanel.classList.contains('expanded');
        
        if (isExpanded) {
            // Panel schließen
            filterPanel.classList.remove('expanded');
            filterToggleBtn.classList.remove('active');
            updateFilterToggleText(false);
        } else {
            // Panel öffnen
            filterPanel.classList.add('expanded');
            filterToggleBtn.classList.add('active');
            updateFilterToggleText(true);
        }
        
        console.log(`Filter-Panel ${isExpanded ? 'geschlossen' : 'geöffnet'}`);
    }
    
    // Filter-Toggle Text aktualisieren
    function updateFilterToggleText(isExpanded) {
        const filterText = filterToggleBtn.querySelector('.filter-text');
        if (filterText) {
            filterText.textContent = isExpanded ? 'Filter verbergen' : 'Filter anzeigen';
        }
    }
    
    // Filter-Status aktualisieren
    function updateFilterStatus() {
        const activeCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
        
        if (filterStatus) {
            if (activeCount === 0) {
                filterStatus.textContent = '0 Filter aktiv';
            } else if (activeCount === 1) {
                filterStatus.textContent = '1 Filter aktiv';
            } else {
                filterStatus.textContent = `${activeCount} Filter aktiv`;
            }
        }
        
        // Filter-Toggle-Bar visuell hervorheben wenn Filter aktiv
        if (activeCount > 0) {
            filterToggleBar.style.background = 'linear-gradient(135deg, #e67e22, #d35400)';
            // Auto-öffnen bei ersten aktiven Filter
            if (!filterPanel.classList.contains('expanded')) {
                setTimeout(() => toggleFilterPanel(), 200);
            }
        } else {
            filterToggleBar.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        }
    }
    
    // Filter-Typ aus Button bestimmen
    function getFilterType(button) {
        if (button.hasAttribute('data-category')) return 'category';
        if (button.hasAttribute('data-tech')) return 'tech';
        if (button.hasAttribute('data-period')) return 'period';
        if (button.hasAttribute('data-level')) return 'level';
        return null;
    }
    
    // Filter-Wert aus Button bestimmen
    function getFilterValue(button) {
        const filterType = getFilterType(button);
        return button.getAttribute(`data-${filterType}`);
    }
    
    // Filter hinzufügen
    function addFilter(type, value) {
        if (!activeFilters[type].includes(value)) {
            activeFilters[type].push(value);
            console.log(`Filter hinzugefügt: ${type} = ${value}`);
        }
    }
    
    // Filter entfernen
    function removeFilter(type, value) {
        const index = activeFilters[type].indexOf(value);
        if (index > -1) {
            activeFilters[type].splice(index, 1);
            console.log(`Filter entfernt: ${type} = ${value}`);
        }
    }
    
    // Alle Filter zurücksetzen
    function resetAllFilters() {
        // Filter-Arrays leeren
        Object.keys(activeFilters).forEach(key => {
            activeFilters[key] = [];
        });
        
        // Alle Filter-Buttons deaktivieren
        filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Spezielle Behandlung für "Alle" Button
        const allButton = document.querySelector('.filter-btn[data-category="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
        
        // Filter anwenden und UI aktualisieren
        applyFilters();
        updateActiveFiltersDisplay();
        updateFilterStatus();
        
        console.log('Alle Filter zurückgesetzt');
    }
    
    // =====================================================
    // Filter-Logik
    // =====================================================
    
    // Hauptfunktion zum Anwenden der Filter
    function applyFilters() {
        const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);
        
        if (!hasActiveFilters) {
            // Keine Filter aktiv - alle Elemente anzeigen
            showAllElements();
            return;
        }
        
        // Kategorien-Filter anwenden
        applyCategoryFilters();
        
        // Timeline-Items filtern
        applyTimelineFilters();
        
        // Skill-Kategorien und Items filtern
        applySkillFilters();
        
        // Sprachen filtern
        applyLanguageFilters();
        
        // Zertifikate filtern
        applyCertificateFilters();
        
        console.log('Filter angewendet:', activeFilters);
    }
    
    // Kategorien-Filter anwenden
    function applyCategoryFilters() {
        const categoryFilters = activeFilters.category;
        
        filterableElements.sections.forEach(section => {
            const sectionCategory = section.getAttribute('data-category');
            const shouldShow = categoryFilters.length === 0 || categoryFilters.includes(sectionCategory);
            
            toggleElementVisibility(section, shouldShow);
        });
    }
    
    // Timeline-Filter anwenden
    function applyTimelineFilters() {
        const periodFilters = activeFilters.period;
        const techFilters = activeFilters.tech;
        
        filterableElements.timelineItems.forEach(item => {
            const itemPeriod = item.getAttribute('data-period');
            const itemTech = item.getAttribute('data-tech');
            
            // Hole das Datum aus der timeline-date für Jahresfilterung
            const timelineDate = item.querySelector('.timeline-date');
            const dateText = timelineDate ? timelineDate.textContent : '';
            
            let shouldShow = true;
            
            // Zeitraum-Filter prüfen (nach Jahren)
            if (periodFilters.length > 0) {
                shouldShow = shouldShow && checkYearFilter(dateText, periodFilters);
            }
            
            // Technologie-Filter prüfen
            if (techFilters.length > 0 && itemTech) {
                const itemTechs = itemTech.split(' ');
                shouldShow = shouldShow && techFilters.some(tech => itemTechs.includes(tech));
            }
            
            toggleElementVisibility(item, shouldShow);
        });
    }
    
    // Hilfsfunktion für prozentbasierte Skill-Level-Filterung
    function checkSkillLevelByPercentage(percentage, levelFilter) {
        switch (levelFilter) {
            case 'expert':
                return percentage >= 60;
            case 'advanced':
                return percentage >= 45 && percentage <= 59;
            case 'intermediate':
                return percentage >= 30 && percentage <= 44;
            case 'basic':
                return percentage >= 15 && percentage <= 29;
            case 'beginner':
                return percentage >= 5 && percentage <= 14;
            default:
                return false;
        }
    }
    
    // Hilfsfunktion für Jahresfilterung
    function checkYearFilter(dateText, periodFilters) {
        // Extrahiere alle Jahre aus dem Datumstext (MM/YYYY Format)
        const yearRegex = /\b(\d{4})\b/g;
        const years = [];
        let match;
        
        while ((match = yearRegex.exec(dateText)) !== null) {
            years.push(match[1]);
        }
        
        // Behandle "heute" als aktuelles Jahr
        if (dateText.includes('heute')) {
            years.push('2025');
        }
        
        // Prüfe ob eines der Filter-Jahre in den gefundenen Jahren ist
        return periodFilters.some(filterYear => {
            if (filterYear === 'older') {
                // "Älter" bedeutet vor 2017
                return years.some(year => parseInt(year) < 2017);
            } else {
                // Exakte Jahresübereinstimmung
                return years.includes(filterYear);
            }
        });
    }
    
    // Skill-Filter anwenden
    function applySkillFilters() {
        const techFilters = activeFilters.tech;
        const levelFilters = activeFilters.level;
        
        // Skill-Kategorien filtern
        filterableElements.skillCategories.forEach(category => {
            const categoryTech = category.getAttribute('data-tech');
            let shouldShow = true;
            
            if (techFilters.length > 0 && categoryTech) {
                const categoryTechs = categoryTech.split(' ');
                shouldShow = techFilters.some(tech => categoryTechs.includes(tech));
            }
            
            toggleElementVisibility(category, shouldShow);
        });
        
        // Einzelne Skill-Items filtern
        filterableElements.skillItems.forEach(item => {
            const itemLevel = item.getAttribute('data-level');
            const skillProgress = item.querySelector('.skill-progress');
            const skillPercentage = skillProgress ? parseInt(skillProgress.getAttribute('data-skill')) : 0;
            
            let shouldShow = true;
            
            if (levelFilters.length > 0) {
                shouldShow = levelFilters.some(filter => {
                    // Prüfe sowohl das data-level Attribut als auch den tatsächlichen Prozentsatz
                    return itemLevel === filter || checkSkillLevelByPercentage(skillPercentage, filter);
                });
            }
            
            toggleElementVisibility(item, shouldShow);
        });
    }
    
    // Sprachen-Filter anwenden
    function applyLanguageFilters() {
        const levelFilters = activeFilters.level;
        
        filterableElements.languageItems.forEach(item => {
            const itemLevel = item.getAttribute('data-level');
            let shouldShow = true;
            
            if (levelFilters.length > 0) {
                shouldShow = levelFilters.includes(itemLevel);
            }
            
            toggleElementVisibility(item, shouldShow);
        });
    }
    
    // Zertifikate-Filter anwenden
    function applyCertificateFilters() {
        const periodFilters = activeFilters.period;
        const techFilters = activeFilters.tech;
        
        filterableElements.certificateItems.forEach(item => {
            const itemPeriod = item.getAttribute('data-period');
            const itemTech = item.getAttribute('data-tech');
            
            // Hole das Jahr aus der Zertifikatsdatum für Jahresfilterung
            const certDate = item.querySelector('.cert-date');
            const dateText = certDate ? certDate.textContent : '';
            
            let shouldShow = true;
            
            // Zeitraum-Filter prüfen (nach Jahren)
            if (periodFilters.length > 0) {
                shouldShow = shouldShow && checkYearFilter(dateText, periodFilters);
            }
            
            // Technologie-Filter prüfen
            if (techFilters.length > 0 && itemTech) {
                const itemTechs = itemTech.split(' ');
                shouldShow = shouldShow && techFilters.some(tech => itemTechs.includes(tech));
            }
            
            toggleElementVisibility(item, shouldShow);
        });
    }
    
    // =====================================================
    // UI-Hilfsfunktionen
    // =====================================================
    
    // Element-Sichtbarkeit umschalten
    function toggleElementVisibility(element, shouldShow) {
        element.classList.remove('filtered-out', 'highlighted', 'filter-animation');
        
        if (shouldShow) {
            element.classList.add('highlighted', 'filter-animation');
            // Animation nach kurzer Zeit entfernen
            setTimeout(() => {
                element.classList.remove('filter-animation');
            }, 500);
        } else {
            element.classList.add('filtered-out');
        }
    }
    
    // Alle Elemente anzeigen
    function showAllElements() {
        Object.values(filterableElements).forEach(nodeList => {
            nodeList.forEach(element => {
                element.classList.remove('filtered-out', 'highlighted', 'filter-animation');
            });
        });
    }
    
    // =====================================================
    // Aktive Filter Anzeige
    // =====================================================
    
    // Aktive Filter UI aktualisieren
    function updateActiveFiltersDisplay() {
        const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);
        
        if (!hasActiveFilters) {
            activeFiltersContainer.style.display = 'none';
            return;
        }
        
        activeFiltersContainer.style.display = 'block';
        filterTagsContainer.innerHTML = '';
        
        // Filter-Tags erstellen
        Object.entries(activeFilters).forEach(([type, values]) => {
            values.forEach(value => {
                createFilterTag(type, value);
            });
        });
    }
    
    // Filter-Tag erstellen
    function createFilterTag(type, value) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        
        const text = document.createElement('span');
        text.textContent = getFilterDisplayName(type, value);
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-filter';
        removeButton.innerHTML = '×';
        removeButton.setAttribute('aria-label', 'Filter entfernen');
        
        // Event-Listener für Entfernen
        removeButton.addEventListener('click', function() {
            removeFilterByTag(type, value);
        });
        
        tag.appendChild(text);
        tag.appendChild(removeButton);
        filterTagsContainer.appendChild(tag);
    }
    
    // Filter über Tag entfernen
    function removeFilterByTag(type, value) {
        removeFilter(type, value);
        
        // Entsprechenden Filter-Button deaktivieren
        const button = document.querySelector(`.filter-btn[data-${type}="${value}"]`);
        if (button) {
            button.classList.remove('active');
        }
        
        applyFilters();
        updateActiveFiltersDisplay();
        updateFilterStatus();
    }
    
    // Anzeigename für Filter generieren
    function getFilterDisplayName(type, value) {
        const displayNames = {
            category: {
                personal: 'Persönliche Daten',
                education: 'Ausbildung',
                experience: 'Berufserfahrung',
                school: 'Schulbildung',
                skills: 'Fähigkeiten',
                languages: 'Sprachen',
                certificates: 'Zertifikate'
            },
            tech: {
                frontend: 'Frontend',
                backend: 'Backend',
                database: 'Datenbanken',
                tools: 'Tools',
                cloud: 'Cloud'
            },
            period: {
                '2025': '2025',
                '2024': '2024', 
                '2023': '2023',
                '2022': '2022',
                '2021': '2021',
                '2020': '2020',
                '2019': '2019',
                '2018': '2018',
                '2017': '2017',
                'older': 'Vor 2017'
            },
            level: {
                expert: 'Experte (60%+)',
                advanced: 'Fortgeschritten (45-59%)',
                intermediate: 'Mittel (30-44%)',
                basic: 'Grundkenntnisse (15-29%)',
                beginner: 'Anfänger (5-14%)'
            }
        };
        
        return displayNames[type]?.[value] || value;
    }
    
    // =====================================================
    // Zusätzliche Features
    // =====================================================
    
    // Filter-Statistiken anzeigen
    function showFilterStatistics() {
        const stats = {
            visible: 0,
            hidden: 0,
            total: 0
        };
        
        Object.values(filterableElements).forEach(nodeList => {
            nodeList.forEach(element => {
                stats.total++;
                if (element.classList.contains('filtered-out')) {
                    stats.hidden++;
                } else {
                    stats.visible++;
                }
            });
        });
        
        console.log('Filter-Statistiken:', stats);
        return stats;
    }
    
    // Keyboard-Shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC zum Zurücksetzen aller Filter
        if (e.key === 'Escape') {
            resetAllFilters();
        }
        
        // Ctrl+F zum Fokussieren des ersten Filter-Buttons
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const firstFilterButton = document.querySelector('.filter-btn');
            if (firstFilterButton) {
                firstFilterButton.focus();
            }
        }
    });
    
    // =====================================================
    // Initialisierung
    // =====================================================
    
    // "Alle" Button als aktiv markieren
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
        
        // Spezieller Event-Listener für "Alle" Button
        allButton.addEventListener('click', function(e) {
            e.stopPropagation();
            resetAllFilters();
        });
    }
    
    // Initial alle Elemente anzeigen
    showAllElements();
    updateActiveFiltersDisplay();
    updateFilterStatus();
    
    console.log('Lebenslauf-Filter-System erfolgreich initialisiert!');
    
    // Filter-System für andere Skripte verfügbar machen
    window.cvFilterSystem = {
        applyFilters,
        resetAllFilters,
        showFilterStatistics,
        activeFilters
    };
});
