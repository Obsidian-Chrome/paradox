# Paradox - Site Web de l'Agence

Site web pour l'agence Paradox, regroupant des artistes et mannequins avec un bar événementiel mensuel.

## 🎨 Design

- **Couleurs**: Bleu (#4a90e2), Rose (#ff4d94), Violet (#9b59b6)
- **Style**: Moderne avec utilisation d'icônes Font Awesome
- **Responsive**: Compatible mobile et desktop

## 📁 Structure du Site

### Pages
- **index.html** - Page d'accueil avec description, horaires, adresse et carrousel
- **reglement.html** - Règlement de l'agence pour les visiteurs
- **carte.html** - Menu du bar avec cocktails et spiritueux
- **equipe.html** - Présentation de l'équipe (artistes et mannequins)
- **merch.html** - Boutique de merchandise téléchargeable avec recherche et filtres
- **magazine.html** - Magazine trimestriel au format PDF

### Fichiers CSS et JavaScript
- **style.css** - Styles principaux
- **carte.css** - Styles additionnels pour les pages secondaires
- **script.js** - JavaScript principal (navigation, carrousel)
- **merch.js** - Fonctionnalités de recherche et tri du merch
- **magazine.js** - Gestion du visualiseur PDF

## 📂 Dossier Media

```
media/
├── paradox_logo.png (logo principal)
├── intra/ (contenu gitignore - non versionné)
├── cocktails/ (images des cocktails, format carré)
│   ├── paradox_dream.jpg
│   ├── pink_fusion.jpg
│   └── ...
├── team/ (photos de l'équipe)
│   ├── artist1.jpg
│   ├── model1.jpg
│   └── ...
├── magazines/ (fichiers PDF)
│   ├── edition_1.pdf
│   ├── edition_2.pdf
│   └── ...
└── carousel1/2/3.jpg (images du carrousel)
```

## 🔗 Liens Externes

- **Watch2Gether**: Lien dans la navigation vers w2g.tv (à personnaliser)
- **Discord**: Lien dans la navigation vers discord.gg (à personnaliser)

## ⚙️ Configuration

### Logo
Placez votre logo `paradox_logo.png` dans le dossier `media/`

### Images des Cocktails
- Format: Carré (recommandé 400x400px)
- Dossier: `media/cocktails/`
- Nommage: nom_du_cocktail.jpg

### Photos de l'Équipe
- Format: Portrait (recommandé 600x800px)
- Dossier: `media/team/`
- Nommage: artist1.jpg, model1.jpg, etc.

### Magazines PDF
- Format: PDF
- Dossier: `media/magazines/`
- Nommage: edition_1.pdf, edition_2.pdf, etc.

### Carousel
- Format: Paysage (recommandé 1200x600px)
- Dossier: `media/`
- Nommage: carousel1.jpg, carousel2.jpg, carousel3.jpg

## 🚀 Installation

1. Placez tous les fichiers dans un dossier
2. Ajoutez vos images dans le dossier `media/`
3. Ouvrez `index.html` dans un navigateur

## 📝 Personnalisation

### Horaires et Adresse
Modifiez les informations dans `index.html` (section `.info-cards`)

### Liens Sociaux
Remplacez les URLs dans les liens Watch2Gether et Discord:
- Watch2Gether: `https://w2g.tv` → Votre lien personnalisé
- Discord: `https://discord.gg` → Votre invitation Discord

### Menu du Bar
Ajoutez ou modifiez les cocktails dans `carte.html`

### Équipe
Ajoutez ou modifiez les membres dans `equipe.html`

### Merchandise
Ajoutez ou modifiez les items dans `merch.html` (format data-attributes)

## 🔒 Sécurité

Le dossier `media/intra/` est exclu du versioning via `.gitignore` pour protéger le contenu privé.

## 🎯 Fonctionnalités

- ✅ Navigation responsive avec menu burger
- ✅ Carrousel automatique d'images
- ✅ Recherche et filtres sur le merch
- ✅ Tri par taille/nom sur le merch
- ✅ Visualiseur PDF pour les magazines
- ✅ Filtrage par trimestre des magazines
- ✅ Design moderne avec animations
- ✅ Liens vers réseaux sociaux

## 🌐 Compatibilité

- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Mobile responsive

---

**Paradox** © 2026 - Tous droits réservés
