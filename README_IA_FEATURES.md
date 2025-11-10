# INZASTOR - Système de Gestion avec IA

## Nouvelles Fonctionnalités

### 1. Traitement d'Images Automatique
- **Redimensionnement automatique** : Toutes les images sont redimensionnées à 800x600 pixels
- **Conservation des proportions** : Maintien du ratio d'aspect original avec fond neutre si nécessaire
- **Compression optimisée** : Réduction de la taille des fichiers sans perte de qualité visible
- **Application universelle** : S'applique à toutes les images de produits dans tous les contextes

### 2. Gestion des Images de Catégories
Interface d'administration complète permettant :
- Sélection d'une catégorie existante
- Upload de nouvelles images avec validation (JPG/PNG, max 5MB)
- Recadrage et ajustement des images avant validation
- Prévisualisation en temps réel des modifications
- Journalisation des actions administrateur

### 3. Génération IA de Contenu
Intégration d'OpenAI pour :
- **Descriptions automatiques** : Génération de descriptions produit pertinentes
- **Images IA** : Création d'images réalistes via DALL-E
- **Interface intuitive** : Bouton "✨ Générer avec IA" dans le formulaire
- **Personnalisation** : Options de longueur, ton et langue
- **Régénération** : Possibilité de régénérer le contenu si insatisfaisant

## Installation et Configuration

### 1. Clés API Requises
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos clés API
REACT_APP_OPENAI_API_KEY=votre_clé_openai_ici
```

### 2. Installation des Dépendances
```bash
npm install
```

### 3. Lancement de l'Application
```bash
npm start
```

## Utilisation

### Traitement d'Images
Le traitement est automatique lors de l'upload d'images dans le formulaire produit.

### Gestion des Catégories
1. Accéder à la section "Catégories" dans le dashboard
2. Sélectionner une catégorie
3. Upload et traitement de l'image
4. Validation et enregistrement

### Génération IA
1. Créer un nouveau produit
2. Saisir le nom du produit
3. Cliquer sur "✨ Générer avec IA"
4. Personnaliser et valider le contenu généré

## Sécurité
- Validation stricte des formats d'images
- Limitation de taille des fichiers
- Journalisation des actions admin
- Gestion des timeouts et erreurs

## Performance
- Traitement asynchrone des images
- Compression optimisée
- Caching des résultats IA
- Interface réactive et intuitive