# Configuration de Google Calendar API

Ce guide vous explique comment obtenir une clé API Google Calendar pour lier votre propre compte au calendrier du site Paradox.

## Prérequis

- Un compte Google
- Le calendrier que vous souhaitez afficher doit être public ou partagé

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Sélectionner un projet"** en haut de la page
4. Cliquez sur **"Nouveau projet"**
5. Donnez un nom à votre projet (ex: "Paradox Calendar")
6. Cliquez sur **"Créer"**
7. Attendez que le projet soit créé, puis sélectionnez-le

## Étape 2 : Activer l'API Google Calendar

1. Dans le menu latéral, allez dans **"APIs et services"** > **"Bibliothèque"**
2. Dans la barre de recherche, tapez **"Google Calendar API"**
3. Cliquez sur **"Google Calendar API"** dans les résultats
4. Cliquez sur le bouton **"Activer"**
5. Attendez quelques secondes que l'API soit activée

## Étape 3 : Créer une clé API

1. Dans le menu latéral, allez dans **"APIs et services"** > **"Identifiants"**
2. Cliquez sur **"Créer des identifiants"** en haut
3. Sélectionnez **"Clé API"**
4. Une popup s'affiche avec votre nouvelle clé API
5. **Copiez cette clé** (elle ressemble à : `AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX`)
6. Cliquez sur **"Fermer"**

### Sécuriser la clé API (Recommandé)

1. Cliquez sur le nom de votre clé API dans la liste
2. Dans **"Restrictions liées à l'application"**, sélectionnez **"Référents HTTP (sites web)"**
3. Ajoutez votre domaine (ex: `https://votresite.com/*`)
4. Dans **"Restrictions liées à l'API"**, sélectionnez **"Limiter la clé"**
5. Choisissez **"Google Calendar API"** dans la liste
6. Cliquez sur **"Enregistrer"**

## Étape 4 : Obtenir l'ID du calendrier

### Pour votre calendrier principal :
Votre ID de calendrier est simplement votre adresse email Google (ex: `votreemail@gmail.com`)

### Pour un autre calendrier :
1. Ouvrez [Google Calendar](https://calendar.google.com/)
2. Cliquez sur les **trois points** à côté du calendrier que vous voulez utiliser
3. Sélectionnez **"Paramètres et partage"**
4. Faites défiler jusqu'à **"Intégrer le calendrier"**
5. Copiez l'**"ID du calendrier"** (il ressemble à : `abcdefg1234567890@group.calendar.google.com`)

## Étape 5 : Rendre le calendrier public (Important !)

Pour que l'API puisse lire votre calendrier, il doit être public :

1. Dans les paramètres du calendrier (voir Étape 4)
2. Allez à la section **"Autorisations d'accès aux événements"**
3. Cochez la case **"Rendre ce calendrier accessible au public"**
4. Cliquez sur **"OK"** dans la popup de confirmation
5. Vous pouvez également ajuster les permissions (afficher tous les détails des événements ou seulement occupé/libre)

## Étape 6 : Configurer le site Paradox

Maintenant que vous avez votre clé API et votre ID de calendrier, mettez-les à jour dans le fichier `programme.js` :

```javascript
// Configuration Google Calendar API
const GOOGLE_API_KEY = 'VOTRE_CLE_API_ICI'; // Remplacez par votre clé API
const CALENDAR_ID = 'VOTRE_EMAIL@gmail.com'; // Remplacez par l'ID de votre calendrier
```

### Exemple :
```javascript
const GOOGLE_API_KEY = 'AIzaSyDXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx';
const CALENDAR_ID = 'monequipe@gmail.com';
```

## Étape 7 : Ajouter des événements avec cover images

Pour ajouter une image cover à un événement :

1. Créez un événement dans Google Calendar
2. Dans la **description** de l'événement, ajoutez :
   ```
   cover="https://URL_DE_VOTRE_IMAGE.jpg"
   ```
3. Vous pouvez ajouter du texte avant ou après cette ligne
4. Pour masquer le reste de la description, ajoutez `+++` dans la description

### Exemple de description :
```
Soirée Jazz exceptionnelle avec nos meilleurs artistes !

cover="https://i.imgur.com/exemple.jpg"

+++
```

## Résolution de problèmes

### L'API ne retourne pas d'événements
- ✅ Vérifiez que le calendrier est **public**
- ✅ Vérifiez que l'**API Google Calendar est activée** dans votre projet
- ✅ Vérifiez que la **clé API est correcte**
- ✅ Vérifiez que l'**ID du calendrier est correct**

### Erreur "API key not valid"
- La clé API est incorrecte ou a des restrictions qui bloquent votre site
- Essayez de créer une nouvelle clé API sans restrictions pour tester

### Les événements ne s'affichent pas
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les événements sont dans le mois actuel affiché

### Quota dépassé
- L'API Google Calendar a une limite gratuite de 1 000 000 requêtes/jour
- Pour un site normal, cela ne devrait jamais être atteint
- Si vous atteignez cette limite, contactez Google pour augmenter votre quota

## Limites de l'API gratuite

- **1 000 000 requêtes/jour** : Largement suffisant pour un site web
- **Pas de limite sur les événements** : Vous pouvez avoir autant d'événements que vous voulez
- **Pas de support** : L'API gratuite n'inclut pas de support technique Google

## Ressources supplémentaires

- [Documentation Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Console Google Cloud](https://console.cloud.google.com/)
- [Google Calendar](https://calendar.google.com/)

---

**Note de sécurité** : Ne partagez jamais votre clé API publiquement. Si elle est compromise, supprimez-la et créez-en une nouvelle dans la Google Cloud Console.
