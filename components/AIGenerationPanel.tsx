/**
 * Composant d'intégration IA pour le formulaire de création de produit
 * Permet la génération automatique de descriptions et d'images
 */

import React, { useState, useCallback } from 'react';
import { 
  GeminiProductGenerationService, 
  GeminiImageService,
  GeminiGenerationOptions,
  GeminiGeneratedContent,
  GeminiGeneratedImage
} from '../services/geminiGeneration';
import { createGeminiService } from '../services/geminiMockService';
import { processImage, ImageProcessingLogger } from '../services/imageProcessing';
import { ConfigService } from '../services/config';

interface AIGenerationPanelProps {
  onContentGenerated: (content: GeminiGeneratedContent, image?: File) => void;
  currentUser?: { id: string; email: string; role: string };
  apiKey?: string;
}

export const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  onContentGenerated,
  currentUser,
  apiKey = ConfigService.getInstance().getGeminiApiKey() || ''
}) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeminiGeneratedContent | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeminiGeneratedImage | null>(null);
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [generationStep, setGenerationStep] = useState<string>('');

  const logger = ImageProcessingLogger.getInstance();

  const addLog = useCallback((message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-9), logEntry]);
    logger.log('AI Generation', message, success);
  }, [logger]);

  const handleGenerateContent = async () => {
    if (!productName.trim()) {
      setError('Veuillez entrer le nom du produit');
      return;
    }

    const configService = ConfigService.getInstance();
    const currentApiKey = apiKey || configService.getGeminiApiKey();
    const shouldUseMock = configService.shouldUseMockMode();
    
    if (!currentApiKey && !shouldUseMock) {
      setError('Clé API Gemini non configurée');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationStep('Préparation...');
    addLog(`Début de la génération pour: ${productName}`);

    try {
      const options: AIGenerationOptions = {
        productName: productName.trim(),
        category: category || undefined,
        brand: brand || undefined,
        language: 'français',
        descriptionLength: 'medium',
        tone: 'professional'
      };

      setGenerationStep('Génération de la description...');
      // Utiliser le service qui prend en compte le mode mock automatiquement
      const aiService = createGeminiService(currentApiKey);
      const result = await aiService.generateCompleteProduct(options);

      setGeneratedContent(result.content);
      setGeneratedImage(result.image || null);
      
      addLog(`Description générée avec ${result.content.features.length} caractéristiques`);
      
      if (result.image) {
        addLog(`Image générée: ${result.image.url}`);
      }

      setGenerationStep('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur de génération: ${errorMessage}`);
      addLog(`Erreur: ${errorMessage}`, false);
      setGenerationStep('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateDescription = async () => {
    if (!apiKey || !productName) return;

    setIsGenerating(true);
    setError('');
    
    try {
      const service = createGeminiService(apiKey);
      // Régénérer la description complète
      const newContent = await service.generateCompleteProduct({
        productName: productName.trim(),
        category: category || undefined,
        brand: brand || undefined,
        language: 'français',
        descriptionLength: 'medium',
        tone: 'professional',
        includeImage: false // Ne pas inclure d'image lors de la régénération
      });

      setGeneratedContent(newContent.content);
      addLog('Description régénérée');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur: ${errorMessage}`);
      addLog(`Erreur régénération: ${errorMessage}`, false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!apiKey || !generatedContent?.imagePrompt) return;

    setIsGenerating(true);
    setError('');
    
    try {
      const service = createGeminiService(apiKey);
      // Utiliser le service d'image directement
      const imageService = new GeminiImageService(apiKey);
      const newImage = await imageService.generateProductImage(generatedContent.imagePrompt);
      setGeneratedImage(newImage);
      addLog('Image régénérée');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur: ${errorMessage}`);
      addLog(`Erreur régénération image: ${errorMessage}`, false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToForm = async () => {
    if (!generatedContent) return;

    try {
      let imageFile: File | undefined;
      
      if (generatedImage?.url) {
        setGenerationStep('Téléchargement et traitement de l\'image...');
        
        // Vérifier si c'est une image locale (data URL) ou une image générée (URL http)
        if (generatedImage.url.startsWith('data:')) {
          // Image locale déjà en base64 - la convertir en fichier
          const base64Data = generatedImage.url.split(',')[1];
          const mimeType = generatedImage.url.split(',')[0].split(':')[1].split(';')[0];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: mimeType });
          
          // Traiter l'image pour optimisation
          const processedBlob = await processImage(
            new File([blob], `${productName.replace(/\s+/g, '_')}_local.jpg`, { type: mimeType }),
            {
              maxWidth: 800,
              maxHeight: 600,
              quality: 0.85,
              format: 'image/webp',
              maintainAspectRatio: true,
              backgroundColor: '#FFFFFF'
            }
          );

          imageFile = new File([processedBlob], `${productName.replace(/\s+/g, '_')}_optimized.webp`, { 
            type: 'image/webp' 
          });
        } else {
          // Image générée - télécharger depuis l'URL
          const response = await fetch(generatedImage.url);
          const blob = await response.blob();
          
          // Traiter l'image pour optimisation
          const processedBlob = await processImage(
            new File([blob], `${productName.replace(/\s+/g, '_')}_generated.jpg`, { type: 'image/jpeg' }),
            {
              maxWidth: 800,
              maxHeight: 600,
              quality: 0.85,
              format: 'image/webp',
              maintainAspectRatio: true,
              backgroundColor: '#FFFFFF'
            }
          );

          imageFile = new File([processedBlob], `${productName.replace(/\s+/g, '_')}_optimized.webp`, { 
            type: 'image/webp' 
          });
        }
        
        addLog('Image téléchargée et optimisée');
      }

      // Créer l'objet de contenu avec le prix suggéré
      const contentToApply = {
        ...generatedContent,
        imageUrl: typeof generatedImage?.url === 'string' ? generatedImage.url : '' // Inclure l'URL de l'image dans le contenu (chaîne uniquement)
      };

      // Appliquer le contenu au formulaire
      onContentGenerated(contentToApply, imageFile);
      addLog('Contenu appliqué au formulaire');
      
      // Réinitialiser après application
      setGeneratedContent(null);
      setGeneratedImage(null);
      setGenerationStep('');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(`Erreur lors de l\'application: ${errorMessage}`);
      addLog(`Erreur application: ${errorMessage}`, false);
      setGenerationStep('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Génération IA de Contenu Produit
        </h2>
        {currentUser && (
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
            Connecté: {currentUser.email}
          </span>
        )}
      </div>

      {/* Logs en temps réel */}
      {logs.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Activité récente:</h3>
          <div className="text-xs text-gray-600 space-y-1 max-h-24 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire de génération */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Smartphone Samsung Galaxy S24"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie (optionnel)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Téléphones"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque (optionnel)
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Samsung"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateContent}
          disabled={isGenerating || !productName.trim() || !apiKey}
          className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {generationStep || 'Génération en cours...'}
            </span>
          ) : (
            'Générer automatiquement'
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Résultats de la génération */}
      {generatedContent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contenu Généré</h3>
          
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
            <textarea
              value={generatedContent.description}
              onChange={(e) => setGeneratedContent({...generatedContent, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Caractéristiques */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Caractéristiques:</label>
            <textarea
              value={generatedContent.features.join('\n')}
              onChange={(e) => setGeneratedContent({...generatedContent, features: e.target.value.split('\n').filter(f => f.trim())})}
              rows={3}
              placeholder="Une caractéristique par ligne"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix suggéré */}
          {generatedContent.suggestedPrice && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix suggéré: {generatedContent.suggestedPrice}€
              </label>
              <button
                type="button"
                onClick={() => setGeneratedContent({...generatedContent, suggestedPrice: undefined})}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Ne pas utiliser ce prix
              </button>
            </div>
          )}

          {/* Image générée */}
          {generatedImage && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image générée:</label>
              <div className="border rounded-lg p-3 bg-white">
                <img
                  src={generatedImage.url}
                  alt="Produit généré"
                  className="max-w-full h-auto max-h-48 mx-auto rounded"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Prompt: {generatedImage.prompt}
                </p>
                <div className="mt-3 flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-upload-local')?.click()}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Remplacer par une image locale
                  </button>
                  <input
                    id="image-upload-local"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setGeneratedImage({
                            ...generatedImage,
                            url: reader.result as string,
                            prompt: `Image locale: ${file.name}`
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setGeneratedImage(null)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Ne pas utiliser d'image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de régénération */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleRegenerateDescription}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 transition-colors text-sm"
            >
              Régénérer description
            </button>
            
            {generatedContent.imagePrompt && (
              <button
                onClick={handleRegenerateImage}
                disabled={isGenerating}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 transition-colors text-sm"
              >
                Régénérer image
              </button>
            )}
          </div>

          {/* Bouton d'application */}
          <button
            onClick={handleApplyToForm}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 transition-colors font-semibold"
          >
            Appliquer au formulaire
          </button>
        </div>
      )}

      {/* Configuration requise */}
      {!apiKey && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Configuration requise:</h3>
          <p className="text-sm text-yellow-700">
            Pour utiliser la génération IA, vous devez configurer une clé API OpenAI dans les paramètres.
          </p>
        </div>
      )}

      {/* Informations de sécurité */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Sécurité et performance:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Les images générées sont automatiquement optimisées</li>
          <li>• Les appels API sont journalisés pour sécurité</li>
          <li>• Un timeout est appliqué pour éviter les blocages</li>
          <li>• Vous pouvez modifier le contenu généré avant validation</li>
        </ul>
      </div>
    </div>
  );
};

export default AIGenerationPanel;