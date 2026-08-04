import React from 'react';

interface PhyathaiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PhyathaiLogo: React.FC<PhyathaiLogoProps> = ({ className = '', size = 'md' }) => {
  // Height scale based on size
  const heightClass = size === 'sm' ? 'h-10' : size === 'lg' ? 'h-16' : 'h-12';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 320 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClass} w-auto object-contain`}
      >
        {/* Emblem - 4 connected nodes */}
        {/* Top-Left node group (dark green) */}
        <g id="phyathai-emblem">
          <path
            d="M 38,28 C 38,18 48,12 56,18 C 64,24 64,36 56,42 C 50,46 44,52 48,60 C 52,68 64,68 68,60 C 72,52 84,52 88,60 C 92,68 86,80 76,80 C 66,80 58,74 52,68 C 46,62 38,62 34,68 C 30,74 34,86 44,88 C 54,90 62,84 62,74"
            stroke="#006652"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Node 1 - Dark Green top left */}
          <circle cx="30" cy="30" r="11" fill="#006652" />
          <circle cx="58" cy="22" r="11" fill="#006652" />
          <circle cx="22" cy="54" r="11" fill="#006652" />
          <circle cx="48" cy="46" r="11" fill="#006652" />
          <path d="M 30,30 L 58,22 L 48,46 L 22,54 Z" fill="#006652" />

          {/* Node 2 - Light Green bottom left */}
          <circle cx="16" cy="68" r="10" fill="#52C288" />
          <circle cx="42" cy="62" r="10" fill="#52C288" />
          <circle cx="10" cy="90" r="10" fill="#52C288" />
          <circle cx="36" cy="84" r="10" fill="#52C288" />
          <path d="M 16,68 L 42,62 L 36,84 L 10,90 Z" fill="#52C288" />

          {/* Node 3 - Gray right */}
          <circle cx="54" cy="52" r="10" fill="#6E7A81" />
          <circle cx="80" cy="44" r="10" fill="#6E7A81" />
          <circle cx="48" cy="74" r="10" fill="#6E7A81" />
          <circle cx="74" cy="66" r="10" fill="#6E7A81" />
          <path d="M 54,52 L 80,44 L 74,66 L 48,74 Z" fill="#6E7A81" />
        </g>

        {/* Brand Name Text: พญาไท (Thai) */}
        <text
          x="100"
          y="42"
          fill="#006652"
          fontSize="36"
          fontWeight="900"
          fontFamily="'Sarabun', 'Prompt', 'Kanit', sans-serif"
          letterSpacing="-0.5"
        >
          พญาไท
        </text>

        {/* Brand Name Text: PHYATHAI (English) */}
        <text
          x="100"
          y="68"
          fill="#52C288"
          fontSize="22"
          fontWeight="800"
          fontFamily="'Montserrat', 'Arial', sans-serif"
          letterSpacing="4"
        >
          PHYATHAI
        </text>

        {/* Divider Line */}
        <line x1="100" y1="78" x2="315" y2="78" stroke="#006652" strokeWidth="2.5" />

        {/* Branch Text: พหลโยธิน • PHAHOLYOTHIN */}
        <text
          x="100"
          y="100"
          fill="#6E7A81"
          fontSize="15"
          fontWeight="700"
          fontFamily="'Sarabun', 'Prompt', sans-serif"
          letterSpacing="0.5"
        >
          พหลโยธิน • PHAHOLYOTHIN
        </text>
      </svg>
    </div>
  );
};
