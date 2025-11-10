



import React from 'react';
// Fix: Use a named import for react-router-dom to fix module resolution issues
import { Link } from 'react-router-dom';
import type { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onCheckout }) => {
  const total = cart.reduce((sum, item) => {
    const price = item.selectedVariation ? item.selectedVariation.price : item.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Votre Panier</h1>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Votre panier est vide.</p>
          <Link to="/" className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors">
            Continuer les achats
          </Link>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {cart.map(item => {
                const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.price;
                return (
                  <div key={item.cartItemId} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center">
                      <img src={item.imageUrl} alt={item.name} className="h-20 w-20 object-cover rounded-md mr-4" />
                      <div>
                        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h2>
                        {item.selectedVariation && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.selectedVariation.name}</p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400">{itemPrice.toLocaleString('fr-FR')} CFA</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.cartItemId, parseInt(e.target.value, 10))}
                        className="w-16 text-center border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500"
                      />
                       <button onClick={() => onUpdateQuantity(item.cartItemId, 0)} className="ml-4 text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
            })}
          </div>
          <div className="mt-8 text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Total: {total.toLocaleString('fr-FR')} CFA
            </p>
            <button onClick={onCheckout} className="mt-4 inline-block px-8 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors shadow-lg">
              Passer la commande
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;