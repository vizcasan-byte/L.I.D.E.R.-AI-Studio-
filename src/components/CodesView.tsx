/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Search, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { LIDER_CATEGORIES } from '../data/liderCodes';

interface CodesViewProps {
  onUseCodeInCreate: (code: string) => void;
}

export const CodesView: React.FC<CodesViewProps> = ({ onUseCodeInCreate }) => {
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const filteredCategories = LIDER_CATEGORIES.map(cat => {
    const q = search.toLowerCase().trim();
    if (!q) return cat;
    const items = cat.items.filter(([code, label, desc]) => 
      code.toLowerCase().includes(q) ||
      label.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q)
    );
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-3">
          <Layers className="w-3.5 h-3.5 text-[#d7ad32]" />
          CÓDIGO L.I.D.E.R.™
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#09243a]">
          Tu nuevo lenguaje para crear con IA
        </h1>
        <p className="text-base sm:text-lg text-[#68747d] mt-2">
          Elige códigos. Combínalos. Crea recursos educativos visuales, imprimibles o interactivos en segundos.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl relative">
        <Search className="w-5 h-5 text-[#68747d] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar códigos por nombre, comando o descripción..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#e7e4dc] bg-white text-sm focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/15 outline-none shadow-xs"
        />
      </div>

      {/* Categories Grid */}
      <div className="space-y-8">
        {filteredCategories.map(category => (
          <div key={category.name} className="bg-white border border-[#e7e4dc] rounded-3xl p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#09243a] mb-4 pb-2 border-b border-[#f4f6f7]">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {category.items.map(([code, label, desc]) => {
                const isCopied = copiedCode === code;
                return (
                  <div
                    key={code}
                    className="border border-[#e7e4dc] hover:border-[#d7ad32] rounded-2xl p-4 bg-[#fbfaf6] hover:bg-white transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <strong className="text-sm text-[#09243a] font-extrabold">{label}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(code)}
                          className="p-1 rounded-md text-[#68747d] hover:text-[#09243a] hover:bg-[#f4f6f7] transition-colors"
                          title="Copiar código"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <code className="inline-block text-xs font-mono font-bold text-[#09243a] bg-white px-2 py-0.5 rounded border border-[#e7e4dc] mb-2">
                        {code}
                      </code>
                      <p className="text-xs text-[#68747d] m-0 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUseCodeInCreate(code)}
                      className="mt-3 pt-2 border-t border-[#e7e4dc]/50 text-xs font-bold text-[#09243a] group-hover:text-[#d7ad32] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Usar en Crear</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
