# Guide d'utilisation des fichiers JSON

Le site Paradox utilise des fichiers JSON pour gérer facilement le contenu dynamique. Tous les fichiers JSON se trouvent dans le dossier `data/`.

## Fichiers JSON disponibles

### 1. `data/equipe.json` - Équipe (toutes catégories)

**Structure :**
```json
{
  "gerant": [...],
  "agent_production": [...],
  "garde_corps": [...],
  "photographe": [...],
  "mascotte": [...],
  "artiste": [...],
  "mannequin": [...]
}
```

**Catégories disponibles :**
- `gerant` : Gérant
- `agent_production` : Agent de production
- `garde_corps` : Garde du corps
- `photographe` : Photographe
- `mascotte` : Mascotte
- `artiste` : Artiste
- `mannequin` : Mannequin

**Champs par membre :**
- `nom` : Nom du membre
- `image` : Chemin vers l'image (absolu depuis la racine, ex: `/media/team/placeholder.webp`)
- `youtube` : Lien vers la chaîne YouTube (optionnel, affiche un badge si renseigné)

**Utilisé par :** `equipe/index.html` via `equipe.js`

---

### 2. `data/merch.json` - Boutique

**Structure :**
```json
{
  "items": [
    {
      "nom": "T-shirt Dorothy",
      "image": "/media/boutique/Dorothy.webp",
      "auteur": "Vivaldi",
      "compatible": "TBSE+",
      "fichier_masculin": "tshirt_dorothy_m.pmp",
      "fichier_feminin": "tshirt_dorothy_f.pmp",
      "tags": ["Vêtements", "PMP"]
    }
  ]
}
```

**Champs :**
- `nom` : Nom de l'item
- `image` : Chemin vers l'image (absolu depuis la racine, ex: `/media/boutique/nom.webp`)
- `auteur` : Créateur du mod
- `compatible` : Compatibilité (TBSE+, YAB, Rue, Bibo...)
- `fichier_masculin` : Nom du fichier à télécharger pour les hommes
- `fichier_feminin` : Nom du fichier à télécharger pour les femmes
- `tags` : Tags affichés sur la vignette

**Utilisé par :** `boutique/index.html` via `merch.js`

---

### 3. `data/carte.json` - Menu du Bar

**Structure :**
```json
{
  "basiques": [
    {
      "nom": "Les thés",
      "variantes": ["Noir", "Vert", "Blanc", "Oolong"],
      "prix": "4 gils",
      "createur": "",
      "image": "/media/carte/placeholder.webp"
    }
  ],
  "petits_plats": [
    {
      "nom": "Rock'n'Ribs",
      "description": "Côtes levées caramélisées au whisky...",
      "prix": "",
      "createur": "",
      "image": "/media/carte/placeholder.webp"
    }
  ],
  "cocktails": [
    {
      "nom": "Cendres Silencieuses",
      "description": "Whisky tourbé, liqueur de cerise noire...",
      "prix": "",
      "createur": "Void",
      "image": "/media/carte/placeholder.webp"
    }
  ],
  "partenaires": []
}
```

**Sections disponibles :**
- `basiques` : Boissons de base (thés, jus, cafés, chocolats chauds) avec liste de `variantes`
- `petits_plats` : Plats proposés au bar avec `description`
- `cocktails` : Cocktails créés par les membres avec `createur` et `description`
- `partenaires` : Partenaires du bar (vide pour le moment)

**Champs communs :**
- `nom` : Nom de l'item
- `prix` : Prix (peut être vide)
- `createur` : Créateur de la recette (peut être vide)
- `image` : Chemin vers l'image (absolu depuis la racine, ex: `/media/carte/nom.webp`)

**Champs spécifiques :**
- `variantes` : Liste des variantes disponibles (pour `basiques`)
- `description` : Description détaillée (pour `petits_plats` et `cocktails`)

**Utilisé par :** `carte/index.html` via `carte.js`

---

### 4. `data/magazines.json` - Magazines

