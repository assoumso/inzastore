import React from 'react';

const InfoCard = ({ icon, title, description, linkText }: { icon: React.ReactNode, title: string, description: string, linkText: string }) => (
  <div className="bg-white p-6 rounded-2xl text-center flex flex-col items-center transition-all duration-300 border border-gray-200 hover:shadow-lg hover:border-lime-400">
    <div className="text-lime-500 mb-4">{icon}</div>
    <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 flex-grow mb-4">{description}</p>
    <a href="#products" className="font-semibold text-lime-600 hover:text-lime-500 text-sm">
      {linkText}
    </a>
  </div>
);

const InfoSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
            title="Services Exclusifs"
            description="L'option la plus accessible pour garantir votre nouveau produit Apple."
            linkText="EN SAVOIR PLUS"
          />
          <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
            title="Paiement Échelonné"
            description="Payez jusqu'à 70% de la valeur en 21 fois. Décidez à la fin comment payer les 30% restants."
            linkText="DÉCOUVRIR"
          />
           <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5V4H4zm0 10h5v5H4v-5zm10 0h5v5h-5v-5zm10-10v5h-5V4h5zM7 7l10 10" /></svg>}
            title="Programme de Reprise"
            description="Votre appareil usagé vous donne droit à une réduction sur l'achat d'un nouveau."
            linkText="VOIR COMMENT"
          />
           <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
            title="Abonnement iPhone"
            description="Des plans sur 21 mois. À la fin de la période, échangez contre un nouvel iPhone."
            linkText="S'ABONNER"
          />
        </div>
      </div>
    </section>
  );
};

export default InfoSection;