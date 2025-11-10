/**
 * Service de traitement d'images professionnel
 * Gère le redimensionnement, la compression et l'optimisation des images
 */

export interface ImageProcessingOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0.1 to 1.0
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  maintainAspectRatio: boolean;
  backgroundColor: string;
}

export const DEFAULT_PROCESSING_OPTIONS: ImageProcessingOptions = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.85,
  format: 'image/webp',
  maintainAspectRatio: true,
  backgroundColor: '#FFFFFF'
};

/**
 * Traite une image avec redimensionnement et optimisation
 */
export async function processImage(
  file: File, 
  options: Partial<ImageProcessingOptions> = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_PROCESSING_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Calculer les dimensions finales en conservant le ratio
          let { width, height } = calculateDimensions(
            img.width, 
            img.height, 
            opts.maxWidth, 
            opts.maxHeight, 
            opts.maintainAspectRatio
          );

          canvas.width = opts.maxWidth;
          canvas.height = opts.maxHeight;

          // Remplir le fond si nécessaire
          if (opts.backgroundColor !== 'transparent') {
            ctx.fillStyle = opts.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Centrer l'image
          const x = (canvas.width - width) / 2;
          const y = (canvas.height - height) / 2;

          // Dessiner l'image avec lissage
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, x, y, width, height);

          // Convertir en blob avec compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            opts.format,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Calcule les dimensions finales en conservant le ratio d'aspect
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return { width: maxWidth, height: maxHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Valide le format et la taille d'une image
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): {
  isValid: boolean;
  error?: string;
} {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Format non supporté. Formats acceptés: JPG, PNG, WebP`
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Image trop volumineuse. Taille maximum: ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
}

/**
 * Génère un aperçu d'image optimisé pour l'affichage
 */
export async function generateImagePreview(
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  const processedBlob = await processImage(file, {
    maxWidth,
    maxHeight,
    quality: 0.7,
    format: 'image/jpeg',
    maintainAspectRatio: true,
    backgroundColor: '#F5F5F5'
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to create preview'));
    reader.readAsDataURL(processedBlob);
  });
}

/**
 * Compresse une image existante (URL ou base64)
 */
export async function compressImageFromUrl(
  imageUrl: string,
  options: Partial<ImageProcessingOptions> = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const opts = { ...DEFAULT_PROCESSING_OPTIONS, ...options };
        
        let { width, height } = calculateDimensions(
          img.width,
          img.height,
          opts.maxWidth,
          opts.maxHeight,
          opts.maintainAspectRatio
        );

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = () => reject(new Error('Failed to read blob'));
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          opts.format,
          opts.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image from URL'));
    };

    img.src = imageUrl;
  });
}

/**
 * Service de journalisation pour les actions d'administration
 */
export class ImageProcessingLogger {
  private static instance: ImageProcessingLogger;
  private logs: Array<{
    timestamp: Date;
    action: string;
    details: any;
    success: boolean;
    error?: string;
  }> = [];

  static getInstance(): ImageProcessingLogger {
    if (!ImageProcessingLogger.instance) {
      ImageProcessingLogger.instance = new ImageProcessingLogger();
    }
    return ImageProcessingLogger.instance;
  }

  log(action: string, details: any, success: boolean = true, error?: string) {
    this.logs.push({
      timestamp: new Date(),
      action,
      details,
      success,
      error
    });

    // Garder seulement les 100 dernières entrées
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Log dans la console pour le développement
    console.log(`[ImageProcessing] ${action}:`, { details, success, error });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}