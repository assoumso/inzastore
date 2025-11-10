# 🖼️ Guide du Gestionnaire d'Images de Catégories

## Vue d'ensemble

Le formulaire de modification des images de catégories permet aux administrateurs de personnaliser visuellement les catégories de produits de leur boutique INZASTOR. Ce système offre une interface intuitive pour gérer les images de navigation et de bannière de chaque catégorie.

## 🚀 Accès au Formulaire

1. **Connexion à l'administration** : Accédez à `http://localhost:3003/admin`
2. **Navigation** : Cliquez sur **"Catégories"** dans le menu latéral
3. **Interface** : Le gestionnaire s'affiche avec toutes les fonctionnalités

## 📋 Fonctionnalités Principales

### 1. Sélection de Catégorie
- **Liste déroulante** : Affiche toutes les catégories disponibles
- **Catégories supportées** : iPhone, iPad, Mac, Apple Watch, AirPods, Accessoires
- **Mise à jour en temps réel** : Les catégories sont extraites automatiquement des produits

### 2. Upload d'Image
- **Formats acceptés** : JPG, PNG, WebP
- **Taille maximale** : 5MB
- **Drag & drop** : Interface moderne pour le téléchargement
- **Validation automatique** : Vérification du format et de la taille

### 3. Traitement d'Image Automatique
- **Redimensionnement** : Optimisation automatique à 800x600px
- **Compression** : Qualité réglée à 90% pour un bon compromis
- **Format WebP** : Conversion automatique pour de meilleures performances
- **Conservation du ratio** : L'aspect original est préservé

### 4. Prévisualisation
- **Aperçu en temps réel** : Visualisation avant validation
- **Informations techniques** : Dimensions et taille affichées
- **Comparaison** : Avant/après le traitement

### 5. Sécurité et Journalisation
- **Logs d'activité** : Historique complet des actions
- **Authentification** : Accès restreint aux administrateurs
- **Sauvegarde locale** : Stockage dans le navigateur pour persistance

## 🔧 Utilisation Étapes par Étapes

### Étape 1 : Sélectionner une Catégorie
```
1. Cliquez sur la liste déroulante "Sélectionner une catégorie"
2. Choisissez la catégorie à personnaliser
3. Le système affichera l'image actuelle (par défaut ou personnalisée)
```

### Étape 2 : Télécharger une Image
```
1. Cliquez sur "Choisir une image"
2. Sélectionnez un fichier depuis votre ordinateur
3. Attendez la validation automatique
4. L'aperçu apparaîtra automatiquement
```

### Étape 3 : Prévisualiser et Valider
```
1. Vérifiez l'aperçu de l'image traitée
2. Cliquez sur "Mettre à jour l'image"
3. Attendez la confirmation de succès
4. L'image est immédiatement appliquée
```

### Étape 4 : Réinitialiser (Optionnel)
```
1. Cliquez sur "Réinitialiser" pour annuler
2. Le formulaire revient à l'état initial
3. Les images par défaut sont restaurées
```

## 🎯 Images par Défaut

Le système attribue automatiquement des images officielles Apple pour chaque catégorie :

| Catégorie | Image de Navigation | Image de Bannière |
|-----------|---------------------|-------------------|
| iPhone | iPhone 15 Pro | iPhone 15 Pro HD |
| iPad | iPad Pro 11" | iPad Pro 11" HD |
| Mac | MacBook Air | MacBook Air HD |
| Apple Watch | Apple Watch Series 9 | Apple Watch Series 9 HD |
| AirPods | AirPods Pro | AirPods Pro HD |
| Accessoires | Accessoires Apple | Accessoires Apple HD |

## 💾 Stockage et Persistance

### LocalStorage
- **Clé de stockage** : `categoryImage_[categoryId]`
- **Format** : Base64 encodé
- **Persistance** : Les images restent après rechargement de la page
- **Nettoyage** : Suppression possible via console ou réinitialisation

### Synchronisation
- **Temps réel** : Les changements s'appliquent immédiatement
- **Multi-onglets** : Synchronisation entre différentes fenêtres
- **Partage** : Les images sont locales à chaque navigateur

## 🚨 Gestion des Erreurs

### Erreurs Courantes
1. **Fichier trop volumineux** : Réduisez la taille de l'image
2. **Format non supporté** : Utilisez JPG, PNG ou WebP
3. **Upload échoué** : Vérifiez votre connexion internet
4. **Image corrompue** : Réessayez avec un autre fichier

### Messages de Succès
- ✅ "Image de catégorie mise à jour avec succès!"
- ✅ "Fichier sélectionné: [nom] ([taille])"
- ✅ "Image traitée avec succès: [taille] bytes"

## 🛠️ Développement et Maintenance

### Structure Technique
```
components/
├── CategoryImageManager.tsx    # Composant principal
├── DashboardView.tsx           # Intégration administration
└── App.tsx                     # Logique d'assignation d'images

services/
└── imageProcessing.ts          # Traitement et optimisation
```

### API et Services
- **Traitement d'image** : Optimisation automatique
- **Validation** : Vérification des fichiers
- **Journalisation** : Historique des actions
- **Base64** : Encodage pour stockage local

## 📱 Compatibilité

### Navigateurs Supportés
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Appareils
- **Desktop** : Interface complète
- **Tablette** : Adaptation responsive
- **Mobile** : Version simplifiée

## 🔒 Sécurité

### Mesures de Protection
- **Validation côté client** : Formats et tailles vérifiés
- **Limitation de taille** : Maximum 5MB par fichier
- **Nettoyage des données** : Aucun script exécuté
- **Accès restreint** : Réservé aux administrateurs

### Bonnes Pratiques
- Toujours valider les fichiers côté serveur
- Implémenter une limite de nombre d'uploads
- Nettoyer régulièrement le stockage local
- Sauvegarder les images importantes

## 🆘 Support et Dépannage

### Problèmes Fréquents

**L'image ne s'affiche pas ?**
- Vérifiez le format du fichier
- Réduisez la taille de l'image
- Réessayez avec un autre navigateur

**Le formulaire ne répond pas ?**
- Rafraîchissez la page
- Videz le cache du navigateur
- Vérifiez la console JavaScript

**Les images par défaut ne chargent pas ?**
- Vérifiez votre connexion internet
- Les URLs Apple peuvent être temporairement indisponibles
- Utilisez des images locales personnalisées

### Contact
Pour toute question ou problème technique, contactez l'équipe de développement via le système de support INZASTOR.

---

**Dernière mise à jour** : Novembre 2025  
**Version** : 1.0.0  
**Auteur** : INZASTOR Development Team