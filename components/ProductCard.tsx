



import React from 'react';
import { Link } from 'react-router-dom';
import type { Product, Variation } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedVariation?: Variation) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const hasVariations = product.variations && product.variations.length > 0;

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:bg-gray-100">
      <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col flex-grow p-4">
        <div className="flex justify-center items-center h-48 mb-4">
          <img className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" src={product.imageUrl} alt={product.name} />
        </div>
        
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-sky-600 transition-colors" title={product.name}>{product.name}</h3>
          <p className="text-md font-bold text-black mt-1">{product.price.toLocaleString('fr-FR')} CFA</p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        {hasVariations ? (
          <Link to={`/product/${product.id}`} className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
            Voir
          </Link>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors"
          >
            Ajouter
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;