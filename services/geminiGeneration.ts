import { ConfigService } from './config';
import { createGeminiService as createMockGeminiService } from './geminiMockService';

/**
 * Service d'IA basé sur Google Gemini
 * Remplace OpenAI pour la génération de contenu et d'images
 */

export interface GeminiGenerationOptions {
  productName: string;
  category?: string;
  brand?: string;
  language?: string;
  descriptionLength?: 'short' | 'medium' | 'long';
  tone?: 'professional' | 'casual' | 'luxury' | 'technical';
}

export interface GeminiGeneratedContent {
  description: string;
  features: string[];
  specifications: Record<string, string>;
  suggestedPrice?: number;
  suggestedCategory?: string;
  imagePrompt?: string;
}

export interface GeminiGeneratedImage {
  url: string;
  prompt: string;
}

/**
 * Service de génération de descriptions avec Gemini
 */
export class GeminiDescriptionService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
  private useMockMode: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ConfigService.getInstance().getGeminiApiKey();
    this.useMockMode = ConfigService.getInstance().shouldUseMockMode();
    
    if (!this.useMockMode && !this.apiKey) {
      throw new Error('Clé API Gemini non configurée. Veuillez définir VITE_GEMINI_API_KEY dans votre fichier .env.local');
    }
  }

  /**
   * Génère une description complète du produit avec Gemini
   */
  async generateProductContent(options: GeminiGenerationOptions): Promise<GeminiGeneratedContent> {
    // Si en mode mock, utiliser des données simulées
    if (this.useMockMode) {
      console.log('🎭 Mock Gemini: Génération de contenu simulé pour', options.productName);
      
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Données mock
      const mockResponses = [
        `DESCRIPTION: ${options.productName} - Produit haut de gamme avec des caractéristiques exceptionnelles.
CARACTÉRISTIQUES: Qualité supérieure | Design moderne | Performance optimale | Facile à utiliser
SPÉCIFICATIONS: Matériau:Premium | Dimensions:Standard | Poids:Léger | Couleur:Multiple
PRIX_SUGGÉRÉ: 299
CATÉGORIE: ${options.category || 'Général'}
PROMPT_IMAGE: Modern ${options.productName} product with sleek design and premium materials`,
        
        `DESCRIPTION: ${options.productName} - Solution innovante pour vos besoins quotidiens.
CARACTÉRISTIQUES: Technologie avancée | Économique | Écologique | Garantie incluse
SPÉCIFICATIONS: Durabilité:Haute | Certification:CE | Origine:Européenne | Maintenance:Facile
PRIX_SUGGÉRÉ: 149
CATÉGORIE: ${options.category || 'Maison'}
PROMPT_IMAGE: Sustainable ${options.productName} with eco-friendly design and modern aesthetics`
      ];
      
      // Sélectionner une réponse basée sur le nom du produit
      const responseIndex = Math.abs(options.productName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)) % mockResponses.length;
      
      return this.parseGeneratedContent(mockResponses[responseIndex], options);
    }
    
    // Sinon, utiliser l'API réelle
    const prompt = this.buildDescriptionPrompt(options);
    
    console.log('Gemini API Request:', {
      url: `${this.baseURL}/gemini-pro:generateContent?key=${this.apiKey.substring(0, 10)}...`,
      prompt: prompt.substring(0, 100) + '...',
      options: options
    });
    
    try {
      const response = await fetch(`${this.baseURL}/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text().catch(() => 'No error details');
        console.error('Gemini API Error Response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${response.statusText}. Details: ${errorData}`);
      }

      const data = await response.json();
      console.log('Gemini API Response:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Réponse API Gemini invalide: structure de données incorrecte');
      }
      
      const content = data.candidates[0].content.parts[0].text;
      
      return this.parseGeneratedContent(content, options);
    } catch (error) {
      console.error('Erreur lors de la génération de la description avec Gemini:', error);
      throw new Error('Impossible de générer la description du produit');
    }
  }

  /**
   * Construit le prompt pour Gemini
   */
  private buildDescriptionPrompt(options: GeminiGenerationOptions): string {
    const length = options.descriptionLength || 'medium';
    const tone = options.tone || 'professional';
    const language = options.language || 'français';
    
    let prompt = `Génère une description ${length} et ${tone} en ${language} pour le produit: "${options.productName}"`;
    
    if (options.category) {
      prompt += ` dans la catégorie ${options.category}`;
    }
    
    if (options.brand) {
      prompt += ` de la marque ${options.brand}`;
    }
    
    prompt += `\n\nLa réponse doit être structurée ainsi:\n`;
    prompt += `DESCRIPTION: [description principale engageante]\n`;
    prompt += `CARACTÉRISTIQUES: [liste de 3-5 caractéristiques clés, séparées par |]\n`;
    prompt += `SPÉCIFICATIONS: [spécifications techniques clés, format clé:valeur séparées par |]\n`;
    prompt += `PRIX_SUGGÉRÉ: [prix suggéré en euros, juste le nombre]\n`;
    prompt += `CATÉGORIE: [catégorie suggérée si différente]\n`;
    prompt += `PROMPT_IMAGE: [prompt détaillé pour générer une image du produit, en anglais]`;

    return prompt;
  }

  /**
   * Parse la réponse de Gemini
   */
  private parseGeneratedContent(content: string, options: GeminiGenerationOptions): GeminiGeneratedContent {
    const lines = content.split('\n');
    const result: GeminiGeneratedContent = {
      description: '',
      features: [],
      specifications: {}
    };

    lines.forEach(line => {
      if (line.startsWith('DESCRIPTION:')) {
        result.description = line.replace('DESCRIPTION:', '').trim();
      } else if (line.startsWith('CARACTÉRISTIQUES:')) {
        const features = line.replace('CARACTÉRISTIQUES:', '').trim();
        result.features = features.split('|').map(f => f.trim()).filter(f => f);
      } else if (line.startsWith('SPÉCIFICATIONS:')) {
        const specs = line.replace('SPÉCIFICATIONS:', '').trim();
        specs.split('|').forEach(spec => {
          const [key, value] = spec.split(':');
          if (key && value) {
            result.specifications[key.trim()] = value.trim();
          }
        });
      } else if (line.startsWith('PRIX_SUGGÉRÉ:')) {
        const price = line.replace('PRIX_SUGGÉRÉ:', '').trim();
        result.suggestedPrice = parseFloat(price) || undefined;
      } else if (line.startsWith('CATÉGORIE:')) {
        const category = line.replace('CATÉGORIE:', '').trim();
        if (category && category !== options.category) {
          result.suggestedCategory = category;
        }
      } else if (line.startsWith('PROMPT_IMAGE:')) {
        result.imagePrompt = line.replace('PROMPT_IMAGE:', '').trim();
      }
    });

    return result;
  }
}

