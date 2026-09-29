/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { MethodView } from './components/MethodView';
import { CreateView } from './components/CreateView';
import { CodesView } from './components/CodesView';
import { SavedView } from './components/SavedView';
import { GamificationModal } from './components/GamificationModal';
import { InteractiveSandboxModal } from './components/InteractiveSandboxModal';
import { BrandLogo } from './components/BrandLogo';
import { ResourceFormData, ResourceFunctionMode, SavedResource } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  
  // Builder state for pre-population from Quick Create or Re-use
  const [createFormData, setCreateFormData] = useState<Partial<ResourceFormData>>({
    tipo: 'Actividad educativa',
    modo: 'interactivo',
    tema: '',
    selectedCodes: []
  });

  // Modal states
  const [isGamificationOpen, setIsGamificationOpen] = useState<boolean>(false);
  const [sandboxConfig, setSandboxConfig] = useState<{
    isOpen: boolean;
    topic: string;
    tipo: string;
    grade?: string;
    subject?: string;
  }>({
    isOpen: false,
    topic: 'Sistema Solar',
    tipo: 'Actividad interactiva'
  });

  // Load saved from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('liderResources');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Normalize entries if they come from old format
          const normalized: SavedResource[] = parsed.map((item, index) => ({
            id: item.id || `lider_${Date.now()}_${index}`,
            type: item.type || 'Recurso',
            topic: item.topic || 'Sin tema',
            modo: item.modo || 'interactivo',
            codes: Array.isArray(item.codes) ? item.codes : [],
            prompt: item.prompt || '',
            date: item.date || new Date().toISOString(),
            subject: item.subject,
            grade: item.grade
          }));
          setSavedResources(normalized);
        }
      }
    } catch {
      // Ignored
    }
  }, []);

  // Save to localStorage whenever savedResources change
  const persistSaved = (newList: SavedResource[]) => {
    setSavedResources(newList);
    try {
      localStorage.setItem('liderResources', JSON.stringify(newList));
    } catch {
      // Storage full or restricted
    }
  };

  const handleSaveResource = (resource: Omit<SavedResource, 'id' | 'date'>) => {
    const newItem: SavedResource = {
      ...resource,
      id: `lider_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      date: new Date().toISOString()
    };
    const updated = [newItem, ...savedResources];
    persistSaved(updated);
  };

  const handleDeleteResource = (id: string) => {
    const updated = savedResources.filter(r => r.id !== id);
    persistSaved(updated);
  };

  const handleReuseResource = (resource: SavedResource) => {
    setCreateFormData({
      tipo: resource.type,
      modo: resource.modo || 'interactivo',
      tema: resource.topic,
      materia: resource.subject || '',
      grado: resource.grade || '',
      selectedCodes: resource.codes || []
    });
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickCreate = (type: string, initialModo: ResourceFunctionMode = 'interactivo') => {
    setCreateFormData({
      tipo: type,
      modo: initialModo,
      tema: '',
      selectedCodes: []
    });
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseCodeInCreate = (code: string) => {
    setCreateFormData(prev => ({
      ...prev,
      selectedCodes: Array.from(new Set([...(prev?.selectedCodes || []), code]))
    }));
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSandbox = (topic: string, tipo: string, grade?: string, subject?: string) => {
    setSandboxConfig({
      isOpen: true,
      topic: topic || 'El Universo y los Planetas',
      tipo: tipo || 'Actividad interactiva',
      grade,
      subject
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf6] text-[#24313b]">
      
      {/* Brand Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGamification={() => setIsGamificationOpen(true)}
        savedCount={savedResources.length}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickCreate={handleQuickCreate}
            onOpenGamification={() => setIsGamificationOpen(true)}
          />
        )}

        {currentView === 'method' && (
          <MethodView
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'create' && (
          <CreateView
            initialFormData={createFormData}
            onSaveResource={handleSaveResource}
            onOpenGamification={() => setIsGamificationOpen(true)}
            onOpenSandbox={handleOpenSandbox}
          />
        )}

        {currentView === 'codes' && (
          <CodesView
            onUseCodeInCreate={handleUseCodeInCreate}
          />
        )}

        {currentView === 'saved' && (
          <SavedView
            resources={savedResources}
            onDelete={handleDeleteResource}
            onReuse={handleReuseResource}
            onOpenSandbox={handleOpenSandbox}
            onImport={(imported) => persistSaved([...imported, ...savedResources])}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </main>

      {/* Gamification 2.0 Modal */}
      <GamificationModal
        isOpen={isGamificationOpen}
        onClose={() => setIsGamificationOpen(false)}
        onSaveResource={handleSaveResource}
        onOpenSandbox={handleOpenSandbox}
      />

      {/* Interactive Sandbox Modal for testing functional widgets */}
      <InteractiveSandboxModal
        isOpen={sandboxConfig.isOpen}
        onClose={() => setSandboxConfig(prev => ({ ...prev, isOpen: false }))}
        topic={sandboxConfig.topic}
        tipo={sandboxConfig.tipo}
        grade={sandboxConfig.grade}
        subject={sandboxConfig.subject}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#e7e4dc] py-8 sm:py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#68747d]">
          <BrandLogo size="sm" showStudioBadge={false} />

          <div className="text-center md:text-right space-y-1">
            <div className="font-bold text-[#09243a]">
              L.I.D.E.R. AI Studio · Método L.I.D.E.R.© por Katya Sánchez
            </div>
            <div>
              Tecnología con propósito humano. IA que se aplica. Enseñanza que se transforma.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
