// =====================================================
// JavaScript für Kontaktformular mit Live-Validierung
// Funktionen: Echtzeit-Validierung, mailto-Funktionalität
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // Formular-Elemente referenzieren
    const form = document.getElementById('contact-form');
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    const privacyField = document.getElementById('privacy');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    // Validierungs-Objekt um den Status aller Felder zu verfolgen
    const validationState = {
        name: false,
        email: false,
        phone: true, // Optional
        subject: false,
        message: false,
        privacy: false
    };

    // =====================================================
    // Validierungs-Funktionen
    // =====================================================

    // Name-Validierung
    function validateName(value) {
        value = value.trim();
        
        if (value.length === 0) {
            return { valid: false, message: 'Name ist erforderlich' };
        }
        
        if (value.length < 4) {
            return { valid: false, message: 'Name muss mindestens 4 Zeichen lang sein. Denken Sie an Vor- und Nachnamen' };
        }
        
        if (value.length > 50) {
            return { valid: false, message: 'Name darf maximal 50 Zeichen lang sein' };
        }
        
        // Prüfung auf gültige Zeichen (Buchstaben, Leerzeichen, Bindestriche, Apostrophe)
        const nameRegex = /^[a-zA-ZäöüÄÖÜß\s\-']+$/;
        if (!nameRegex.test(value)) {
            return { valid: false, message: 'Name darf nur Buchstaben, Leerzeichen und Bindestriche enthalten' };
        }
        
        return { valid: true, message: '' };
    }

    // E-Mail-Validierung
    function validateEmail(value) {
        value = value.trim().toLowerCase();
        
        if (value.length === 0) {
            return { valid: false, message: 'E-Mail-Adresse ist erforderlich' };
        }
        
        // Umfassende E-Mail-Regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(value)) {
            return { valid: false, message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein' };
        }
        
        return { valid: true, message: '' };
    }

    // Telefonnummer-Validierung (optional)
    function validatePhone(value) {
        value = value.trim();
        
        // Leer ist erlaubt, da optional
        if (value.length === 0) {
            return { valid: true, message: '' };
        }
        
        // Entferne alle Leerzeichen, Bindestriche und Klammern für Validierung
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        
        // Prüfe auf gültige Zeichen (Zahlen, +, Leerzeichen, Bindestriche, Klammern)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            return { valid: false, message: 'Bitte geben Sie eine gültige Telefonnummer ein' };
        }
        
        // Prüfe Mindestlänge der reinen Zahlen
        if (cleanPhone.replace(/\+/, '').length < 8) {
            return { valid: false, message: 'Telefonnummer muss mindestens 8 Ziffern haben' };
        }
        
        return { valid: true, message: '' };
    }

    // Betreff-Validierung
    function validateSubject(value) {
        if (value === '' || value === null) {
            return { valid: false, message: 'Bitte wählen Sie einen Betreff' };
        }
        
        return { valid: true, message: '' };
    }

    // Nachricht-Validierung
    function validateMessage(value) {
        value = value.trim();
        
        if (value.length === 0) {
            return { valid: false, message: 'Nachricht ist erforderlich' };
        }
        
        if (value.length < 10) {
            return { valid: false, message: 'Nachricht muss mindestens 10 Zeichen lang sein' };
        }
        
        if (value.length > 2000) {
            return { valid: false, message: 'Nachricht darf maximal 2000 Zeichen lang sein' };
        }
        
        return { valid: true, message: '' };
    }

    // Datenschutz-Validierung
    function validatePrivacy(checked) {
        if (!checked) {
            return { valid: false, message: 'Sie müssen der Datenschutzerklärung zustimmen' };
        }
        
        return { valid: true, message: '' };
    }

    // =====================================================
    // UI-Update-Funktionen
    // =====================================================

    // Feld-Validierung anzeigen
    function showFieldValidation(fieldName, isValid, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        const successElement = document.getElementById(`${fieldName}-success`);
        
        // CSS-Klassen aktualisieren
        field.classList.remove('valid', 'error');
        field.classList.add(isValid ? 'valid' : 'error');
        
        // Fehlernachricht anzeigen/verstecken
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('show', !isValid && message);
        }
        
        // Erfolgssymbol anzeigen/verstecken
        if (successElement) {
            successElement.classList.toggle('show', isValid);
        }
        
        // Validierungsstatus aktualisieren
        validationState[fieldName] = isValid;
        updateSubmitButton();
    }

    // Submit-Button Status aktualisieren
    function updateSubmitButton() {
        const allValid = Object.values(validationState).every(state => state === true);
        submitBtn.disabled = !allValid;
        
        if (allValid) {
            submitBtn.classList.add('ready');
        } else {
            submitBtn.classList.remove('ready');
        }
    }

    // Zeichenzähler für Nachricht aktualisieren
    function updateMessageCounter() {
        const counter = document.getElementById('message-counter');
        const length = messageField.value.length;
        const minLength = 10;
        
        counter.textContent = `${length} / ${minLength} Zeichen (min.)`;
        counter.classList.toggle('valid', length >= minLength);
    }

    // =====================================================
    // Event-Listener für Live-Validierung
    // =====================================================

    // Name-Feld
    nameField.addEventListener('input', function() {
        const validation = validateName(this.value);
        showFieldValidation('name', validation.valid, validation.message);
    });

    nameField.addEventListener('blur', function() {
        const validation = validateName(this.value);
        showFieldValidation('name', validation.valid, validation.message);
    });

    // E-Mail-Feld
    emailField.addEventListener('input', function() {
        const validation = validateEmail(this.value);
        showFieldValidation('email', validation.valid, validation.message);
    });

    emailField.addEventListener('blur', function() {
        const validation = validateEmail(this.value);
        showFieldValidation('email', validation.valid, validation.message);
    });

    // Telefon-Feld
    phoneField.addEventListener('input', function() {
        const validation = validatePhone(this.value);
        showFieldValidation('phone', validation.valid, validation.message);
    });

    phoneField.addEventListener('blur', function() {
        const validation = validatePhone(this.value);
        showFieldValidation('phone', validation.valid, validation.message);
    });

    // Betreff-Feld
    subjectField.addEventListener('change', function() {
        const validation = validateSubject(this.value);
        showFieldValidation('subject', validation.valid, validation.message);
    });

    // Nachricht-Feld
    messageField.addEventListener('input', function() {
        const validation = validateMessage(this.value);
        showFieldValidation('message', validation.valid, validation.message);
        updateMessageCounter();
    });

    messageField.addEventListener('blur', function() {
        const validation = validateMessage(this.value);
        showFieldValidation('message', validation.valid, validation.message);
    });

    // Datenschutz-Checkbox
    privacyField.addEventListener('change', function() {
        const validation = validatePrivacy(this.checked);
        showFieldValidation('privacy', validation.valid, validation.message);
    });

    // =====================================================
    // Formular-Submit-Handling
    // =====================================================

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Alle Felder nochmal validieren
        const nameValidation = validateName(nameField.value);
        const emailValidation = validateEmail(emailField.value);
        const phoneValidation = validatePhone(phoneField.value);
        const subjectValidation = validateSubject(subjectField.value);
        const messageValidation = validateMessage(messageField.value);
        const privacyValidation = validatePrivacy(privacyField.checked);
        
        // Validierungsergebnisse anzeigen
        showFieldValidation('name', nameValidation.valid, nameValidation.message);
        showFieldValidation('email', emailValidation.valid, emailValidation.message);
        showFieldValidation('phone', phoneValidation.valid, phoneValidation.message);
        showFieldValidation('subject', subjectValidation.valid, subjectValidation.message);
        showFieldValidation('message', messageValidation.valid, messageValidation.message);
        showFieldValidation('privacy', privacyValidation.valid, privacyValidation.message);
        
        // Prüfen ob alle Felder gültig sind
        const allValidations = [
            nameValidation, emailValidation, phoneValidation,
            subjectValidation, messageValidation, privacyValidation
        ];
        
        const isFormValid = allValidations.every(validation => validation.valid);
        
        if (isFormValid) {
            sendEmail();
        } else {
            showFormStatus('error', 'Bitte korrigieren Sie die Fehler im Formular.');
            
            // Zum ersten Fehlerfeld scrollen
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstErrorField.focus();
            }
        }
    });

    // =====================================================
    // E-Mail senden (mailto)
    // =====================================================

    function sendEmail() {
        // Loading-Status anzeigen
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        // Kurze Verzögerung für bessere UX
        setTimeout(() => {
            try {
                // E-Mail-Daten sammeln
                const formData = {
                    name: nameField.value.trim(),
                    email: emailField.value.trim(),
                    phone: phoneField.value.trim(),
                    subject: subjectField.value,
                    message: messageField.value.trim()
                };
                
                // E-Mail-Body zusammenstellen
                const emailBody = createEmailBody(formData);
                const emailSubject = `Kontaktanfrage: ${formData.subject} - von ${formData.name}`;
                
                // mailto-Link erstellen
                const mailtoLink = `mailto:m.feinen@web.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                
                // E-Mail-Client öffnen
                window.location.href = mailtoLink;
                
                // Erfolg anzeigen
                showFormStatus('success', 'Ihr E-Mail-Client wurde geöffnet. Bitte senden Sie die E-Mail ab.');
                
                // Formular zurücksetzen
                setTimeout(() => {
                    resetForm();
                }, 2000);
                
            } catch (error) {
                console.error('Fehler beim Erstellen der E-Mail:', error);
                showFormStatus('error', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
            } finally {
                // Loading-Status zurücksetzen
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        }, 1000);
    }

    // E-Mail-Body erstellen
    function createEmailBody(data) {
        let body = `Hallo,\n\n`;
        body += `Sie haben eine neue Kontaktanfrage über Ihre Bewerbungsseite erhalten:\n\n`;
        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        body += `Name: ${data.name}\n`;
        body += `E-Mail: ${data.email}\n`;
        
        if (data.phone) {
            body += `Telefon: ${data.phone}\n`;
        }
        
        body += `Betreff: ${data.subject}\n\n`;
        body += `Nachricht:\n${data.message}\n\n`;
        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        body += `Diese Nachricht wurde über das Kontaktformular Ihrer Bewerbungsseite gesendet.\n`;
        body += `Zeitpunkt: ${new Date().toLocaleString('de-DE')}\n\n`;
        body += `Mit freundlichen Grüßen,\n`;
        body += `Ihr Kontaktformular`;
        
        return body;
    }

    // =====================================================
    // Formular-Status und Reset-Funktionen
    // =====================================================

    // Formular-Status anzeigen
    function showFormStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        
        // Nach 5 Sekunden ausblenden
        setTimeout(() => {
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.textContent = '';
                formStatus.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    // Formular zurücksetzen
    function resetForm() {
        form.reset();
        
        // Alle Validierungsstatus zurücksetzen
        Object.keys(validationState).forEach(field => {
            validationState[field] = field === 'phone'; // phone ist optional
            
            const fieldElement = document.getElementById(field);
            const errorElement = document.getElementById(`${field}-error`);
            const successElement = document.getElementById(`${field}-success`);
            
            if (fieldElement) {
                fieldElement.classList.remove('valid', 'error');
            }
            
            if (errorElement) {
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            }
            
            if (successElement) {
                successElement.classList.remove('show');
            }
        });
        
        // Zeichenzähler zurücksetzen
        updateMessageCounter();
        updateSubmitButton();
    }

    // =====================================================
    // Initialisierung
    // =====================================================

    // Zeichenzähler initial setzen
    updateMessageCounter();
    
    // Submit-Button initial deaktivieren
    updateSubmitButton();
    
    console.log('Kontaktformular mit Live-Validierung erfolgreich initialisiert!');
});

// =====================================================
// Zusätzliche Utility-Funktionen
// =====================================================

// Formular-Daten für Debugging ausgeben (nur in Entwicklung)
function logFormData() {
    const formData = new FormData(document.getElementById('contact-form'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    console.log('Aktuelle Formular-Daten:', data);
}

// Automatisches Speichern in LocalStorage (optional)
function saveFormDataToLocalStorage() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.type !== 'checkbox') {
                localStorage.setItem(`contact_form_${this.name}`, this.value);
            }
        });
    });
}

// Gespeicherte Formular-Daten laden
function loadFormDataFromLocalStorage() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.type !== 'checkbox') {
            const savedValue = localStorage.getItem(`contact_form_${input.name}`);
            if (savedValue) {
                input.value = savedValue;
            }
        }
    });
}
