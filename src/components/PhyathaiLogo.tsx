import React from 'react';

interface PhyathaiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PHYATHAI_LOGO_URL =
  'https://static.hdmall.co.th/184x184/webp/system/brands/logo/2240/original/phyathai-phaholyothin-hospital.jpg';

export const PhyathaiLogo: React.FC<PhyathaiLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heightClass =
    size === 'sm'
      ? 'h-9 w-auto'
      : size === 'lg'
      ? 'h-16 w-auto'
      : size === 'xl'
      ? 'h-24 w-auto'
      : size === 'full'
      ? 'w-full h-full'
      : 'h-12 w-auto';

  return (
    <img
      src={PHYATHAI_LOGO_URL}
      alt="โรงพยาบาลพญาไท พหลโยธิน - Phyathai Phaholyothin Hospital"
      referrerPolicy="no-referrer"
      className={`${heightClass} object-contain select-none ${className}`}
    />
  );
};
