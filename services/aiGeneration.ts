/**
 * Service d'IA pour la génération automatique de contenu produit
 * Intègre OpenAI pour les descriptions et la génération d'images
 */

export interface AIGenerationOptions {
  productName: string;
  category?: string;
  brand?: string;
  language?: string;
  descriptionLength?: 'short' | 'medium' | 'long';
  tone?: 'professional' | 'casual' | 'luxury' | 'technical';
}

export interface GeneratedContent {
  description: string;
  features: string[];
  specifications: Record<string, string>;
  suggestedPrice?: number;
  suggestedCategory?: string;
  imagePrompt?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  revisedPrompt?: string;
}

/**
 * Service de génération de descriptions avec OpenAI
 */
export class AIDescriptionService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Génère une description complète du produit
   */
  async generateProductContent(options: AIGenerationOptions): Promise<GeneratedContent> {
    const prompt = this.buildDescriptionPrompt(options);
    
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en marketing produit. Génère des descriptions engageantes et professionnelles.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      return this.parseGeneratedContent(content, options);
    } catch (error) {
      console.error('Erreur lors de la génération de la description:', error);
      throw new Error('Impossible de générer la description du produit');
    }
  }

  /**
   * Construit le prompt pour OpenAI
   */
  private buildDescriptionPrompt(options: AIGenerationOptions): string {
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
   * Parse la réponse d'OpenAI
   */
  private parseGeneratedContent(content: string, options: AIGenerationOptions): GeneratedContent {
    const lines = content.split('\n');
    const result: GeneratedContent = {
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
 * Service de génération d'images avec DALL-E
 */
export class AIImageService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Génère une image de produit
   */
  async generateProductImage(
    prompt: string,
    size: '256x256' | '512x512' | '1024x1024' = '512x512',
    quality: 'standard' | 'hd' = 'standard'
  ): Promise<GeneratedImage> {
    try {
      const response = await fetch(`${this.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Professional product photography, ${prompt}, clean background, high quality, commercial use`,
          n: 1,
          size,
          quality,
          style: 'photographic'
        })
      });

      if (!response.ok) {
        throw new Error(`DALL-E API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        url: data.data[0].url,
        prompt: prompt,
        revisedPrompt: data.data[0].revised_prompt
      };
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error);
      throw new Error('Impossible de générer l\'image du produit');
    }
  }
}

/**
 * Service principal combinant description et image
 */
export class AIProductGenerationService {
  private descriptionService: AIDescriptionService;
  private imageService: AIImageService;

  constructor(openaiApiKey: string) {
    this.descriptionService = new AIDescriptionService(openaiApiKey);
    this.imageService = new AIImageService(openaiApiKey);
  }

  /**
   * Génère le contenu complet d'un produit
   */
  async generateCompleteProduct(options: AIGenerationOptions): Promise<{
    content: GeneratedContent;
    image?: GeneratedImage;
  }> {
    try {
      // Générer la description
      const content = await this.descriptionService.generateProductContent(options);
      
      let image: GeneratedImage | undefined;
      
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
      console.error('Erreur lors de la génération complète du produit:', error);
      throw error;
    }
  }

  /**
   * Régénère seulement la description
   */
  async regenerateDescription(options: AIGenerationOptions): Promise<GeneratedContent> {
    return this.descriptionService.generateProductContent(options);
  }

  /**
   * Régénère seulement l'image
   */
  async regenerateImage(prompt: string): Promise<GeneratedImage> {
    return this.imageService.generateProductImage(prompt);
  }
}