/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, BookOpen, FileText, CheckSquare, Gamepad2, Target, Monitor, Layers, ExternalLink } from 'lucide-react';
import { ResourceFunctionMode } from '../types';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onQuickCreate: (type: string, initialModo?: ResourceFunctionMode) => void;
  onOpenGamification: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onQuickCreate,
  onOpenGamification,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#d7ad32]" />
            TU COPILOTO DOCENTE CON IA
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#09243a] tracking-tight leading-[1.05]">
            Menos prompting.<br />
            <span className="text-[#d7ad32]">Más creación.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#68747d] leading-relaxed max-w-2xl">
            Transforma una idea en un recurso educativo listo para el aula. Elige cómo quieres que funcione (imprimible o con <strong className="text-[#09243a]">interactividad real ejecutable</strong>). Tú eliges los códigos. L.I.D.E.R. construye la instrucción.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="px-6 py-3.5 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#09243a]/20 flex items-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#d7ad32]" />
              Crear mi primer recurso
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('codes')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#f4f6f7] text-[#09243a] border border-[#e7e4dc] font-extrabold text-sm sm:text-base transition-all hover:border-[#d7ad32] flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#68747d]" />
              Explorar códigos
            </button>
          </div>
        </div>

        {/* Hero Card Preview */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#e7e4dc] rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#09243a]/5 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#09243a] font-extrabold text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d7ad32]"></span>
                Código L.I.D.E.R.™
              </div>
              <span className="px-2.5 py-1 bg-[#f8edc5] text-[#735a00] font-mono text-[11px] font-black rounded-lg">
                D · DISEÑAR
              </span>
            </div>

            {/* Modality Pill Feature */}
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-[#09243a]/5 border border-[#09243a]/10 flex items-center justify-between text-xs">
              <span className="text-[#09243a] font-bold flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#d7ad32]" />
                Modalidad de funcionamiento:
              </span>
              <span className="font-extrabold text-[#09243a] bg-white px-2 py-0.5 rounded shadow-2xs">
                💻 Interactivo
              </span>
            </div>

            <div className="bg-[#f5f7f8] rounded-2xl p-4 text-[#56636c] text-xs sm:text-sm leading-relaxed border border-[#e7e4dc]/60">
              &quot;Crea una actividad sobre el sistema solar con funcionalidad interactiva real: botones con eventos, comprobación instantánea de respuestas, marcador dinámico de puntos y botón de reinicio...&quot;
            </div>

            <div className="flex flex-wrap gap-2 my-4">
              <span className="bg-white border border-[#e7e4dc] rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold text-[#09243a]">
                /interactive
              </span>
              <span className="bg-white border border-[#e7e4dc] rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold text-[#09243a]">
                /space
              </span>
              <span className="bg-white border border-[#e7e4dc] rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold text-[#09243a]">
                /feedback
              </span>
              <span className="bg-white border border-[#e7e4dc] rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold text-[#09243a]">
                /gamified
              </span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="w-full py-3 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              Generar recurso ahora →
            </button>
          </div>
        </div>

      </section>

      {/* NEW FEATURE HIGHLIGHT BANNER */}
      <section className="bg-linear-to-r from-[#09243a] via-[#0c314f] to-[#09243a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black">
            🎯 NUEVA CAPACIDAD EN L.I.D.E.R. AI STUDIO
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ¿Cómo quieres que funcione tu recurso?
          </h2>
          <p className="text-sm sm:text-base text-[#d6e1e7] leading-relaxed">
            Ahora puedes elegir entre <span className="text-[#d7ad32] font-bold">📄 Imprimible</span>, <span className="text-[#d7ad32] font-bold">💻 Interactivo</span> o <span className="text-[#d7ad32] font-bold">🔄 Híbrido</span>. Al seleccionar Interactivo, la IA no se limitará a describir la interacción: <strong className="text-white">la implementará con funcionalidad real</strong> (botones, respuestas validadas, puntuación, retroalimentación y reinicio).
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="px-5 py-2.5 rounded-xl bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              Probar en el Creador →
            </button>
          </div>
        </div>
      </section>

      {/* Quick Create Grid */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black mb-2">
            CREA CON IA
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#09243a]">
            ¿Qué quieres crear hoy?
          </h2>
          <p className="text-sm sm:text-base text-[#68747d]">
            Empieza por lo que necesitas. No necesitas saber prompting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          
          <button
            type="button"
            onClick={() => onQuickCreate('Actividad educativa', 'interactivo')}
            className="group bg-white border border-[#e7e4dc] hover:border-[#d7ad32] hover:shadow-xl rounded-2xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#fffdf5] border border-[#eadfb8] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-lg font-black text-[#09243a] mb-1 group-hover:text-[#d7ad32] transition-colors">
                Actividad Interactiva
              </h3>
              <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                Ejercicios dinámicos con botones, evaluación al instante y puntuación.
              </p>
            </div>
            <span className="text-xs font-bold text-[#09243a] mt-4 flex items-center gap-1">
              Crear actividad →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onQuickCreate('Hoja de trabajo', 'imprimible')}
            className="group bg-white border border-[#e7e4dc] hover:border-[#d7ad32] hover:shadow-xl rounded-2xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#fffdf5] border border-[#eadfb8] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 className="text-lg font-black text-[#09243a] mb-1 group-hover:text-[#d7ad32] transition-colors">
                Recurso Imprimible
              </h3>
              <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                Worksheets, flashcards, pósteres e infografías listos para fotocopiar.
              </p>
            </div>
            <span className="text-xs font-bold text-[#09243a] mt-4 flex items-center gap-1">
              Crear recurso →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onQuickCreate('Clase completa', 'hibrido')}
            className="group bg-white border border-[#e7e4dc] hover:border-[#d7ad32] hover:shadow-xl rounded-2xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#fffdf5] border border-[#eadfb8] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎓
              </div>
              <h3 className="text-lg font-black text-[#09243a] mb-1 group-hover:text-[#d7ad32] transition-colors">
                Clase Híbrida
              </h3>
              <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                Experiencias de aprendizaje con versión de papel y versión digital.
              </p>
            </div>
            <span className="text-xs font-bold text-[#09243a] mt-4 flex items-center gap-1">
              Diseñar clase →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onQuickCreate('Rúbrica de evaluación', 'imprimible')}
            className="group bg-white border border-[#e7e4dc] hover:border-[#d7ad32] hover:shadow-xl rounded-2xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#fffdf5] border border-[#eadfb8] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-lg font-black text-[#09243a] mb-1 group-hover:text-[#d7ad32] transition-colors">
                Evaluación & Rúbricas
              </h3>
              <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                Rúbricas analíticas, checklists y exit tickets con criterios pedagógicos.
              </p>
            </div>
            <span className="text-xs font-bold text-[#09243a] mt-4 flex items-center gap-1">
              Crear evaluación →
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenGamification}
            className="group bg-linear-to-br from-white to-[#fffdf5] border-2 border-[#eadfb8] hover:border-[#d7ad32] hover:shadow-xl rounded-2xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#09243a] text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎮
              </div>
              <h3 className="text-lg font-black text-[#09243a] mb-1 group-hover:text-[#d7ad32] transition-colors">
                Gamificación 2.0
              </h3>
              <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                Misiones, quizzes, escape rooms, insignias, XP y temporizadores con interactividad real.
              </p>
            </div>
            <span className="text-xs font-bold text-[#d7ad32] mt-4 flex items-center gap-1">
              Abrir Gamificación →
            </span>
          </button>

          <button
            type="button"
            onClick={() => onQuickCreate('Material personalizado', 'hibrido')}
            className="group bg-white border border-[#e7e4dc] hover:border-[#d7ad32] hover:shadow-xl rounded-2xl p-5 sm:p-6 text-left transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#fffdf5] border border-[#eadfb8] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-lg font-black text-[#09243a] mb-1 group-hover:text-[#d7ad32] transition-colors">
                Personalización DUA
              </h3>
              <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                Adapta el material a diferentes ritmos de aprendizaje y necesidades educativas.
              </p>
            </div>
            <span className="text-xs font-bold text-[#09243a] mt-4 flex items-center gap-1">
              Personalizar →
            </span>
          </button>

        </div>
      </section>

      {/* Mini-Course Callout */}
      <section className="bg-[#09243a] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black text-white m-0">
            ¿Quieres aprender IA desde cero?
          </h3>
          <p className="text-sm text-[#d6e1e7] m-0 max-w-xl">
            Empieza gratis con el Mini Curso IA para Docentes de Katya Sánchez. Descubre cómo integrar la IA en tu labor pedagógica diaria.
          </p>
        </div>

        <a
          href="https://minicurso-ia.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-black rounded-xl text-sm whitespace-nowrap transition-all shadow-md hover:scale-105 flex items-center gap-2"
        >
          <span>Ir al minicurso gratuito</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

    </div>
  );
};
