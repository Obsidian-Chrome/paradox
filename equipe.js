async function loadTeam() {
    try {
        const response = await fetch('data/equipe.json');
        const data = await response.json();
        
        const artistsGrid = document.getElementById('artistsGrid');
        const modelsGrid = document.getElementById('modelsGrid');
        
        if (artistsGrid) {
            artistsGrid.innerHTML = '';
            data.artistes.forEach(artiste => {
                const card = createTeamMemberCard(artiste, 'Artiste');
                artistsGrid.appendChild(card);
            });
        }
        
        if (modelsGrid) {
            modelsGrid.innerHTML = '';
            data.mannequins.forEach(mannequin => {
                const card = createTeamMemberCard(mannequin, 'Mannequin');
                modelsGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'équipe:', error);
    }
}

function createTeamMemberCard(member, role) {
    const card = document.createElement('div');
    card.className = 'team-member';
    
    const badgeHTML = member.youtube 
        ? `<div class="member-role-badge"><a href="${member.youtube}" target="_blank"><i class="fab fa-youtube"></i></a></div>`
        : '';
    
    card.innerHTML = `
        <div class="member-image">
            <img src="${member.image}" alt="${member.nom}">
            ${badgeHTML}
        </div>
        <div class="member-info">
            <h3>${member.nom}</h3>
        </div>
    `;
    
    return card;
}

document.addEventListener('DOMContentLoaded', loadTeam);
