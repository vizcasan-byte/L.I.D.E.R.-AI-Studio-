/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Printer, 
  X, 
  BookOpen, 
  CheckCircle2, 
  Key, 
  ClipboardCheck, 
  Ticket, 
  Layers, 
  Sparkles,
  Award,
  HelpCircle,
  Clock,
  Check,
  FileText,
  Download,
  Loader2,
  Info
} from 'lucide-react';
import { ResourceFormData, PaperSize, OrientationMode } from '../types';
import { exportElementToPdf, printElementViaIframe, downloadStandaloneHtml } from '../utils/printPdfUtils';

export type AdaptationProfile = 'standard' | 'dua' | 'tdah' | 'discalculia' | 'altascapacidades' | 'lecturafacil';

interface PrintableResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResourceFormData;
  promptText?: string;
  initialTab?: 'worksheet' | 'answers' | 'rubric' | 'exitticket' | 'dua_matriz' | 'lessonplan' | 'groups' | 'all';
  initialAdaptation?: AdaptationProfile;
}

export const PrintableResourceModal: React.FC<PrintableResourceModalProps> = ({
  isOpen,
  onClose,
  data,
  promptText,
  initialTab = 'worksheet',
  initialAdaptation
}) => {
  const [activeTab, setActiveTab] = useState<'worksheet' | 'answers' | 'rubric' | 'exitticket' | 'dua_matriz' | 'lessonplan' | 'groups' | 'all'>(initialTab);
  const [adaptationMode, setAdaptationMode] = useState<AdaptationProfile>(() => {
    const codes = data.selectedCodes || [];
    if (codes.includes('/tdah')) return 'tdah';
    if (codes.includes('/discalculia')) return 'discalculia';
    if (codes.includes('/altascapacidades')) return 'altascapacidades';
    if (codes.includes('/lecturafacil')) return 'lecturafacil';
    if (codes.includes('/dua')) return 'dua';
    return initialAdaptation || 'standard';
  });
  
  // Tamaño de papel y orientación física
  const [paperSize, setPaperSize] = useState<PaperSize>(data.paperSize || 'carta');
  const [orientation, setOrientation] = useState<OrientationMode>(data.orientation || 'vertical');

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: 'info' | 'success' | 'warn'; text: string } | null>(null);
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const rawTopic = data.tema?.trim() || 'Sumas y Restas';
  // Strip game setting mentions if typed inside topic
  const cleanTopic = rawTopic.replace(/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade)?)/gi, '').trim() || rawTopic;

  const formattedSubject = data.materia || 'Matemáticas / Educación General';
  const formattedGrade = data.grado || '1° - 2° Primaria';
  const formattedObjective = data.objetivo || `Consolidar las habilidades de cálculo mental y resolución de problemas cotidianos sobre ${cleanTopic}.`;

  const getCleanFilename = (extension: string) => {
    const tabSuffix = activeTab === 'worksheet' ? `Ficha_${adaptationMode}` :
                      activeTab === 'answers' ? 'Solucionario_Docente' :
                      activeTab === 'rubric' ? 'Rubrica_Formativa' :
                      activeTab === 'exitticket' ? 'Ticket_Salida' :
                      activeTab === 'dua_matriz' ? 'Adecuaciones_Curriculares_Ley7600_MEP' :
                      activeTab === 'lessonplan' ? 'Guion_Sesion_Clase_Minuto_a_Minuto' :
                      activeTab === 'groups' ? 'Grupos_Trabajo_Roles_Cooperativo' : 'Kit_Completo_Docente';
    const cleanName = cleanTopic.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_').substring(0, 30);
    return `${cleanName}_${tabSuffix}.${extension}`;
  };

  const handleDownloadPdf = async () => {
    if (!printContentRef.current) return;
    try {
      setIsGeneratingPdf(true);
      setStatusNotice({ type: 'info', text: 'Convirtiendo documento a PDF de alta resolución... Por favor espera un momento.' });
      
      const filename = getCleanFilename('pdf');
      await exportElementToPdf(printContentRef.current, filename, { paperSize, orientation });
      
      setStatusNotice({ 
        type: 'success', 
        text: `¡PDF descargado con éxito en tu dispositivo! Archivo: ${filename}` 
      });
      setTimeout(() => setStatusNotice(null), 6000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setStatusNotice({ 
        type: 'warn', 
        text: 'Hubo un inconveniente al renderizar el PDF. Puedes usar "Descargar HTML listo para imprimir" o probar nuevamente.' 
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (!printContentRef.current) return;
    setIsPrinting(true);
    setStatusNotice({ type: 'info', text: 'Preparando documento para impresión...' });

    // 1. Try printing via isolated hidden iframe (bypasses parent iframe block in many browsers)
    const dispatched = printElementViaIframe(
      printContentRef.current, 
      `Ficha - ${cleanTopic} (${formattedSubject})`,
      { paperSize, orientation }
    );

    // 2. Also trigger standard window.print in try/catch as fallback
    try {
      window.print();
    } catch (e) {
      console.warn('Standard window.print caught:', e);
    }

    setTimeout(() => {
      setIsPrinting(false);
      setStatusNotice({ 
        type: 'info', 
        text: '💡 Si tu navegador no abre la ventana emergente de impresión (común en vistas previas dentro de iframes), haz clic en el botón dorado "Descargar PDF (.pdf)" para guardarlo directamente.' 
      });
    }, 1000);
  };

  const handleDownloadHtml = () => {
    if (!printContentRef.current) return;
    const filename = getCleanFilename('html');
    downloadStandaloneHtml(
      printContentRef.current,
      filename,
      `Ficha de Aula · ${cleanTopic} - Método L.I.D.E.R.©`,
      { paperSize, orientation }
    );
    setStatusNotice({
      type: 'success',
      text: `¡Archivo HTML descargado! Puedes abrirlo en cualquier navegador (Chrome, Edge, Safari) e imprimirlo sin bordes.`
    });
    setTimeout(() => setStatusNotice(null), 6000);
  };

  const topicCombined = (cleanTopic + ' ' + (data.materia || '') + ' ' + (data.tipo || '')).toLowerCase();
  const isMath = topicCombined.includes('suma') || 
                 topicCombined.includes('resta') || 
                 topicCombined.includes('matemática') || 
                 topicCombined.includes('matematica') || 
                 topicCombined.includes('número') || 
                 topicCombined.includes('numero') || 
                 topicCombined.includes('cálculo') || 
                 topicCombined.includes('calculo') || 
                 topicCombined.includes('fraccion') ||
                 topicCombined.includes('multiplic');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#09243a]/80 backdrop-blur-xs overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-[#e7e4dc] overflow-hidden my-6 flex flex-col max-h-[94vh]">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="bg-[#09243a] text-white px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d7ad32] text-[#09243a] flex items-center justify-center font-black shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f8edc5] text-[#09243a] text-[10px] font-black uppercase tracking-wider mb-0.5">
                <span>KIT DOCENTE DE AULA · MÉTODO L.I.D.E.R.©</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight m-0">
                Ficha de Aula, Solucionario y Rúbrica Formativa
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Primary Action: Guardar / Descargar PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-[#d7ad32] hover:bg-[#c99f2b] disabled:opacity-75 text-[#09243a] font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              title="Generar y descargar archivo PDF en tu equipo"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF (.pdf)</span>
                </>
              )}
            </button>

            {/* Secondary Action: Imprimir Directo */}
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Abrir diálogo de impresión del navegador"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

            {/* Tertiary Action: Descargar HTML standalone */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-[#d6e1e7] font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
              title="Descargar archivo HTML independiente listo para abrir y fotocopiar"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Descargar HTML</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status / Feedback Notice Banner */}
        {statusNotice && (
          <div className={`px-5 py-2 text-xs flex items-center justify-between border-b print:hidden transition-all ${
            statusNotice.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : statusNotice.type === 'warn'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              {statusNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span className="font-semibold">{statusNotice.text}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setStatusNotice(null)} 
              className="text-slate-500 hover:text-slate-800 text-xs cursor-pointer ml-3 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Switcher Tabs (hidden when printing) */}
        <div className="bg-[#061a2b] px-5 sm:px-8 py-2.5 border-b border-white/10 flex items-center gap-2 overflow-x-auto print:hidden shrink-0">
          {[
            { id: 'worksheet', label: '📄 1. Ficha del Estudiante', desc: 'Para fotocopiar' },
            { id: 'answers', label: '🔑 2. Guía & Solucionario Docente', desc: 'Claves de respuesta' },
            { id: 'rubric', label: '📋 3. Rúbrica Formativa', desc: 'Matriz de 4 niveles' },
            { id: 'exitticket', label: '🎟️ 4. Ticket de Salida (3 min)', desc: 'Metacognición' },
            { id: 'dua_matriz', label: '🇨🇷 5. Adecuaciones Curriculares (Ley 7600 · MEP)', desc: 'Para expediente del Comité de Apoyo' },
            { id: 'lessonplan', label: '⏱️ 6. Guión de Clase (Minuto a Minuto)', desc: 'Secuencia didáctica 80 min' },
            { id: 'groups', label: '👥 7. Trabajo en Equipo & Roles', desc: 'Tarjetas de roles y reto cooperativo' },
            { id: 'all', label: '📚 Kit Completo (Imprimir Todo)', desc: 'Todas las páginas' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#d7ad32] text-[#09243a] shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-[#d6e1e7]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Adaptation & Inclusion Profile Selector */}
        <div className="bg-[#f4f7f9] px-5 sm:px-8 py-2 border-b border-[#e7e4dc] flex flex-col md:flex-row md:items-center justify-between gap-2.5 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase text-[#09243a] flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#d7ad32]"></span>
              Perfil de Inclusión / DUA:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {[
              { id: 'standard', label: '🌟 Estándar', desc: 'Aula Regular' },
              { id: 'dua', label: '🧩 DUA Universal', desc: 'Opciones múltiples y multinivel' },
              { id: 'tdah', label: '🎯 TDAH', desc: 'Pasos guiados, casillas de verificación y pausas de foco' },
              { id: 'discalculia', label: '🔢 Discalculia', desc: 'Recta numérica visual y apoyos manipulativos' },
              { id: 'altascapacidades', label: '🚀 Altas Capacidades', desc: 'Enriquecimiento y pensamiento divergente' },
              { id: 'lecturafacil', label: '📖 Lectura Fácil', desc: 'Pictogramas y enunciados accesibles' },
            ].map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => setAdaptationMode(profile.id as AdaptationProfile)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  adaptationMode === profile.id
                    ? 'bg-[#09243a] text-[#f8edc5] shadow-xs ring-2 ring-[#d7ad32]'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
                title={profile.desc}
              >
                <span>{profile.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paper Size & Orientation Bar */}
        <div className="bg-[#eef3f6] px-5 sm:px-8 py-2 border-b border-[#e7e4dc] flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0 text-xs">
          {/* Tamaño de papel */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase text-[#09243a] flex items-center gap-1">
              <span>📐 Tamaño Papel:</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300">
              {[
                { id: 'carta', label: '📄 Carta (Letter)', tip: '21.6 x 27.9 cm · Estándar Costa Rica/América' },
                { id: 'a4', label: '📄 A4', tip: '21.0 x 29.7 cm · Internacional' },
                { id: 'oficio', label: '📄 Oficio (Legal)', tip: '21.6 x 35.6 cm · Rúbricas amplias' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaperSize(p.id as PaperSize)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold cursor-pointer transition-all ${
                    paperSize === p.id
                      ? 'bg-[#09243a] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={p.tip}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orientación */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase text-[#09243a]">
              Orientación:
            </span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300">
              <button
                type="button"
                onClick={() => setOrientation('vertical')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold cursor-pointer transition-all flex items-center gap-1 ${
                  orientation === 'vertical'
                    ? 'bg-[#09243a] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>↕️ Vertical</span>
              </button>
              <button
                type="button"
                onClick={() => setOrientation('horizontal')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold cursor-pointer transition-all flex items-center gap-1 ${
                  orientation === 'horizontal'
                    ? 'bg-[#09243a] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>↔️ Horizontal (Infografía)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex-1">
          
          <div 
            ref={printContentRef}
            id="printable-worksheet"
            className={`bg-white mx-auto p-6 sm:p-10 rounded-2xl shadow-md border border-[#e7e4dc] text-[#1f2937] print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full space-y-10 transition-all duration-300 ${
              orientation === 'horizontal' ? 'max-w-6xl w-full' : 'max-w-4xl w-full'
            }`}
          >

            {/* ========================================================================= */}
            {/* SECCIÓN 1: FICHA DE TRABAJO PARA EL ESTUDIANTE                            */}
            {/* ========================================================================= */}
            {(activeTab === 'worksheet' || activeTab === 'all') && (
              <div className="space-y-6 print:break-after-page">
                
                {/* Membrete Escolar Oficial en Blanco para Llenar */}
                <div className="border-2 border-[#09243a] rounded-xl p-4 bg-[#fbfaf6] text-xs space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-end gap-2">
                      <span className="font-black text-[#09243a] shrink-0 uppercase text-[10px]">Institución Educativa:</span>
                      <div className="border-b border-slate-400 flex-1 min-h-[18px]"></div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-black text-[#09243a] shrink-0 uppercase text-[10px]">Docente:</span>
                      <div className="border-b border-slate-400 flex-1 min-h-[18px]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-end gap-2">
                      <span className="font-black text-[#09243a] shrink-0 uppercase text-[10px]">Materia:</span>
                      <div className="border-b border-slate-400 flex-1 min-h-[18px] font-bold text-[#09243a] px-1">
                        {formattedSubject}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-black text-[#09243a] shrink-0 uppercase text-[10px]">Grado / Grupo:</span>
                      <div className="border-b border-slate-400 flex-1 min-h-[18px] font-bold text-[#09243a] px-1">
                        {formattedGrade}
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="font-black text-[#09243a] shrink-0 uppercase text-[10px]">Fecha:</span>
                      <div className="border-b border-slate-400 flex-1 min-h-[18px]"></div>
                    </div>
                  </div>

                  <div className="flex items-end gap-2 pt-0.5">
                    <span className="font-black text-[#09243a] shrink-0 uppercase text-[10px]">Nombre del Estudiante:</span>
                    <div className="border-b-2 border-slate-600 flex-1 min-h-[18px]"></div>
                  </div>

                  {/* Distintivo de Adaptación Curricular y DUA */}
                  {adaptationMode === 'standard' && (
                    <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between border-t border-slate-200 pt-1.5">
                      <span>Modalidad: Evaluación Formativa Regular</span>
                      <span>Método L.I.D.E.R.©</span>
                    </div>
                  )}

                  {adaptationMode === 'dua' && (
                    <div className="bg-[#f8edc5] border border-[#d7ad32] rounded-xl p-2.5 text-xs text-[#09243a] space-y-1">
                      <div className="flex items-center justify-between font-black">
                        <span>🧩 ADAPTACIÓN DUA · MÚLTIPLES FORMAS DE ACCESO Y EXPRESIÓN</span>
                        <span className="text-[10px] bg-[#d7ad32] text-[#09243a] px-2 py-0.5 rounded font-black">Diseño Universal</span>
                      </div>
                      <p className="text-[11px] text-slate-800 m-0">
                        Consigna inclusiva: Puedes responder escribiendo con números, dibujando los elementos o marcando con lápiz. ¡Elige el formato donde mejor demuestres lo que aprendiste!
                      </p>
                    </div>
                  )}

                  {adaptationMode === 'tdah' && (
                    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-2.5 text-xs text-amber-950 space-y-1.5">
                      <div className="flex items-center justify-between font-black">
                        <span>🎯 ENFOQUE TDAH · PASOS FRAGMENTADOS & ATENCIÓN FOCALIZADA</span>
                        <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-black">Foco y Autorregulación</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-bold text-amber-900 bg-white/70 p-2 rounded-lg border border-amber-200">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 border border-amber-500 rounded bg-white inline-block"></span>
                          1. Leo en voz baja
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 border border-amber-500 rounded bg-white inline-block"></span>
                          2. Encierro datos clave
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 border border-amber-500 rounded bg-white inline-block"></span>
                          3. Compruebo con calma
                        </span>
                      </div>
                    </div>
                  )}

                  {adaptationMode === 'discalculia' && (
                    <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-3 text-xs text-blue-950 space-y-2">
                      <div className="flex items-center justify-between font-black">
                        <span>🔢 ANDAMIAJE DISCALCULIA · RECTA NUMÉRICA VISUAL (0 a 20)</span>
                        <span className="text-[10px] bg-blue-200 text-blue-950 px-2 py-0.5 rounded font-black">Apoyo Concreto</span>
                      </div>
                      
                      {/* Recta numérica de apoyo manipulativo impreso */}
                      <div className="bg-white border-2 border-blue-300 rounded-xl p-2.5 shadow-xs">
                        <div className="flex items-center justify-between font-mono font-black text-xs text-blue-950 select-none pb-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                            <div key={num} className="flex flex-col items-center">
                              <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-[10px]">
                                {num}
                              </span>
                              <span className="text-[9px] text-blue-400 font-bold">|</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center justify-between text-[10px] text-blue-900 font-bold border-t border-blue-100 pt-1.5 px-1">
                          <span>➕ SUMA: Da saltos hacia adelante (derecha ➡️)</span>
                          <span>➖ RESTA: Da saltos hacia atrás (izquierda ⬅️)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {adaptationMode === 'altascapacidades' && (
                    <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-2.5 text-xs text-purple-950 space-y-1">
                      <div className="flex items-center justify-between font-black">
                        <span>🚀 ENRIQUECIMIENTO CURRICULAR · ALTAS CAPACIDADES & PROFUNDIZACIÓN</span>
                        <span className="text-[10px] bg-purple-200 text-purple-950 px-2 py-0.5 rounded font-black">Pensamiento Divergente</span>
                      </div>
                      <p className="text-[11px] text-purple-900 m-0">
                        Desafío experto: No te limites al resultado directo; justifica tus métodos, busca caminos alternativos y crea tus propios problemas en la zona de maestría.
                      </p>
                    </div>
                  )}

                  {adaptationMode === 'lecturafacil' && (
                    <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-2.5 text-xs text-emerald-950 space-y-1">
                      <div className="flex items-center justify-between font-black">
                        <span>📖 LECTURA FÁCIL & ACCESIBILIDAD COGNITIVA</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-black">Pictogramas & Frases Claras</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-emerald-900 pt-0.5">
                        <span>👁️ Observa con atención</span>
                        <span>✏️ Escribe en la línea</span>
                        <span>🔢 Cuenta despacio</span>
                        <span>🎯 Marca tu respuesta</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Título de la Ficha y Objetivo */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    <span>Ficha de Aula · Trabajo Práctico Individual o en Parejas</span>
                    <span className="text-[#09243a] font-black">Puntaje Total: 100 pts</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#09243a] m-0">
                    {cleanTopic}
                  </h1>
                </div>

                <div className="bg-slate-50 border-l-4 border-[#09243a] p-3 rounded-r-xl text-xs text-slate-700 leading-relaxed">
                  <strong className="text-[#09243a] block mb-0.5 font-bold uppercase text-[10px]">
                    🎯 Objetivo de Aprendizaje:
                  </strong>
                  <span>{formattedObjective}</span>
                </div>

                {/* PARTE A: RETOS Y OPERACIONES DE AULA */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#09243a] border-b-2 border-[#09243a] pb-1 flex items-center justify-between">
                    <span>Parte 1: Retos Graduados de Aplicación</span>
                    <span className="text-slate-500 font-normal text-[11px]">(60 puntos)</span>
                  </h3>

                  {isMath ? (
                    <div className="space-y-4">
                      {/* Reto 1: Suma Básica */}
                      <div className="border border-slate-300 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-black text-[#09243a]">
                            1. 🍎 Problema de Canasta (Suma Directa - 20 pts):
                          </strong>
                          <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">Nivel 1</span>
                        </div>
                        <p className="text-xs text-slate-700 m-0">
                          En una canasta escolar hay <strong>5 manzanas rojas</strong>. La maestra coloca <strong>3 manzanas más</strong>. ¿Cuántas manzanas hay en total?
                        </p>

                        {/* Apoyo concreto para discalculia */}
                        {adaptationMode === 'discalculia' && (
                          <div className="flex items-center gap-2 text-xs text-blue-900 font-bold bg-blue-50/80 p-2 rounded-lg border border-blue-200">
                            <span className="text-[10px] uppercase font-black text-blue-600">Puntos de conteo:</span>
                            <span className="tracking-widest font-mono text-sm text-blue-800">● ● ● ● ●</span>
                            <span className="font-mono text-sm font-black">+</span>
                            <span className="tracking-widest font-mono text-sm text-blue-800">● ● ●</span>
                            <span className="text-[10px] text-blue-600 font-normal ml-auto">(Cuenta los puntos uno a uno)</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="border border-dashed border-slate-300 p-2.5 rounded-lg text-center text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">OPERACIÓN:</span>
                            <span className="font-mono text-base font-black">5 + 3 = ______</span>
                          </div>
                          <div className="border border-dashed border-slate-300 p-2.5 rounded-lg text-center text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">RESPUESTA COMPLETA:</span>
                            <span className="text-xs text-slate-600 block mt-1">Hay ______ manzanas en total.</span>
                          </div>
                        </div>
                      </div>

                      {/* Reto 2: Resta con Material Escolar */}
                      <div className="border border-slate-300 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-black text-[#09243a]">
                            2. ✏️ Los Lápices de Colores (Resta - 20 pts):
                          </strong>
                          <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">Nivel 2</span>
                        </div>
                        <p className="text-xs text-slate-700 m-0">
                          Tienes <strong>9 lápices de colores</strong> en tu estuche y le prestas <strong>4 lápices</strong> a tu compañero de mesa. ¿Cuántos lápices te quedan a ti?
                        </p>

                        {/* Apoyo concreto para discalculia */}
                        {adaptationMode === 'discalculia' && (
                          <div className="flex items-center gap-2 text-xs text-blue-900 font-bold bg-blue-50/80 p-2 rounded-lg border border-blue-200">
                            <span className="text-[10px] uppercase font-black text-blue-600">Tacha los que prestas:</span>
                            <span className="tracking-widest font-mono text-sm text-blue-800">● ● ● ● ● ● ● ● ●</span>
                            <span className="text-[10px] text-blue-600 font-normal ml-auto">(Tacha 4 y cuenta los que sobran)</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="border border-dashed border-slate-300 p-2.5 rounded-lg text-center text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">OPERACIÓN:</span>
                            <span className="font-mono text-base font-black">9 - 4 = ______</span>
                          </div>
                          <div className="border border-dashed border-slate-300 p-2.5 rounded-lg text-center text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">RESPUESTA COMPLETA:</span>
                            <span className="text-xs text-slate-600 block mt-1">Me quedan ______ lápices en mi estuche.</span>
                          </div>
                        </div>
                      </div>

                      {/* Pausa Activa de autorregulación para TDAH */}
                      {adaptationMode === 'tdah' && (
                        <div className="bg-amber-100/80 border-2 border-dashed border-amber-400 p-2.5 rounded-xl text-center text-xs text-amber-950 flex items-center justify-center gap-2.5 font-bold shadow-xs">
                          <span className="text-lg">⏸️</span>
                          <span>PAUSA ACTIVA DE ENFOQUE (60 seg): Suelta el lápiz, estira los brazos al techo y respira hondo 3 veces. ¡Gran concentración!</span>
                        </div>
                      )}

                      {/* Reto 3: Desafío Combinado */}
                      <div className="border border-slate-300 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-black text-[#09243a]">
                            3. 🧮 Reto Combinado de Aula (Suma y Resta - 20 pts):
                          </strong>
                          <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">Nivel 3</span>
                        </div>
                        <p className="text-xs text-slate-700 m-0">
                          En un juego tienes <strong>6 fichas</strong>, ganas <strong>5 fichas más</strong> y luego le regalas <strong>3 fichas</strong> a tu amigo. ¿Cuántas fichas tienes al final?
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="border border-dashed border-slate-300 p-2.5 rounded-lg text-center text-xs">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">OPERACIÓN EN 2 PASOS:</span>
                            <span className="font-mono text-sm font-black block">Paso 1: 6 + 5 = ______</span>
                            <span className="font-mono text-sm font-black block mt-0.5">Paso 2: ______ - 3 = ______</span>
                          </div>
                          <div className="border border-dashed border-slate-300 p-2.5 rounded-lg text-center text-xs flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">RESULTADO FINAL:</span>
                            <span className="text-xs font-bold text-[#09243a]">Tengo ______ fichas al final.</span>
                          </div>
                        </div>
                      </div>

                      {/* Enriquecimiento para Altas Capacidades */}
                      {adaptationMode === 'altascapacidades' && (
                        <div className="border-2 border-purple-400 bg-purple-50/60 rounded-xl p-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                              <span>🚀 Zona de Maestría: Pensamiento Divergente & Reto Creador</span>
                            </strong>
                            <span className="text-[10px] bg-purple-200 text-purple-950 font-black px-2 py-0.5 rounded">
                              Enriquecimiento
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-purple-900">
                            <div>
                              <strong>A) Estrategia Alternativa:</strong> ¿De qué otra forma distinta a contar una por una podrías resolver 6 + 5 - 3 mentalmente?
                              <div className="border-b border-dashed border-purple-300 h-5 mt-1"></div>
                            </div>
                            <div>
                              <strong>B) Inversión de Roles (Crea tu propio problema):</strong> Formula un problema con datos de tu colegio que tenga como solución el número 15 usando suma y resta:
                              <div className="border-b border-dashed border-purple-300 h-5 mt-1"></div>
                              <div className="border-b border-dashed border-purple-300 h-5 mt-1"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Retos genéricos curriculares */}
                      {[
                        { num: 1, title: 'Concepto Clave y Definición', prompt: `Explica con tus propias palabras qué es ${cleanTopic} y por qué es importante aprenderlo:` },
                        { num: 2, title: 'Aplicación Práctica en la Vida Real', prompt: `Escribe 2 ejemplos de tu vida diaria o de tu comunidad donde se aplique este tema:` },
                        { num: 3, title: 'Pregunta de Análisis Crítico', prompt: `¿Qué ocurriría si este proceso no funcionara correctamente? Argumenta tu respuesta:` }
                      ].map(item => (
                        <div key={item.num} className="border border-slate-300 rounded-xl p-3.5 space-y-2">
                          <strong className="text-xs font-black text-[#09243a]">
                            {item.num}. {item.title} (20 pts):
                          </strong>
                          <p className="text-xs text-slate-700 m-0">{item.prompt}</p>
                          <div className="space-y-2 pt-2">
                            <div className="border-b border-dashed border-slate-400 h-5"></div>
                            <div className="border-b border-dashed border-slate-400 h-5"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PARTE B: SECUENCIAS Y SOPA DE LETRAS PARA LÁPIZ */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#09243a] border-b-2 border-[#09243a] pb-1 flex items-center justify-between">
                    <span>Parte 2: Secuencias Numéricas y Sopa de Letras</span>
                    <span className="text-slate-500 font-normal text-[11px]">(40 puntos)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Secuencias */}
                    <div className="border border-slate-300 rounded-xl p-3.5 space-y-3">
                      <strong className="text-xs font-black text-[#09243a] block">
                        🔢 Completa las Secuencias (20 pts):
                      </strong>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="bg-slate-50 p-2 rounded-lg flex items-center justify-between border border-slate-200">
                          <span>A) 2 , 4 , 6 , [ &nbsp;&nbsp;&nbsp;&nbsp; ] , 10</span>
                          <span className="text-[10px] text-slate-500 font-sans">(+2)</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg flex items-center justify-between border border-slate-200">
                          <span>B) 1 , 3 , 5 , [ &nbsp;&nbsp;&nbsp;&nbsp; ] , 9</span>
                          <span className="text-[10px] text-slate-500 font-sans">(Impares)</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg flex items-center justify-between border border-slate-200">
                          <span>C) 10 , 9 , 8 , [ &nbsp;&nbsp;&nbsp;&nbsp; ] , 6</span>
                          <span className="text-[10px] text-slate-500 font-sans">(-1)</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg flex items-center justify-between border border-slate-200">
                          <span>D) 5 , 10 , 15 , [ &nbsp;&nbsp;&nbsp;&nbsp; ] , 25</span>
                          <span className="text-[10px] text-slate-500 font-sans">(+5)</span>
                        </div>
                      </div>
                    </div>

                    {/* Sopa de Letras para lápiz */}
                    <div className="border border-slate-300 rounded-xl p-3.5 space-y-2">
                      <strong className="text-xs font-black text-[#09243a] block">
                        🔤 Sopa de Letras (20 pts):
                      </strong>
                      <p className="text-[11px] text-slate-600 m-0">
                        Encuentra y encierra con lápiz las palabras: <strong>SUMA, RESTA, OCHO, TOTAL, DIEZ</strong>.
                      </p>
                      
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-center font-mono font-black text-xs tracking-widest leading-loose">
                        <div>S &nbsp; U &nbsp; M &nbsp; A &nbsp; X &nbsp; Y &nbsp; Z &nbsp; W</div>
                        <div>R &nbsp; E &nbsp; S &nbsp; T &nbsp; A &nbsp; K &nbsp; L &nbsp; M</div>
                        <div>O &nbsp; C &nbsp; H &nbsp; O &nbsp; P &nbsp; Q &nbsp; R &nbsp; S</div>
                        <div>T &nbsp; O &nbsp; T &nbsp; A &nbsp; L &nbsp; A &nbsp; B &nbsp; C</div>
                        <div>D &nbsp; I &nbsp; E &nbsp; Z &nbsp; N &nbsp; O &nbsp; P &nbsp; Q</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie de página de la Ficha */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Ficha didáctica para el aula · Material fotocopiable</span>
                  <span>Método L.I.D.E.R.© por Katya Sánchez</span>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 2: GUÍA Y SOLUCIONARIO PARA EL DOCENTE                            */}
            {/* ========================================================================= */}
            {(activeTab === 'answers' || activeTab === 'all') && (
              <div className="space-y-6 pt-6 border-t-4 border-dashed border-[#d7ad32] print:border-none print:break-after-page">
                
                <div className="bg-[#09243a] text-white p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Key className="w-5 h-5 text-[#d7ad32]" />
                    <div>
                      <h2 className="text-base font-black m-0 text-white">
                        Guía del Docente & Solucionario de Corrección Rápida
                      </h2>
                      <span className="text-xs text-[#d6e1e7]">
                        Uso exclusivo del profesorado · Claves exactas, criterios y escala de evaluación
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#09243a] bg-[#d7ad32] px-3 py-1 rounded-lg">
                    SOLUCIONARIO
                  </span>
                </div>

                {/* Tabla de Respuestas Correctas */}
                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-black text-xs text-[#09243a]">
                    CLAVES DE RESPUESTA EXACTAS Y DESGLOSE DE PUNTOS
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-[#09243a] block">Reto 1 (Manzanas):</strong>
                        <span className="text-slate-600">Operación: <strong>5 + 3 = 8</strong>. Respuesta: <em>Hay 8 manzanas en total</em>.</span>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black text-[11px] self-start sm:self-auto">
                        20 puntos
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-[#09243a] block">Reto 2 (Lápices):</strong>
                        <span className="text-slate-600">Operación: <strong>9 - 4 = 5</strong>. Respuesta: <em>Me quedan 5 lápices</em>.</span>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black text-[11px] self-start sm:self-auto">
                        20 puntos
                      </span>
                    </div>

                    <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-[#09243a] block">Reto 3 (Combinado de Fichas):</strong>
                        <span className="text-slate-600">Paso 1: <strong>6 + 5 = 11</strong>. Paso 2: <strong>11 - 3 = 8</strong>. Resultado: <em>8 fichas</em>.</span>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black text-[11px] self-start sm:self-auto">
                        20 puntos
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-[#09243a] block">Secuencias Numéricas:</strong>
                        <span className="text-slate-600">A) <strong>8</strong> (patrón +2) | B) <strong>7</strong> (impares) | C) <strong>7</strong> (patrón -1) | D) <strong>20</strong> (patrón +5).</span>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black text-[11px] self-start sm:self-auto">
                        20 puntos (5 c/u)
                      </span>
                    </div>

                    <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-[#09243a] block">Sopa de Letras:</strong>
                        <span className="text-slate-600">Fila 1: SUMA | Fila 2: RESTA | Fila 3: OCHO | Fila 4: TOTAL | Fila 5: DIEZ.</span>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black text-[11px] self-start sm:self-auto">
                        20 puntos (4 c/u)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orientaciones Didácticas y Errores Comunes para el Docente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                    <strong className="text-amber-950 block font-black uppercase text-[11px]">
                      ⚠️ Errores Frecuentes a Observar:
                    </strong>
                    <ul className="text-amber-900 space-y-1 list-disc pl-4 m-0 leading-relaxed">
                      <li><strong>Confusión de signos:</strong> Alumnos que suman en lugar de restar en el problema de lápices prestados.</li>
                      <li><strong>Conteo sobre los dedos:</strong> Fomentar el salto mental rápido a partir del número mayor (ej. desde 5, contar 6, 7, 8).</li>
                      <li><strong>En secuencias regresivas:</strong> Dificultad para contar hacia atrás desde el 10 al 8.</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                    <strong className="text-blue-950 block font-black uppercase text-[11px]">
                      💡 Escala de Calificación Sugerida:
                    </strong>
                    <div className="space-y-1 text-blue-900 leading-relaxed">
                      <div>• <strong>90 - 100 pts:</strong> Desempeño Destacado (Maestría del cálculo).</div>
                      <div>• <strong>75 - 89 pts:</strong> Desempeño Logrado (Aplica procedimientos con solvencia).</div>
                      <div>• <strong>60 - 74 pts:</strong> En Proceso (Requiere apoyo puntual en la resta).</div>
                      <div>• <strong>Menos de 60 pts:</strong> Nivel Inicial (Reforzar con material concreto y ábaco).</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 3: RÚBRICA FORMATIVA ANALÍTICA DE 4 NIVELES                       */}
            {/* ========================================================================= */}
            {(activeTab === 'rubric' || activeTab === 'all') && (
              <div className="space-y-6 pt-6 border-t-4 border-dashed border-[#d7ad32] print:border-none print:break-after-page">
                
                <div className="bg-[#09243a] text-white p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="w-5 h-5 text-[#d7ad32]" />
                    <div>
                      <h2 className="text-base font-black m-0 text-white">
                        Rúbrica Formativa Analítica (Fase E · Evaluación L.I.D.E.R.)
                      </h2>
                      <span className="text-xs text-[#d6e1e7]">
                        Instrumento cualitativo ágil para evidenciar el aprendizaje ante directivos y familias
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#09243a] bg-[#d7ad32] px-3 py-1 rounded-lg">
                    4 NIVELES DUA
                  </span>
                </div>

                {/* Matriz de Evaluación */}
                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-[#09243a] font-black border-b border-slate-300">
                          <th className="p-3 w-1/4">Criterio Evaluado</th>
                          <th className="p-3 w-[18%] bg-rose-50 text-rose-950">Inicial (1)</th>
                          <th className="p-3 w-[18%] bg-amber-50 text-amber-950">En Proceso (2)</th>
                          <th className="p-3 w-[18%] bg-blue-50 text-blue-950">Logrado (3)</th>
                          <th className="p-3 w-[21%] bg-emerald-50 text-emerald-950">Destacado (4)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {/* Criterio 1 */}
                        <tr>
                          <td className="p-3 font-bold text-[#09243a] bg-slate-50/50">
                            1. Comprensión Conceptual de la Operación
                          </td>
                          <td className="p-3 bg-rose-50/30 text-slate-700">
                            Confunde suma y resta; requiere orientación constante para saber qué operación aplicar.
                          </td>
                          <td className="p-3 bg-amber-50/30 text-slate-700">
                            Distingue entre agregar y quitar pero duda ante enunciados escritos de problemas.
                          </td>
                          <td className="p-3 bg-blue-50/30 text-slate-700">
                            Identifica con claridad si el problema requiere sumar o restar y plantea la ecuación correcta.
                          </td>
                          <td className="p-3 bg-emerald-50/30 text-slate-700 font-medium">
                            Explica con soltura la lógica operativa y propone nuevas situaciones matemáticas reales.
                          </td>
                        </tr>

                        {/* Criterio 2 */}
                        <tr>
                          <td className="p-3 font-bold text-[#09243a] bg-slate-50/50">
                            2. Precisión en el Cálculo y Resolución
                          </td>
                          <td className="p-3 bg-rose-50/30 text-slate-700">
                            Comete fallos frecuentes en operaciones con números menores a 10 aun con apoyo.
                          </td>
                          <td className="p-3 bg-amber-50/30 text-slate-700">
                            Resuelve sumas directas correctamente pero comete errores en la resta o cálculo combinado.
                          </td>
                          <td className="p-3 bg-blue-50/30 text-slate-700">
                            Calcula con exactitud sumas, restas y completa secuencias numéricas sin equivocarse.
                          </td>
                          <td className="p-3 bg-emerald-50/30 text-slate-700 font-medium">
                            Demuestra cálculo mental ágil, anticipa resultados y comprueba autónomamente sus respuestas.
                          </td>
                        </tr>

                        {/* Criterio 3 */}
                        <tr>
                          <td className="p-3 font-bold text-[#09243a] bg-slate-50/50">
                            3. Autonomía, Esfuerzo y Metacognición
                          </td>
                          <td className="p-3 bg-rose-50/30 text-slate-700">
                            Se frustra con facilidad ante el error y abandona la tarea sin solicitar apoyo.
                          </td>
                          <td className="p-3 bg-amber-50/30 text-slate-700">
                            Persiste con ayuda del docente pero le cuesta identificar en qué punto se equivocó.
                          </td>
                          <td className="p-3 bg-blue-50/30 text-slate-700">
                            Trabaja con autonomía, revisa sus fallos con actitud positiva y completa la guía a tiempo.
                          </td>
                          <td className="p-3 bg-emerald-50/30 text-slate-700 font-medium">
                            Apoya a sus compañeros, reflexiona sobre su propio proceso de aprendizaje y busca nuevos retos.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 4: TICKET DE SALIDA RECORTABLE (EXIT TICKET - 3 MINUTOS)           */}
            {/* ========================================================================= */}
            {(activeTab === 'exitticket' || activeTab === 'all') && (
              <div className="space-y-6 pt-6 border-t-4 border-dashed border-[#d7ad32] print:border-none">
                
                <div className="bg-[#09243a] text-white p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Ticket className="w-5 h-5 text-[#d7ad32]" />
                    <div>
                      <h2 className="text-base font-black m-0 text-white">
                        Ticket de Salida (Exit Ticket · 3 a 5 Minutos de Cierre)
                      </h2>
                      <span className="text-xs text-[#d6e1e7]">
                        Ficha breve recortable (2 por página) para comprobar el aprendizaje antes de salir del aula
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#09243a] bg-[#d7ad32] px-3 py-1 rounded-lg">
                    RECORTABLE
                  </span>
                </div>

                {/* 2 Boletos recortables por hoja para ahorrar papel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((num) => (
                    <div key={num} className="border-2 border-dashed border-[#09243a] rounded-2xl p-4 bg-[#fbfaf6] space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black uppercase text-[#09243a]">🎟️ Boleto de Salida #{num}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">✂️ Recortar aquí</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-end gap-1">
                          <span className="font-bold text-[10px] text-slate-600">Alumno:</span>
                          <div className="border-b border-slate-400 flex-1"></div>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="font-bold text-[10px] text-slate-600">Fecha:</span>
                          <div className="border-b border-slate-400 flex-1"></div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <strong className="block text-[#09243a] text-[11px] mb-0.5">
                            1. Comprobación rápida:
                          </strong>
                          <span>Si tienes 7 estrellas y ganas 3 más: 7 + 3 = ______</span>
                        </div>

                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <strong className="block text-[#09243a] text-[11px] mb-0.5">
                            2. Resta de salida:
                          </strong>
                          <span>Tenías 10 fichas y perdiste 4: 10 - 4 = ______</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                          <strong className="block text-[#09243a] text-[11px]">
                            3. Metacognición (¿Cómo me sentí hoy?):
                          </strong>
                          <div className="flex items-center justify-around text-lg pt-1">
                            <span className="cursor-pointer">😃 Fácil</span>
                            <span className="cursor-pointer">🤔 Tuve dudas</span>
                            <span className="cursor-pointer">😅 Necesito ayuda</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 5: MATRIZ DUA & PLAN DE AJUSTES RAZONABLES (PIAR) PARA EL DOCENTE  */}
            {/* ========================================================================= */}
            {(activeTab === 'dua_matriz' || activeTab === 'all') && (
              <div className="space-y-6 pt-6 border-t-4 border-dashed border-[#d7ad32] print:border-none print:break-after-page">
                
                <div className="bg-[#09243a] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#d7ad32] text-[#09243a] flex items-center justify-center font-black shrink-0 text-base">
                      🇨🇷
                    </div>
                    <div>
                      <h2 className="text-base font-black m-0 text-white leading-tight">
                        Registro de Adecuaciones Curriculares & DUA (Ley 7600 · MEP)
                      </h2>
                      <span className="text-xs text-[#d6e1e7]">
                        Instrumento oficial para expediente del estudiante, Comité de Apoyo Educativo (CAE) y carpeta docente
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#09243a] bg-[#d7ad32] px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                    LEY 7600 · MEP
                  </span>
                </div>

                {/* Ficha Técnica Institucional de Inclusión */}
                <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-xs space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Materia / Área:</span>
                      <strong className="text-[#09243a]">{formattedSubject}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Grado / Nivel:</span>
                      <strong className="text-[#09243a]">{formattedGrade}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Tema Curricular:</span>
                      <strong className="text-[#09243a]">{cleanTopic}</strong>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <span className="font-bold text-slate-500 uppercase text-[10px] block">Propósito de Inclusión:</span>
                    <span className="text-slate-700">{formattedObjective}</span>
                  </div>
                </div>

                {/* Clasificación Oficial de Adecuaciones Curriculares según Ley 7600 (MEP Costa Rica) */}
                <div className="border-2 border-[#09243a] rounded-xl p-3.5 bg-amber-50/70 text-xs space-y-2">
                  <div className="flex items-center justify-between font-black text-[#09243a] border-b border-amber-300 pb-1">
                    <span className="flex items-center gap-1.5 uppercase tracking-wide">
                      🇨🇷 Clasificación Oficial de Adecuaciones Curriculares (Normativa MEP - Ley 7600):
                    </span>
                    <span className="text-[10px] bg-[#09243a] text-[#f8edc5] px-2 py-0.5 rounded font-black">
                      Vigente MEP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    {/* Acceso */}
                    <div className="bg-white p-2.5 rounded-lg border border-amber-300 space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 font-black text-[#09243a]">
                        <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                        <span>1. De Acceso (Aplicada)</span>
                      </div>
                      <p className="text-[11px] text-slate-700 m-0 leading-snug">
                        Modificaciones en materiales y recursos visuales: recta numérica visual (0-20), tokens de conteo, formato claro y eliminación de barreras en la comunicación.
                      </p>
                    </div>

                    {/* No Significativa */}
                    <div className="bg-white p-2.5 rounded-lg border border-amber-300 space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5 font-black text-[#09243a]">
                        <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                        <span>2. No Significativa (Aplicada)</span>
                      </div>
                      <p className="text-[11px] text-slate-700 m-0 leading-snug">
                        Ajustes metodológicos y de evaluación: consignas fragmentadas paso a paso, casillas [ ], pausas activas y tiempo flexible sin alterar los objetivos curriculares.
                      </p>
                    </div>

                    {/* Significativa */}
                    <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-300 space-y-1 opacity-75">
                      <div className="flex items-center gap-1.5 font-bold text-slate-600">
                        <span className="w-4 h-4 rounded border border-slate-400 bg-white inline-block"></span>
                        <span>3. Significativa (No requerida)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 m-0 leading-snug">
                        Modificación sustancial o eliminación de contenidos y objetivos esenciales (requiere programación educativa individualizada PEI).
                      </p>
                    </div>
                  </div>
                </div>

                {/* 1. Identificación de Barreras para el Aprendizaje y la Participación (BAP) */}
                <div className="border border-slate-300 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-black uppercase text-[#09243a] flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    <span>1. Barreras para el Aprendizaje y la Participación (BAP) Identificadas:</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-lg space-y-1">
                      <strong className="text-rose-950 font-bold block text-[11px]">Barreras de Acceso:</strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Sobrecarga de texto en enunciados, fatiga visual o dificultad para decodificar símbolos operativos abstractos (+ y -).
                      </p>
                    </div>
                    <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg space-y-1">
                      <strong className="text-amber-950 font-bold block text-[11px]">Barreras de Procesamiento:</strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Limitación en memoria de trabajo para retener cantidades intermedias, impulsividad o pérdida de foco durante secuencias largas.
                      </p>
                    </div>
                    <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg space-y-1">
                      <strong className="text-blue-950 font-bold block text-[11px]">Barreras de Expresión:</strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Lentitud en la escritura manual o ansiedad ante pruebas cronometradas que bloquean la demostración del aprendizaje real.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Matriz de los 3 Principios del DUA Aplicados */}
                <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs text-xs">
                  <div className="bg-slate-100 p-3 border-b border-slate-300 font-black text-[#09243a] flex items-center justify-between">
                    <span>2. Matriz de Ajustes Razonables según los 3 Principios del DUA</span>
                    <span className="text-[10px] text-slate-500 font-normal">Alineado al marco universal CAST</span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {/* Principio 1 */}
                    <div className="p-3.5 space-y-1.5 bg-white">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black text-[10px] uppercase">
                          Principio I
                        </span>
                        <strong className="text-[#09243a] font-black">
                          Múltiples Medios de Representación (¿El QUÉ del aprendizaje?)
                        </strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 pl-2">
                        <div>• <strong>Apoyo Visual y Concreto:</strong> Recta numérica graduada de 0 a 20 con código de color y flechas direccionales.</div>
                        <div>• <strong>Andamiaje Manipulativo:</strong> Fichas y puntos de conteo (tokens) para tachar o asociar físicamente las cantidades.</div>
                        <div>• <strong>Claridad Lingüística:</strong> Enunciados desglosados sin lenguaje figurado, apoyados por pictogramas y palabras clave en negrita.</div>
                        <div>• <strong>Modelado Previo:</strong> Ejemplo inicial 100% resuelto que sirve de ancla cognitiva antes del trabajo autónomo.</div>
                      </div>
                    </div>

                    {/* Principio 2 */}
                    <div className="p-3.5 space-y-1.5 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-950 font-black text-[10px] uppercase">
                          Principio II
                        </span>
                        <strong className="text-[#09243a] font-black">
                          Múltiples Medios de Acción y Expresión (¿El CÓMO del aprendizaje?)
                        </strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 pl-2">
                        <div>• <strong>Formatos de Respuesta Flexibles:</strong> El estudiante puede escribir el número, dibujar la cantidad o verbalizar su razonamiento.</div>
                        <div>• <strong>Checklists de Foco Ejecutivo:</strong> Casillas de verificación [ ] paso a paso para supervisar el avance de manera estructurada.</div>
                        <div>• <strong>Eliminación de la Presión Temporal:</strong> Tiempo extendido y ritmo adaptativo sin cronómetros punitivos.</div>
                        <div>• <strong>Cuadrículas Espaciadas:</strong> Cajas de respuesta amplias para evitar la confusión perceptual de números apiñados.</div>
                      </div>
                    </div>

                    {/* Principio 3 */}
                    <div className="p-3.5 space-y-1.5 bg-white">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 font-black text-[10px] uppercase">
                          Principio III
                        </span>
                        <strong className="text-[#09243a] font-black">
                          Múltiples Medios de Implicación y Afectividad (¿El POR QUÉ del aprendizaje?)
                        </strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700 pl-2">
                        <div>• <strong>Graduación de Retos (Multinivel):</strong> Desde el Nivel 1 (básico guiado) hasta la Zona de Maestría (altas capacidades).</div>
                        <div>• <strong>Pausas de Autorregulación:</strong> Momentos de respiración consciente de 60 segundos para reducir la sobrecarga sensorial.</div>
                        <div>• <strong>Relevancia Significativa:</strong> Problemas basados en manzanas, lápices de colores y situaciones escolares reales.</div>
                        <div>• <strong>Cultura del Error Formativo:</strong> El fallo es tratado como oportunidad de aprendizaje y ajuste de pistas, sin reproches.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Protocolo de Atención Diferenciada por Perfil de Alumnado */}
                <div className="border border-slate-300 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#09243a] border-b border-slate-200 pb-1.5">
                    <span>3. Protocolo de Acompañamiento en el Aula por Perfil de Estudiante:</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="border border-amber-200 bg-amber-50/50 p-3 rounded-lg space-y-1">
                      <strong className="text-amber-950 font-bold flex items-center gap-1.5">
                        <span>🎯 Alumnos con TDAH / Funciones Ejecutivas:</span>
                      </strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Entregar la ficha doblada para mostrar solo 1 reto a la vez. Permitir que marque las casillas [x] con rotulador de color y verificar que realice la pausa activa antes del reto 3.
                      </p>
                    </div>

                    <div className="border border-blue-200 bg-blue-50/50 p-3 rounded-lg space-y-1">
                      <strong className="text-blue-950 font-bold flex items-center gap-1.5">
                        <span>🔢 Alumnos con Discalculia / DEA:</span>
                      </strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Facilitar fichas o tapones reales si lo requiere. Acompañar el salto en la recta numérica con el dedo para fijar la noción de avance (+) o retroceso (-).
                      </p>
                    </div>

                    <div className="border border-purple-200 bg-purple-50/50 p-3 rounded-lg space-y-1">
                      <strong className="text-purple-950 font-bold flex items-center gap-1.5">
                        <span>🚀 Alumnos con Altas Capacidades:</span>
                      </strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Activar la Zona de Maestría. Plantearles el desafío de inventar un problema nuevo para resolverlo en parejas o asumir el rol de mediadores de aula.
                      </p>
                    </div>

                    <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg space-y-1">
                      <strong className="text-emerald-950 font-bold flex items-center gap-1.5">
                        <span>📖 Alumnos con Dificultades de Lectoescritura / Dislexia:</span>
                      </strong>
                      <p className="text-slate-700 m-0 leading-relaxed">
                        Leer los enunciados en voz alta si es necesario. Aceptar respuestas orales o mediante diagramas sin penalizar la ortografía en el área matemática.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Criterios de Evaluación y Espacio de Firmas Oficiales */}
                <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-xs space-y-4">
                  <div className="space-y-1">
                    <strong className="text-[#09243a] font-black uppercase text-[11px] block">
                      4. Criterios de Evaluación Adaptada (Sin Barreras Punitivas):
                    </strong>
                    <p className="text-slate-700 m-0 leading-relaxed">
                      Se prioriza la comprensión del concepto operativo y la elección de la estrategia sobre la velocidad de respuesta. Cualquier adaptación consignada en este plan es un derecho del estudiante para equiparar oportunidades de aprendizaje.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-center text-slate-700">
                    <div className="space-y-1">
                      <div className="border-b border-slate-400 min-h-[30px] mx-4"></div>
                      <span className="font-bold text-[10px] uppercase block text-[#09243a]">Docente a Cargo</span>
                      <span className="text-[9px] text-slate-500">Planificador y Ejecutor de Aula</span>
                    </div>

                    <div className="space-y-1">
                      <div className="border-b border-slate-400 min-h-[30px] mx-4"></div>
                      <span className="font-bold text-[10px] uppercase block text-[#09243a]">Comité de Apoyo Educativo (CAE)</span>
                      <span className="text-[9px] text-slate-500">Asesoría / Docente de Apoyo MEP</span>
                    </div>

                    <div className="space-y-1">
                      <div className="border-b border-slate-400 min-h-[30px] mx-4"></div>
                      <span className="font-bold text-[10px] uppercase block text-[#09243a]">Dirección del Centro Educativo</span>
                      <span className="text-[9px] text-slate-500">Visto Bueno Institucional (Ley 7600)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 6: GUIÓN DE LA SESIÓN DE CLASE (PLAN MINUTO A MINUTO · 80 MIN)    */}
            {/* ========================================================================= */}
            {(activeTab === 'lessonplan' || activeTab === 'all') && (
              <div className="space-y-6 pt-6 border-t-4 border-dashed border-[#d7ad32] print:border-none print:break-after-page">
                
                <div className="bg-[#09243a] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#d7ad32] text-[#09243a] flex items-center justify-center font-black shrink-0 text-base">
                      ⏱️
                    </div>
                    <div>
                      <h2 className="text-base font-black m-0 text-white leading-tight">
                        Guión de la Sesión de Clase · Secuencia Minuto a Minuto (80 min)
                      </h2>
                      <span className="text-xs text-[#d6e1e7]">
                        Plan de mediación pedagógica paso a paso con consignas textuales, gestión del tiempo y andamiajes de aula
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#09243a] bg-[#d7ad32] px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                    MÉTODO L.I.D.E.R. · FASE L-02
                  </span>
                </div>

                {/* Ficha Técnica de la Lección */}
                <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-xs space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Materia / Área:</span>
                      <strong className="text-[#09243a]">{formattedSubject}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Nivel / Grado:</span>
                      <strong className="text-[#09243a]">{formattedGrade}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Duración Estimada:</span>
                      <strong className="text-[#09243a]">80 minutos (Bloque Doble)</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">Tema Central:</span>
                      <strong className="text-[#09243a]">{cleanTopic}</strong>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">🎯 Criterio de Mediación / Aprendizaje Esperado:</span>
                      <span className="text-slate-700">{formattedObjective}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">📦 Recursos y Materiales Requeridos:</span>
                      <span className="text-slate-700">Fichas de aula impresas, recta numérica visual (0-20), pizarra y tizas/plumones, material concreto (fichas/tapones) y boletos de Ticket de Salida.</span>
                    </div>
                  </div>
                </div>

                {/* Secuencia de los 4 Momentos de Mediación Minuto a Minuto */}
                <div className="space-y-4 text-xs">

                  {/* MOMENTO 1: FOCALIZACIÓN Y ENGANCHE */}
                  <div className="border-2 border-emerald-300 bg-white rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-emerald-500 text-white p-3 font-black flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-white text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                          00:00 - 15:00 (15 min)
                        </span>
                        <span className="text-sm">Momento 1 · Focalización, Enganche & Pregunta Detonadora</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-100 hidden sm:inline">Activación Previa</span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded-xl space-y-1">
                          <strong className="text-emerald-950 font-black block text-[11px] uppercase">
                            🗣️ Guión Textual del Docente (Qué decir en el aula):
                          </strong>
                          <p className="text-slate-800 italic m-0 leading-relaxed">
                            "¡Buenos días equipo! Imaginen que van a la pulpería o supermercado con 9 monedas. Compran un jugo que cuesta 4 monedas... ¿Cómo podemos saber con total seguridad cuántas monedas nos tienen que dar de vuelto sin equivocarnos ni un segundo? ¿Quién ha tenido que calcular esto en la vida real?"
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                          <strong className="text-[#09243a] font-black block text-[11px] uppercase">
                            👥 Acciones de los Estudiantes:
                          </strong>
                          <p className="text-slate-700 m-0 leading-relaxed">
                            Dialogan 2 minutos en parejas sobre cómo hacen cuentas en su casa. 2 voluntarios comparten su respuesta ante el grupo. Se genera curiosidad y conexión con su entorno familiar.
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#f8edc5] border border-[#d7ad32] p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#09243a]">
                        <span>🔑 Pregunta Clave de Mediación: "¿Qué palabra nos da la pista de si tenemos que JUNTAR (sumar) o QUITAR (restar)?"</span>
                        <span className="text-[10px] bg-[#d7ad32] px-2 py-0.5 rounded">Ley 7600: Anotar en pizarra con pictogramas</span>
                      </div>
                    </div>
                  </div>

                  {/* MOMENTO 2: EXPLORACIÓN Y MODELADO DOCENTE */}
                  <div className="border-2 border-blue-300 bg-white rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-blue-600 text-white p-3 font-black flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-white text-blue-900 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                          15:00 - 35:00 (20 min)
                        </span>
                        <span className="text-sm">Momento 2 · Exploración & Modelado Guiado ("Yo Hago / Nosotros Hacemos")</span>
                      </div>
                      <span className="text-[11px] font-bold text-blue-100 hidden sm:inline">Andamiaje Cognitivo</span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-blue-50/50 border border-blue-200 p-3 rounded-xl space-y-1.5">
                          <strong className="text-blue-950 font-black block text-[11px] uppercase">
                            👨‍🏫 Fase "Yo Hago" (Modelado Explicativo del Docente):
                          </strong>
                          <ul className="text-slate-700 pl-4 space-y-1 m-0 list-disc">
                            <li>El docente dibuja en la pizarra la <strong>recta numérica de 0 a 20</strong>.</li>
                            <li>Modela el problema de la canasta (5 + 3): <em>"Pongo mi dedo en el 5. Sumar es avanzar hacia adelante. Doy 3 saltos sonoros: ¡6, 7, 8! Mi resultado es 8."</em></li>
                            <li>Explica el truco para ahorrar memoria de trabajo: <em>"Guardo el número mayor en la cabeza y cuento solo los saltos."</em></li>
                          </ul>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-200 p-3 rounded-xl space-y-1.5">
                          <strong className="text-blue-950 font-black block text-[11px] uppercase">
                            🤝 Fase "Nosotros Hacemos" (Práctica Colectiva):
                          </strong>
                          <ul className="text-slate-700 pl-4 space-y-1 m-0 list-disc">
                            <li>El docente plantea en la pizarra: <em>9 lápices prestamos 4 (9 - 4)</em>.</li>
                            <li>Invita a un alumno a dar los saltos hacia atrás en la recta numérica.</li>
                            <li>Comprobación simultánea con los dedos: toda la clase levanta su mano mostrando 5 dedos al unísono.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 text-[11px] text-slate-700">
                        <strong>💡 Pauta para Error Típico:</strong> Si un alumno cuenta desde 1 con los dedos en lugar de dar saltos desde el número inicial, felicitar su esfuerzo y modelar amablemente: <em>"¡Muy buen intento! Ahora observa cómo con la recta numérica llegamos en solo 3 saltos sin cansarnos"</em>.
                      </div>
                    </div>
                  </div>

                  {/* MOMENTO 3: APLICACIÓN AUTÓNOMA Y MEDIACIÓN EN VIVO */}
                  <div className="border-2 border-amber-300 bg-white rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-amber-500 text-[#09243a] p-3 font-black flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#09243a] text-[#f8edc5] text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                          35:00 - 65:00 (30 min)
                        </span>
                        <span className="text-sm font-black">Momento 3 · Aplicación Autónoma ("Tú Haces") & Mediación Diferenciada</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#09243a] hidden sm:inline">Práctica en Aula</span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="border border-slate-300 p-3 rounded-xl space-y-1 bg-white">
                          <strong className="text-[#09243a] font-black block text-[11px] uppercase">
                            📝 Consigna de Trabajo:
                          </strong>
                          <p className="text-slate-700 m-0 leading-relaxed">
                            Se entrega la Ficha Didáctica de Aula. Los estudiantes resuelven los retos individualmente o en parejas colaborativas según su ritmo.
                          </p>
                        </div>

                        <div className="border border-slate-300 p-3 rounded-xl space-y-1 bg-white">
                          <strong className="text-[#09243a] font-black block text-[11px] uppercase">
                            🚶‍♂️ Rol de Circulación Docente:
                          </strong>
                          <p className="text-slate-700 m-0 leading-relaxed">
                            Caminar por las mesas con lápiz de corrección positiva. Brindar pistas graduales sin dar la respuesta final (Fase E-02 Andamiaje L.I.D.E.R.).
                          </p>
                        </div>

                        <div className="border border-amber-400 bg-amber-50/70 p-3 rounded-xl space-y-1">
                          <strong className="text-amber-950 font-black block text-[11px] uppercase flex items-center gap-1">
                            <span>⏸️ Minuto 50:00 · Pausa Activa:</span>
                          </strong>
                          <p className="text-amber-900 m-0 leading-relaxed">
                            El docente detiene el aula 60 segundos: todos de pie, estirar brazos hacia arriba y respirar hondo 3 veces (Vital para alumnos con TDAH).
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-200 text-blue-950">
                          <strong>Adecuación en mesa (Discalculia / Ley 7600):</strong> Acercar tapones de plástico o la recta numérica para que el estudiante deslice su dedo.
                        </div>
                        <div className="bg-purple-50/60 p-2 rounded-lg border border-purple-200 text-purple-950">
                          <strong>Adecuación en mesa (Altas Capacidades):</strong> Activar de inmediato la Zona de Maestría: inventar un problema nuevo para retar a un compañero.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MOMENTO 4: PUESTA EN COMÚN, TICKET DE SALIDA Y CIERRE */}
                  <div className="border-2 border-purple-300 bg-white rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-purple-700 text-white p-3 font-black flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-white text-purple-950 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                          65:00 - 80:00 (15 min)
                        </span>
                        <span className="text-sm">Momento 4 · Puesta en Común, Ticket de Salida & Cierre Metacognitivo</span>
                      </div>
                      <span className="text-[11px] font-bold text-purple-100 hidden sm:inline">Evaluación Formativa</span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-purple-50/60 border border-purple-200 p-3 rounded-xl space-y-1">
                          <strong className="text-purple-950 font-black block text-[11px] uppercase">
                            1. Puesta en Común (7 min):
                          </strong>
                          <p className="text-slate-700 m-0 leading-relaxed">
                            Dos estudiantes con métodos distintos muestran cómo llegaron al resultado. Se valida que ambos caminos son correctos y se refuerza la flexibilidad mental.
                          </p>
                        </div>

                        <div className="bg-amber-50/60 border border-amber-300 p-3 rounded-xl space-y-1">
                          <strong className="text-amber-950 font-black block text-[11px] uppercase">
                            2. Ticket de Salida (5 min):
                          </strong>
                          <p className="text-slate-700 m-0 leading-relaxed">
                            Se entregan los boletos recortables. Cada alumno responde en silencio sus 2 preguntas y marca su semáforo emocional (Fácil / Tuve dudas / Necesito ayuda).
                          </p>
                        </div>

                        <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl space-y-1">
                          <strong className="text-emerald-950 font-black block text-[11px] uppercase">
                            3. Peaje de Despedida (3 min):
                          </strong>
                          <p className="text-slate-700 m-0 leading-relaxed">
                            El docente recoge los tickets en una canasta en la puerta antes de salir. Esto da al profesor la radiografía exacta del nivel de logro en 3 minutos sin calificar en casa.
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#09243a] text-white p-3 rounded-xl flex items-center justify-between text-[11px]">
                        <span><strong>💬 Frase Docente de Cierre:</strong> "¡Excelente energía hoy! El error no es un fracaso, fue nuestro mejor maestro de cálculo. Mañana pondremos a prueba estos poderes en la arena interactiva."</span>
                        <span className="text-[#d7ad32] font-black shrink-0 ml-2">¡Fin de la Sesión!</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Caja de Gestión de Aula y Contingencias Docentes */}
                <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-xs space-y-2.5">
                  <strong className="text-[#09243a] font-black uppercase text-[11px] block border-b border-slate-200 pb-1">
                    🛡️ Protocolo para Contingencias e Imprevistos en Vivo:
                  </strong>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700">
                    <div>
                      <span className="font-bold text-[#09243a] block mb-0.5">¿Si terminan 10 minutos antes?</span>
                      <span>Asignar el rol de "coaches matemáticos" para apoyar a sus compañeros de mesa o resolver el enigma bonus de la Zona de Maestría.</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#09243a] block mb-0.5">¿Si la mayoría se traba en la resta?</span>
                      <span>Hacer una pausa colectiva de 2 minutos y volver a dar los saltos hacia atrás en la recta numérica de la pizarra entre todos.</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#09243a] block mb-0.5">¿Qué registrar en el cuaderno docente?</span>
                      <span>Revisar los tickets de salida: clasificar los boletos en 3 pilas (Dominado, En proceso, Requiere apoyo) para planificar la siguiente lección.</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECCIÓN 7: DINÁMICA DE GRUPOS DE TRABAJO & APRENDIZAJE COOPERATIVO (EQUIPOS)*/}
            {/* ========================================================================= */}
            {(activeTab === 'groups' || activeTab === 'all') && (
              <div className="space-y-6 pt-6 border-t-4 border-dashed border-[#d7ad32] print:border-none print:break-after-page">
                
                <div className="bg-[#09243a] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#d7ad32] text-[#09243a] flex items-center justify-center font-black shrink-0 text-base">
                      👥
                    </div>
                    <div>
                      <h2 className="text-base font-black m-0 text-white leading-tight">
                        Dinámica de Trabajo en Equipo & Aprendizaje Cooperativo (Roles L.I.D.E.R.)
                      </h2>
                      <span className="text-xs text-[#d6e1e7]">
                        Tarjetas de roles recortables, desafío de equipo encadenado y semáforo de coevaluación grupal
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#09243a] bg-[#d7ad32] px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                    COOPERATIVO 4 ROLES
                  </span>
                </div>

                {/* Membrete de Identidad de Equipo */}
                <div className="border-2 border-[#09243a] rounded-xl p-4 bg-[#fbfaf6] text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-black text-[#09243a] uppercase text-[11px] shrink-0">Nombre de Nuestro Equipo:</span>
                      <div className="border-b-2 border-slate-600 flex-1 min-h-[18px]"></div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-[#09243a] uppercase text-[10px]">Mesa / Grupo #:</span>
                      <div className="border-b-2 border-slate-600 w-12 min-h-[18px]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[9px] uppercase">👑 Coordinador(a):</span>
                      <div className="border-b border-slate-300 min-h-[16px] mt-0.5"></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[9px] uppercase">🗣️ Portavoz:</span>
                      <div className="border-b border-slate-300 min-h-[16px] mt-0.5"></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[9px] uppercase">📝 Secretario(a):</span>
                      <div className="border-b border-slate-300 min-h-[16px] mt-0.5"></div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[9px] uppercase">⏳ Gestor(a) de Tiempo:</span>
                      <div className="border-b border-slate-300 min-h-[16px] mt-0.5"></div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-center font-bold text-amber-950 text-[11px]">
                    🤝 <strong>Acuerdo de Convivencia:</strong> "En este equipo todos aportamos ideas, nos escuchamos con paciencia y nadie se queda atrás."
                  </div>
                </div>

                {/* 1. TARJETAS DE ROLES RECORTABLES (4 GAFETES DE MESA) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-[#09243a] pb-1">
                    <h3 className="text-xs font-black uppercase text-[#09243a] flex items-center gap-1.5 m-0">
                      <span>1. Tarjetas de Roles Recortables para los Pupitres (Gafetes de Responsabilidad)</span>
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">✂️ Recortar y colocar sobre la mesa</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    
                    {/* ROL 1: COORDINADOR */}
                    <div className="border-2 border-dashed border-amber-500 bg-amber-50/60 rounded-xl p-3.5 space-y-2 relative shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-300 pb-1.5">
                        <span className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                          <span>👑 Coordinador(a) / Líder</span>
                        </span>
                        <span className="text-[9px] bg-amber-200 font-black px-2 py-0.5 rounded text-amber-900 uppercase">Rol #1</span>
                      </div>
                      <div className="space-y-1 text-slate-800 text-[11px]">
                        <div><strong>🎯 Mi Misión:</strong> Leer la consigna en voz alta, pedir la palabra en orden y asegurar que todos participen antes de decidir.</div>
                        <div><strong>💬 Mi Frase Clave:</strong> <em>"¿Todos estamos de acuerdo con esta respuesta o alguien tiene otra idea?"</em></div>
                        <div className="text-[10px] text-amber-900 font-bold bg-white/80 p-1.5 rounded border border-amber-200 mt-1">
                          ⭐ Súper Poder: Mantener al equipo unido y enfocado.
                        </div>
                      </div>
                    </div>

                    {/* ROL 2: PORTAVOZ */}
                    <div className="border-2 border-dashed border-blue-500 bg-blue-50/60 rounded-xl p-3.5 space-y-2 relative shadow-xs">
                      <div className="flex items-center justify-between border-b border-blue-300 pb-1.5">
                        <span className="font-black text-blue-950 text-sm flex items-center gap-1.5">
                          <span>🗣️ Portavoz / Comunicador(a)</span>
                        </span>
                        <span className="text-[9px] bg-blue-200 font-black px-2 py-0.5 rounded text-blue-900 uppercase">Rol #2</span>
                      </div>
                      <div className="space-y-1 text-slate-800 text-[11px]">
                        <div><strong>🎯 Mi Misión:</strong> Explicar ante el grupo o la docente el método que usamos. Hacer consultas al profesor solo cuando todo el equipo tiene dudas.</div>
                        <div><strong>💬 Mi Frase Clave:</strong> <em>"Nuestro equipo descubrió que la mejor estrategia para este problema fue..."</em></div>
                        <div className="text-[10px] text-blue-900 font-bold bg-white/80 p-1.5 rounded border border-blue-200 mt-1">
                          ⭐ Súper Poder: Comunicar con seguridad y claridad.
                        </div>
                      </div>
                    </div>

                    {/* ROL 3: SECRETARIO */}
                    <div className="border-2 border-dashed border-emerald-500 bg-emerald-50/60 rounded-xl p-3.5 space-y-2 relative shadow-xs">
                      <div className="flex items-center justify-between border-b border-emerald-300 pb-1.5">
                        <span className="font-black text-emerald-950 text-sm flex items-center gap-1.5">
                          <span>📝 Secretario(a) / Registrador(a)</span>
                        </span>
                        <span className="text-[9px] bg-emerald-200 font-black px-2 py-0.5 rounded text-emerald-900 uppercase">Rol #3</span>
                      </div>
                      <div className="space-y-1 text-slate-800 text-[11px]">
                        <div><strong>🎯 Mi Misión:</strong> Escribir con letra clara y prolija las respuestas que el equipo haya acordado por consenso en la hoja final.</div>
                        <div><strong>💬 Mi Frase Clave:</strong> <em>"Díctenme con calma el procedimiento paso a paso para anotarlo sin errores."</em></div>
                        <div className="text-[10px] text-emerald-900 font-bold bg-white/80 p-1.5 rounded border border-emerald-200 mt-1">
                          ⭐ Súper Poder: Orden visual y exactitud escrita.
                        </div>
                      </div>
                    </div>

                    {/* ROL 4: GESTOR DE TIEMPO Y MATERIALES */}
                    <div className="border-2 border-dashed border-purple-500 bg-purple-50/60 rounded-xl p-3.5 space-y-2 relative shadow-xs">
                      <div className="flex items-center justify-between border-b border-purple-300 pb-1.5">
                        <span className="font-black text-purple-950 text-sm flex items-center gap-1.5">
                          <span>⏳ Gestor(a) de Tiempo & Materiales</span>
                        </span>
                        <span className="text-[9px] bg-purple-200 font-black px-2 py-0.5 rounded text-purple-900 uppercase">Rol #4</span>
                      </div>
                      <div className="space-y-1 text-slate-800 text-[11px]">
                        <div><strong>🎯 Mi Misión:</strong> Mirar el reloj del aula, avisar cuando queden 10 y 5 minutos, repartir la recta numérica/fichas y dejar el pupitre ordenado.</div>
                        <div><strong>💬 Mi Frase Clave:</strong> <em>"¡Equipo, nos quedan 5 minutos para completar la comprobación!"</em></div>
                        <div className="text-[10px] text-purple-900 font-bold bg-white/80 p-1.5 rounded border border-purple-200 mt-1">
                          ⭐ Súper Poder: Ritmo, orden y cuidado del tiempo.
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. FICHA DE DESAFÍO COOPERATIVO EN EQUIPO (MISIÓN ENCADENADA) */}
                <div className="border border-slate-300 rounded-xl p-4 space-y-3 bg-white text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <strong className="text-[#09243a] uppercase font-black text-xs flex items-center gap-1.5">
                      <span>2. Reto Cooperativo de Equipo: "La Misión Encadenada sobre {cleanTopic}"</span>
                    </strong>
                    <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">Interdependencia Positiva</span>
                  </div>

                  <p className="text-slate-700 m-0 leading-relaxed text-[11px]">
                    Para resolver este desafío, ningún miembro puede terminar solo. Cada rol debe completar su fase antes de que el equipo avance al siguiente paso:
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {/* Paso 1 - Coordinador */}
                    <div className="bg-amber-50/50 border border-amber-200 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center justify-between font-bold text-amber-950 text-[11px]">
                        <span>Paso 1 (Líder): Lectura y Subrayado de Datos Clave</span>
                        <span className="font-mono text-[10px] text-amber-800">[ ] Revisado</span>
                      </div>
                      <p className="text-slate-700 m-0 text-[11px]">
                        "En el bazar escolar había 15 cuadernos. Por la mañana se vendieron 6 y por la tarde se recibieron 4 nuevos cuadernos de donación."
                      </p>
                      <div className="text-[10px] text-slate-600 italic">Datos identificados por el equipo: Teníamos: ______ | Vendimos: ______ | Recibimos: ______</div>
                    </div>

                    {/* Paso 2 - Gestor de Materiales */}
                    <div className="bg-purple-50/50 border border-purple-200 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center justify-between font-bold text-purple-950 text-[11px]">
                        <span>Paso 2 (Gestor de Tiempo/Materiales): Comprobación Visual en Recta o Fichas</span>
                        <span className="font-mono text-[10px] text-purple-800">[ ] Manipulado</span>
                      </div>
                      <p className="text-slate-700 m-0 text-[11px]">
                        Ubiquen el 15 en la recta numérica. Den 6 saltos hacia atrás (resta) y luego 4 saltos hacia adelante (suma).
                      </p>
                      <div className="text-[10px] text-purple-950 font-bold">Número intermedio al que llegamos: [ ______ ] → Número final: [ ______ ]</div>
                    </div>

                    {/* Paso 3 - Secretario */}
                    <div className="bg-emerald-50/50 border border-emerald-200 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-950 text-[11px]">
                        <span>Paso 3 (Secretario): Registro Matemático Formal</span>
                        <span className="font-mono text-[10px] text-emerald-800">[ ] Registrado</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center pt-0.5">
                        <div className="border border-dashed border-emerald-400 p-1.5 rounded bg-white font-mono font-bold text-emerald-900">
                          Operación: 15 - 6 + 4 = ______
                        </div>
                        <div className="border border-dashed border-emerald-400 p-1.5 rounded bg-white text-emerald-900 font-bold text-[11px]">
                          Respuesta: Quedan ______ cuadernos.
                        </div>
                      </div>
                    </div>

                    {/* Paso 4 - Portavoz */}
                    <div className="bg-blue-50/50 border border-blue-200 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center justify-between font-bold text-blue-950 text-[11px]">
                        <span>Paso 4 (Portavoz): Justificación Verbal ante el Aula</span>
                        <span className="font-mono text-[10px] text-blue-800">[ ] Ensayo Listo</span>
                      </div>
                      <p className="text-slate-700 m-0 text-[11px]">
                        El equipo ensaya 1 minuto la explicación que el Portavoz dirá en voz alta cuando la docente le dé el turno.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. SEMÁFORO DE COEVALUACIÓN DEL EQUIPO */}
                <div className="border border-slate-300 rounded-xl overflow-hidden text-xs shadow-xs">
                  <div className="bg-slate-100 p-2.5 border-b border-slate-300 font-black text-[#09243a] flex items-center justify-between">
                    <span>3. Semáforo de Coevaluación del Equipo (¿Cómo trabajamos hoy juntos?)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Marcar con X: 🟢 Sí | 🟡 Más o menos | 🔴 Necesitamos mejorar</span>
                  </div>

                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200">
                        <th className="p-2.5">Criterio de Trabajo Cooperativo</th>
                        <th className="p-2.5 text-center w-20 bg-emerald-50 text-emerald-900">🟢 Siempre</th>
                        <th className="p-2.5 text-center w-20 bg-amber-50 text-amber-900">🟡 A veces</th>
                        <th className="p-2.5 text-center w-20 bg-rose-50 text-rose-900">🔴 Nos costó</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">1. Nos escuchamos sin interrumpir y respetamos el turno de palabra de cada rol.</td>
                        <td className="p-2.5 text-center font-bold text-emerald-700">[ &nbsp;&nbsp; ]</td>
                        <td className="p-2.5 text-center font-bold text-amber-700">[ &nbsp;&nbsp; ]</td>
                        <td className="p-2.5 text-center font-bold text-rose-700">[ &nbsp;&nbsp; ]</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">2. Todos entendimos la estrategia y nadie se quedó con dudas antes de entregar.</td>
                        <td className="p-2.5 text-center font-bold text-emerald-700">[ &nbsp;&nbsp; ]</td>
                        <td className="p-2.5 text-center font-bold text-amber-700">[ &nbsp;&nbsp; ]</td>
                        <td className="p-2.5 text-center font-bold text-rose-700">[ &nbsp;&nbsp; ]</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">3. Cuidamos los materiales de aula y terminamos dentro del tiempo fijado.</td>
                        <td className="p-2.5 text-center font-bold text-emerald-700">[ &nbsp;&nbsp; ]</td>
                        <td className="p-2.5 text-center font-bold text-amber-700">[ &nbsp;&nbsp; ]</td>
                        <td className="p-2.5 text-center font-bold text-rose-700">[ &nbsp;&nbsp; ]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4. PAUTAS PARA AGRUPAMIENTO INCLUSIVO (LEY 7600 MEP / DUA) */}
                <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50 text-xs space-y-2">
                  <strong className="text-[#09243a] font-black uppercase text-[11px] block border-b border-slate-200 pb-1">
                    💡 Pautas de Agrupamiento Inclusivo para el Docente (Ley 7600 · MEP):
                  </strong>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] text-slate-700">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <strong className="text-[#09243a] block">🎯 Alumno con TDAH:</strong>
                      Asignarle el rol de <strong>Gestor de Tiempo y Materiales</strong>. Canaliza su energía motora de forma positiva al manipular el reloj y repartir la recta numérica.
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <strong className="text-[#09243a] block">🔢 Alumno con Discalculia:</strong>
                      Asignarle el rol de <strong>Portavoz</strong> o <strong>Coordinador</strong>. El equipo le brinda andamiaje seguro y él lidera la comunicación sin angustia en el trazo.
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <strong className="text-[#09243a] block">🚀 Alumno de Altas Capacidades:</strong>
                      Rotarlo como <strong>Coordinador</strong> o mediador de equipo para entrenar empatía, escucha activa y paciencia pedagógica sin monopolizar el reto.
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Document Footer (Visible in print) */}
            <div className="pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 flex items-center justify-between">
              <span>Recurso pedagógico generado con L.I.D.E.R. AI Studio</span>
              <span>Método L.I.D.E.R.© por Katya Sánchez</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
