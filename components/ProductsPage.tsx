import React from 'react';
import type { Product, Category, Variation } from '../types';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product, selectedVariation?: Variation) => void;
  searchTerm: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products, categories, onAddToCart, searchTerm }) => {
  const navigate = useNavigate();
  
  const filteredProducts = products.filter(product =>
    searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const groupedProducts = categories.map(category => ({
    category,
    products: filteredProducts.filter(p => p.category === category.name)
  })).filter(group => group.products.length > 0);

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tous nos produits</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </button>
        </div>

        {searchTerm && (
          <div className="mb-8">
            <p className="text-gray-600">
              Résultats pour: <span className="font-semibold">"{searchTerm}"</span>
            </p>
          </div>
        )}

        {groupedProducts.length === 0 ? (
          <div className="text-center py-16 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Aucun produit trouvé</h2>
            <p className="text-gray-500 mt-2">Votre recherche n'a donné aucun résultat.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {groupedProducts.map(({ category, products }) => (
              <section key={category.id} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <span className="text-gray-500">{products.length} produit{products.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;