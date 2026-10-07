import React from 'react';

interface FyndLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const FyndLogo: React.FC<FyndLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-11 h-11 rounded-2xl', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7', text: 'text-2xl' },
    xl: { box: 'w-16 h-16 rounded-3xl', icon: 'w-8 h-8', text: 'text-3xl' },
  };

  const { box, icon, text } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${box} bg-[#09261a] border-2 border-white text-lime-400 flex items-center justify-center shadow-lg transition-transform`}
      >
        <svg
          className={icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="m11 8 3 3-3 3" />
        </svg>
      </div>

      {showText && (
        <span className={`font-display font-black tracking-tight text-slate-900 ${text}`}>
          FYND
        </span>
      )}
    </div>
  );
};