/**
 * Service de génération d'images avec Gemini (utilisant Imagen ou alternative)
 */
export class GeminiImageService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  private useMockMode: boolean;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.useMockMode = ConfigService.getInstance().shouldUseMockMode();
  }

  /**
   * Génère une image de produit avec Gemini
   */
  async generateProductImage(
    prompt: string,
    size: '256x256' | '512x512' | '1024x1024' = '512x512'
  ): Promise<GeminiGeneratedImage> {
    try {
      // Si en mode mock, utiliser des images simulées
      if (this.useMockMode) {
        console.log('🎭 Mock Gemini: Génération d\'image simulée pour:', prompt);
        
        // Simuler un délai de génération d'image
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
        
        // URLs d'images mock
        const mockImageUrls = [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
        ];
        
        // Sélectionner une image basée sur le prompt
        const imageIndex = Math.abs(prompt.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0)) % mockImageUrls.length;
        
        return {
          url: mockImageUrls[imageIndex],
          prompt: prompt
        };
      }
      
      // Note: Gemini n'a pas encore d'API d'image publique stable
      // Pour l'instant, nous utilisons une approche alternative
      const mockImageUrl = this.generateMockImageUrl(prompt, size);
      
      return {
        url: mockImageUrl,
        prompt: prompt
      };
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image avec Gemini:', error);
      throw new Error('Impossible de générer l\'image du produit');
    }
  }

  /**
   * Génère une URL mock pour l'image (à remplacer par une vraie API)
   */
  private generateMockImageUrl(prompt: string, size: string): string {
    // Pour le développement, nous utilisons un service mock ou une image placeholder
    // Vous pouvez remplacer ceci par une vraie API de génération d'images
    const width = size.split('x')[0];
    const height = size.split('x')[1];
    
    // Option 1: Service placeholder (pour les tests)
    // return `https://via.placeholder.com/${size}/e3f2fd/1976d2?text=Product+Image`;
    
    // Option 2: Utiliser une API de génération d'images alternative
    // Ici vous pourriez intégrer:
    // - Stable Diffusion API
    // - DALL-E (si vous avez aussi une clé OpenAI)
    // - Un autre service de génération d'images
    
    // Pour cette démo, nous retournons une URL qui pourrait être remplacée
    return `https://source.unsplash.com/${width}x${height}/?product,${prompt.replace(/\s+/g, ',')}`;
  }
}

/**
 * Service principal combinant description et image avec Gemini
 */
export class GeminiProductGenerationService {
  private apiKey: string;
  private descriptionService: GeminiDescriptionService;
  private imageService: GeminiImageService;
  private useMockMode: boolean = false;

  constructor(apiKey?: string) {
    const configService = ConfigService.getInstance();
    this.apiKey = apiKey || configService.getGeminiApiKey();
    this.useMockMode = configService.shouldUseMockMode();
    
    if (!this.useMockMode && !this.apiKey) {
      throw new Error('Gemini API key is required. Please set VITE_GEMINI_API_KEY in your .env.local file');
    }
    
    console.log(this.useMockMode ? '🎭 Utilisation du service Mock Gemini' : '🔧 Utilisation du service Gemini réel');
    
    // Toujours initialiser les services, le mode mock est géré dans les méthodes
    this.descriptionService = new GeminiDescriptionService(this.apiKey);
    this.imageService = new GeminiImageService(this.apiKey);
  }

  /**
   * Génération complète avec description et image
   */
  async generateCompleteProduct(options: GeminiGenerationOptions): Promise<{
    content: GeminiGeneratedContent;
    image?: GeminiGeneratedImage;
  }> {
    console.log('🚀 Gemini: Génération complète de produit pour', options.productName);
    
    try {
      // Générer la description
      const content = await this.descriptionService.generateProductContent(options);
      
      let image: GeminiGeneratedImage | undefined;
      
      // Générer l'image si un prompt est disponible
      if (content.imagePrompt) {
        try {
          image = await this.imageService.generateProductImage(content.imagePrompt);
        } catch (imageError) {
          console.warn('Échec de la génération d\'image, mais la description est disponible:', imageError);
        }
      }
      
      return { content, image };
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
    }
  }

  /**
   * Régénère seulement la description
   */
  async regenerateDescription(options: GeminiGenerationOptions): Promise<GeminiGeneratedContent> {
    return this.descriptionService.generateProductContent(options);
  }

  /**
   * Régénère seulement l'image
   */
  async regenerateImage(prompt: string): Promise<GeminiGeneratedImage> {
    return this.imageService.generateProductImage(prompt);
  }
}