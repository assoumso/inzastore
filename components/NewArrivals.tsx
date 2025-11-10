
import React from 'react';
import type { Product, Variation } from '../types';
import ProductCard from './ProductCard';

interface NewArrivalsProps {
  products: Product[];
  onAddToCart: (product: Product, selectedVariation?: Variation) => void;
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ products, onAddToCart }) => {
  // Filtrer uniquement les produits marqués comme nouveaux
  const newProducts = products.filter(product => product.isNew === true);
  
  if (!newProducts || newProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
          Nouveautés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;