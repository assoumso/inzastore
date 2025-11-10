



import React, { useState, useEffect, useCallback } from 'react';
// Fix: Use named imports for react-router-dom to fix module resolution issues
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import firebase, { db } from './firebase';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import Footer from './components/Footer';
import WhatsAppChatButton from './components/WhatsAppChatButton';
import useLocalStorage from './hooks/useLocalStorage';
import type { Product, CartItem, Customer, Order, Category } from './types';
import AdminAuth from './components/AdminAuth';
import ProductDetailView from './components/ProductDetailView';
import CheckoutModal from './components/CheckoutModal';
import DashboardView from './components/DashboardView';
import ProductsPage from './components/ProductsPage';

const initialProducts: Omit<Product, 'id'>[] = [
  { name: 'iPhone 15 Pro Max', description: 'Le nec plus ultra de la technologie Apple.', price: 950000, originalPrice: 1050000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708', category: 'iPhone', rating: 4.8, reviewCount: 1128, colors: ['#A9A9A9', '#D3D3D3', '#000000', '#F5F5DC'], stock: 10, variations: [{name: '256 Go', price: 950000, stock: 10}, {name: '512 Go', price: 1100000, stock: 5}, {name: '1 To', price: 1250000, stock: 3}] },
  { name: 'iPhone 15 Pro', description: 'La puissance Pro dans un format plus compact.', price: 850000, originalPrice: 920000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699321', category: 'iPhone', rating: 4.7, reviewCount: 5639, colors: ['#808080', '#C0C0C0', '#FFFFFF', '#000000'], stock: 15, variations: [{name: '128 Go', price: 850000, stock: 15}, {name: '256 Go', price: 920000, stock: 10}, {name: '512 Go', price: 1050000, stock: 8}] },
  { name: 'iPhone 15', description: 'Un concentré d’innovations.', price: 650000, originalPrice: 710000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692917772020', category: 'iPhone', rating: 4.6, reviewCount: 17259, colors: ['#ADD8E6', '#FFC0CB', '#000000', '#FFFF00', '#90EE90'], stock: 20, variations: [{name: '128 Go', price: 650000, stock: 20}, {name: '256 Go', price: 720000, stock: 15}] },
  { name: 'iPhone 14 Pro', description: 'Toujours aussi performant et élégant.', price: 700000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1663703840578', category: 'iPhone', rating: 4.5, reviewCount: 2454, colors: ['#574751', '#E3DCD2', '#F0E68C', '#000000'], stock: 5, variations: [{name: '128 Go', price: 700000, stock: 5}, {name: '256 Go', price: 780000, stock: 2}] },
  { name: 'iPhone 14', description: 'Un excellent choix, puissant et fiable.', price: 580000, originalPrice: 650000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=166102finish-12-6-1-blue-2-1', category: 'iPhone', rating: 4.4, reviewCount: 8762, colors: ['#ADD8E6', '#CBC3E3', '#FFFF00', '#000000', '#FF0000'], stock: 12, variations: [{name: '128 Go', price: 580000, stock: 12}, {name: '256 Go', price: 640000, stock: 8}] },
  { name: 'iPhone 13', description: 'Un classique moderne, toujours d\'actualité.', price: 490000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=166102finish-12-6-1-blue-2-0', category: 'iPhone', rating: 4.5, reviewCount: 12043, colors: ['#FFC0CB', '#000000', '#FFFFFF', '#008000', '#ADD8E6'], stock: 30 },
  { name: 'AirPods Pro 3', description: 'Audio adaptatif pour une écoute immersive avec réduction active du bruit avancée.', price: 249000, imageUrl: 'https://www.apple.com/v/airpods/aa/images/meta/airpods__dh7xkbort402_og.png?202511050407', category: 'AirPods', rating: 4.9, reviewCount: 12850, colors: ['#FFFFFF'], stock: 75 },
  { name: 'AirPods 4 avec ANC', description: 'Réduction active du bruit, Audio spatial personnalisé et Détection des conversations.', price: 199000, imageUrl: 'https://www.apple.com/v/airpods/aa/images/meta/airpods__dh7xkbort402_og.png?202511050407', category: 'AirPods', rating: 4.8, reviewCount: 8750, colors: ['#FFFFFF'], stock: 60 },
  { name: 'AirPods 4', description: 'Confort et son. Nouvelle évolution avec Audio spatial personnalisé.', price: 149000, imageUrl: 'https://www.apple.com/v/airpods/aa/images/meta/airpods__dh7xkbort402_og.png?202511050407', category: 'AirPods', rating: 4.7, reviewCount: 6420, colors: ['#FFFFFF'], stock: 80 },
  { name: 'AirPods Max', description: 'Casque audio haut de gamme avec son spatial et réduction active du bruit.', price: 549000, imageUrl: 'https://www.apple.com/v/airpods/aa/images/meta/airpods__dh7xkbort402_og.png?202511050407', category: 'AirPods', rating: 4.9, reviewCount: 4320, colors: ['#C0C0C0', '#FFC0CB', '#0000FF', '#008000'], stock: 25 },
  { name: 'Chargeur MagSafe', description: 'Recharge sans fil rapide et facile.', price: 35000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MHXH3?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1601625914000', category: 'Accessoires', rating: 4.7, reviewCount: 15400, colors: ['#FFFFFF'], stock: 100 },
  { name: 'Apple Watch Ultra 2', description: 'L\'aventure vous appelle.', price: 550000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MRF43_VW_34FR+watch-49-titanium-ultra2_VW_34FR_WF_CO+watch-face-49-alpine-ultra2_VW_34FR_WF_CO?wid=752&hei=720&bg-color=255,255,255&fmt=p-jpg&qlt=80&.v=1694384275194', category: 'Apple Watch', rating: 4.9, reviewCount: 3450, colors: ['#D3D3D3', '#0000FF', '#FFFF00'], stock: 15 },
  { name: 'MacBook Air 13" (M3)', description: 'Incroyablement fin et léger, avec la puce M3.', price: 1100000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-m3-midnight-202402?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1707444333933', category: 'Mac', rating: 4.8, reviewCount: 750, colors: ['#C0C0C0', '#808080', '#F5F5DC', '#465061'], stock: 8, variations: [{name: '8 Go RAM / 256 Go SSD', price: 1100000, stock: 8}, {name: '16 Go RAM / 512 Go SSD', price: 1350000, stock: 4}] },
  { name: 'MacBook Pro 14" (M3 Pro)', description: 'Une puissance phénoménale pour les pros.', price: 1800000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-m3-max-pro-spaceblack-202310?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1697150389292', category: 'Mac', rating: 4.9, reviewCount: 1200, colors: ['#C0C0C0', '#000000'], stock: 6, variations: [{name: '18 Go RAM / 512 Go SSD', price: 1800000, stock: 6}, {name: '36 Go RAM / 1 To SSD', price: 2300000, stock: 2}]}, 
  { name: 'iPad Pro 11" (M4)', description: 'Le nec plus ultra de l’iPad, avec la puce M4.', price: 900000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-11-select-202405?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1713509915745', category: 'iPad', rating: 4.8, reviewCount: 950, colors: ['#C0C0C0', '#000000'], stock: 9 },
  { name: 'iPad Air 13" (M2)', description: 'Puissance et polyvalence dans un design fin.', price: 650000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-13-select-202405?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1713488527196', category: 'iPad', rating: 4.7, reviewCount: 1500, colors: ['#A7ADC5', '#E3DCD2', '#B4B8C1', '#9C95A0'], stock: 11 },
  { name: 'iPad (10e génération)', description: 'Tout le plaisir de l\'iPad. Encore plus de possibilités.', price: 450000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1667594090149', category: 'iPad', rating: 4.6, reviewCount: 2100, colors: ['#ADD8E6', '#FFC0CB', '#FFFFFF', '#C0C0C0'], stock: 18, variations: [{name: '64 Go Wi-Fi', price: 450000, stock: 18}, {name: '256 Go Wi-Fi', price: 580000, stock: 12}] },
  { name: 'iPad mini (6e génération)', description: 'Mini format. Maxi possibilités.', price: 520000, imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-mini-select-202309-purple-wifi?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1692923290909', category: 'iPad', rating: 4.8, reviewCount: 1850, colors: ['#9370DB', '#C0C0C0', '#FFC0CB', '#000000'], stock: 15, variations: [{name: '64 Go Wi-Fi', price: 520000, stock: 15}, {name: '256 Go Wi-Fi', price: 650000, stock: 10}] },
];

const initialCategories: Omit<Category, 'id'>[] = [
  { name: 'iPhone', navImageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699321', bannerImageUrl: 'https://www.apple.com/v/iphone/home/bu/images/overview/compare/compare_iphone_15_pro__f3M242m2N12u_large.jpg', order: 1 },
  { name: 'iPad', navImageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-11-select-202405?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1713509915745', bannerImageUrl: 'https://www.apple.com/v/ipad/home/cd/images/overview/compare_ipad_pro__erf9xlaeyd4i_large.jpg', order: 2 },
  { name: 'Mac', navImageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-m3-midnight-202402?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1707444333933', bannerImageUrl: 'https://www.apple.com/v/mac/home/br/images/overview/compare/compare_macbook_pro_14_16__f98p4dpu0l2q_large.jpg', order: 3 },
  { name: 'Apple Watch', navImageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MRF43_VW_34FR+watch-49-titanium-ultra2_VW_34FR_WF_CO+watch-face-49-alpine-ultra2_VW_34FR_WF_CO?wid=752&hei=720&bg-color=255,255,255&fmt=p-jpg&qlt=80&.v=1694384275194', bannerImageUrl: 'https://www.apple.com/v/watch/home/ac/images/overview/compare/compare_s9__b844k2065keq_large.jpg', order: 4 },
  { name: 'AirPods', navImageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1694014871985', bannerImageUrl: 'https://www.apple.com/v/airpods/v/images/overview/compare/compare_airpods_pro__e9uztda64o2m_large.jpg', order: 5 },
  { name: 'Accessoires', navImageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MHXH3?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1601625914000', bannerImageUrl: 'https://www.apple.com/v/watch/home/ac/images/overview/connect/connect_business__d81p5w133pua_large.jpg', order: 6 },
];

const phoneNumber = "2250787324514";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Fonction pour assigner des images par défaut aux catégories
  const assignDefaultCategoryImages = (category: Category): Category => {
    // Vérifier s'il existe une image personnalisée dans le localStorage
    const customImageKey = `categoryImage_${category.id}`;
    const customImage = localStorage.getItem(customImageKey);
    
    const categoryImages: Record<string, { navImageUrl: string; bannerImageUrl: string }> = {
      // Ensemble futuriste (ton néon/cyberpunk) par catégorie
      'iphone': {
        navImageUrl: 'https://images.unsplash.com/photo-1694738332358-10494a6132a0?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&h=800&auto=format&fit=crop'
      },
      'ipad': {
        navImageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1200&h=800&auto=format&fit=crop'
      },
      'mac': {
        navImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200&h=800&auto=format&fit=crop'
      },
      'apple watch': {
        navImageUrl: 'https://images.unsplash.com/photo-1544135795-57df0a75b836?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1579586337278-35d18b1d8081?q=80&w=1200&h=800&auto=format&fit=crop'
      },
      'airpods': {
        navImageUrl: 'https://images.unsplash.com/photo-1606841701189-8d5b2ba4430e?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1603484478332-7f9e144a7b63?q=80&w=1200&h=800&auto=format&fit=crop'
      },
      'accessoires': {
        navImageUrl: 'https://images.unsplash.com/photo-1619861952875-a49d0e745610?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1619861952875-a49d0e745610?q=80&w=1200&h=800&auto=format&fit=crop'
      },
      'default': {
        navImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=300&auto=format&fit=crop',
        bannerImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&h=800&auto=format&fit=crop'
      }
    };

    const categoryKey = category.name.toLowerCase().trim();
    const defaultImages = categoryImages[categoryKey] || categoryImages['default'];

    return {
      ...category,
      navImageUrl: defaultImages.navImageUrl || customImage || category.navImageUrl,
      bannerImageUrl: defaultImages.bannerImageUrl || customImage || category.bannerImageUrl
    };
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
        const productsCollection = db.collection('products');
        const productsSnapshot = await productsCollection.get();
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsList);

        const categoriesCollection = db.collection('categories');
        const categoriesSnapshot = await categoriesCollection.get();
        const categoriesList = categoriesSnapshot.docs.map(doc => {
          const categoryData = { id: doc.id, ...doc.data() } as Category;
          return assignDefaultCategoryImages(categoryData);
        });
        setCategories(categoriesList.sort((a, b) => (a.order || 99) - (b.order || 99)));
        
        const ordersCollection = db.collection('orders');
        const ordersSnapshot = await ordersCollection.get();
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(ordersList.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));

    } catch (error) {
        console.error("Error fetching data: ", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const seedAndFetchData = async () => {
      const productsSnapshot = await db.collection('products').get();
      if (productsSnapshot.empty) {
        console.log('No products found, seeding database...');
        const batch = db.batch();
        initialProducts.forEach(product => {
          const docRef = db.collection('products').doc();
          batch.set(docRef, product);
        });
        await batch.commit();
        console.log('Products seeded.');
      }

      const categoriesSnapshot = await db.collection('categories').get();
      if (categoriesSnapshot.empty) {
        console.log('No categories found, seeding database...');
        const batch = db.batch();
        initialCategories.forEach(category => {
          const docRef = db.collection('categories').doc();
          batch.set(docRef, category);
        });
        await batch.commit();
        console.log('Categories seeded.');
      }
      fetchData();
    };

    seedAndFetchData();
  }, [fetchData]);
  
  const handleAddToCart = (product: Product, selectedVariation?: Variation) => {
    const cartItemId = product.id + (selectedVariation ? `-${selectedVariation.name}` : '');
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    const stock = selectedVariation ? selectedVariation.stock : product.stock;

    if(stock <= currentQuantityInCart) {
      alert("Désolé, la quantité demandée n'est pas disponible en stock.");
      return;
    }

    setCart(prevCart => {
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
          ...product,
          cartItemId: cartItemId,
          quantity: 1,
          selectedVariation: selectedVariation
      };
      return [...prevCart, newItem];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.cartItemId === cartItemId);
      if (!itemToUpdate) return prevCart;

      const stock = itemToUpdate.selectedVariation ? itemToUpdate.selectedVariation.stock : itemToUpdate.stock;
      if (quantity > stock) {
        alert("Désolé, la quantité demandée n'est pas disponible en stock.");
        return prevCart;
      }

      if (quantity <= 0) {
        return prevCart.filter(item => item.cartItemId !== cartItemId);
      }
      return prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
    });
  };

  const handlePlaceOrder = async (customer: Customer) => {
    if (cart.length === 0) return;

    try {
      await db.runTransaction(async (transaction) => {
        for (const item of cart) {
          const productRef = db.collection('products').doc(item.id);
          const productDoc = await transaction.get(productRef);
          if (!productDoc.exists) throw new Error(`Produit ${item.name} non trouvé!`);
          
          const productData = productDoc.data() as Product;
          
          if (item.selectedVariation) {
            const variation = productData.variations?.find(v => v.name === item.selectedVariation!.name);
            if (!variation || variation.stock < item.quantity) {
              throw new Error(`Stock insuffisant pour ${item.name} (${item.selectedVariation.name}).`);
            }
            const newVariations = productData.variations!.map(v => 
              v.name === item.selectedVariation!.name ? { ...v, stock: v.stock - item.quantity } : v
            );
            transaction.update(productRef, { variations: newVariations });
          } else {
            if (productData.stock < item.quantity) {
              throw new Error(`Stock insuffisant pour ${item.name}.`);
            }
            transaction.update(productRef, { stock: productData.stock - item.quantity });
          }
        }

        const orderRef = db.collection('orders').doc();
        const total = cart.reduce((sum, item) => {
          const price = item.selectedVariation ? item.selectedVariation.price : item.price;
          return sum + price * item.quantity;
        }, 0);
        
        // Validation des données du client pour éviter les valeurs undefined
        const validatedCustomer = {
          name: customer.name?.trim() || '',
          phone: customer.phone?.trim() || '',
          address: customer.address?.trim() || ''
        };
        
        transaction.set(orderRef, {
          customer: validatedCustomer,
          items: cart,
          total,
          status: 'Nouvelle',
          // Fix: firebase.firestore is now available after fixing firebase.ts
          createdAt: firebase.firestore.Timestamp.now(),
        });
      });

      const total = cart.reduce((sum, item) => (item.selectedVariation ? item.selectedVariation.price : item.price) * item.quantity + sum, 0);
      let message = `Bonjour INZASTORE, je souhaite passer une commande.\n\n`;
      message += `*Client:*\nNom: ${customer.name}\nContact: ${customer.phone}\nRésidence: ${customer.address}\n\n`;
      message += `*Commande:*\n`;
      cart.forEach(item => {
        const price = item.selectedVariation ? item.selectedVariation.price : item.price;
        const variationName = item.selectedVariation ? ` (${item.selectedVariation.name})` : '';
        message += `- ${item.name}${variationName} (x${item.quantity}) : ${(price * item.quantity).toLocaleString('fr-FR')} CFA\n`;
      });
      message += `\n*Total: ${total.toLocaleString('fr-FR')} CFA*\n\nMerci !`;

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setCart([]);
      setIsCheckoutModalOpen(false);
      await fetchData(); 
      alert('Merci pour votre commande ! Vous serez bientôt contacté par le service client.');

    } catch (error: any) {
      console.error("La commande a échoué : ", error);
      alert(`Impossible de passer la commande : ${error.message}`);
    }
  };


  // --- Dashboard Handlers ---
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    // S'assurer que imageUrl est une chaîne de caractères et non un Blob/File
    const sanitizedProductData = {
      ...productData,
      imageUrl: typeof productData.imageUrl === 'string' ? productData.imageUrl : ''
    };
    
    const productWithDefaults = { ...sanitizedProductData, rating: 0, reviewCount: 0 };
    const docRef = await db.collection("products").add(productWithDefaults);
    const newProduct = { id: docRef.id, ...productWithDefaults } as Product;
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };
  
  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    // S'assurer que imageUrl est une chaîne de caractères et non un Blob/File si présent
    const sanitizedProductData = productData.imageUrl ? {
      ...productData,
      imageUrl: typeof productData.imageUrl === 'string' ? productData.imageUrl : ''
    } : productData;
    
    const productRef = db.collection("products").doc(productId);
    await productRef.set(sanitizedProductData, { merge: true }); // Utilise set avec merge pour créer/mettre à jour
    await fetchData(); // Recharge les données pour refléter les changements
  };
  
  const handleDeleteProduct = async (productId: string) => {
    await db.collection("products").doc(productId).delete();
    await fetchData();
  };
  
  const handleUpdateOrder = async (orderId: string, data: Partial<Omit<Order, 'id'>>) => {
    const orderRef = db.collection("orders").doc(orderId);
    await orderRef.update(data);
    await fetchData();
  };

  const sortedCategories = categories.sort((a, b) => (a.order || 99) - (b.order || 99));

  if (isLoading) {
    return <div className="bg-white text-black flex items-center justify-center h-screen">Chargement en cours, veuillez patienter...</div>;
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800 font-sans">
        <Header
          cartCount={cart.reduce((count, item) => count + item.quantity, 0)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={sortedCategories.map(c => c.name)}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProductList products={products} categories={categories} onAddToCart={handleAddToCart} searchTerm={searchTerm} />
              </>
            } />
            <Route path="/products" element={<ProductsPage products={products} categories={categories} onAddToCart={handleAddToCart} searchTerm={searchTerm} />} />
            <Route path="/product/:id" element={<ProductDetailView products={products} onAddToCart={handleAddToCart} />} />
            <Route path="/cart" element={<div className="container mx-auto px-4 py-8"><CartView cart={cart} onUpdateQuantity={handleUpdateQuantity} onCheckout={() => setIsCheckoutModalOpen(true)} /></div>} />
             <Route path="/dashboard" element={
                <AdminAuth>
                  <DashboardView
                    products={products}
                    orders={orders}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onUpdateOrder={handleUpdateOrder}
                  />
                </AdminAuth>
             } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppChatButton phoneNumber={phoneNumber} />
        <CheckoutModal 
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </HashRouter>
  );
};

export default App;