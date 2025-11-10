/**
 * Service mock pour Gemini permettant de tester l'interface sans appel API réel
 * Cette implémentation retourne des données simulées pour le développement
 */

import { 
  GeminiGenerationOptions, 
  GeminiGeneratedContent, 
  GeminiGeneratedImage,
  GeminiProductGenerationService
} from './geminiGeneration';

export class MockGeminiDescriptionService {
  private apiKey: string;
  private mockResponses: string[] = [
    `DESCRIPTION: Smartphone haut de gamme avec écran OLED de 6.7 pouces, processeur puissant et appareil photo professionnel.
CARACTÉRISTIQUES: Écran OLED 120Hz | Processeur Snapdragon 8 Gen 3 | Triple caméra 108MP | Batterie 5000mAh
SPÉCIFICATIONS: RAM:12GB | Stockage:256GB | Écran:6.7 pouces | Batterie:5000mAh
PRIX_SUGGÉRÉ: 899
CATÉGORIE: Électronique
PROMPT_IMAGE: Modern smartphone with sleek design, OLED display, professional camera system`,

    `DESCRIPTION: Ordinateur portable puissant pour le gaming et le travail créatif avec carte graphique dédiée.
CARACTÉRISTIQUES: Processeur Intel i7 | RTX 4060 8GB | 16GB RAM | SSD 1TB
SPÉCIFICATIONS: Écran:15.6 pouces | RAM:16GB | Stockage:1TB SSD | GPU:RTX 4060
PRIX_SUGGÉRÉ: 1299
CATÉGORIE: Informatique
PROMPT_IMAGE: Gaming laptop with RGB keyboard, high-performance design`,

    `DESCRIPTION: Montre connectée élégante avec suivi de santé avancé et autonomie prolongée.
CARACTÉRISTIQUES: Écran AMOLED | GPS intégré | Résistante à l'eau | Autonomie 7 jours
SPÉCIFICATIONS: Batterie:7 jours | Étanchéité:5ATM | Connectivité:Bluetooth 5.0 | GPS:Oui
PRIX_SUGGÉRÉ: 349
CATÉGORIE: Accessoires
PROMPT_IMAGE: Elegant smartwatch with health tracking features, modern design`
  ];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'mock-key';
  }

  /**
   * Génère un contenu mock pour le produit
   */
  async generateProductContent(options: GeminiGenerationOptions): Promise<GeminiGeneratedContent> {
    console.log('🎭 Mock Gemini: Génération de contenu simulé pour', options.productName);
    
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Sélectionner une réponse mock basée sur le nom du produit
    const responseIndex = Math.abs(options.productName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)) % this.mockResponses.length;
    
    const mockResponse = this.mockResponses[responseIndex];
    
    // Personnaliser la réponse avec le nom du produit
    const personalizedResponse = mockResponse.replace(
      /DESCRIPTION:.*?\n/,
      `DESCRIPTION: ${options.productName} - ${mockResponse.split('\n')[0].replace('DESCRIPTION: ', '')}\n`
    );
    
    return this.parseGeneratedContent(personalizedResponse, options);
  }

  /**
   * Parse le contenu généré (même logique que le service réel)
   */
  private parseGeneratedContent(response: string, options: GeminiGenerationOptions): GeminiGeneratedContent {
    const lines = response.split('\n').filter(line => line.trim());
    
    const content: GeminiGeneratedContent = {
      productName: options.productName,
      description: '',
      features: [],
      specifications: [],
      price: 0,
      category: 'Autre',
      imagePrompt: ''
    };

    for (const line of lines) {
      if (line.startsWith('DESCRIPTION:')) {
        content.description = line.replace('DESCRIPTION:', '').trim();
      } else if (line.startsWith('CARACTÉRISTIQUES:')) {
        content.features = line.replace('CARACTÉRISTIQUES:', '').split('|').map(f => f.trim()).filter(f => f);
      } else if (line.startsWith('SPÉCIFICATIONS:')) {
        content.specifications = line.replace('SPÉCIFICATIONS:', '').split('|').map(s => s.trim()).filter(s => s);
      } else if (line.startsWith('PRIX_SUGGÉRÉ:')) {
        content.price = parseInt(line.replace('PRIX_SUGGÉRÉ:', '').trim()) || 0;
      } else if (line.startsWith('CATÉGORIE:')) {
        content.category = line.replace('CATÉGORIE:', '').trim();
      } else if (line.startsWith('PROMPT_IMAGE:')) {
        content.imagePrompt = line.replace('PROMPT_IMAGE:', '').trim();
      }
    }

    return content;
  }
}

export class MockGeminiImageService {
  private apiKey: string;
  private mockImageUrls: string[] = [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
  ];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Génère une image mock
   */
  async generateProductImage(
    prompt: string,
    size: '256x256' | '512x512' | '1024x1024' = '512x512'
  ): Promise<GeminiGeneratedImage> {
    console.log('🎭 Mock Gemini: Génération d\'image simulée pour:', prompt);
    
    // Simuler un délai de génération d'image
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Sélectionner une image basée sur le prompt
    const imageIndex = Math.abs(prompt.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)) % this.mockImageUrls.length;
    
    return {
      url: this.mockImageUrls[imageIndex],
      prompt: prompt,
      altText: `Image générée pour: ${prompt.substring(0, 50)}...`
    };
  }
}

export class MockGeminiProductGenerationService {
  private apiKey: string;
  private mockDescriptionService: MockGeminiDescriptionService;
  private mockImageService: MockGeminiImageService;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'mock-key';
    this.mockDescriptionService = new MockGeminiDescriptionService(this.apiKey);
    this.mockImageService = new MockGeminiImageService(this.apiKey);
  }

  /**
   * Génération complète avec services mock
   */
  async generateCompleteProduct(options: GeminiGenerationOptions): Promise<{
    content: GeminiGeneratedContent;
    image?: GeminiGeneratedImage;
  }> {
    console.log('🎭 Mock Gemini: Génération complète de produit pour', options.productName);
    
    try {
      // Générer la description
      const content = await this.mockDescriptionService.generateProductContent(options);
      
      let image: GeminiGeneratedImage | undefined;
      
      // Générer l'image si demandé
      if (options.includeImage && content.imagePrompt) {
        image = await this.mockImageService.generateProductImage(content.imagePrompt);
      }
      
      return { content, image };
    } catch (error) {
      console.error('🎭 Mock Gemini Error:', error);
      throw error;
    }
  }
}

/**
 * Factory pour créer le service approprié (mock ou réel)
 */
export function createGeminiService(apiKey?: string, useMock: boolean = false) {
  if (useMock || !apiKey || apiKey === 'mock-key') {
    console.log('🎭 Utilisation du service Mock Gemini');
    return new MockGeminiProductGenerationService(apiKey);
  } else {
    console.log('🔧 Utilisation du service Gemini réel');
    return new GeminiProductGenerationService(apiKey);
  }
}