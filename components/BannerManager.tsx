/**
 * Composant d'administration pour la gestion des images de bannières
 * Permet l'upload, le recadrage et la prévisualisation des bannières
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  processImage, 
  validateImageFile, 
  generateImagePreview,
  DEFAULT_PROCESSING_OPTIONS,
  ImageProcessingLogger 
} from '../services/imageProcessing';
import { bannerService, Banner, BannerData } from '../services/bannerService';

interface BannerManagerProps {
  currentUser?: { id: string; email: string; role: string };
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_BANNERS = [
  { id: 'hero-main', name: 'Bannière Principale (Hero)', position: 1 },
  { id: 'promo-primary', name: 'Bannière Promotionnelle Primaire', position: 2 },
  { id: 'promo-secondary', name: 'Bannière Promotionnelle Secondaire', position: 3 },
  { id: 'new-arrivals', name: 'Bannière Nouveautés', position: 4 }
];

export const BannerManager: React.FC<BannerManagerProps> = ({ currentUser }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBannerName, setNewBannerName] = useState('');
  const [newBannerDescription, setNewBannerDescription] = useState('');
  const [newBannerButtonText, setNewBannerButtonText] = useState('');
  const [newBannerButtonLink, setNewBannerButtonLink] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logger = ImageProcessingLogger.getInstance();

  // Charger les bannières au démarrage
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      const loadedBanners = await bannerService.getAllBanners();
      setBanners(loadedBanners);
      addLog(`Bannières chargées: ${loadedBanners.length}`);
    } catch (error) {
      setError('Erreur lors du chargement des bannières');
      addLog(`Erreur chargement: ${error}`, false);
    } finally {
      setIsLoading(false);
    }
  };

  const addLog = useCallback((message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-9), logEntry]); // Garder les 10 derniers logs
    logger.log('Banner Manager', message, success);
  }, [logger]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const validation = validateImageFile(file, 5); // 5MB max
    if (!validation.isValid) {
      setError(validation.error || 'Fichier invalide');
      addLog(`Validation échouée: ${validation.error}`, false);
      return;
    }

    setSelectedFile(file);
    setError('');
    
    try {
      // Générer un aperçu optimisé pour les bannières (format paysage)
      const preview = await generateImagePreview(file, 600, 400);
      setPreviewUrl(preview);
      addLog(`Fichier sélectionné: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (error) {
      setError('Erreur lors de la génération de l\'aperçu');
      addLog(`Erreur aperçu: ${error}`, false);
    }
  };

  const handleBannerUpdate = async () => {
    if (!selectedBanner || !selectedFile) {
      setError('Veuillez sélectionner une bannière et une image');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      addLog(`Mise à jour de la bannière: ${selectedBanner}`);

      // Traiter l'image
      const processedBlob = await processImage(selectedFile, {
        ...DEFAULT_PROCESSING_OPTIONS,
        maxWidth: 1920, // Largeur maximale pour les bannières
        maxHeight: 1080, // Hauteur maximale pour les bannières
        quality: 0.9,  // Haute qualité pour les bannières
        maintainAspectRatio: true,
        backgroundColor: '#FFFFFF'
      });

      addLog(`Image traitée avec succès: ${processedBlob.size} bytes`);

      // Utiliser le service Firebase pour mettre à jour
      const bannerToUpdate = banners.find(b => b.id === selectedBanner);
      if (!bannerToUpdate) {
        throw new Error('Bannière non trouvée');
      }

      await bannerService.updateBanner(selectedBanner, {
        name: bannerToUpdate.name,
        imageFile: processedBlob
      });

      // Recharger les bannières
      await loadBanners();

      setSuccess('Image de bannière mise à jour avec succès!');
      addLog(`Image mise à jour pour la bannière: ${selectedBanner}`, true);

      // Réinitialiser le formulaire
      setSelectedFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur lors de la mise à jour: ${errorMessage}`);
      addLog(`Erreur mise à jour: ${errorMessage}`, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNewBanner = async () => {
    if (!newBannerName || !selectedFile) {
      setError('Veuillez entrer un nom et sélectionner une image');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      addLog(`Création d'une nouvelle bannière: ${newBannerName}`);

      // Traiter l'image
      const processedBlob = await processImage(selectedFile, {
        ...DEFAULT_PROCESSING_OPTIONS,
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.9,
        maintainAspectRatio: true,
        backgroundColor: '#FFFFFF'
      });

      addLog(`Image traitée pour la nouvelle bannière: ${processedBlob.size} bytes`);

      // Utiliser le service Firebase pour ajouter
      await bannerService.addBanner({
        name: newBannerName,
        description: newBannerDescription,
        buttonText: newBannerButtonText,
        buttonLink: newBannerButtonLink,
        imageFile: processedBlob
      });

      // Recharger les bannières
      await loadBanners();

      setSuccess('Nouvelle bannière créée avec succès!');
      addLog(`Nouvelle bannière créée: ${newBannerName}`, true);

      // Réinitialiser le formulaire
      setNewBannerName('');
      setSelectedFile(null);
      setPreviewUrl('');
      setShowAddForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur lors de la création: ${errorMessage}`);
      addLog(`Erreur création: ${errorMessage}`, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      return;
    }

    try {
      setIsProcessing(true);
      addLog(`Suppression de la bannière: ${bannerId}`);
      
      await bannerService.deleteBanner(bannerId);
      
      // Recharger les bannières
      await loadBanners();
      
      setSuccess('Bannière supprimée avec succès!');
      addLog(`Bannière supprimée: ${bannerId}`, true);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur lors de la suppression: ${errorMessage}`);
      addLog(`Erreur suppression: ${errorMessage}`, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    setSuccess('');
    setNewBannerName('');
    setNewBannerDescription('');
    setNewBannerButtonText('');
    setNewBannerButtonLink('');
    setShowAddForm(false);
    if (fileInputRef.current) {
      fileInputRef.value = '';
    }
    addLog('Formulaire réinitialisé');
  };

  const handleViewLogs = () => {
    const allLogs = logger.getLogs();
    console.log('Logs complets:', allLogs);
    alert(`Journal des actions (${allLogs.length} entrées):\n\n${allLogs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.action} - ${log.success ? 'Succès' : 'Échec'}`
    ).join('\n')}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestion des Bannières
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleViewLogs}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Voir les logs
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            {showAddForm ? 'Annuler' : 'Ajouter'}
          </button>
          {currentUser && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
              Connecté: {currentUser.email}
            </span>
          )}
        </div>
      </div>

      {/* État de chargement */}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-blue-700">Chargement des bannières...</p>
        </div>
      )}

      {/* Aperçu des bannières existantes */}
      {!isLoading && banners.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bannières actuelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-2">
                  <h4 className="font-medium text-gray-800">{banner.name}</h4>
                  <p className="text-sm text-gray-500">ID: {banner.id}</p>
                </div>
                {banner.imageUrl && (
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.name}
                    className="w-full h-32 object-cover rounded border"
                  />
                )}
                {!banner.imageUrl && (
                  <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Pas d'image</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs en temps réel */}
      {logs.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Activité récente:</h3>
          <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire d'ajout de bannière */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajouter une nouvelle bannière</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la bannière:
            </label>
            <input
              type="text"
              value={newBannerName}
              onChange={(e) => setNewBannerName(e.target.value)}
              placeholder="Ex: Bannière Soldes d\'été"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle):
            </label>
            <textarea
              value={newBannerDescription}
              onChange={(e) => setNewBannerDescription(e.target.value)}
              placeholder="Description de la bannière..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texte du bouton (optionnel):
            </label>
            <input
              type="text"
              value={newBannerButtonText}
              onChange={(e) => setNewBannerButtonText(e.target.value)}
              placeholder="Ex: Voir les soldes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien du bouton (optionnel):
            </label>
            <input
              type="url"
              value={newBannerButtonLink}
              onChange={(e) => setNewBannerButtonLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de la bannière:
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {previewUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu:
              </label>
              <img src={previewUrl} alt="Aperçu" className="max-w-full h-48 object-cover rounded-lg border" />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddNewBanner}
              disabled={isProcessing || !newBannerName || !selectedFile}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Création...' : 'Créer la bannière'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Sélection de la bannière existante */}
      {!showAddForm && !isLoading && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner une bannière à modifier:
          </label>
          <select
            value={selectedBanner}
            onChange={(e) => {
              setSelectedBanner(e.target.value);
              addLog(`Bannière sélectionnée: ${e.target.value}`);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choisir une bannière --</option>
            {banners.map((banner) => (
              <option key={banner.id} value={banner.id}>
                {banner.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Upload de l'image (pour la modification) */}
      {!showAddForm && selectedBanner && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouvelle image de bannière:
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Aperçu de l'image */}
      {previewUrl && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aperçu:
          </label>
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Aperçu" 
              className="max-w-full h-64 object-cover rounded-lg border border-gray-300"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Format paysage recommandé
            </div>
          </div>
        </div>
      )}

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Boutons d'action */}
      {!showAddForm && selectedBanner && (
        <div className="flex gap-2">
          <button
            onClick={handleBannerUpdate}
            disabled={isProcessing || !selectedFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
          <button
            onClick={() => handleDeleteBanner(selectedBanner)}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Supprimer
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      )}

      {/* Canvas caché pour le traitement */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BannerManager;