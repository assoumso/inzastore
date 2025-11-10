import React, { useState, useEffect } from 'react';
import { bannerService } from './services/bannerService';
import { Banner } from './services/bannerService';

// Composant de test pour vérifier le fonctionnement du Hero avec les bannières
const TestHeroComponent: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      // Pour le test, on utilise getAllBanners pour voir toutes les bannières
      const allBanners = await bannerService.getAllBanners();
      setBanners(allBanners);
      
      if (allBanners.length > 0) {
        setCurrentBannerIndex(0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des bannières:', error);
      setError('Erreur lors du chargement des bannières');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer une bannière de test
  const createTestBanner = async () => {
    try {
      const testBanner = {
        name: 'Bannière Test ' + new Date().toLocaleTimeString(),
        description: 'Ceci est une bannière de test créée automatiquement',
        buttonText: 'Cliquez ici',
        buttonLink: '#test',
        imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        position: banners.length,
        isActive: true
      };

      await bannerService.addBanner(testBanner);
      await loadBanners(); // Recharger les bannières
      alert('Bannière de test créée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création de la bannière de test:', error);
      alert('Erreur lors de la création de la bannière de test: ' + error);
    }
  };

  // Changement automatique des bannières toutes les 5 secondes
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % banners.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToNextBanner = () => {
    if (banners.length <= 1) return;
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToPrevBanner = () => {
    if (banners.length <= 1) return;
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <div className="bg-blue-100 p-8 rounded-lg text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-blue-700">Chargement des bannières...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-8 rounded-lg text-center">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={loadBanners}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="bg-yellow-100 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Aucune bannière disponible</h2>
        <p className="mb-4">Aucune bannière n'a été trouvée dans la base de données.</p>
        <button 
          onClick={createTestBanner}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Créer une bannière de test
        </button>
      </div>
    );
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="space-y-8">
      {/* Contrôles de test */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Contrôles de Test</h2>
        <div className="flex gap-4 mb-4">
          <button 
            onClick={createTestBanner}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Créer Bannière Test
          </button>
          <button 
            onClick={loadBanners}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Recharger
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Total des bannières: {banners.length} | 
          Bannières actives: {banners.filter(b => b.isActive).length} |
          Bannière actuelle: {currentBannerIndex + 1} / {banners.length}
        </p>
      </div>

      {/* Aperçu du Hero */}
      <div className="border-4 border-blue-500 rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-2 text-center font-bold">
          APERÇU DU HERO COMPONENT
        </div>
        
        <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
          {/* Image de la bannière */}
          <div className="absolute inset-0">
            {currentBanner.imageUrl ? (
              <img
                src={currentBanner.imageUrl}
                alt={currentBanner.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
            )}
            
            {/* Overlay sombre pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Contenu de la bannière */}
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {currentBanner.name}
              </h1>
              {currentBanner.description && (
                <p className="text-xl md:text-2xl mb-8">
                  {currentBanner.description}
                </p>
              )}
              {currentBanner.buttonText && currentBanner.buttonLink && (
                <a
                  href={currentBanner.buttonLink}
                  className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {currentBanner.buttonText}
                </a>
              )}
            </div>
          </div>

          {/* Navigation entre les bannières */}
          {banners.length > 1 && (
            <>
              {/* Bouton précédent */}
              <button
                onClick={goToPrevBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Bouton suivant */}
              <button
                onClick={goToNextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicateurs de position */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentBannerIndex
                        ? 'bg-white'
                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Informations détaillées de la bannière actuelle */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Détails de la bannière actuelle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>ID:</strong> {currentBanner.id}</div>
          <div><strong>Nom:</strong> {currentBanner.name}</div>
          <div><strong>Description:</strong> {currentBanner.description || 'Aucune'}</div>
          <div><strong>Texte du bouton:</strong> {currentBanner.buttonText || 'Aucun'}</div>
          <div><strong>Lien du bouton:</strong> {currentBanner.buttonLink || 'Aucun'}</div>
          <div><strong>Position:</strong> {currentBanner.position}</div>
          <div><strong>Active:</strong> {currentBanner.isActive ? 'Oui' : 'Non'}</div>
          <div><strong>Image:</strong> {currentBanner.imageUrl ? 'Oui' : 'Non'}</div>
        </div>
      </div>
    </div>
  );
};

export default TestHeroComponent;