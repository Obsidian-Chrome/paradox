// Configuration Google Calendar API
// IMPORTANT: Remplacez ces valeurs par vos propres clés API
const GOOGLE_API_KEY = 'VOTRE_CLE_API_GOOGLE';
const CALENDAR_ID = 'VOTRE_CALENDAR_ID@group.calendar.google.com';

let currentDate = new Date();
let events = [];

// Jours de la semaine
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

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
    // Si les clés API ne sont pas configurées, utiliser des événements de démonstration
    if (GOOGLE_API_KEY === 'VOTRE_CLE_API_GOOGLE') {
        loadDemoEvents();
        return;
    }
    
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
        }
    } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        loadDemoEvents();
    }
}

// Événements de démonstration (à utiliser en attendant la configuration de l'API)
function loadDemoEvents() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    events = [
        {
            summary: 'Soirée Jazz',
            description: 'Une soirée musicale avec des artistes jazz de renom. Ambiance feutrée et cocktails d\'exception.',
            start: { dateTime: new Date(year, month, 15, 20, 0).toISOString() },
            end: { dateTime: new Date(year, month, 15, 23, 59).toISOString() },
            location: 'Paradox - Salle principale'
        },
        {
            summary: 'Concert Électro',
            description: 'DJ Set avec nos meilleurs artistes électro. Danse et lumières garanties !',
            start: { dateTime: new Date(year, month, 22, 21, 0).toISOString() },
            end: { dateTime: new Date(year, month, 23, 2, 0).toISOString() },
            location: 'Paradox - Bar'
        },
        {
            summary: 'Vernissage Expo Photo',
            description: 'Découvrez la nouvelle exposition de nos photographes résidents.',
            start: { dateTime: new Date(year, month, 8, 18, 0).toISOString() },
            end: { dateTime: new Date(year, month, 8, 22, 0).toISOString() },
            location: 'Paradox - Galerie'
        }
    ];
    
    displayEvents();
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
    
    details.innerHTML = `
        <div class="event-time">
            <strong><i class="fas fa-clock"></i> Horaires:</strong> ${timeString}
        </div>
        ${event.location ? `<p><strong><i class="fas fa-map-marker-alt"></i> Lieu:</strong> ${event.location}</p>` : ''}
        ${event.description ? `<div class="event-description"><strong><i class="fas fa-info-circle"></i> Description:</strong><br>${event.description}</div>` : ''}
    `;
    
    modal.classList.add('show');
}
