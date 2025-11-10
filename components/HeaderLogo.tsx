
import React from 'react';
import { Logo } from './Logo';

interface HeaderLogoProps {}

export const HeaderLogo: React.FC<HeaderLogoProps> = () => {
    return (
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
                <Logo className="h-10 w-auto text-white hover:text-lime-400 transition-colors" />
            </div>
            <div className="w-px h-8 bg-gray-700 hidden md:block" />
            <div className="text-left hidden md:block">
                <p className="text-xs font-semibold leading-tight text-white">Apple</p>
                <p className="text-xs font-semibold leading-tight text-white">Revendeur Agrée</p>
            </div>
        </div>
    );
};
