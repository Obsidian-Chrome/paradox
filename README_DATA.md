# Guide d'utilisation des fichiers JSON

Le site Paradox utilise désormais des fichiers JSON pour gérer facilement le contenu dynamique. Tous les fichiers JSON se trouvent dans le dossier `data/`.

## 📋 Fichiers JSON disponibles

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
- `image` : Chemin vers l'image
- `youtube` : Lien vers la chaîne YouTube (optionnel, affiche un badge si renseigné)

**Utilisé par :** `equipe.html` via `equipe.js`

---

### 2. `data/merch.json` - Merchandise

**Structure :**
```json
{
  "items": [
    {
      "nom": "T-shirt Dorothy",
      "image": "media/merch/Dorothy.png",
      "auteur": "Vivaldi",
      "taille": "3.2",
      "compatible": "TBSE+",
      "fichier": "tshirt_dorothy.pmp",
      "tags": ["Vêtements", "PMP"]
    }
  ]
}
```

**Champs :**
- `nom` : Nom de l'item
- `image` : Chemin vers l'image
- `auteur` : Créateur du mod
- `taille` : Taille en MB (nombre décimal)
- `compatible` : Compatibilité (TBSE+, YAB, Rue, Bibo)
- `fichier` : Nom du fichier à télécharger
- `tags` : Tags affichés sur la vignette

**Utilisé par :** `merch.html` via `merch.js`

---

### 3. `data/carte.json` - Menu du Bar

**Structure :**
```json
{
  "cocktails_signature": [
    {
      "nom": "Paradox Dream",
      "description": "Vodka, curaçao bleu, jus d'ananas, sirop de vanille",
      "prix": "14€",
      "image": "media/cocktails/paradox_dream.jpg"
    }
  ],
  "classiques": [...],
  "sans_alcool": [...]
}
```

**Sections disponibles :**
- `cocktails_signature` : Cocktails originaux de Paradox
- `classiques` : Cocktails classiques revisités
- `sans_alcool` : Boissons sans alcool

**Utilisé par :** `carte.html` via `carte.js`

---

### 4. `data/magazines.json` - Magazines

**Structure :**
```json
{
  "magazines": [
    {
      "titre": "Paradox Magazine - Volume 1",
      "pdf": "media/magazines/Paradox V1.pdf",
      "couverture": "media/magazines/Paradox V1.png"
    }
  ]
}
```

**Champs :**
- `titre` : Titre complet du magazine
- `pdf` : Chemin vers le fichier PDF
- `couverture` : Chemin vers l'image de couverture

**Utilisé par :** `magazine.html` via `magazine.js`

---

## ✏️ Comment modifier le contenu

### Ajouter un membre d'équipe

1. Ouvrir `data/equipe.json`
2. Choisir la catégorie appropriée (`gerant`, `agent_production`, `garde_corps`, `photographe`, `mascotte`, `artiste`, `mannequin`)
3. Ajouter une nouvelle entrée dans la liste :
```json
{
  "nom": "Nouveau Membre",
  "image": "media/team/placeholder.jpg",
  "youtube": ""
}
```
4. Sauvegarder le fichier
5. Rafraîchir la page `equipe.html`

### Ajouter un item de merch

1. Ouvrir `data/merch.json`
2. Ajouter une nouvelle entrée dans `items` :
```json
{
  "nom": "T-shirt Nouveau",
  "image": "media/merch/Nouveau.png",
  "auteur": "Auteur",
  "taille": "2.5",
  "compatible": "TBSE+",
  "fichier": "tshirt_nouveau.zip",
  "tags": ["Vêtements", "PMP"]
}
```
3. Placer l'image dans `media/merch/`
4. Sauvegarder et rafraîchir `merch.html`

### Ajouter un cocktail

1. Ouvrir `data/carte.json`
2. Choisir la section (`cocktails_signature`, `classiques`, ou `sans_alcool`)
3. Ajouter une nouvelle entrée :
```json
{
  "nom": "Nouveau Cocktail",
  "description": "Liste des ingrédients",
  "prix": "15€",
  "image": "media/cocktails/nouveau.jpg"
}
```
4. Placer l'image dans `media/cocktails/`
5. Sauvegarder et rafraîchir `carte.html`

### Ajouter un magazine

1. Ouvrir `data/magazines.json`
2. Ajouter une nouvelle entrée dans `magazines` :
```json
{
  "titre": "Paradox Magazine - Volume 4",
  "pdf": "media/magazines/Paradox V4.pdf",
  "couverture": "media/magazines/Paradox V4.png"
}
```
3. Placer les fichiers PDF et couverture dans `media/magazines/`
4. Sauvegarder et rafraîchir `magazine.html`

---

## ⚠️ Points importants

1. **Syntaxe JSON** : Respecter strictement la syntaxe JSON (virgules, guillemets)
2. **Chemins d'images** : Toujours utiliser des chemins relatifs depuis la racine
4. **Validation** : Utiliser un validateur JSON en ligne si besoin

---

## 🔄 Ordre d'affichage

Les items s'affichent dans l'ordre où ils apparaissent dans les fichiers JSON.
Pour réorganiser, déplacer simplement les entrées dans le fichier.
