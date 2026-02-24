let merchData = [];

async function loadMerch() {
    try {
        const response = await fetch('/paradox/data/merch.json');
        const data = await response.json();
        merchData = data.items;
        
        renderMerch(merchData);
    } catch (error) {
        console.error('Erreur lors du chargement du merch:', error);
    }
}

function renderMerch(items) {
    const grid = document.querySelector('.merch-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    items.forEach(item => {
        const card = createMerchCard(item);
        grid.appendChild(card);
    });
}

function createMerchCard(item) {
    const card = document.createElement('div');
    card.className = 'merch-item';
    card.dataset.name = item.nom.toLowerCase();
    card.dataset.compat = item.compatible.toLowerCase().replace('+', '');
    
    const tagsHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    card.innerHTML = `
        <div class="merch-preview">
            <img src="${item.image}" alt="${item.nom}">
            <div class="merch-tags">
                ${tagsHTML}
            </div>
        </div>
        <div class="merch-details">
            <h3>${item.nom}</h3>
            <div class="merch-meta">
                <span>Par <span class="modder">${item.auteur}</span></span>
                <span>Compatible: ${item.compatible}</span>
            </div>
            <button class="download-btn" onclick="downloadItem('${item.nom}')">
                Télécharger
            </button>
        </div>
    `;
    
    return card;
}

function filterMerch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const compatFilter = document.getElementById('compatFilter').value;
    
    const filtered = merchData.filter(item => {
        const matchesSearch = item.nom.toLowerCase().includes(searchTerm);
        const matchesCompat = compatFilter === 'all' || item.compatible.toLowerCase().replace('+', '') === compatFilter;
        return matchesSearch && matchesCompat;
    });
    
    renderMerch(filtered);
    
    if (filtered.length === 0) {
        const grid = document.querySelector('.merch-grid');
        grid.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><br>Aucun résultat trouvé</div>';
    }
}

function sortMerch() {
    const sortValue = document.getElementById('sortSelect').value;
    
    const sorted = [...merchData].sort((a, b) => {
        switch(sortValue) {
            case 'name':
                return a.nom.localeCompare(b.nom);
            case 'name-desc':
                return b.nom.localeCompare(a.nom);
            default:
                return 0;
        }
    });
    
    renderMerch(sorted);
}

let currentDownloadItem = null;

function downloadItem(itemName) {
    const item = merchData.find(i => i.nom === itemName);
    if (!item) return;
    
    currentDownloadItem = item;
    
    const modal = document.getElementById('genderModal');
    const modalItemName = document.getElementById('modalItemName');
    
    modalItemName.textContent = `Télécharger: ${item.nom}`;
    modal.classList.add('active');
}

function closeGenderModal() {
    const modal = document.getElementById('genderModal');
    modal.classList.remove('active');
    currentDownloadItem = null;
}

function confirmDownload(gender) {
    if (!currentDownloadItem) return;
    
    const file = gender === 'masculin' ? currentDownloadItem.fichier_masculin : currentDownloadItem.fichier_feminin;
    
    if (file) {
        const link = document.createElement('a');
        link.href = `downloads/${file}`;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert(`Le modèle ${gender} n'est pas disponible pour cet item.`);
    }
    
    closeGenderModal();
}

document.addEventListener('DOMContentLoaded', loadMerch);
