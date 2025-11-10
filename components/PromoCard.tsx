import React from 'react';

interface PromoCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
}

const PromoCard: React.FC<PromoCardProps> = ({ title, subtitle, imageUrl, bgColor = 'bg-white', textColor = 'text-black', borderColor = 'border-gray-200' }) => {
  // Définir des ombres personnalisées selon la couleur de bordure
  const getShadowClasses = () => {
    const shadowMap: Record<string, string> = {
      'border-blue-500': 'shadow-blue-500/30 hover:shadow-blue-500/50',
      'border-purple-500': 'shadow-purple-500/30 hover:shadow-purple-500/50',
      'border-gray-400': 'shadow-gray-400/30 hover:shadow-gray-400/50',
      'border-red-500': 'shadow-red-500/30 hover:shadow-red-500/50',
      'border-green-500': 'shadow-green-500/30 hover:shadow-green-500/50',
      'border-orange-500': 'shadow-orange-500/30 hover:shadow-orange-500/50',
    };
    return shadowMap[borderColor] || 'shadow-gray-500/30 hover:shadow-gray-500/50';
  };

  return (
    <div className={`relative rounded-2xl p-6 flex flex-col justify-between h-80 ${bgColor} ${textColor} border-2 ${borderColor} shadow-2xl ${getShadowClasses()} transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-3 hover:shadow-3xl`}>
      <div className="absolute inset-0 z-0">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold text-lg drop-shadow-lg">{title}</h3>
        <p className="text-sm drop-shadow-md">{subtitle}</p>
      </div>
    </div>
  );
};

export default PromoCard;