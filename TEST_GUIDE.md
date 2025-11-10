# Guide de Test des Fonctionnalités IA

## Vue d'ensemble
Ce guide vous aide à tester les nouvelles fonctionnalités IA intégrées dans l'application INZASTOR.

## 1. Navigation dans l'Interface Administrateur

### Accès au Tableau de Bord
1. Ouvrez `http://localhost:3001/admin`
2. Connectez-vous avec vos identifiants administrateur
3. Vous devriez voir le nouveau menu latéral avec:
   - **Tableau de Bord** (icône 📊)
   - **Produits** (icône 📱)
   - **Commandes** (icône 📦)
   - **Catégories** (icône 🏷️) - **Nouveau!**
   - **Outils IA** (icône 🤖) - **Nouveau!**

## 2. Test de la Gestion des Images de Catégories

### Navigation
1. Cliquez sur **"Catégories"** dans le menu latéral
2. Vous devriez voir l'interface de gestion des images de catégories

### Fonctionnalités à Tester
1. **Sélection de Catégorie**
   - Choisissez une catégorie dans le menu déroulant
   - Vérifiez que le nom s'affiche correctement

2. **Upload d'Image**
   - Cliquez sur "Choisir une image"
   - Sélectionnez une image JPG, PNG ou WebP
   - Vérifiez que l'aperçu s'affiche

3. **Validation Automatique**
   - Testez avec une image trop volumineuse (> 5MB)
   - Testez avec un format non supporté
   - Vérifiez que les messages d'erreur apparaissent

4. **Traitement d'Image**
   - L'image devrait être automatiquement:
     - Redimensionnée à 800x600px max
     - Compressée avec qualité 85%
     - Convertie en WebP
     - Centrée sur fond blanc

5. **Journalisation**
   - Vérifiez que les logs apparaissent en temps réel
   - Les actions doivent être enregistrées avec horodatage

## 3. Test de la Génération IA de Produits

### Navigation
1. Cliquez sur **"Produits"** dans le menu latéral
2. Cliquez sur **"Ajouter un Produit"**
3. Vous devriez voir le bouton **"Générer avec IA"**

### Fonctionnalités à Tester

#### A. Génération de Contenu IA
1. **Activation du Panneau IA**
   - Cliquez sur "Générer avec IA"
   - Le panneau de génération doit s'ouvrir

2. **Paramètres de Génération**
   - Entrez le nom du produit (obligatoire)
   - Catégorie (optionnelle)
   - Marque (optionnelle)
   - Langue: Français (par défaut)
   - Ton: Professionnel (par défaut)
   - Longueur: Moyenne (par défaut)

3. **Génération**
   - Cliquez sur "Générer"
   - Vérifiez les logs en temps réel
   - Attendez la génération (description + image)

4. **Résultats Attendus**
   - Description engageante du produit
   - 3-5 caractéristiques clés
   - Spécifications techniques
   - Prix suggéré
   - Image générée (512x512px)

#### B. Régenération
1. **Régénération de Description**
   - Cliquez sur "Régénérer Description"
   - Une nouvelle description doit être créée

2. **Régénération d'Image**
   - Cliquez sur "Régénérer Image"
   - Une nouvelle image doit être générée

#### C. Application au Formulaire
1. **Application du Contenu**
   - Cliquez sur "Appliquer au Formulaire"
   - La description doit remplir le champ description
   - L'image doit être téléchargée et optimisée
   - Le panneau IA doit se fermer

## 4. Test du Traitement Automatique des Images

### Upload Manuel d'Image
1. Dans le formulaire produit, cliquez sur "Ajouter une image"
2. Sélectionnez une image volumineuse (> 1MB)
3. L'image devrait être automatiquement:
   - Redimensionnée (max 800x600px)
   - Compressée (qualité 85%)
   - Convertie en WebP
   - Optimisée pour le web

## 5. Test de la Section Outils IA

### Navigation
1. Cliquez sur **"Outils IA"** dans le menu latéral
2. Vous devriez voir une interface informative

### Contenu Attendu
- Statut des services IA
- Documentation des fonctionnalités
- Guide d'utilisation
- Paramètres de configuration

## 6. Configuration Requise

### Variables d'Environnement
Assurez-vous que le fichier `.env.local` contient:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_MAX_IMAGE_SIZE=5242880
VITE_DEFAULT_IMAGE_WIDTH=800
VITE_DEFAULT_IMAGE_HEIGHT=600
```

### Configuration de la clé API Gemini

1. **Définir la clé API** : Ajoutez la ligne suivante dans votre fichier `.env.local` :
   ```
   VITE_GEMINI_API_KEY=AIzaSyCPEup2x_tXIEaRWYGW1rSbAomJzSqjN6c
   ```

2. **Vérifier la configuration** : Accédez à `http://localhost:3001/test-gemini.html` pour tester l'intégration.

3. **Utiliser dans l'interface admin** : La clé API est automatiquement utilisée dans le panneau de génération IA.

### API Gemini
- Une clé API Gemini valide est nécessaire
- Les services Gemini Pro et Gemini Pro Vision doivent être activés
- Vérifiez les limites de quota

## 7. Tests de Performance

### Temps de Réponse Attendus
- **Génération de description**: 2-5 secondes
- **Génération d'image**: 10-30 secondes
- **Traitement d'image**: 1-3 secondes
- **Upload et optimisation**: 2-5 secondes

### Charges Maximales
- Images jusqu'à 5MB
- Dimensions maximales: 2000x2000px
- Format de sortie: WebP (recommandé)

## 8. Journalisation et Debugging

### Logs Disponibles
- Actions d'upload d'images
- Traitements d'images
- Générations IA
- Erreurs et succès
- Horodatage de chaque action

### Debugging
- Ouvrez la console du navigateur (F12)
- Vérifiez les messages de log
- Les erreurs sont affichées en rouge
- Les succès sont affichés en vert

## 9. Problèmes Courants et Solutions

### Erreur "Clé API non configurée"
- Solution: Ajoutez VITE_OPENAI_API_KEY dans .env.local

### Erreur "Image trop volumineuse"
- Solution: Réduisez la taille de l'image ou augmentez VITE_MAX_IMAGE_SIZE

### Erreur "Format non supporté"
- Solution: Utilisez uniquement JPG, PNG ou WebP

### Temps de génération long
- Solution: C'est normal pour DALL-E, soyez patient

## 10. Validation Finale

✅ **Interface de gestion des catégories** - Fonctionnelle
✅ **Upload et traitement d'images** - Automatique
✅ **Génération de descriptions IA** - Intégrée
✅ **Génération d'images IA** - Disponible
✅ **Optimisation automatique** - Active
✅ **Journalisation** - En temps réel
✅ **Navigation admin** - Nouveau menu
✅ **Configuration** - Variables d'env

## Notes
- Toutes les fonctionnalités sont maintenant intégrées
- L'application est prête pour une utilisation en production
- Documentez votre clé API OpenAI en lieu sûr
- Surveillez les quotas d'utilisation