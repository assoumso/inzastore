
import React from 'react';
import { Logo } from './Logo';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-black text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-2">
              <Logo className="h-12 w-auto text-white" />
            </div>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} INZASTORE. Tous droits réservés.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Informations</h3>
            <p>Treichville, Abidjan, Côte d'Ivoire</p>
            <p>+225 0787324514</p>
            <p>Toujours ouvert</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Liens Rapides</h3>
            <ul>
              <li><a href="/#/cart" className="hover:text-white">Panier</a></li>
              <li><a href="/#/dashboard" className="hover:text-white">Admin</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
