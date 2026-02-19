async function loadMenu() {
    try {
        const response = await fetch('data/carte.json');
        const data = await response.json();
        
        loadMenuSection('cocktails_signature', 'Cocktails Signature', data.cocktails_signature);
        loadMenuSection('classiques', 'Classiques Revisités', data.classiques);
        loadMenuSection('sans_alcool', 'Sans Alcool', data.sans_alcool);
    } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
    }
}

function loadMenuSection(id, title, items) {
    const container = document.getElementById(id);
    if (!container) return;
    
    container.innerHTML = `
        <h2>${title}</h2>
        <div class="menu-grid" id="${id}-grid"></div>
    `;
    
    const grid = document.getElementById(`${id}-grid`);
    items.forEach(item => {
        const card = createMenuCard(item);
        grid.appendChild(card);
    });
}

function createMenuCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    
    card.innerHTML = `
        <div class="menu-image">
            <img src="${item.image}" alt="${item.nom}">
        </div>
        <div class="menu-info">
            <h3>${item.nom}</h3>
            <p class="description">${item.description}</p>
            <p class="price">${item.prix}</p>
        </div>
    `;
    
    return card;
}

document.addEventListener('DOMContentLoaded', loadMenu);
