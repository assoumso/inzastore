
import React, { useState, useEffect } from 'react';
import type { CartItem, Customer } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onPlaceOrder: (customer: Customer) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onPlaceOrder }) => {
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '', address: '' });

  const total = cart.reduce((sum, item) => {
    const price = item.selectedVariation ? item.selectedVariation.price : item.price;
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    // Reset form when cart is emptied (after order)
    if (cart.length === 0) {
      setCustomer({ name: '', phone: '', address: '' });
    }
  }, [cart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }
    onPlaceOrder(customer);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Finaliser la Commande</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Column */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Vos Informations</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                <input type="text" id="name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact</label>
                <input type="tel" id="phone" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500" required />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Résidence</label>
                <textarea id="address" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} rows={3} className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:border-sky-500 focus:ring-sky-500" required></textarea>
              </div>
              <button type="submit" className="w-full mt-4 px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.3-8.8-98.1-25.4l-7-4.1-72.5 19 19.3-70.1-4.5-7.4C50.3 316.6 40 282.6 40 248.1c0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.8-16.6-53.9-29.8-75.2-66.3-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                 </svg>
                 Valider et Envoyer via WhatsApp
              </button>
            </form>
          </div>

          {/* Summary Column */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Résumé de la commande</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {cart.map(item => {
                const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.price;
                const variationName = item.selectedVariation ? ` - ${item.selectedVariation.name}` : '';
                return (
                  <div key={item.cartItemId} className="flex justify-between text-sm">
                    <p className="text-gray-700 dark:text-gray-300 pr-2">
                      {item.quantity} x {item.name}
                      <span className="font-semibold">{variationName}</span>
                    </p>
                    <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{(itemPrice * item.quantity).toLocaleString('fr-FR')} CFA</span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4">
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{total.toLocaleString('fr-FR')} CFA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutModal;