function filterMerch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const compatFilter = document.getElementById('compatFilter').value;
    const items = document.querySelectorAll('.merch-item');
    let visibleCount = 0;

    items.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        const compat = item.dataset.compat;
        
        const matchesSearch = name.includes(searchTerm);
        const matchesCompat = compatFilter === 'all' || compat === compatFilter;
        
        if (matchesSearch && matchesCompat) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    const container = document.getElementById('merchContainer');
    const existingNoResults = container.querySelector('.no-results');
    
    if (visibleCount === 0 && !existingNoResults) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = '<i class="fas fa-search"></i><br>Aucun résultat trouvé';
        container.appendChild(noResults);
    } else if (visibleCount > 0 && existingNoResults) {
        existingNoResults.remove();
    }
}

function sortMerch() {
    const sortValue = document.getElementById('sortSelect').value;
    const container = document.querySelector('.merch-grid');
    const items = Array.from(document.querySelectorAll('.merch-item'));
    
    items.sort((a, b) => {
        switch(sortValue) {
            case 'name':
                return a.dataset.name.localeCompare(b.dataset.name);
            case 'name-desc':
                return b.dataset.name.localeCompare(a.dataset.name);
            case 'size':
                return parseFloat(a.dataset.size) - parseFloat(b.dataset.size);
            case 'size-desc':
                return parseFloat(b.dataset.size) - parseFloat(a.dataset.size);
            default:
                return 0;
        }
    });
    
    items.forEach(item => container.appendChild(item));
}

function downloadItem(filename) {
    alert(`Téléchargement de ${filename}...\n\nNote: Assurez-vous d'avoir les permissions nécessaires.`);
}
