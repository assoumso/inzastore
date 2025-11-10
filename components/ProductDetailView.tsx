



import React, { useState, useMemo } from 'react';
// Fix: Use named imports for react-router-dom to fix module resolution issues
import { useParams, Link } from 'react-router-dom';
import type { Product, Variation } from '../types';

interface ProductDetailViewProps {
  products: Product[];
  onAddToCart: (product: Product, selectedVariation?: Variation) => void;
}

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarRating: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
  const fullStars = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < fullStars} />);
  return (
    <div className="flex items-center">
      {stars}
      <span className="text-sm text-gray-500 ml-2">
        {rating.toFixed(1)}/5 ({reviewCount.toLocaleString('fr-FR')} avis)
      </span>
    </div>
  );
};


const ProductDetailView: React.FC<ProductDetailViewProps> = ({ products, onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

  const hasVariations = useMemo(() => product?.variations && product.variations.length > 0, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Produit non trouvé</h2>
        <Link to="/" className="text-sky-500 hover:underline mt-4 inline-block">
          Retour à la boutique
        </Link>
      </div>
    );
  }
  
  const displayPrice = selectedVariation ? selectedVariation.price : product.price;

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedVariation ?? undefined);
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="text-sky-500 hover:text-sky-600 transition-colors">
            &larr; Retour aux produits
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Column */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center">
            <img src={product.imageUrl} alt={product.name} className="max-h-[500px] w-auto object-contain" />
          </div>

          {/* Details Column */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <div className="mb-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>
            
            {hasVariations && (
              <div className="mb-6">
                 <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-3">
                  {product.category === 'iPhone' || product.category === 'Mac' ? 'Capacité' : 'Option'} : <span className="font-bold">{selectedVariation?.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variations?.map((variation) => (
                    <button
                      key={variation.name}
                      onClick={() => setSelectedVariation(variation)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${selectedVariation?.name === variation.name ? 'bg-sky-500 text-white border-sky-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-sky-400'}`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">Couleurs disponibles</h3>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color, index) => (
                    <span key={index} className="block w-8 h-8 rounded-full border-2 border-white dark:border-gray-500 shadow-sm" style={{ backgroundColor: color }} title={color} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-baseline space-x-3 mb-8">
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{displayPrice.toLocaleString('fr-FR')} CFA</p>
              {product.originalPrice && (
                <p className="text-xl text-gray-400 dark:text-gray-500 line-through">{product.originalPrice.toLocaleString('fr-FR')} CFA</p>
              )}
            </div>
            
            <button
              onClick={handleAddToCartClick}
              disabled={hasVariations && !selectedVariation}
              className="w-full px-8 py-4 bg-sky-500 text-white text-lg font-bold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-sky-500 transition-colors shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              {hasVariations && !selectedVariation ? 'Sélectionnez une option' : 'Ajouter au panier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;