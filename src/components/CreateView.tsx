/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { 
  Sparkles, 
  Search, 
  Copy, 
  Heart, 
  Check, 
  Gamepad2, 
  FileText, 
  Monitor, 
  RefreshCw, 
  Play, 
  Download, 
  Eye, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Printer,
  Image as ImageIcon
} from 'lucide-react';
import { ResourceFormData, ResourceFunctionMode, SavedResource, PaperSize, OrientationMode, ImageAspectRatio } from '../types';
import { LIDER_CATEGORIES } from '../data/liderCodes';
import { EXAMPLE_PRESETS, ExamplePreset } from '../data/examplePresets';
import { PrintableResourceModal } from './PrintableResourceModal';
import { buildResourcePrompt, getModalityLabel } from '../services/promptBuilder';

interface CreateViewProps {
  initialFormData?: Partial<ResourceFormData>;
  onSaveResource: (resource: Omit<SavedResource, 'id' | 'date'>) => void;
  onOpenGamification: () => void;
  onOpenSandbox: (topic: string, tipo: string, grade?: string, subject?: string) => void;
}

export const CreateView: React.FC<CreateViewProps> = ({
  initialFormData,
  onSaveResource,
  onOpenGamification,
  onOpenSandbox
}) => {
  const [tipo, setTipo] = useState<string>(initialFormData?.tipo || 'Actividad educativa');
  const [modo, setModo] = useState<ResourceFunctionMode>(initialFormData?.modo || 'interactivo');
  const [tema, setTema] = useState<string>(initialFormData?.tema || '');
  const [materia, setMateria] = useState<string>(initialFormData?.materia || '');
  const [grado, setGrado] = useState<string>(initialFormData?.grado || '');
  const [objetivo, setObjetivo] = useState<string>(initialFormData?.objetivo || '');
  const [adicional, setAdicional] = useState<string>(initialFormData?.adicional || '');
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set(initialFormData?.selectedCodes || []));
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Formato físico y tamaño de papel
  const [paperSize, setPaperSize] = useState<PaperSize>(initialFormData?.paperSize || 'carta');
  const [orientation, setOrientation] = useState<OrientationMode>(initialFormData?.orientation || 'vertical');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(initialFormData?.aspectRatio || '4:3');

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [lastGeneratedData, setLastGeneratedData] = useState<ResourceFormData | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [loadedPresetId, setLoadedPresetId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const searchInputId = useId();

  const handleTipoChange = (newTipo: string) => {
    setTipo(newTipo);
    const lower = newTipo.toLowerCase();
    // Sugerencia inteligente de orientación según el tipo
    if (lower.includes('infografía') || lower.includes('infografia') || lower.includes('timeline') || lower.includes('línea del tiempo') || lower.includes('mindmap') || lower.includes('mapa mental') || lower.includes('compare') || lower.includes('tabla comparativa') || lower.includes('design') || lower.includes('cartel')) {
      setOrientation('horizontal');
      setAspectRatio('16:9');
    } else if (lower.includes('ficha') || lower.includes('hoja de trabajo') || lower.includes('cuestionario') || lower.includes('rúbrica') || lower.includes('rubrica') || lower.includes('guía') || lower.includes('resumen')) {
      setOrientation('vertical');
      setAspectRatio('3:4');
    }
  };

  const handleLoadPreset = (preset: ExamplePreset) => {
    setTipo(preset.data.tipo);
    setModo(preset.data.modo);
    setTema(preset.data.tema);
    setMateria(preset.data.materia);
    setGrado(preset.data.grado);
    setObjetivo(preset.data.objetivo);
    setAdicional(preset.data.adicional || '');
    setSelectedCodes(new Set(preset.data.selectedCodes));
    if (preset.data.paperSize) setPaperSize(preset.data.paperSize);
    if (preset.data.orientation) {
      setOrientation(preset.data.orientation);
      setAspectRatio(preset.data.orientation === 'horizontal' ? '16:9' : '3:4');
    }
    setLoadedPresetId(preset.id);
    setTimeout(() => setLoadedPresetId(null), 3000);
  };

  const STYLE_MEDIUM_CODES = [
    '/3d', 
    '/pixelart', 
    '/claymorphism', 
    '/cartoon', 
    '/handwritten',
    '/watercolor', 
    '/papercraft', 
    '/chalkboard', 
    '/doodle', 
    '/flatdesign', 
    '/lineart', 
    '/visualthinking', 
    '/isometric',
    '/mariokart',
    '/minecraft',
    '/roblox',
    '/lego',
    '/pokemon',
    '/arcade'
  ];

  const toggleCode = (code: string) => {
    setSelectedCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        // Si es una técnica gráfica o medio de renderizado principal, reemplaza el anterior para evitar conflictos de estilo
        if (STYLE_MEDIUM_CODES.includes(code)) {
          STYLE_MEDIUM_CODES.forEach(c => next.delete(c));
        }
        next.add(code);
      }
      return next;
    });
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const effectiveTipo = tipo || 'Hoja de trabajo didáctica';
    if (!tipo) {
      setTipo(effectiveTipo);
    }

    let effectiveTema = tema.trim();
    if (!effectiveTema) {
      effectiveTema = 'El Sistema Solar y las Leyes del Universo';
      setTema(effectiveTema);
    }

    const formData: ResourceFormData = {
      tipo: effectiveTipo,
      modo,
      tema: effectiveTema,
      materia,
      grado,
      objetivo: objetivo.trim(),
      adicional: adicional.trim(),
      selectedCodes: Array.from(selectedCodes),
      paperSize,
      orientation,
      aspectRatio
    };

    const prompt = buildResourcePrompt(formData);
    setGeneratedPrompt(prompt);
    setLastGeneratedData(formData);
    setSaved(false);

    // Smooth scroll to result
    setTimeout(() => {
      const resElem = document.getElementById('result-section');
      if (resElem) {
        resElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const ta = document.getElementById('result-prompt-box') as HTMLTextAreaElement;
      if (ta) {
        ta.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    }
  };

  const handleSave = () => {
    if (!lastGeneratedData || !generatedPrompt) return;
    onSaveResource({
      type: lastGeneratedData.tipo,
      topic: lastGeneratedData.tema,
      modo: lastGeneratedData.modo,
      codes: lastGeneratedData.selectedCodes,
      prompt: generatedPrompt,
      subject: lastGeneratedData.materia,
      grade: lastGeneratedData.grado
    });
    setSaved(true);
  };

  const handleDownloadTxt = () => {
    if (!generatedPrompt) return;
    const blob = new Blob([generatedPrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LIDER_${tema.replace(/\s+/g, '_')}_${modo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter categories by search
  const filteredCategories = LIDER_CATEGORIES.map(cat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return cat;
    const filteredItems = cat.items.filter(([code, label, desc]) => 
      code.toLowerCase().includes(q) ||
      label.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q)
    );
    return { ...cat, items: filteredItems };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Title & Eyebrow */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d7ad32]" />
          D · DISEÑAR EN ACCIÓN
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#09243a]">
          Crea tu recurso educativo
        </h1>
        <p className="text-sm sm:text-base text-[#68747d] mt-1">
          Completa lo esencial, define la modalidad de funcionamiento y elige tus Códigos L.I.D.E.R.™
        </p>
      </div>

      {/* Gamification 2.0 Launcher Banner */}
      <div className="bg-linear-to-r from-[#fffdf5] to-[#fff8df] border border-[#eadfb8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#09243a] text-white flex items-center justify-center shrink-0">
            <Gamepad2 className="w-5 h-5 text-[#d7ad32]" />
          </div>
          <div>
            <strong className="block text-[#09243a] text-sm sm:text-base font-extrabold">
              ¿Quieres diseñar una experiencia gamificada?
            </strong>
            <span className="text-xs sm:text-sm text-[#68747d]">
              Crea misiones, quizzes interactivos, escape rooms, insignias y temporizadores con interactividad real.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenGamification}
          className="px-4 py-2.5 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all shadow-xs cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <span>Diseñar experiencia →</span>
        </button>
      </div>

      {/* 1-Click Curricular Example Presets */}
      <div className="bg-white border border-[#e7e4dc] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d7ad32] animate-pulse"></span>
            <strong className="text-xs sm:text-sm font-black text-[#09243a] uppercase tracking-wider">
              ¿Quieres probar un ejemplo real en 1 clic?
            </strong>
          </div>
          <span className="text-xs text-[#68747d]">
            Carga datos curriculares y códigos L.I.D.E.R. listos para generar:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {EXAMPLE_PRESETS.map((preset) => {
            const isJustLoaded = loadedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 hover:shadow-md hover:-translate-y-0.5 ${
                  isJustLoaded 
                    ? 'bg-[#f8edc5] border-[#d7ad32] ring-2 ring-[#d7ad32]/50 shadow-sm' 
                    : 'bg-[#fbfaf6] hover:bg-white border-[#e7e4dc] hover:border-[#d7ad32]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-extrabold text-[#735a00] bg-[#f8edc5] px-2 py-0.5 rounded-md truncate max-w-[85%]">
                    {preset.badge}
                  </span>
                  {isJustLoaded ? (
                    <span className="text-[10px] font-black text-emerald-700 flex items-center gap-0.5 shrink-0">
                      <Check className="w-3 h-3 text-emerald-700" /> ¡Listo!
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#d7ad32]">
                      Usar →
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-[#09243a] line-clamp-2 leading-snug">
                  {preset.title}
                </div>

                <div className="text-[10px] text-[#68747d] flex items-center justify-between border-t border-[#edebe4] pt-2 mt-0.5">
                  <span className="capitalize font-medium">Modo: {preset.data.modo}</span>
                  <span className="text-[#09243a] font-bold">{preset.data.selectedCodes.length} códigos</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Panel 1: Define tu recurso */}
        <div className="lg:col-span-5 bg-white border border-[#e7e4dc] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-[#f4f6f7] pb-3">
            <h2 className="text-xl font-black text-[#09243a] m-0">
              1. Define tu recurso
            </h2>
            <p className="text-xs text-[#68747d] mt-0.5">
              Personaliza el contenido pedagógico y su forma de operar.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* NUEVA OPCIÓN PEDIDA POR EL USUARIO: ¿Cómo quieres que funcione tu recurso? */}
          {/* ========================================================================= */}
          <div className="bg-[#fbfaf6] border-2 border-[#d7ad32]/40 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-[#09243a] tracking-wide">
                ¿Cómo quieres que funcione tu recurso? *
              </label>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#d7ad32] text-[#09243a] rounded-full">
                NUEVA CAPACIDAD
              </span>
            </div>

            <p className="text-xs text-[#68747d] leading-relaxed">
              Selecciona cómo se ejecutará. Al elegir <strong className="text-[#09243a]">Interactivo</strong>, L.I.D.E.R. le ordenará a la IA programar la funcionalidad real sin que tengas que pedirlo en los detalles.
            </p>

            <div className="space-y-2.5">
              {/* Opción 1: Imprimible */}
              <button
                type="button"
                onClick={() => setModo('imprimible')}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  modo === 'imprimible'
                    ? 'bg-white border-[#09243a] shadow-sm ring-2 ring-[#09243a]/15'
                    : 'bg-white border-[#e7e4dc] hover:border-[#d7ad32]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  modo === 'imprimible' ? 'bg-[#09243a] text-white' : 'bg-[#f4f6f7] text-[#68747d]'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#09243a]">
                    📄 Imprimible
                  </div>
                  <div className="text-xs text-[#68747d] mt-0.5">
                    Listo para imprimir y trabajar en papel.
                  </div>
                </div>
              </button>

              {/* Opción 2: Interactivo */}
              <button
                type="button"
                onClick={() => setModo('interactivo')}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  modo === 'interactivo'
                    ? 'bg-[#f8edc5]/30 border-[#09243a] shadow-sm ring-2 ring-[#09243a]/20'
                    : 'bg-white border-[#e7e4dc] hover:border-[#d7ad32]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  modo === 'interactivo' ? 'bg-[#09243a] text-[#d7ad32]' : 'bg-[#f4f6f7] text-[#68747d]'
                }`}>
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#09243a] flex items-center gap-1.5">
                    <span>💻 Interactivo</span>
                    <span className="text-[10px] font-bold text-[#09243a] bg-[#f8edc5] px-1.5 py-0.2 rounded">
                      Funcionalidad Real
                    </span>
                  </div>
                  <div className="text-xs text-[#68747d] mt-0.5">
                    Botones, respuestas, puntuación, retroalimentación y reinicio cuando corresponda.
                  </div>
                </div>
              </button>

              {/* Opción 3: Híbrido */}
              <button
                type="button"
                onClick={() => setModo('hibrido')}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  modo === 'hibrido'
                    ? 'bg-white border-[#09243a] shadow-sm ring-2 ring-[#09243a]/15'
                    : 'bg-white border-[#e7e4dc] hover:border-[#d7ad32]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  modo === 'hibrido' ? 'bg-[#09243a] text-white' : 'bg-[#f4f6f7] text-[#68747d]'
                }`}>
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#09243a]">
                    🔄 Híbrido
                  </div>
                  <div className="text-xs text-[#68747d] mt-0.5">
                    Versión imprimible + versión interactiva.
                  </div>
                </div>
              </button>

              {/* Opción 4: Solo Recurso Visual (Prompt para Generador de Imágenes) */}
              <button
                type="button"
                onClick={() => setModo('visual')}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  modo === 'visual'
                    ? 'bg-[#f8edc5]/40 border-[#09243a] shadow-sm ring-2 ring-[#09243a]/20'
                    : 'bg-white border-[#e7e4dc] hover:border-[#d7ad32]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  modo === 'visual' ? 'bg-[#09243a] text-[#d7ad32]' : 'bg-[#f4f6f7] text-[#68747d]'
                }`}>
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#09243a] flex items-center gap-1.5">
                    <span>🎨 Solo Recurso Visual / Imagen</span>
                    <span className="text-[10px] font-bold text-white bg-purple-700 px-1.5 py-0.2 rounded">
                      Midjourney / DALL-E
                    </span>
                  </div>
                  <div className="text-xs text-[#68747d] mt-0.5">
                    Genera solo el prompt de imagen (stickers, cómic visual, ilustraciones) sin planes ni fichas pedagógicas de texto.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tipo de recurso */}
          <div>
            <label className="block text-xs font-black uppercase text-[#09243a] mb-1.5">
              Tipo de recurso *
            </label>
            <select
              value={tipo}
              onChange={(e) => handleTipoChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/15 outline-none bg-white font-medium"
            >
              <option value="">Selecciona el tipo de recurso</option>
              <optgroup label="⚡ Formatos Rápidos de Aula (Los 14 Comandos)">
                <option value="Línea del tiempo (/timeline)">⏳ Línea del tiempo cronológica (/timeline)</option>
                <option value="Mapa mental (/mindmap)">🧠 Mapa mental radial (/mindmap)</option>
                <option value="Resumen estructurado (/summary)">📄 Resumen estructurado (Causas/Hechos/Efectos) (/summary)</option>
                <option value="Explícalo fácil (/simple)">💡 Explícalo fácil (Versión simple) (/simple)</option>
                <option value="Explicación paso a paso (/explain)">🪜 Explicación paso a paso (/explain)</option>
                <option value="Analogía visual pedagógica (/analogy)">🏭 Analogía visual pedagógica (/analogy)</option>
                <option value="Cuestionario evaluativo (/quiz)">❓ Cuestionario / Quiz ilustrado (/quiz)</option>
                <option value="Tabla comparativa A vs B (/compare)">⚖️ Tabla comparativa A vs B (/compare)</option>
                <option value="Ficha de repaso activo (/review)">✏️ Ficha de repaso activo (4 ejercicios) (/review)</option>
                <option value="Cartel Visual Thinking (/design)">🖼️ Cartel / Visual Thinking (Normas/Rutinas) (/design)</option>
                <option value="Comprensión multinivel (/create)">🎯 Comprensión multinivel (Básico/Medio/Avanzado) (/create)</option>
                <option value="Plancha de stickers (/stickersheet)">🎨 Plancha de stickers troquelados (/stickersheet)</option>
                <option value="Cómic didáctico (/comicdidactico)">💬 Cómic didáctico en viñetas (/comicdidactico)</option>
                <option value="Diagrama pedagógico (/diagrama)">📊 Diagrama de flujo y procesos (/diagrama)</option>
              </optgroup>
              <optgroup label="📚 Recursos Tradicionales y Evaluación">
                <option value="Hoja de trabajo">Hoja de trabajo estándar</option>
                <option value="Tarjetas / Flashcards">Tarjetas de estudio / Flashcards</option>
                <option value="Infografía">Infografía sintética</option>
                <option value="Folleto plegable (Tríptico / Guía)">Folleto plegable (Tríptico)</option>
                <option value="Rúbrica de evaluación">Rúbrica analítica</option>
                <option value="Lista de verificación">Lista de verificación / Checklist</option>
                <option value="Presentación / Diapositivas">Presentación / Diapositivas</option>
                <option value="Juego educativo interactivo">Juego educativo gamificado</option>
                <option value="Material personalizado">Material personalizado libre</option>
              </optgroup>
            </select>
          </div>

          {/* Formato de Papel, Tamaño y Orientación */}
          <div className="p-3.5 bg-[#fbfaf6] border border-[#e7e4dc] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-[#09243a] flex items-center gap-1.5">
                <span>📐 Tamaño de Papel y Orientación</span>
                <span className="text-[10px] font-bold text-[#d7ad32] bg-[#09243a] px-1.5 py-0.5 rounded">
                  Imprimible & Infografía
                </span>
              </label>
              <span className="text-[11px] font-bold text-[#09243a] bg-[#f8edc5] px-2 py-0.5 rounded">
                {orientation === 'horizontal' ? '↔️ Horizontal (Apaisado)' : '↕️ Vertical (Retrato)'}
              </span>
            </div>

            {/* Selector de Tamaño de Papel */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1">
                Formato de Papel Físico:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'carta', label: '📄 Carta (Letter)', desc: '21.6 x 27.9 cm (Costa Rica / América)' },
                  { id: 'a4', label: '📄 A4 Estándar', desc: '21.0 x 29.7 cm (Internacional)' },
                  { id: 'oficio', label: '📄 Oficio (Legal)', desc: '21.6 x 35.6 cm (Amplio / Rúbricas)' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaperSize(p.id as PaperSize)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paperSize === p.id
                        ? 'bg-white border-[#09243a] ring-2 ring-[#09243a]/15 shadow-xs'
                        : 'bg-white/60 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-[#09243a] flex items-center justify-between">
                      <span>{p.label}</span>
                      {paperSize === p.id && <span className="text-emerald-600 text-xs font-black">✓</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Orientación */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1">
                Orientación del Recurso / Infografía:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrientation('vertical');
                    if (aspectRatio === '16:9') setAspectRatio('3:4');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    orientation === 'vertical'
                      ? 'bg-white border-[#09243a] ring-2 ring-[#09243a]/15 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="w-6 h-8 rounded border-2 border-slate-600 bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-slate-700">↕</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-[#09243a] flex items-center gap-1.5">
                      <span>Vertical (Retrato)</span>
                      {orientation === 'vertical' && <span className="text-emerald-600 text-xs font-black">✓</span>}
                    </div>
                    <div className="text-[10px] text-slate-500">Ideal para fichas, guías, rúbricas y exámenes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrientation('horizontal');
                    if (aspectRatio === '3:4') setAspectRatio('16:9');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    orientation === 'horizontal'
                      ? 'bg-white border-[#09243a] ring-2 ring-[#09243a]/15 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-6 rounded border-2 border-slate-600 bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-slate-700">↔</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-[#09243a] flex items-center gap-1.5">
                      <span>Horizontal (Apaisado)</span>
                      {orientation === 'horizontal' && <span className="text-emerald-600 text-xs font-black">✓</span>}
                    </div>
                    <div className="text-[10px] text-slate-500">Ideal para infografías, líneas de tiempo y mapas</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Selector de Aspect Ratio para Imagen / Generadores Visuales */}
            {(modo === 'visual' || selectedCodes.size > 0) && (
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">
                    Proporción de Imagen (Midjourney / DALL-E / Gemini):
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                    --ar {aspectRatio}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: '3:4', label: '3:4 (Vertical Estándar)' },
                    { id: '4:3', label: '4:3 (Horizontal Estándar)' },
                    { id: '16:9', label: '16:9 (Panorámico / Infografía)' },
                    { id: '9:16', label: '9:16 (Póster / Móvil)' },
                    { id: '1:1', label: '1:1 (Cuadrado / Flashcard)' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setAspectRatio(r.id as ImageAspectRatio)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        aspectRatio === r.id
                          ? 'bg-[#09243a] text-white shadow-2xs ring-1 ring-[#d7ad32]'
                          : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Aclaración pedagógica esencial solicitada por el usuario */}
            <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-950">
              <span className="text-base shrink-0">💡</span>
              <p className="m-0 leading-relaxed text-[11px]">
                <strong>Nota pedagógica:</strong> Los comandos rápidos y fichas de aula <strong>NO requieren seleccionar imagen para funcionar</strong>. Si no eliges un estilo artístico, se genera con diagramación de aula limpia y membrete oficial listo para fotocopiar.
              </p>
            </div>
          </div>

          {/* Estilo Visual / Dirección de Arte Rápida */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase text-[#09243a] flex items-center gap-1.5">
                <span>🎨 Estilo Visual / Dirección de Arte</span>
                <span className="text-[10px] font-bold text-[#68747d] font-normal lowercase">(opcional)</span>
              </label>
              {['/cartoon', '/handwritten', '/3d', '/claymorphism', '/visualthinking', '/watercolor', '/lineart', '/pixelart', '/papercraft', '/doodle', '/flatdesign', '/pastel', '/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade'].some(c => selectedCodes.has(c)) && (
                <button
                  type="button"
                  onClick={() => {
                    ['/cartoon', '/handwritten', '/3d', '/claymorphism', '/visualthinking', '/watercolor', '/lineart', '/pixelart', '/papercraft', '/doodle', '/flatdesign', '/pastel', '/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade'].forEach(c => {
                      if (selectedCodes.has(c)) toggleCode(c);
                    });
                  }}
                  className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Limpiar estilo
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: '/handwritten', label: '📝 Apuntes a Mano' },
                { code: '/cartoon', label: '🎨 Cartoon' },
                { code: '/3d', label: '🧊 3D Render' },
                { code: '/mariokart', label: '🏎️ Mario Kart' },
                { code: '/minecraft', label: '⛏️ Minecraft' },
                { code: '/roblox', label: '🧱 Roblox' },
                { code: '/lego', label: '🧩 Lego' },
                { code: '/pokemon', label: '⚡ Pokémon' },
                { code: '/arcade', label: '🕹️ Arcade Retro' },
                { code: '/claymorphism', label: '🧱 Plastilina 3D' },
                { code: '/visualthinking', label: '📐 Visual Thinking' },
                { code: '/watercolor', label: '🖌️ Acuarela' },
                { code: '/lineart', label: '✏️ Line Art' },
                { code: '/pixelart', label: '👾 Pixel Art' },
                { code: '/papercraft', label: '📄 Papercraft' },
                { code: '/doodle', label: '🖍️ Doodle' },
                { code: '/flatdesign', label: '🏷️ Flat Design' },
                { code: '/pastel', label: '🌸 Pastel' }
              ].map(st => {
                const isSelected = selectedCodes.has(st.code);
                return (
                  <button
                    key={st.code}
                    type="button"
                    onClick={() => toggleCode(st.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#09243a] text-white shadow-xs ring-2 ring-[#d7ad32]'
                        : 'bg-[#f4f6f7] hover:bg-[#e7e4dc] text-[#09243a] border border-[#e7e4dc]'
                    }`}
                  >
                    <span>{st.label}</span>
                    {isSelected && <span className="text-[#fde047] text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Indicador de estilo visual activo */}
            {Array.from(selectedCodes).find(c => ['/handwritten', '/3d', '/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade', '/pixelart', '/claymorphism', '/cartoon', '/watercolor', '/papercraft', '/doodle', '/flatdesign', '/lineart', '/visualthinking'].includes(c)) && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold flex items-center justify-between">
                <span>
                  Técnica / Temática activa: {
                    selectedCodes.has('/mariokart') ? '🏎️ Mario Kart / Carreras' :
                    selectedCodes.has('/minecraft') ? '⛏️ Minecraft / Voxel 3D' :
                    selectedCodes.has('/roblox') ? '🧱 Roblox / Obby de Obstáculos' :
                    selectedCodes.has('/lego') ? '🧩 Lego / Bloques Ensamblables' :
                    selectedCodes.has('/pokemon') ? '⚡ Pokémon / Batalla RPG' :
                    selectedCodes.has('/arcade') ? '🕹️ Arcade Retro / 8-Bit' :
                    selectedCodes.has('/handwritten') ? '📝 Apuntes a Mano (Study Notes / Sketchnote)' :
                    selectedCodes.has('/3d') ? '🧊 3D Render Digital (Pixar / Disney CGI)' :
                    selectedCodes.has('/pixelart') ? '👾 Pixel Art Retro 16-bit' :
                    selectedCodes.has('/claymorphism') ? '🧱 Plastilina 3D / Claymation' :
                    selectedCodes.has('/cartoon') ? '🎨 Cartoon Infantil' :
                    selectedCodes.has('/visualthinking') ? '📐 Visual Thinking' :
                    selectedCodes.has('/watercolor') ? '🖌️ Acuarela' :
                    selectedCodes.has('/lineart') ? '✏️ Line Art' :
                    selectedCodes.has('/papercraft') ? '📄 Papercraft' :
                    selectedCodes.has('/doodle') ? '🖍️ Doodle' :
                    selectedCodes.has('/flatdesign') ? '🏷️ Flat Design' : ''
                  }
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md font-black">
                  Activa
                </span>
              </div>
            )}
          </div>

          {/* Tema */}
          <div>
            <label className="block text-xs font-black uppercase text-[#09243a] mb-1.5">
              Tema *
            </label>
            <input
              id="input-tema"
              type="text"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej. Sistema solar, fracciones equivalentes, fotosíntesis..."
              className="w-full p-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/15 outline-none bg-white"
            />
            {/* Sugerencias rápidas */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-500 font-bold mr-0.5">Sugerencias curriculares:</span>
              {[
                '➕ Sumas y restas (1° y 2°)',
                '☀️ Sistema Solar',
                '📐 Fracciones simples',
                '🌿 Fotosíntesis',
                '📖 Comprensión lectora',
                '🏛️ Civilizaciones antiguas'
              ].map(sug => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setTema(sug.replace(/^[^\s]+\s/, ''))}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Materia y Grado en 2 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#09243a] mb-1.5">
                Materia
              </label>
              <select
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] outline-none bg-white"
              >
                <option value="">Selecciona</option>
                <option>Español / Lengua</option>
                <option>Matemáticas</option>
                <option>Ciencias</option>
                <option>Estudios Sociales</option>
                <option>Inglés</option>
                <option>Arte</option>
                <option>Tecnología</option>
                <option>Educación Física</option>
                <option>Otra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#09243a] mb-1.5">
                Nivel / Grado
              </label>
              <select
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] outline-none bg-white"
              >
                <option value="">Selecciona</option>
                <option>Preescolar / Kinder</option>
                <option>1° - 2° grado</option>
                <option>3° - 5° grado</option>
                <option>6° - 8° grado</option>
                <option>9° - 10° grado</option>
                <option>11° - 12° grado</option>
                <option>Universidad</option>
                <option>Formación profesional</option>
              </select>
            </div>
          </div>

          {/* Objetivo de aprendizaje */}
          <div>
            <label className="block text-xs font-black uppercase text-[#09243a] mb-1.5">
              Objetivo de aprendizaje
            </label>
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="¿Qué deben aprender, practicar o demostrar los estudiantes?"
              rows={2}
              className="w-full p-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/15 outline-none bg-white resize-vertical"
            />
          </div>

          {/* Detalles adicionales */}
          <div>
            <label className="block text-xs font-black uppercase text-[#09243a] mb-1.5">
              Detalles adicionales (opcional)
            </label>
            <textarea
              value={adicional}
              onChange={(e) => setAdicional(e.target.value)}
              placeholder="Ej. tres niveles de dificultad, trabajo en parejas, tiempo máximo de 15 min..."
              rows={2}
              className="w-full p-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/15 outline-none bg-white resize-vertical"
            />
          </div>
        </div>

        {/* Panel 2: Elige tus Códigos L.I.D.E.R.™ */}
        <div className="lg:col-span-7 bg-white border border-[#e7e4dc] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-[#f4f6f7] pb-3">
            <h2 className="text-xl font-black text-[#09243a] m-0">
              2. Elige tus Códigos L.I.D.E.R.™
            </h2>
            <p className="text-xs text-[#68747d] mt-0.5">
              No necesitas aprender prompting. Elige cómo quieres que sea tu recurso visual y pedagógicamente.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#68747d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔎 Buscar código (ej. worksheet, doodle, rubric, points)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/15 outline-none bg-white"
            />
          </div>

          {/* Selected codes bar */}
          <div className="bg-[#f4f6f7] rounded-xl p-3 flex flex-wrap items-center gap-2 min-h-[44px]">
            <span className="text-[10px] font-black uppercase text-[#68747d] tracking-wider mr-1">
              SELECCIONADOS ({selectedCodes.size}):
            </span>
            {selectedCodes.size === 0 ? (
              <span className="text-xs text-[#68747d] italic">
                Ninguno todavía (puedes generar sin códigos o elegir varios)
              </span>
            ) : (
              Array.from(selectedCodes).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggleCode(code)}
                  className="bg-[#09243a] hover:bg-[#c62828] text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
                  title="Clic para remover"
                >
                  <span>{code}</span>
                  <span className="text-white/60 group-hover:text-white text-[10px]">✕</span>
                </button>
              ))
            )}
          </div>

          {/* Categories and code chips */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredCategories.map((category) => (
              <div key={category.name} className="border border-[#e7e4dc] rounded-2xl overflow-hidden">
                <div className="bg-[#faf9f5] px-4 py-2 text-xs font-extrabold text-[#09243a] border-b border-[#e7e4dc]">
                  {category.name}
                </div>
                <div className="p-3 flex flex-wrap gap-2">
                  {category.items.map(([code, label, desc]) => {
                    const isSelected = selectedCodes.has(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleCode(code)}
                        className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-start gap-0.5 ${
                          isSelected
                            ? 'bg-[#09243a] text-white border-[#09243a] shadow-xs'
                            : 'bg-white text-[#24313b] border-[#e7e4dc] hover:border-[#d7ad32] hover:bg-[#fffdf5]'
                        }`}
                      >
                        <strong className="text-xs leading-tight">{label}</strong>
                        <code className={`text-[10px] font-mono ${isSelected ? 'text-amber-200' : 'text-[#68747d]'}`}>
                          {code}
                        </code>
                        <small className={`text-[10px] leading-tight ${isSelected ? 'text-[#d9e3e9]' : 'text-[#68747d]'}`}>
                          {desc}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Button: Generar mi recurso (Enhanced positioning below codes) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleGenerate()}
              className="w-full py-4 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-sm sm:text-base font-black shadow-lg shadow-[#09243a]/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#d7ad32]" />
              <span>✨ Generar mi recurso</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* RESULT SECTION                                                            */}
      {/* ========================================================================= */}
      {generatedPrompt && (
        <div id="result-section" className="bg-[#09243a] rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-5 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d7ad32]" />
                LISTO PARA USAR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
                ✨ Tu recurso está listo
              </h2>
              <p className="text-xs sm:text-sm text-[#d6e1e7] mt-1 max-w-2xl">
                L.I.D.E.R. convirtió tus decisiones de diseño en una instrucción completa para ChatGPT, Claude, Gemini o Canva AI.
              </p>
            </div>

            {/* Modality Tag */}
            <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-extrabold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d7ad32]"></span>
              <span>{getModalityLabel(modo)}</span>
            </div>
          </div>

          {/* Codes used summary */}
          {selectedCodes.size > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase text-[#d5e0e7] tracking-wider mb-2">
                CÓDIGO L.I.D.E.R.™ UTILIZADO:
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedCodes).map(c => (
                  <span key={c} className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/20 text-white font-mono text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Feature Alert if Interactive or Hybrid */}
          {(modo === 'interactivo' || modo === 'hibrido') && (
            <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-emerald-200 text-sm font-extrabold">
                    Capacidad interactiva incorporada
                  </strong>
                  <span className="text-xs text-emerald-300/80">
                    El prompt instruye a la IA para entregar funcionalidad real (botones con eventos, comprobación, puntaje y reinicio).
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const activeGame = Array.from(selectedCodes).find(c => 
                    ['/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade'].includes(c)
                  );
                  onOpenSandbox(tema, activeGame || tipo, grado, materia);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#09243a] text-xs font-black whitespace-nowrap transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
              >
                <Eye className="w-4 h-4" />
                <span>Probar simulador interactivo</span>
              </button>
            </div>
          )}

          {/* Prompt textarea */}
          <div className="relative">
            <textarea
              id="result-prompt-box"
              readOnly
              value={generatedPrompt}
              rows={12}
              className="w-full bg-[#061a2b] text-[#edf5f8] p-4 sm:p-5 rounded-2xl border border-white/10 font-mono text-xs sm:text-sm leading-relaxed outline-none focus:ring-2 focus:ring-[#d7ad32]/40"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Copy prompt */}
              <button
                type="button"
                onClick={handleCopy}
                className="px-5 py-3 rounded-xl bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar prompt'}</span>
              </button>

              {/* Save resource */}
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-3 rounded-xl bg-white hover:bg-[#f4f6f7] text-[#09243a] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : 'text-[#68747d]'}`} />
                <span>{saved ? 'Guardado en Mis recursos' : 'Guardar recurso'}</span>
              </button>

              {/* Print worksheet */}
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#133b5c] hover:bg-[#184870] text-[#f8edc5] border border-[#d7ad32]/40 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                title="Abrir hoja de aula imprimible con membrete oficial"
              >
                <Printer className="w-4 h-4 text-[#d7ad32]" />
                <span>Kit Docente (Ficha + Rúbrica)</span>
              </button>

              {/* Download txt */}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Descargar archivo de texto"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Descargar .txt</span>
              </button>
            </div>

            {/* Test simulator button */}
            {(modo === 'interactivo' || modo === 'hibrido') && (
              <button
                type="button"
                onClick={() => {
                  const activeGame = Array.from(selectedCodes).find(c => 
                    ['/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade'].includes(c)
                  );
                  onOpenSandbox(tema, activeGame || tipo, grado, materia);
                }}
                className="px-4 py-3 rounded-xl bg-[#0c314f] hover:bg-[#0e3b60] text-[#d7ad32] border border-[#d7ad32]/40 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Simulador de interactividad</span>
              </button>
            )}

          </div>

        </div>
      )}

      {/* Printable Classroom Worksheet Modal */}
      {lastGeneratedData && (
        <PrintableResourceModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          data={lastGeneratedData}
          promptText={generatedPrompt}
        />
      )}

    </div>
  );
};
