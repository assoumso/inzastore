import React from 'react';

// This SVG is for the Apple logo.
const AppleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.526 12.01c.012-2.083 1.737-3.538 1.77-3.563-.037-.05-1.124-.48-2.333-.505-1.927-.05-3.23,1.15-4.08,1.15-.862,0-1.89-.99-3.2-.99-1.54,0-2.977.99-3.815,2.49-.838,1.488-.238,4.487,1.213,6.863.688,1.15,1.526,2.563,2.687,2.563,1.137,0,1.588-.75,3.238-.75s2.05.75,3.225.75c1.2,0,1.862-1.2,2.525-2.325.862-1.5,1.225-2.813,1.237-2.838-.025-.012-2.387-.9-2.437-3.45zM14.65,6.549c.637-.775,1.062-1.8,1-2.925-.912.038-2.037.625-2.712,1.4-.6.675-1.112,1.75-1,2.837,1.012.1,2.075-.537,2.712-1.312z"/>
    </svg>
);

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    // Recreates the logo from the provided image with a stacked layout.
    // Sized to fit within the existing header and footer containers.
    <div className={`inline-flex flex-col items-start leading-none ${className}`}>
      <div className="flex items-center uppercase">
        <span className="font-black text-xl tracking-wide">.inz</span>
        <AppleLogo className="w-7 h-7 -ml-1 transform -translate-y-0.5" />
      </div>
      <span className="font-serif italic text-xl -mt-2 ml-4">store</span>
    </div>
  );
};
