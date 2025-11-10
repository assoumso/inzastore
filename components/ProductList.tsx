
import React from 'react';
import type { Product, Category, Variation, Order } from '../types';
import ProductCard from './ProductCard';
import PromoCard from './PromoCard';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product, selectedVariation?: Variation) => void;
  searchTerm: string;
  orders?: Order[];
}

const ProductList: React.FC<ProductListProps> = ({ products, categories, onAddToCart, searchTerm }) => {
  const filteredProducts = products.filter(product =>
    searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="bg-white text-gray-800">
      <div id="products" className="container mx-auto px-4 py-12">
        {/* Section Nouveautés - Maintenant en première position */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nouveautés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.href = '/products'}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              Voir plus de produits
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Section iPhone avec bannière et 3 produits - Maintenant en deuxième position */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">iPhone. <span className="text-gray-500 font-normal">Conçu pour faire la différence.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Carte Promo "iPhone" */}
            <div 
              onClick={() => window.location.href = '/products?category=iPhone'}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <PromoCard
                title="iPhone 17 Pro Max."
                subtitle="Le futur, c'est maintenant."
                imageUrl="https://www.apple.com/v/iphone-17-pro/d/images/meta/iphone-17-pro_overview__er68vecct16q_og.png"
                bgColor="bg-gray-900"
                textColor="text-white"
                borderColor="border-blue-500"
              />
            </div>
            
            {/* Produits de la catégorie iPhone - 3 produits */}
            {products.filter(p => p.category === 'iPhone').slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Section iPad */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">iPad. <span className="text-gray-500 font-normal">Tout ce que vous aimez faire, vous allez l'adorer.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Carte Promo "iPad" */}
            <div 
              onClick={() => window.location.href = '/products?category=iPad'}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <PromoCard
                title="iPad Pro."
                subtitle="Une toute nouvelle ère."
                imageUrl="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                bgColor="bg-gray-900"
                textColor="text-white"
                borderColor="border-purple-500"
              />
            </div>
            
            {/* Produits de la catégorie iPad - 3 produits */}
            {products.filter(p => p.category === 'iPad').slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Section Mac */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Mac. <span className="text-gray-500 font-normal">Conçu pour être à la hauteur de vos ambitions.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Carte Promo "Mac" */}
            <div 
              onClick={() => window.location.href = '/products?category=Mac'}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <PromoCard
                title="MacBook Pro."
                subtitle="Conçu pour les pros."
                imageUrl="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                bgColor="bg-gray-900"
                textColor="text-white"
                borderColor="border-gray-400"
              />
            </div>
            
            {/* Produits de la catégorie Mac - 3 produits */}
            {products.filter(p => p.category === 'Mac').slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Section Apple Watch */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Apple Watch. <span className="text-gray-500 font-normal">Un choix sain, c'est vous.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Carte Promo "Apple Watch" */}
            <div 
              onClick={() => window.location.href = '/products?category=Apple Watch'}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <PromoCard
                title="Apple Watch."
                subtitle="Votre partenaire santé."
                imageUrl="https://www.apple.com/fr/watch/images/meta/apple-watch__ywfuk5wnf1u2_og.png?202509180846"
                bgColor="bg-gray-900"
                textColor="text-white"
                borderColor="border-red-500"
              />
            </div>
            
            {/* Produits de la catégorie Apple Watch - 3 produits */}
            {products.filter(p => p.category === 'Apple Watch').slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Section Leçon de son */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Leçon de son. <span className="text-gray-500 font-normal">Un choix incroyable pour un son riche de haute qualité.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Carte Promo "AirPods" */}
            <div 
              onClick={() => window.location.href = '/products?category=AirPods'}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <PromoCard 
                title="AirPods Pro 3."
                subtitle="Le son, repoussé à l'extrême."
                imageUrl="https://www.apple.com/v/airpods/aa/images/meta/airpods__dh7xkbort402_og.png?202511050407"
                bgColor="bg-black"
                textColor="text-white"
                borderColor="border-green-500"
              />
            </div>
            {/* Produits de la catégorie Audio - 3 produits */}
            {products.filter(p => p.category === 'AirPods' || p.category === 'HomePod').slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Section Accessoires - Maintenant en dernière position */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Accessoires. <span className="text-gray-500 font-normal">Des essentiels qui s'accordent parfaitement à vos appareils.</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Carte Promo "Nouveau bracelet" */}
            <div 
              onClick={() => window.location.href = '/products?category=Accessoires'}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <PromoCard 
                title="Accessoires iPhone." 
                subtitle="Chargeurs, coques et plus."
                imageUrl="https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                borderColor="border-orange-500"
              />
            </div>
            {/* Produits de la catégorie Accessoires - 3 produits */}
            {products.filter(p => p.category === 'Accessoires').slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        {/* Section Produits les plus commandés */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Produits les plus commandés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Simuler les produits les plus populaires - iPhone, AirPods, Apple Watch, iPad */}
            {[
              products.find(p => p.name.includes('iPhone 17 Pro Max')),
              products.find(p => p.name.includes('AirPods Pro')),
              products.find(p => p.name.includes('Apple Watch Series')),
              products.find(p => p.name.includes('iPad Pro'))
            ].filter(Boolean).map((product, index) => (
              <div key={product?.id || index} className="relative">
                {/* Badge "Populaire" */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                  Populaire
                </div>
                {product && <ProductCard product={product} onAddToCart={onAddToCart} />}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Voir tous les produits
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductList;