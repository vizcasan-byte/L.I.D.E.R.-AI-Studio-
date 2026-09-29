/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Gamepad2, BookOpen, Layers, Bookmark, PlusCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenGamification: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenGamification,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e7e4dc] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[82px] py-2.5 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div 
            className="flex items-center gap-4 cursor-pointer py-1" 
            onClick={() => onNavigate('home')}
            title="Ir al inicio · L.I.D.E.R. AI Studio"
          >
            <BrandLogo size="md" showStudioBadge={true} />
          </div>

          {/* Navigation links & Quick action */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                currentView === 'home'
                  ? 'bg-[#f8edc5] text-[#09243a] shadow-xs'
                  : 'text-[#68747d] hover:bg-[#f4f6f7] hover:text-[#09243a]'
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => onNavigate('method')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                currentView === 'method'
                  ? 'bg-[#f8edc5] text-[#09243a] shadow-xs'
                  : 'text-[#68747d] hover:bg-[#f4f6f7] hover:text-[#09243a]'
              }`}
            >
              Método
            </button>

            <button
              type="button"
              onClick={() => onNavigate('create')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'create'
                  ? 'bg-[#09243a] text-white shadow-xs'
                  : 'bg-[#f8edc5] text-[#09243a] hover:bg-[#f3e5b3]'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#d7ad32]" />
              <span>Crear</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('codes')}
              className={`hidden sm:inline-flex px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all items-center gap-1.5 ${
                currentView === 'codes'
                  ? 'bg-[#f8edc5] text-[#09243a]'
                  : 'text-[#68747d] hover:bg-[#f4f6f7] hover:text-[#09243a]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Códigos
            </button>

            <button
              type="button"
              onClick={() => onNavigate('saved')}
              className={`px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'saved'
                  ? 'bg-[#f8edc5] text-[#09243a]'
                  : 'text-[#68747d] hover:bg-[#f4f6f7] hover:text-[#09243a]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mis recursos</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black bg-[#09243a] text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Quick Gamification button */}
            <button
              type="button"
              onClick={onOpenGamification}
              className="hidden lg:flex items-center gap-1.5 ml-1 px-3 py-2 text-xs font-bold text-[#09243a] bg-linear-to-r from-[#fffdf5] to-[#fff8df] border border-[#eadfb8] rounded-xl hover:border-[#d7ad32] transition-all hover:scale-[1.02]"
              title="Diseñador de Gamificación 2.0"
            >
              <Gamepad2 className="w-4 h-4 text-[#d7ad32]" />
              <span>Gamificación</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
