// Configuration Google Calendar API
const GOOGLE_API_KEY = 'AIzaSyCtxOjsUfFxtxKpwdh2eJz4CS1x3eshS-w';
const CALENDAR_ID = 'deadwire01@gmail.com';

let currentDate = new Date();
let events = [];

// Jours de la semaine
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Extrait l'URL du cover depuis la description
function extractCover(description) {
    if (!description) return null;
    const coverMatch = description.match(/cover="([^"]+)"/i);
    return coverMatch ? coverMatch[1] : null;
}

// Mois de l'année
const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    
    // Fermeture de la modal
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
    loadGoogleCalendarEvents();
}

function initializeCalendar() {
    renderCalendar();
    loadGoogleCalendarEvents();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Mise à jour du titre
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // En-têtes des jours
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });
    
    // Premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    // Ajuster pour que Lundi soit le premier jour (0)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Nombre de jours du mois précédent
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    // Jours du mois précédent
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
        const dayElement = createDayElement(prevMonthDays - i, true);
        grid.appendChild(dayElement);
    }
    
    // Jours du mois actuel
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        const dayElement = createDayElement(day, false, isToday);
        grid.appendChild(dayElement);
    }
    
    // Jours du mois suivant pour compléter la grille
    const totalCells = grid.children.length - 7; // -7 pour les en-têtes
    const remainingCells = 42 - totalCells - 7; // 6 semaines * 7 jours - cellules déjà remplies - en-têtes
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true);
        grid.appendChild(dayElement);
    }
}

function createDayElement(day, isOtherMonth = false, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    if (isToday) {
        dayElement.classList.add('today');
    }
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    
    dayElement.appendChild(dayNumber);
    
    // Stocker la date pour vérifier les événements plus tard
    if (!isOtherMonth) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        dayElement.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    return dayElement;
}

// Chargement des événements depuis Google Calendar
async function loadGoogleCalendarEvents() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const timeMin = new Date(year, month, 1).toISOString();
    const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items) {
            events = data.items;
            displayEvents();
        } else {
            events = [];
            displayEvents();
        }
    } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        events = [];
        displayEvents();
    }
}

function displayEvents() {
    // Retirer tous les marqueurs d'événements existants
    document.querySelectorAll('.calendar-day.has-event').forEach(el => {
        el.classList.remove('has-event');
        el.onclick = null;
    });
    
    // Ajouter les marqueurs pour les jours avec événements
    events.forEach(event => {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        const dateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
        
        const dayElement = document.querySelector(`[data-date="${dateStr}"]`);
        if (dayElement) {
            dayElement.classList.add('has-event');
            dayElement.onclick = () => showEventModal(event);
        }
    });
}

function showEventModal(event) {
    const modal = document.getElementById('eventModal');
    const title = document.getElementById('eventTitle');
    const details = document.getElementById('eventDetails');
    
    const startDate = new Date(event.start.dateTime || event.start.date);
    const endDate = new Date(event.end.dateTime || event.end.date);
    
    const timeString = event.start.dateTime ? 
        `${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 
        'Toute la journée';
    
    title.textContent = event.summary;
    
    const coverUrl = extractCover(event.description);
    const descriptionText = event.description ? event.description.replace(/cover="[^"]+"/gi, '').trim() : '';
    
    details.innerHTML = `
        <div class="event-time">
            <strong><i class="fas fa-clock"></i> Horaires:</strong> ${timeString}
        </div>
        ${event.location ? `<p><strong><i class="fas fa-map-marker-alt"></i> Lieu:</strong> ${event.location}</p>` : ''}
        ${coverUrl ? `<div class="event-cover"><img src="${coverUrl}" alt="Événement" style="max-width: 100%; border-radius: 10px; margin: 1rem 0; cursor: pointer;" onclick="showCoverModal('${coverUrl}')"></div>` : ''}
        ${descriptionText && !descriptionText.includes('+++') ? `<div class="event-description"><strong><i class="fas fa-info-circle"></i> Description:</strong><br>${descriptionText}</div>` : ''}
    `;
    
    modal.classList.add('show');
}

// Crée et affiche la modal de l'image cover
function showCoverModal(imageUrl) {
    const existingModal = document.querySelector('.cover-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'cover-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'cover-modal__close';
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 100001;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid rgba(74, 144, 226, 0.5);
        background: rgba(15, 15, 30, 0.9);
        color: var(--light-text);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        box-shadow: 0 10px 50px rgba(74, 144, 226, 0.5);
        border-radius: 10px;
        animation: scaleIn 0.3s ease;
    `;
    
    if (!document.querySelector('#cover-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'cover-modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .cover-modal__close:hover {
                border-color: var(--primary-blue);
                background: rgba(15, 15, 30, 1);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    modal.appendChild(closeBtn);
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    const close = () => {
        modal.style.animation = 'fadeIn 0.2s ease reverse';
        setTimeout(() => modal.remove(), 200);
    };
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        close();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            close();
        }
    });
    
    img.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}