**Structure :**
```json
{
  "magazines": [
    {
      "titre": "Paradox Magazine - Volume 1",
      "pdf": "/media/magazines/Paradox V1.pdf",
      "couverture": "/media/magazines/Paradox V1.webp"
    }
  ]
}
```

**Champs :**
- `titre` : Titre complet du magazine
- `pdf` : Chemin vers le fichier PDF (absolu depuis la racine)
- `couverture` : Chemin vers l'image de couverture (absolu depuis la racine)

**Utilisé par :** `magazine/index.html` via `magazine.js`

---

## Comment modifier le contenu

### Ajouter un membre d'équipe

1. Ouvrir `data/equipe.json`
2. Choisir la catégorie appropriée (`gerant`, `agent_production`, `garde_corps`, `photographe`, `mascotte`, `artiste`, `mannequin`)
3. Ajouter une nouvelle entrée dans la liste :
```json
{
  "nom": "Nouveau Membre",
  "image": "/media/team/placeholder.webp",
  "youtube": ""
}
```
4. Sauvegarder le fichier
5. Rafraîchir la page `equipe/`

### Ajouter un item de boutique

1. Ouvrir `data/merch.json`
2. Ajouter une nouvelle entrée dans `items` :
```json
{
  "nom": "T-shirt Nouveau",
  "image": "/media/boutique/Nouveau.webp",
  "auteur": "Auteur",
  "compatible": "TBSE+",
  "fichier_masculin": "tshirt_nouveau_m.pmp",
  "fichier_feminin": "tshirt_nouveau_f.pmp",
  "tags": ["Vêtements", "PMP"]
}
```
3. Placer l'image dans `media/boutique/`
4. Sauvegarder et rafraîchir `boutique/`

### Ajouter un cocktail

1. Ouvrir `data/carte.json`
2. Ajouter une nouvelle entrée dans la section `cocktails` :
```json
{
  "nom": "Nouveau Cocktail",
  "description": "Liste des ingrédients",
  "prix": "",
  "createur": "Nom du créateur",
  "image": "/media/carte/placeholder.webp"
}
```
3. Si vous avez une image spécifique, la placer dans `media/carte/`
4. Sauvegarder et rafraîchir `carte/`

### Ajouter une boisson de base

1. Ouvrir `data/carte.json`
2. Ajouter une nouvelle entrée dans la section `basiques` :
```json
{
  "nom": "Les smoothies",
  "variantes": ["Fraise", "Mangue", "Banane"],
  "prix": "5 gils",
  "createur": "",
  "image": "/media/carte/placeholder.webp"
}
```
3. Sauvegarder et rafraîchir `carte/`

### Ajouter un magazine

1. Ouvrir `data/magazines.json`
2. Ajouter une nouvelle entrée dans `magazines` :
```json
{
  "titre": "Paradox Magazine - Volume 4",
  "pdf": "/media/magazines/Paradox V4.pdf",
  "couverture": "/media/magazines/Paradox V4.webp"
}
```
3. Placer les fichiers PDF et couverture dans `media/magazines/`
4. Sauvegarder et rafraîchir `magazine/`

---

## Points importants

1. **Syntaxe JSON** : Respecter strictement la syntaxe JSON (virgules, guillemets)
2. **Chemins d'images** : Toujours utiliser des chemins **absolus** commençant par `/` (ex: `/media/carte/image.webp`)
3. **Format d'image** : Privilégier le format `.webp` pour de meilleures performances.
4. **Structure des pages** : Les pages sont dans des sous-dossiers (`carte/`, `equipe/`, etc.) mais les chemins JSON restent absolus depuis la racine
5. **Optimiser les PDF** : Utiliser un logiciel ou un site pour optimiser les PDF (conserver la meilleure qualité possible suffit). Pas de fichier de plus de 100 mo.

---

## Ordre d'affichage

Les items s'affichent dans l'ordre où ils apparaissent dans les fichiers JSON.
Pour réorganiser, déplacer simplement les entrées dans le fichier.
