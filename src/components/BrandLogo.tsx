/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showStudioBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showStudioBadge = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Logo sizing according to size variant
  const logoClasses = {
    sm: 'h-9 sm:h-10 w-auto max-w-[210px] object-contain block',
    md: 'h-11 sm:h-13 w-auto max-w-[265px] object-contain block',
    lg: 'h-14 sm:h-16 w-auto max-w-[340px] object-contain block',
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-4 select-none ${className}`}>
      
      {/* Official Katya Sánchez Logo */}
      {!imgError ? (
        <img
          src="/logo-katya.png"
          alt="Katya Sánchez · Mentora en IA & EdTech"
          className={logoClasses[size]}
          onError={() => setImgError(true)}
        />
      ) : (
        <img
          src="/logo-katya-original.png"
          alt="Katya Sánchez · Mentora en IA & EdTech"
          className={logoClasses[size]}
        />
      )}

      {/* L.I.D.E.R. AI Studio Brand Divider */}
      {showStudioBadge && (
        <div className="hidden lg:flex flex-col border-l border-[#e7e4dc] pl-4 ml-1 py-1">
          <strong className="text-[#09243a] text-sm sm:text-base font-extrabold leading-tight tracking-tight">
            L.I.D.E.R. AI Studio
          </strong>
          <span className="text-[#d7ad32] text-[11px] font-bold leading-tight mt-0.5 tracking-wide">
            Método L.I.D.E.R.©
          </span>
        </div>
      )}

    </div>
  );
};
