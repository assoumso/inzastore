import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "BIENVENUE CHEZ",
      subtitle: "INZASTORE",
      description: "Votre destination pour les produits Apple premium",
      buttonText: "Découvrir nos produits",
      buttonLink: "/products"
    },
    {
      title: "BIENVENUE CHEZ",
      subtitle: "INZASTORE",
      description: "iPhone, iPad, Mac et plus encore",
      buttonText: "Voir nos offres",
      buttonLink: "/offers"
    },
    {
      title: "BIENVENUE CHEZ",
      subtitle: "INZASTORE",
      description: "Service client exceptionnel",
      buttonText: "Nous contacter",
      buttonLink: "/contact"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Images de fond Apple - Sources fiables */}
      <div className="absolute inset-0 opacity-25">
        {/* iPhone 15 Pro - Image premium */}
        <img 
          src="https://images.unsplash.com/photo-1695026542292-4a9eb5a41245?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="iPhone 15 Pro" 
          className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain filter blur-sm transform rotate-12"
        />
        
        {/* MacBook Air - Image premium */}
        <img 
          src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="MacBook Air" 
          className="absolute top-1/3 right-1/4 w-40 h-32 md:w-56 md:h-40 lg:w-72 lg:h-48 object-contain filter blur-sm transform -rotate-12"
        />
        
        {/* iPad Pro - Image premium */}
        <img 
          src="https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="iPad Pro" 
          className="absolute bottom-1/4 left-1/3 w-36 h-28 md:w-52 md:h-36 lg:w-68 lg:h-44 object-contain filter blur-sm transform rotate-6"
        />
        
        {/* AirPods Pro - Image premium */}
        <img 
          src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="AirPods Pro" 
          className="absolute bottom-1/3 right-1/3 w-24 h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 object-contain filter blur-sm transform -rotate-6"
        />
        
        {/* Apple Watch - Image premium */}
        <img 
          src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Apple Watch" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-32 md:w-40 md:h-44 lg:w-52 lg:h-56 object-contain filter blur-sm opacity-80"
        />
        
        {/* iMac - Image premium */}
        <img 
          src="https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="iMac" 
          className="absolute top-1/6 left-1/6 w-40 h-36 md:w-56 md:h-48 lg:w-72 lg:h-60 object-contain filter blur-sm transform rotate-3"
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <div className="animate-pulse mb-4">
            <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2">
              {slides[currentSlide].title}
            </h1>
          </div>
          
          <div className="animate-bounce mb-6">
            <h2 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {slides[currentSlide].subtitle}
            </h2>
          </div>
          
          <p className="font-orbitron text-lg sm:text-xl md:text-2xl mb-8 text-gray-300">
            {slides[currentSlide].description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={slides[currentSlide].buttonLink} 
              className="font-orbitron bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {slides[currentSlide].buttonText}
            </a>
            
            <a 
              href="/about" 
              className="font-orbitron border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </div>

      {/* Indicateurs de slide */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Flèches de navigation */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 text-2xl sm:text-3xl font-bold z-20"
      >
        ‹
      </button>
      
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 text-2xl sm:text-3xl font-bold z-20"
      >
        ›
      </button>
    </div>
  );
};

export default Hero;