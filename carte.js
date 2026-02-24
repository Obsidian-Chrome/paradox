async function loadMenu() {
    try {
        const response = await fetch('/data/carte.json');
        const data = await response.json();
        
        loadMenuSection('basiques', 'Nos basiques', data.basiques);
        loadMenuSection('petits_plats', 'Nos petits plats', data.petits_plats);
        if (data.cocktails && data.cocktails.length > 0) {
            loadMenuSection('cocktails', 'Nos cocktails', data.cocktails);
        }
        if (data.partenaires && data.partenaires.length > 0) {
            loadMenuSection('partenaires', 'Nos partenaires', data.partenaires);
        }
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
    
    const variantesHTML = item.variantes 
        ? `<p class="variantes">${item.variantes.join(', ')}</p>` 
        : `<p class="description">${item.description || ''}</p>`;
    
    const createurHTML = item.createur 
        ? `<p class="createur">Créé par ${item.createur}</p>` 
        : '';
    
    const prixHTML = item.prix 
        ? `<span class="price">${item.prix}</span>` 
        : '';
    
    // Gestion de l'image : affiche l'image seulement si définie
    let imageHTML = '';
    if (item.image) {
        const imageWebp = item.image.replace(/\.(jpg|png|jpeg)$/i, '.webp');
        imageHTML = `
        <div class="menu-image">
            <picture>
                <source srcset="${imageWebp}" type="image/webp">
                <img src="${item.image}" alt="${item.nom}">
            </picture>
        </div>`;
    }
    
    card.innerHTML = `
        ${imageHTML}
        <div class="menu-info">
            <div class="menu-header">
                <h3>${item.nom}</h3>
                ${prixHTML}
            </div>
            ${variantesHTML}
            ${createurHTML}
        </div>
    `;
    
    return card;
}

document.addEventListener('DOMContentLoaded', loadMenu);
