
import React, { useState, useEffect, useMemo } from 'react';
import type { Product, Order, Variation } from '../types';
import CategoryImageManager from './CategoryImageManager';
import BannerManager from './BannerManager';
import AIGenerationPanel from './AIGenerationPanel';
import { processImage } from '../services/imageProcessing';


// SVG Icons (self-contained to avoid dependencies)
const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"/><path d="M12 8v4l2 2"/></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M16 16.5a2.5 2.5 0 0 0-5 0"/></svg>;
const BannerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>;

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateOrder: (orderId: string, data: Partial<Omit<Order, 'id'>>) => Promise<void>;
}

const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {activeView === 'overview' && <Overview {...props} />}
        {activeView === 'products' && <ProductManager {...props} />}
        {activeView === 'orders' && <OrderManager {...props} />}
        {activeView === 'categories' && <CategoryManager {...props} />}
        {activeView === 'banners' && <BannerManager />}
        {activeView === 'ai-tools' && <AIToolsManager />}
      </main>
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{ activeView: string, setActiveView: (view: string) => void }> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <OverviewIcon /> },
    { id: 'products', label: 'Produits', icon: <ProductsIcon /> },
    { id: 'orders', label: 'Commandes', icon: <OrdersIcon /> },
    { id: 'categories', label: 'Catégories', icon: <CategoryIcon /> },
    { id: 'banners', label: 'Bannières', icon: <BannerIcon /> },
    { id: 'ai-tools', label: 'Outils IA', icon: <AIIcon /> },
  ];

  return (
    <aside className="w-16 sm:w-64 bg-gray-800 p-2 sm:p-4 flex flex-col">
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
              activeView === item.id ? 'bg-sky-500 text-white' : 'hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

// Overview Component
const Overview: React.FC<DashboardViewProps> = ({ products, orders }) => {
  const totalRevenue = useMemo(() => orders.filter(o => o.status === 'Livrée').reduce((sum, order) => sum + order.total, 0), [orders]);
  const newOrdersCount = useMemo(() => orders.filter(o => o.status === 'Nouvelle').length, [orders]);
  const totalProducts = products.length;
  const outOfStockCount = useMemo(() => products.filter(p => p.stock === 0).length, [products]);

  const stats = [
    { title: 'Revenu Total', value: `${totalRevenue.toLocaleString('fr-FR')} CFA`, icon: '💰' },
    { title: 'Nouvelles Commandes', value: newOrdersCount, icon: '📦' },
    { title: 'Produits en Ligne', value: totalProducts, icon: '📱' },
    { title: 'Rupture de Stock', value: outOfStockCount, icon: '⚠️' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vue d'ensemble</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.title} className="bg-gray-800 p-6 rounded-xl flex items-center space-x-4">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
       <h2 className="text-2xl font-bold mb-4">Commandes Récentes</h2>
       <div className="bg-gray-800 rounded-xl p-4">
         {orders.slice(0, 5).map(order => (
            <div key={order.id} className="grid grid-cols-4 gap-4 items-center p-3 border-b border-gray-700 last:border-0">
                <p className="truncate">{order.customer.name}</p>
                <p>{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                <p className="font-semibold">{order.total.toLocaleString('fr-FR')} CFA</p>
                <span className={`px-3 py-1 text-xs rounded-full w-fit ${order.status === 'Nouvelle' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>{order.status}</span>
            </div>
         ))}
       </div>
    </div>
  );
};

// Product Manager Component
const ProductManager: React.FC<DashboardViewProps> = ({ products, ...rest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const openModalForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openModalForNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    }
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestion des Produits</h1>
            <button onClick={openModalForNew} className="px-4 py-2 bg-sky-500 rounded-lg hover:bg-sky-600 font-semibold">Ajouter un Produit</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onEdit={openModalForEdit} onDelete={rest.onDeleteProduct} />
            ))}
        </div>
        {isModalOpen && <ProductFormModal product={editingProduct} onClose={closeModal} {...rest} />}
    </div>
  );
};

const ProductCard: React.FC<{product: Product, onEdit: (p: Product) => void, onDelete: (id: string) => void}> = ({ product, onEdit, onDelete }) => (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
        <img src={product.imageUrl} alt={product.name} className="h-48 w-full object-cover" crossOrigin="anonymous"/>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lg truncate">{product.name}</h3>
            <p className="text-sm text-gray-400">{product.category}</p>
            <div className="flex-grow mt-2">
                <p className="font-semibold text-sky-400">{product.price.toLocaleString('fr-FR')} CFA</p>
                <p className="text-sm">Stock: <span className="font-bold">{product.stock}</span></p>
            </div>
            <div className="flex gap-2 mt-4">
                <button onClick={() => onEdit(product)} className="flex-1 px-3 py-1 bg-yellow-500 text-black rounded text-sm hover:bg-yellow-600">Modifier</button>
                <button onClick={() => window.confirm("Supprimer ce produit ?") && onDelete(product.id)} className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Supprimer</button>
            </div>
        </div>
    </div>
);


// Order Manager Component
const OrderManager: React.FC<DashboardViewProps> = ({ orders, onUpdateOrder }) => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Gestion des Commandes</h1>
        <div className="bg-gray-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-700 last:border-0">
                  <td className="p-4">{order.customer.name}</td>
                  <td className="p-4">{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold">{order.total.toLocaleString('fr-FR')} CFA</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrder(order.id, { status: e.target.value as Order['status'] })}
                      className="bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option>Nouvelle</option>
                      <option>En cours</option>
                      <option>Livrée</option>
                      <option>Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

// Category Manager Component
const CategoryManager: React.FC<DashboardViewProps> = ({ products }) => {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string } | null>(null);

  // Extraire les catégories uniques des produits
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
      .map((categoryName, index) => ({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        image: undefined // L'image sera assignée automatiquement par assignDefaultCategoryImages
      }));
    setCategories(uniqueCategories);
  }, [products]);

  // Récupérer l'utilisateur actuel (simulé pour le moment)
  useEffect(() => {
    // Dans une vraie application, cela viendrait du contexte d'authentification
    setCurrentUser({
      id: 'admin-1',
      email: 'admin@inzastor.com',
      role: 'admin'
    });
  }, []);

  // Fonction pour mettre à jour l'image d'une catégorie
  const handleImageUpdate = async (categoryId: string, imageBlob: Blob): Promise<void> => {
    try {
      // Convertir le Blob en URL base64 ou télécharger vers un service de stockage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        
        // Trouver la catégorie correspondante
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          // Mettre à jour la catégorie avec la nouvelle image
          const updatedCategories = categories.map(cat => 
            cat.id === categoryId 
              ? { ...cat, image: base64Image }
              : cat
          );
          setCategories(updatedCategories);
          
          // Sauvegarder dans le localStorage pour persistance
          localStorage.setItem(`categoryImage_${categoryId}`, base64Image);
          
          console.log(`Image mise à jour pour la catégorie: ${category.name}`);
        }
      };
      reader.readAsDataURL(imageBlob);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      throw new Error('Impossible de mettre à jour l\'image de la catégorie');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des Catégories</h1>
      <CategoryImageManager 
        categories={categories}
        onImageUpdate={handleImageUpdate}
        currentUser={currentUser}
      />
    </div>
  );
};

// AI Tools Manager Component
const AIToolsManager: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Outils d'Intelligence Artificielle</h1>
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Génération de Contenu IA</h2>
        <p className="text-gray-400 mb-6">
          Utilisez l'IA pour générer automatiquement des descriptions et des images de produits.
          Cette fonctionnalité est intégrée dans le formulaire de création de produits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-sky-400 mb-2">Génération de Descriptions</h3>
            <p className="text-sm text-gray-300">
              Génère des descriptions de produits uniques et engageantes basées sur le nom du produit.
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-sky-400 mb-2">Génération d'Images</h3>
            <p className="text-sm text-gray-300">
              Crée des images réalistes de produits à partir de descriptions textuelles.
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 <strong>Astuce :</strong> Pour utiliser ces fonctionnalités IA, accédez à la section 
            "Produits" et cliquez sur "Ajouter un Produit". Les outils IA seront disponibles 
            dans le formulaire de création.
          </p>
        </div>
      </div>
    </div>
  );
};


// Product Form Modal
type ProductFormData = Omit<Product, 'id' | 'rating' | 'reviewCount'>;
const emptyProductForm: ProductFormData = { name: '', description: '', price: 0, originalPrice: 0, imageUrl: '', category: 'iPhone', colors: [], stock: 0, variations: [], isNew: false };

const ProductFormModal: React.FC<{ product: Product | null, onClose: () => void } & Omit<DashboardViewProps, 'orders'| 'products'>> = ({ product, onClose, onAddProduct, onUpdateProduct }) => {
    const [formData, setFormData] = useState<ProductFormData>(emptyProductForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [variationsText, setVariationsText] = useState('');
    const [colorsText, setColorsText] = useState('');
    const [showAIPanel, setShowAIPanel] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({ name: product.name, description: product.description, price: product.price, originalPrice: product.originalPrice, imageUrl: product.imageUrl, category: product.category, colors: product.colors, stock: product.stock, variations: product.variations });
            setImagePreview(product.imageUrl);
            setVariationsText(JSON.stringify(product.variations || [], null, 2));
            setColorsText(product.colors.join(', '));
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'originalPrice' || name === 'stock' ? Number(value) : value }));
    };

    const handleAIContentGenerated = (content: { description?: string; imageUrl?: string; suggestedPrice?: number } | { content: { description?: string; imageUrl?: string; suggestedPrice?: number }; imageFile?: File }) => {
        // Gérer les deux formats de réponse possibles
        let description: string | undefined;
        let imageUrl: string | undefined;
        let imageFile: File | undefined;
        let suggestedPrice: number | undefined;

        if ('content' in content) {
            // Format avec objet wrapper (nouveau format)
            description = content.content.description;
            imageUrl = content.content.imageUrl;
            imageFile = content.imageFile;
            suggestedPrice = content.content.suggestedPrice;
        } else {
            // Format simple (ancien format)
            description = content.description;
            imageUrl = content.imageUrl;
            suggestedPrice = content.suggestedPrice;
        }

        if (description) {
            setFormData(prev => ({ ...prev, description }));
        }
        if (imageUrl) {
            setFormData(prev => ({ ...prev, imageUrl }));
            setImagePreview(imageUrl);
        }
        if (imageFile) {
            setImageFile(imageFile);
            // Créer un aperçu pour le fichier image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        }
        if (suggestedPrice && suggestedPrice > 0) {
            setFormData(prev => ({ ...prev, price: suggestedPrice }));
            // Optionnel : afficher une notification du changement de prix
            console.log(`Prix suggéré appliqué : ${suggestedPrice}€`);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Vérifier la taille du fichier (1MB = 1 * 1024 * 1024 bytes)
            if (file.size > 1048576) {
                alert("L'image est trop grande. Veuillez choisir une image de moins de 1 Mo.");
                return; // Arrêter le processus si l'image est trop grande
            }
            setImageFile(file);
            // Convert image to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fonction pour charger les images avec proxy CORS
    const loadImageWithProxy = async (imageUrl: string): Promise<string> => {
        try {
            // Essayer de charger l'image directement d'abord
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve) => {
                img.onload = () => {
                    // Convertir l'image en base64
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        resolve(imageUrl);
                        return;
                    }
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    try {
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        resolve(dataUrl);
                    } catch (e) {
                        console.warn('Erreur lors de la conversion en base64:', e);
                        resolve(imageUrl);
                    }
                };
                
                img.onerror = () => {
                    console.warn('Erreur de chargement de l\'image, utilisation de l\'URL d\'origine');
                    resolve(imageUrl);
                };
                
                img.src = imageUrl;
            });
        } catch (error) {
            console.warn('Erreur lors du chargement de l\'image:', error);
            return imageUrl; // Retourner l'URL originale si échec
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Validation des données requises
            if (!formData.name.trim()) {
                alert("Le nom du produit est requis.");
                return;
            }
            if (formData.price < 0) {
                alert("Le prix doit être positif.");
                return;
            }
            if (formData.stock < 0) {
                alert("Le stock ne peut pas être négatif.");
                return;
            }

            const variations = variationsText ? JSON.parse(variationsText) : [];
            const colors = colorsText.split(',').map(c => c.trim()).filter(Boolean);
            let finalImageUrl = formData.imageUrl;

            if (imageFile) {
                // Traiter l'image uploadée avec redimensionnement et compression
                const processedBlob = await processImage(imageFile, {
                    maxWidth: 800,
                    maxHeight: 600,
                    quality: 0.85,
                    format: 'image/webp',
                    maintainAspectRatio: true,
                    backgroundColor: '#FFFFFF'
                });
                
                // Convertir le Blob en base64
                finalImageUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error('Erreur de conversion de l\'image'));
                    reader.readAsDataURL(processedBlob);
                });
            } else if (formData.imageUrl && !formData.imageUrl.startsWith('data:')) {
                // Si c'est une URL externe, essayer de la charger via proxy pour éviter les blocages CORS
                finalImageUrl = await loadImageWithProxy(formData.imageUrl);
            }
            
            // S'assurer que tous les champs numériques ont des valeurs valides
            const productData = {
                name: formData.name.trim(),
                description: formData.description?.trim() || '',
                price: Number(formData.price) || 0,
                originalPrice: Number(formData.originalPrice) || 0,
                stock: Number(formData.stock) || 0,
                category: formData.category || 'iPhone',
                colors,
                variations,
                imageUrl: finalImageUrl,
                isNew: formData.isNew || false
            };

            if (product) {
                await onUpdateProduct(product.id, productData);
            } else {
                await onAddProduct({ ...productData, rating: 0, reviewCount: 0 });
            }
            onClose();
        } catch (error: any) {
            console.error("Erreur détaillée lors de l'enregistrement du produit:", error);
            console.error("Code d'erreur:", error.code);
            console.error("Message d'erreur:", error.message);
            
            let errorMessage = "Une erreur est survenue lors de l'enregistrement.";
            
            // Vérifier si c'est une erreur de connexion Firebase
            if (error.code === 'unavailable' || error.code === 'network-request-failed') {
                errorMessage = "Impossible de se connecter à la base de données. Vérifiez votre connexion internet ou désactivez les extensions de votre navigateur.";
            } else if (error.code === 'permission-denied') {
                errorMessage = "Accès refusé à la base de données. Vérifiez les règles de sécurité Firebase.";
            } else if (error.code === 'not-found') {
                errorMessage = "Document non trouvé. Le produit n'existe peut-être plus.";
            } else if (error.message) {
                errorMessage = `Erreur: ${error.message}`;
            }
            
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><CloseIcon /></button>
                <h2 className="text-2xl font-bold mb-6">{product ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nom du produit" className="p-3 bg-gray-700 rounded-lg w-full" required />
                        <select name="category" value={formData.category} onChange={handleChange} className="p-3 bg-gray-700 rounded-lg w-full">
                            <option>iPhone</option> <option>iPad</option> <option>Mac</option> <option>Apple Watch</option> <option>AirPods</option> <option>Accessoires</option>
                        </select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        {formData.name && (
                            <button 
                                type="button"
                                onClick={() => setShowAIPanel(!showAIPanel)}
                                className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200"
                            >
                                {showAIPanel ? 'Masquer IA' : '✨ Générer avec IA'}
                            </button>
                        )}
                    </div>
                    
                    {showAIPanel && (
                        <AIGenerationPanel 
                            productName={formData.name}
                            onContentGenerated={handleAIContentGenerated}
                        />
                    )}
                    
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-3 bg-gray-700 rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Prix de vente *</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Prix" className="p-3 bg-gray-700 rounded-lg w-full" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Prix barré (optionnel)</label>
                            <input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} placeholder="Prix barré" className="p-3 bg-gray-700 rounded-lg w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Stock disponible *</label>
                            <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" className="p-3 bg-gray-700 rounded-lg w-full" required />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            id="isNew" 
                            checked={formData.isNew || false} 
                            onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))} 
                            className="w-4 h-4 text-sky-500 bg-gray-700 border-gray-600 rounded focus:ring-sky-500"
                        />
                        <label htmlFor="isNew" className="text-sm font-medium text-gray-300">
                            🆕 Marquer comme nouveau produit
                        </label>
                    </div>
                     <div>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de l'image" className="w-full p-3 bg-gray-700 rounded-lg mb-2" />
                        <input type="file" onChange={handleImageChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-sky-700 hover:file:bg-sky-100" />
                        {imagePreview && <img src={imagePreview} alt="Aperçu" className="w-24 h-24 object-contain rounded mt-2 bg-gray-700 p-1" crossOrigin="anonymous" />}
                     </div>
                     <input value={colorsText} onChange={(e) => setColorsText(e.target.value)} placeholder="Couleurs (ex: #FFFFFF, #000000)" className="w-full p-3 bg-gray-700 rounded-lg" />
                     <textarea value={variationsText} onChange={(e) => setVariationsText(e.target.value)} placeholder='Variations (Format JSON: [{"name":"128 Go", "price": 1000, "stock": 10}])' className="w-full p-3 bg-gray-700 rounded-lg h-32 font-mono text-sm" />

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 font-semibold">Annuler</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-sky-500 rounded-lg hover:bg-sky-600 font-semibold disabled:bg-gray-500">
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default DashboardView;
