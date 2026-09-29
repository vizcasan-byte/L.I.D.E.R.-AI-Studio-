/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Palette, 
  Zap, 
  Award, 
  Printer, 
  CheckCircle2, 
  BookOpen, 
  X,
  Layers,
  Download,
  Loader2
} from 'lucide-react';
import { exportElementToPdf, printElementViaIframe } from '../utils/printPdfUtils';

interface MethodViewProps {
  onNavigate: (view: string) => void;
}

export const MethodView: React.FC<MethodViewProps> = ({ onNavigate }) => {
  const [isCheatSheetModalOpen, setIsCheatSheetModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownloadPosterPdf = async () => {
    if (!posterRef.current) return;
    try {
      setIsGeneratingPdf(true);
      setNotice('Generando póster en formato PDF...');
      await exportElementToPdf(posterRef.current, 'Poster_Metodo_LIDER_Docente.pdf');
      setNotice('¡Póster descargado en tu dispositivo!');
      setTimeout(() => setNotice(null), 5000);
    } catch (e) {
      console.error(e);
      setNotice('Error al generar PDF. Intenta con la opción imprimir.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrintPoster = () => {
    if (!posterRef.current) return;
    printElementViaIframe(posterRef.current, 'Póster Pedagógico · Método L.I.D.E.R.©');
    try {
      window.print();
    } catch (e) {
      console.warn(e);
    }
    setNotice('Preparando para imprimir. Si no se abre la ventana, usa "Descargar PDF".');
    setTimeout(() => setNotice(null), 6000);
  };

  const steps = [
    {
      letter: 'L',
      name: 'Liberar',
      bg: 'bg-[#09243a]',
      textColor: 'text-white',
      borderColor: 'border-[#09243a]/20',
      icon: ShieldCheck,
      question: '¿Qué carga mental o tarea repetitiva puedo delegar en la IA hoy?',
      action: 'Superar mitos y tecnofobia. Usar la IA como copiloto para planificación, redacción y estructuración.',
      outcome: 'Docente aliviado, con energía enfocada en la interacción humana con sus estudiantes.',
      description: 'Supera miedos y mitos sobre la IA y conviértela en tu copiloto diario de confianza.'
    },
    {
      letter: 'I',
      name: 'Integrar',
      bg: 'bg-[#75b8d3]',
      textColor: 'text-[#09243a]',
      borderColor: 'border-[#75b8d3]/30',
      icon: Compass,
      question: '¿Qué objetivo de aprendizaje y criterio curricular guía esta actividad?',
      action: 'Vincular cada prompt pedagógico con objetivos de aprendizaje, taxonomía de Bloom y competencias clave.',
      outcome: 'Propuestas educativas rigurosas, medibles y con sentido curricular inequívoco.',
      description: 'Aprende a integrar herramientas y flujos de IA en tu programación docente real.'
    },
    {
      letter: 'D',
      name: 'Diseñar',
      bg: 'bg-[#df806c]',
      textColor: 'text-white',
      borderColor: 'border-[#df806c]/30',
      icon: Palette,
      highlight: true,
      question: '¿Qué hará el estudiante con este material (resolver, debatir, simular)?',
      action: 'Crear recursos en dos modalidades: fichas de aula imprimibles limpias y simuladores interactivos reales.',
      outcome: 'Estudiantes activos, enganchados con experiencias educativas significativas y memorables.',
      description: 'Crea experiencias educativas, materiales interactivos reales, imprimibles y actividades con IA.'
    },
    {
      letter: 'E',
      name: 'Estrategia',
      bg: 'bg-[#8978b8]',
      textColor: 'text-white',
      borderColor: 'border-[#8978b8]/30',
      icon: Zap,
      question: '¿Cómo evalúo el progreso en menos tiempo y atiendo a distintos ritmos?',
      action: 'Generar rúbricas analíticas, pistas adaptativas, actividades de refuerzo y autoevaluación formativa.',
      outcome: 'Ahorro de hasta 5 horas semanales y retroalimentación personalizada oportuna.',
      description: 'Automatiza tareas administrativas y recupera tiempo de calidad para tus estudiantes.'
    },
    {
      letter: 'R',
      name: 'Referente',
      bg: 'bg-[#d7ad32]',
      textColor: 'text-[#09243a]',
      borderColor: 'border-[#d7ad32]/40',
      icon: Award,
      question: '¿Cómo comparto esta innovación con mi claustro y comunidad escolar?',
      action: 'Documentar buenas prácticas, liderar talleres entre pares y publicar recursos educativos abiertos.',
      outcome: 'Reconocimiento profesional, liderazgo transformador y trascendencia educativa.',
      description: 'Comparte tu innovación, lidera la transformación educativa y conviértete en referente pedagógico.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title & Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d7ad32]" />
            TU MÉTODO PEDAGÓGICO OFICIAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#09243a]">
            Método L.I.D.E.R.©
          </h1>
          <p className="text-base sm:text-lg text-[#68747d] mt-2">
            De docente a referente: tecnología con propósito humano para transformar la educación.
          </p>
        </div>

        {/* Quick Printable Cheat-Sheet button */}
        <button
          type="button"
          onClick={() => setIsCheatSheetModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-white border border-[#e7e4dc] hover:border-[#d7ad32] text-[#09243a] font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 cursor-pointer self-start md:self-auto hover:-translate-y-0.5"
        >
          <div className="w-7 h-7 rounded-lg bg-[#f8edc5] text-[#735a00] flex items-center justify-center font-black">
            <Printer className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block font-black text-xs leading-tight">Cheat-Sheet Docente</span>
            <span className="block text-[10px] text-[#68747d]">Póster imprimible en 1 hoja</span>
          </div>
        </button>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.letter}
              className={`bg-white border ${step.highlight ? 'border-[#d7ad32] ring-2 ring-[#d7ad32]/20' : 'border-[#e7e4dc]'} rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md relative`}
            >
              {step.highlight && (
                <span className="absolute -top-3 right-4 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Corazón del Studio
                </span>
              )}

              <div>
                <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.textColor} flex items-center justify-center font-black text-2xl mb-4 shadow-xs`}>
                  {step.letter}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-extrabold text-[#09243a] m-0">
                    {step.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#68747d] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f4f6f7] flex items-center justify-between text-xs text-[#68747d]">
                <span className="font-bold">Fase {step.letter}</span>
                <Icon className="w-4 h-4 opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Cheat-Sheet Card Section */}
      <div className="bg-white border border-[#e7e4dc] rounded-3xl p-6 sm:p-9 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#f4f6f7] pb-5">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#d7ad32] block">
              GUÍA DE APLICACIÓN EN AULA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#09243a] m-0 mt-0.5">
              Cómo aplicar las 5 fases en tu práctica docente diaria
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsCheatSheetModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#d7ad32]" />
            <span>Imprimir Cheat-Sheet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={`detail-${step.letter}`}
                className="border border-[#e7e4dc] rounded-2xl p-5 bg-[#fbfaf6] flex flex-col justify-between space-y-4 hover:border-[#d7ad32] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-8 h-8 rounded-xl ${step.bg} ${step.textColor} flex items-center justify-center font-black text-sm`}>
                      {step.letter}
                    </span>
                    <strong className="text-base font-extrabold text-[#09243a]">
                      Fase {step.letter} · {step.name}
                    </strong>
                  </div>

                  <div className="space-y-2.5 text-xs text-[#475569]">
                    <div className="bg-white border border-[#e7e4dc] rounded-xl p-3">
                      <span className="font-bold text-[#09243a] block text-[11px] mb-1">
                        🎯 Pregunta Clave de Mentoría:
                      </span>
                      <p className="m-0 italic text-[#09243a]/90 leading-snug">
                        "{step.question}"
                      </p>
                    </div>

                    <div>
                      <strong className="text-[#09243a] block mb-0.5">Acción pedagógica:</strong>
                      <p className="m-0 leading-relaxed text-[#64748b]">
                        {step.action}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#edebe4] flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{step.outcome}</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Sello Metodológico */}
          <div className="border border-[#d7ad32]/40 bg-linear-to-br from-[#fffdf5] to-[#fcf7e6] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#d7ad32] text-[#09243a] flex items-center justify-center font-black text-sm">
                  ★
                </div>
                <strong className="text-base font-extrabold text-[#09243a]">
                  El Propósito Humano
                </strong>
              </div>
              <p className="text-xs text-[#524419] leading-relaxed">
                La Inteligencia Artificial en educación no sustituye al docente; amplifica su empatía, creatividad y rigor metodológico.
              </p>
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-[#d7ad32]/30 text-xs font-bold text-[#09243a] text-center">
                “IA que se aplica. Enseñanza que se transforma.”
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="w-full py-2.5 rounded-xl bg-[#09243a] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#061a2b] transition-all cursor-pointer"
            >
              <span>Crear recurso con el método →</span>
            </button>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#09243a] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white m-0">
            D · Diseñar es el corazón de L.I.D.E.R. AI Studio.
          </h2>
          <p className="text-sm text-[#d6e1e7] m-0 max-w-2xl">
            Convierte lo que sabes en recursos que tus estudiantes recuerden, ahora con interactividad real incorporada y formato de impresión impecable.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('create')}
          className="px-6 py-3.5 bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-black rounded-xl text-sm whitespace-nowrap transition-all shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <span>Diseñar ahora →</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal: Printable Cheat-Sheet */}
      {isCheatSheetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#09243a]/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#e7e4dc] overflow-hidden my-6 flex flex-col max-h-[92vh]">
            
            {/* Modal Header Toolbar */}
            <div className="bg-[#09243a] text-white px-5 sm:px-8 py-4 flex items-center justify-between gap-4 border-b border-white/10 print:hidden shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d7ad32] text-[#09243a] flex items-center justify-center font-black">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                    Cheat-Sheet Oficial · Método L.I.D.E.R.©
                  </h2>
                  <p className="text-xs text-[#d6e1e7] mt-0.5">
                    Póster de referencia pedagógica para imprimir y tener en tu escritorio docente.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPosterPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2 bg-[#d7ad32] hover:bg-[#c99f2b] disabled:opacity-75 text-[#09243a] font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                  title="Descargar póster en formato PDF"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintPoster}
                  className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Imprimir póster"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheatSheetModalOpen(false)}
                  className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notice if any */}
            {notice && (
              <div className="px-6 py-2 bg-[#d7ad32]/10 border-b border-[#d7ad32]/30 text-xs font-bold text-[#09243a] flex items-center justify-between">
                <span>{notice}</span>
                <button type="button" onClick={() => setNotice(null)} className="text-[#09243a]/60 hover:text-[#09243a] cursor-pointer">✕</button>
              </div>
            )}

            {/* Printable Paper Area */}
            <div className="overflow-y-auto p-6 sm:p-10 bg-[#f8f9fa] flex-1">
              <div 
                ref={posterRef}
                id="printable-poster"
                className="bg-white max-w-3xl mx-auto p-8 sm:p-12 rounded-2xl shadow-md border border-[#e7e4dc] text-[#1f2937] print:shadow-none print:border-none print:p-0 print:max-w-none space-y-6"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-[#09243a] pb-6 gap-4">
                  <img
                    src="/logo-katya.png"
                    alt="Katya Sánchez · Mentora en IA & EdTech"
                    className="h-12 sm:h-14 w-auto object-contain"
                  />
                  <div className="text-right">
                    <div className="text-xs font-black uppercase text-[#09243a] tracking-widest">
                      Cheat-Sheet Pedagógica
                    </div>
                    <div className="text-sm font-extrabold text-[#d7ad32]">
                      Método L.I.D.E.R.©
                    </div>
                    <div className="text-[10px] text-[#68747d] mt-0.5">
                      De Docente a Referente
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="text-center py-2 bg-[#fbfaf6] border border-[#e7e4dc] rounded-xl">
                  <span className="text-xs font-extrabold text-[#09243a]">
                    Las 5 Fases para Diseñar con IA sin Perder el Propósito Humano
                  </span>
                </div>

                {/* The 5 Phases List */}
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div
                      key={`print-step-${step.letter}`}
                      className="border border-[#e2e8f0] rounded-xl p-4 flex items-start gap-4"
                    >
                      <div className={`w-10 h-10 rounded-xl ${step.bg} ${step.textColor} flex items-center justify-center font-black text-lg shrink-0 mt-0.5`}>
                        {step.letter}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-black text-[#09243a]">
                            Fase {step.letter} · {step.name}
                          </strong>
                        </div>
                        <p className="text-[#334155] m-0 leading-relaxed font-medium">
                          {step.description}
                        </p>
                        <div className="pt-1 text-[#64748b]">
                          <strong>Pregunta guía:</strong> <em>"{step.question}"</em>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Golden Principles Box */}
                <div className="bg-[#fffdf5] border border-[#d7ad32] p-4 rounded-xl text-center space-y-1 text-xs">
                  <div className="font-extrabold text-[#09243a]">
                    Regla de Oro de la Mentoría en IA:
                  </div>
                  <div className="text-[#524419] font-medium">
                    "Menos prompting memorístico. Más diseño instruccional con sentido pedagógico."
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#e2e8f0] text-center">
                  <span className="text-xs font-black tracking-widest text-[#09243a] uppercase">
                    LIDER AI STUDIO
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
