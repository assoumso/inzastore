
export interface Variation {
  name: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name:string;
  description: string;
  price: number; // Base/starting price
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  stock: number;
  variations?: Variation[];
  isNew?: boolean; // Nouveau champ pour marquer les nouveaux produits
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for this cart entry: product.id + variation.name
  quantity: number;
  selectedVariation?: Variation;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: 'Nouvelle' | 'En cours' | 'Livrée' | 'Annulée';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface Category {
  id: string;
  name: string;
  navImageUrl: string;
  bannerImageUrl: string;
  order?: number;
}