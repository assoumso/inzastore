// Service de configuration pour l'application
export class ConfigService {
  private static instance: ConfigService;
  private useMockMode: boolean = false;
  
  private constructor() {
    // Activer le mode mock si DEMANDÉ explicitement ou si pas de clé API valide
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || '';
    this.useMockMode = import.meta.env.VITE_USE_MOCK_AI === 'true' || !geminiKey || geminiKey.length < 10;
    
    if (this.useMockMode) {
      console.log('🎭 Mode Mock AI activé');
    }
  }
  
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
  
  // Récupérer la clé API Gemini depuis les variables d'environnement
  getGeminiApiKey(): string {
    // Priorité: variable d'environnement VITE_GEMINI_API_KEY, sinon VITE_API_KEY (compatibilité descendante)
    return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || 'mock-key';
  }
  
  // Vérifier si la clé API est configurée
  hasGeminiApiKey(): boolean {
    const key = this.getGeminiApiKey();
    return key && key !== 'mock-key' && key.length > 10;
  }
  
  // Vérifier si on utilise le mode mock
  shouldUseMockMode(): boolean {
    return this.useMockMode;
  }
  
  // Récupérer la configuration Firebase
  getFirebaseConfig() {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
  }
  
  // Vérifier si Firebase est configuré
  hasFirebaseConfig(): boolean {
    const config = this.getFirebaseConfig();
    return Object.values(config).every(value => !!value);
  }
}