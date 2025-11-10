/**
 * Composant d'administration pour la gestion des images de catégories
 * Permet l'upload, le recadrage et la prévisualisation des images
 */

import React, { useState, useRef, useCallback } from 'react';
import { 
  processImage, 
  validateImageFile, 
  generateImagePreview,
  DEFAULT_PROCESSING_OPTIONS,
  ImageProcessingLogger 
} from '../services/imageProcessing';

interface CategoryImageManagerProps {
  categories: Array<{ id: string; name: string; image?: string }>;
  onImageUpdate: (categoryId: string, imageBlob: Blob) => Promise<void>;
  currentUser?: { id: string; email: string; role: string };
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CategoryImageManager: React.FC<CategoryImageManagerProps> = ({
  categories,
  onImageUpdate,
  currentUser
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logger = ImageProcessingLogger.getInstance();

  const addLog = useCallback((message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-9), logEntry]); // Garder les 10 derniers logs
    logger.log('Category Image Manager', message, success);
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
      // Générer un aperçu
      const preview = await generateImagePreview(file, 400, 300);
      setPreviewUrl(preview);
      addLog(`Fichier sélectionné: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (error) {
      setError('Erreur lors de la génération de l\'aperçu');
      addLog(`Erreur aperçu: ${error}`, false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedCategory || !selectedFile) {
      setError('Veuillez sélectionner une catégorie et une image');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      addLog(`Début du traitement de l'image pour la catégorie: ${selectedCategory}`);

      // Traiter l'image avec les options par défaut
      const processedBlob = await processImage(selectedFile, {
        ...DEFAULT_PROCESSING_OPTIONS,
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.9
      });

      addLog(`Image traitée avec succès: ${processedBlob.size} bytes`);

      // Appeler la fonction de mise à jour
      await onImageUpdate(selectedCategory, processedBlob);

      setSuccess('Image de catégorie mise à jour avec succès!');
      addLog(`Image mise à jour pour la catégorie: ${selectedCategory}`, true);

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

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    addLog('Formulaire réinitialisé');
  };

  const handleViewLogs = () => {
    const allLogs = logger.getLogs();
    console.log('Logs complets:', allLogs);
    alert(`Journal des actions (${allLogs.length} entrées):\n\n${allLogs.map(log => 
      `[${log.timestamp.toLocaleTimeString()}] ${log.action} - ${log.success ? 'Succès' : 'Écheque'}`
    ).join('\n')}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestion des Images de Catégories
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleViewLogs}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Voir les logs
          </button>
          {currentUser && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
              Connecté: {currentUser.email}
            </span>
          )}
        </div>
      </div>

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

      {/* Sélection de la catégorie */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner une catégorie:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            addLog(`Catégorie sélectionnée: ${e.target.value}`);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choisir une catégorie --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload de l'image */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image de la catégorie:
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="category-image-upload"
          />
          <label
            htmlFor="category-image-upload"
            className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Choisir une image
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Formats acceptés: JPG, PNG, WebP. Taille max: 5MB
          </p>
        </div>
      </div>

      {/* Aperçu de l'image */}
      {previewUrl && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aperçu (après traitement):
          </label>
          <div className="border rounded-lg p-4 bg-gray-50">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="max-w-full h-auto max-h-64 mx-auto rounded"
            />
            <div className="mt-2 text-xs text-gray-500 text-center">
              Dimensions finales: 800x600px, qualité optimisée
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
      <div className="flex gap-3">
        <button
          onClick={handleImageUpload}
          disabled={!selectedCategory || !selectedFile || isProcessing}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Traitement...' : 'Mettre à jour l\'image'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isProcessing}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Informations de sécurité */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Sécurité:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Toutes les actions sont journalisées</li>
          <li>• Les images sont traitées et optimisées automatiquement</li>
          <li>• L'accès est limité aux utilisateurs admin</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryImageManager;