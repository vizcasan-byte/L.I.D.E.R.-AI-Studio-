/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Gamepad2, Sparkles, Copy, Heart, Check, FileText, Monitor, RefreshCw, Eye, Printer } from 'lucide-react';
import { GAM_EXPERIENCES, GAM_MECHANICS, GAM_VISUALS, GAM_ACCESSIBILITY } from '../data/liderCodes';
import { ResourceFunctionMode, SavedResource } from '../types';
import { PrintableResourceModal } from './PrintableResourceModal';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveResource: (resource: Omit<SavedResource, 'id' | 'date'>) => void;
  onOpenSandbox: (topic: string, tipo: string, grade?: string, subject?: string) => void;
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  isOpen,
  onClose,
  onSaveResource,
  onOpenSandbox
}) => {
  const [tema, setTema] = useState('');
  const [materia, setMateria] = useState('');
  const [grado, setGrado] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [modo, setModo] = useState<ResourceFunctionMode>('interactivo');
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(new Set(['/quiz', '/memory', '/sequence']));
  const [selectedWorlds, setSelectedWorlds] = useState<'3' | '2' | '4'>('3');
  const [selectedMechanics, setSelectedMechanics] = useState<Set<string>>(new Set(['/points', '/feedback', '/levelup', '/progressbar']));
  const [selectedVisuals, setSelectedVisuals] = useState<Set<string>>(new Set(['/minecraft']));
  const [selectedAccessibility, setSelectedAccessibility] = useState<Set<string>>(new Set(['/simplifiedlanguage']));
  const [modoVista, setModoVista] = useState('Vista docente y estudiante');
  const [idioma, setIdioma] = useState('Español');
  const [detallesAdicionales, setDetallesAdicionales] = useState('');
  
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [temaNotice, setTemaNotice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleSetItem = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, code: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleGenerate = () => {
    let effectiveTema = tema.trim();
    if (!effectiveTema) {
      effectiveTema = 'El Sistema Solar y las Leyes del Universo';
      setTema(effectiveTema);
      setTemaNotice('💡 Se ha generado con el tema sugerido "El Sistema Solar". Puedes modificarlo arriba en cualquier momento y volver a presionar Generar.');
    } else {
      setTemaNotice(null);
    }

    // Intelligent separation between academic topic and game setting if user typed both into tema
    let cleanAcademicTema = effectiveTema;
    if (/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade))/i.test(cleanAcademicTema)) {
      cleanAcademicTema = cleanAcademicTema.replace(/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade)?)/gi, '').trim();
    }
    if (!cleanAcademicTema) cleanAcademicTema = effectiveTema;

    setIsGenerating(true);

    const expLabels = Array.from(selectedExperiences).map(code => {
      const expItem = GAM_EXPERIENCES.find(x => x[0] === code);
      return expItem ? `${expItem[1]} (${code})` : code;
    });

    const allCodes = [
      ...Array.from(selectedExperiences),
      ...Array.from(selectedMechanics),
      ...Array.from(selectedVisuals),
      ...Array.from(selectedAccessibility)
    ];

    let modalityBlock = '';
    if (modo === 'interactivo') {
      modalityBlock = `
MODALIDAD DE FUNCIONAMIENTO:
💻 INTERACTIVO (FUNCIONALIDAD REAL EN EL JUEGO / EXPERIENCIA)

🎯 REGLA DE ORO DE INTERACTIVIDAD (L.I.D.E.R. FUNCIONAL):
No describas la interacción: IMPLEMÉNTALA.
Los botones, campos, comprobación de respuestas, puntuación, retroalimentación y reinicio DEBEN FUNCIONAR REALMENTE en el recurso generado.
- Proporciona el código funcional completo en HTML + CSS + JS autocontenido en un solo bloque.
- Debe incluir eventos reales de clic, validación instantánea de aciertos/fallos, actualización de puntos y barra de progreso, pistas desbloqueables y botón de reinicio operativo.`;
    } else if (modo === 'hibrido') {
      modalityBlock = `
MODALIDAD DE FUNCIONAMIENTO:
🔄 HÍBRIDO (VERSIÓN IMPRIMIBLE DE JUEGO + VERSIÓN DIGITAL INTERACTIVA)

1. VERSIÓN IMPRIMIBLE: Tarjetas, tableros o consignas para jugar físicamente en equipos en el aula.
2. VERSIÓN INTERACTIVA: Código completo ejecutable (HTML+CSS+JS) con botones reales, validación en tiempo real, puntuación y reinicio.`;
    } else {
      modalityBlock = `
MODALIDAD DE FUNCIONAMIENTO:
📄 IMPRIMIBLE (LISTO PARA IMPRIMIR Y JUGAR EN EL AULA)
- Formato maquetado para fotocopiar (tarjetas recortables, tablero de juego de mesa o fichas de reto con hoja de instrucciones y soluciones).`;
    }

    let prompt = `Actúa como diseñador instruccional experto en aprendizaje activo, gamificación educativa e inteligencia artificial.

DISEÑA UNA EXPERIENCIA EDUCATIVA GAMIFICADA MULTI-ACTIVIDAD Y MULTINIVEL.

TEMA CURRICULAR / ACADÉMICO: "${cleanAcademicTema}"
ACTIVIDADES EDUCATIVAS INTEGRADAS:
${expLabels.map(l => `- ${l}`).join('\n')}
CÓDIGO L.I.D.E.R.™ UTILIZADO: ${allCodes.join(' ')}
`;

    if (materia) prompt += `\nMATERIA: ${materia}`;
    if (grado) prompt += `\nNIVEL EDUCATIVO: ${grado}`;
    if (objetivo) prompt += `\nOBJETIVO DE APRENDIZAJE: ${objetivo}`;

    // Estructura de Mundos / Niveles de Complejidad Progresiva
    prompt += `\n\n🌍 ESTRUCTURA OBLIGATORIA POR MUNDOS / NIVELES DE COMPLEJIDAD (${selectedWorlds} MUNDOS):
El recurso DEBE estar organizado en ${selectedWorlds} Mundos de dificultad progresiva basados en la Taxonomía Curricular:
- 🟢 MUNDO 1 (NIVEL BÁSICO / INICIACIÓN - APRENDIZ):
  • Foco: Operaciones elementales directas o conceptos clave fundamentales de "${cleanAcademicTema}".
  • Ejemplos: Sumas o restas directas con números del 1 al 10, secuencias numéricas sencillas (+1, +2), vocabulario base.
  • Reto de superación: 3 desafíos o actividades para desbloquear el portal al Mundo 2.

- 🟡 MUNDO 2 (NIVEL INTERMEDIO / EXPLORADOR - DESAFÍO):
  • Foco: Operaciones combinadas (suma y resta consecutivas), números hasta 20, secuencias con saltos variables (+3, +5, descendentes) y problemas contextualizados de la vida real.
  • Andamiaje: Pistas graduales disponibles ante el primer fallo.
  • Reto de superación: 3 desafíos intermedios para desbloquear el Mundo 3.

- 🔴 MUNDO 3 (NIVEL AVANZADO / MAESTRÍA - BÓVEDA FINAL):
  • Foco: Razonamiento lógico-matemático, cálculo mental ágil con 3 términos, operaciones con incógnitas (ej. 6 + [?] = 10) y sopa de letras / puzzle conceptual complejo.
  • Desafío Final / Jefe del Conocimiento: Un reto integrador que consolida todo el aprendizaje del tema.`;

    if (selectedWorlds === '4') {
      prompt += `\n- 👑 MUNDO 4 (ZONA BONUS / JEFE SUPREMO): Retos de velocidad o enigmas especiales para estudiantes que terminan primero.`;
    }

    // Directrices específicas para cada actividad seleccionada
    let activitiesDirectives = '\n\n🎯 DIRECTRICES DE IMPLEMENTACIÓN PARA CADA ACTIVIDAD SELECCIONADA:';
    
    if (selectedExperiences.has('/memory')) {
      activitiesDirectives += `\n\n🧠 1. ESTACIÓN DE JUEGO DE MEMORIA (/memory):
- Mecánica: Cuadrícula interactiva de cartas volteables (Memory match).
- Contenido pedagógico: Parejas exactas entre operaciones y sus resultados (ej: Carta A: "5 + 3" ➔ Carta B: "8", Carta C: "9 - 4" ➔ Carta D: "5") o conceptos con sus definiciones.
- Funcionalidad real: Detección automática de coincidencias, contador de intentos/movimientos, animación de giro de cartas y mensaje de victoria al encontrar todos los pares.`;
    }

    if (selectedExperiences.has('/sequence')) {
      activitiesDirectives += `\n\n🔢 2. ESTACIÓN DE SECUENCIAS Y PATRONES (/sequence):
- Mecánica: Series numéricas o secuencias lógicas con casillas faltantes o tarjetas desordenadas para arrastrar/seleccionar en orden correcto.
- Contenido pedagógico: Patrones numéricos adaptados al grado escolar (Mundo 1: 2, 4, 6, [?]; Mundo 2: 15, 12, 9, [?]; Mundo 3: patrones combinados o secuencias temporales del tema).
- Funcionalidad real: Comprobación instantánea al colocar o pulsar el número faltante con feedback explicativo.`;
    }

    if (selectedExperiences.has('/wordsearch')) {
      activitiesDirectives += `\n\n🔤 3. ESTACIÓN DE SOPA DE LETRAS / VOCABULARIO (/wordsearch):
- Mecánica: Cuadrícula interactiva de letras (ej. 8x8 o 10x10) con una lista lateral de palabras o términos clave del tema a buscar.
- Contenido pedagógico: Nombres de números y operaciones (ej: SUMA, RESTA, OCHO, TOTAL, DIEZ, CINCO) o términos esenciales de "${cleanAcademicTema}".
- Funcionalidad real: El usuario puede hacer clic en las letras para seleccionarlas y marcarlas; al encontrar una palabra válida, esta se resalta en color fluorescente y se tacha en la lista de objetivos con suma de puntos.`;
    }

    if (selectedExperiences.has('/quiz')) {
      activitiesDirectives += `\n\n🧩 4. ESTACIÓN DE QUIZ INTERACTIVO (/quiz):
- Mecánica: Cuestionario de opción múltiple con 3 o 4 alternativas por pregunta.
- Contenido pedagógico: Preguntas estrictamente curriculares graduadas por mundo, con explicaciones pedagógicas ante aciertos y errores.`;
    }

    if (selectedExperiences.has('/wheel')) {
      activitiesDirectives += `\n\n🎡 5. RULETA DE DESAFÍOS (/wheel):
- Mecánica: Ruleta giratoria animada con botón de giro, flecha indicadora y retos aleatorios según el sector donde caiga.`;
    }

    if (selectedExperiences.has('/escape')) {
      activitiesDirectives += `\n\n🔐 6. ESCAPE ROOM DIGITAL (/escape):
- Mecánica: Salas temáticas con candados numéricos interactivos donde la clave es el resultado del problema pedagógico.`;
    }

    if (selectedExperiences.has('/matching')) {
      activitiesDirectives += `\n\n🔗 7. EMPAREJAMIENTO DINÁMICO (/matching):
- Mecánica: Columnas interactivas para conectar el problema o concepto con su resolución.`;
    }

    prompt += `\n${modalityBlock}`;
    prompt += activitiesDirectives;

    if (selectedMechanics.size > 0) {
      prompt += `\n\nMECÁNICAS DE GAMIFICACIÓN ACTIVAS:\n${Array.from(selectedMechanics).map(code => {
        const item = GAM_MECHANICS.find(m => m[0] === code);
        return `- ${item ? item[1] : code} (${code})`;
      }).join('\n')}`;
    }

    if (selectedVisuals.size > 0) {
      prompt += `\n\nESTILO VISUAL SELECCIONADO:\n${Array.from(selectedVisuals).map(code => {
        const item = GAM_VISUALS.find(v => v[0] === code);
        return `- ${item ? item[1] : code} (${code})`;
      }).join('\n')}`;

      // Inyectar mecánicas temáticas completas cuando se selecciona un estilo de juego popular
      if (selectedVisuals.has('/mariokart') || tema.toLowerCase().includes('mario kart') || detallesAdicionales.toLowerCase().includes('mario kart')) {
        prompt += `\n\n🏎️ MECÁNICAS Y AMBIENTACIÓN DE MARIO KART:
- NARRATIVA DE CARRERA: El recurso es un Gran Premio de velocidad y conocimiento sobre "${cleanAcademicTema}".
- SI ES INTERACTIVO: Construye una carrera de 3 vueltas (Laps) en código HTML/CSS/JS. Cada acierto otorga un "Champiñón Turbo 🍄" (+30 km/h y animación de avance veloz); cada error hace resbalar al kart con una "Cáscara de Banana 🍌" con pista pedagógica para corregir. Incluye velocímetro funcional en km/h, monedas doradas recolectadas y podio final de victoria con copa dorada.
- SI ES IMPRIMIBLE: Diseña la hoja con un circuito de pista con 3 sectores (Curva 1, Curva 2, Recta Final), casillas con cajas misteriosas [ ? ] para las preguntas y podio con casillas de autoevaluación (1er, 2do y 3er puesto).`;
      }

      if (selectedVisuals.has('/minecraft') || tema.toLowerCase().includes('minecraft') || detallesAdicionales.toLowerCase().includes('minecraft')) {
        prompt += `\n\n⛏️ MECÁNICAS Y AMBIENTACIÓN DE MINECRAFT (VOXEL):
- NARRATIVA DE SUPERVIVENCIA Y CRAFTEO: La misión es recolectar recursos para craftear el "Trofeo de Diamante del Conocimiento" sobre "${cleanAcademicTema}".
- SI ES INTERACTIVO: Barra de vida con 5 corazones (❤️❤️❤️❤️❤️) que parpadean ante errores y se regeneran con aciertos; cuadrícula de crafteo 3x3 donde cada respuesta correcta coloca un recurso (hierro, oro, redstone, diamante) hasta completar la herramienta; botón de reinicio "Reaparecer / Respawn".
- SI ES IMPRIMIBLE: Estructura de cuadrícula de inventario con marcos de bloques, corazones de vida dibujados para colorear por cada acierto y receta de crafteo para completar.`;
      }

      if (selectedVisuals.has('/roblox') || tema.toLowerCase().includes('roblox') || detallesAdicionales.toLowerCase().includes('roblox')) {
        prompt += `\n\n🧱 MECÁNICAS Y AMBIENTACIÓN DE ROBLOX (OBBY PARKOUR):
- NARRATIVA DE OBBY: Superar un circuito de plataformas flotantes y saltos sobre lava hasta la cima del conocimiento de "${cleanAcademicTema}".
- SI ES INTERACTIVO: 5 etapas (Stages) progresivas con plataformas de colores neón, botón de Checkpoint que guarda el progreso, contador de "Caídas al vacío" y corona dorada al superar el último salto.
- SI ES IMPRIMIBLE: Mapa de etapas numeradas (Stage 1 a Stage 5), sellos de checkpoint para estampar o marcar, y tabla de puntuación con gemas de victoria.`;
      }

      if (selectedVisuals.has('/lego') || tema.toLowerCase().includes('lego') || detallesAdicionales.toLowerCase().includes('lego')) {
        prompt += `\n\n🧩 MECÁNICAS Y AMBIENTACIÓN DE LEGO (CONSTRUCCIÓN CON BLOQUES):
- NARRATIVA DE MONTAJE: Construir una estructura o invento pieza a pieza respondiendo preguntas de "${cleanAcademicTema}".
- SI ES INTERACTIVO: Modelo visual que va ensamblando ladrillos plásticos de colores con cada respuesta correcta, con studs cilíndricos visibles, contador de piezas colocadas (ej. "8/8 bloques colocados") y botón de desmontar/reiniciar.
- SI ES IMPRIMIBLE: Manual de instrucciones de construcción ilustrado por pasos (Paso 1: Coloca la base, Paso 2: Ensambla las columnas...), con casillas en forma de bloques para colorear.`;
      }

      if (selectedVisuals.has('/pokemon') || tema.toLowerCase().includes('pokemon') || tema.toLowerCase().includes('pokémon') || detallesAdicionales.toLowerCase().includes('pokemon')) {
        prompt += `\n\n⚡ MECÁNICAS Y AMBIENTACIÓN DE POKÉMON (BATALLA RPG):
- NARRATIVA DE DUELO DE GIMNASIO: Derrotar al "Jefe de la Confusión" o capturar a la criatura legendaria de "${cleanAcademicTema}".
- SI ES INTERACTIVO: Barra de vida del rival (HP 100) que se reduce con cada respuesta correcta ("¡Ataque súper efectivo!"); menú de 4 ataques donde cada ataque es una opción de respuesta pedagógica; medalla de gimnasio desbloqueable al ganar.
- SI ES IMPRIMIBLE: Ficha de Entrenador del estudiante con nivel y medallas, menú de combate con 4 ataques por pregunta, y tarjeta Pokédex para completar con el resumen del tema.`;
      }

      if (selectedVisuals.has('/arcade') || tema.toLowerCase().includes('arcade') || detallesAdicionales.toLowerCase().includes('arcade')) {
        prompt += `\n\n🕹️ MECÁNICAS Y AMBIENTACIÓN DE ARCADE RETRO (8-BIT):
- NARRATIVA DE MÁQUINA RECREATIVA: Superar la pantalla "Stage 1" y alcanzar el récord "HIGH SCORE" en "${cleanAcademicTema}".
- SI ES INTERACTIVO: Estética retro con tipografía de píxel, vidas "1UP", sonidos estilo chiptune sugeridos, marcador de SCORE dinámico y pantalla de "GAME OVER / CONTINUE? 9..8..7..".
- SI ES IMPRIMIBLE: Maqueta de pantalla de videojuego con marco arcade, tabla de récord para inscribir el nombre de 3 iniciales y casillas pixeladas.`;
      }

      const hasGameVisual = selectedVisuals.has('/mariokart') || selectedVisuals.has('/minecraft') ||
                            selectedVisuals.has('/roblox') || selectedVisuals.has('/lego') ||
                            selectedVisuals.has('/pokemon') || selectedVisuals.has('/arcade');

      if (hasGameVisual) {
        prompt += `\n\n🚨 REGLA DE ORO DE CONTENIDO CURRICULAR (ESTRICTO Y OBLIGATORIO):
EL 100% DE LAS PREGUNTAS Y EJERCICIOS DEBEN EVALUAR EXCLUSIVAMENTE: "${cleanAcademicTema}" (${grado || 'escolar'}).
❌ PROHIBIDO FORMULAR PREGUNTAS SOBRE EL VIDEOJUEGO O AMBIENTACIÓN: CERO preguntas sobre Minecraft, Mario Kart, Roblox, Lego o Pokémon (NO preguntes por personajes, monstruos, recetas de crafteo, objetos o reglas del juego). El alumno NO está siendo evaluado sobre videojuegos.
✅ LA AMBIENTACIÓN ES ÚNICAMENTE UNA METÁFORA VISUAL Y NARRATIVA:
   - Ejemplo si el tema es "Sumas y restas para 1° y 2° grado": Las preguntas deben ser operaciones matemáticas normales adecuadas a la edad (ej: "¿Cuánto es 5 + 3?" o problemas cotidianos sencillos con lápices, manzanas o monedas).
   - Cualquier estudiante debe poder responder las preguntas usando únicamente sus conocimientos escolares de "${cleanAcademicTema}", aunque jamás haya jugado o visto el videojuego.`;
      }
    }

    if (selectedAccessibility.size > 0) {
      prompt += `\n\nACCESIBILIDAD E INCLUSIÓN EDUCATIVA:\n${Array.from(selectedAccessibility).map(code => {
        const item = GAM_ACCESSIBILITY.find(a => a[0] === code);
        return `- ${item ? item[1] : code} (${code})`;
      }).join('\n')}`;
    }

    prompt += `\n\nMODO DE VISTA: ${modoVista}\nIDIOMA: ${idioma}`;

    if (detallesAdicionales) {
      prompt += `\n\nDETALLES ADICIONALES DEL DOCENTE:\n${detallesAdicionales}`;
    }

    prompt += `\n\nREGLA DE FIDELIDAD DE LOS DATOS:
Conserva rigurosamente el tema "${effectiveTema}", la materia y el nivel indicados. La creatividad pedagógica debe aplicarse al diseño de la mecánica y experiencia lúdica sin alterar los datos curriculares.

ENTREGA COMPLETA ESPERADA:
1. Título dinámico de la experiencia.
2. Narrativa / Misión de anclaje.
3. Reglas y mecánicas de participación.
4. Contenido completo de las preguntas, retos, tarjetas o desafíos (no te limites a describirlos, constrúyelos íntegramente).
5. Sistema de evaluación, puntos e insignias.
6. Adaptaciones para inclusión (DUA).

Entrega el recurso estructurado y listo para llevar al aula.`;

    setGeneratedPrompt(prompt.trim());
    setSaved(false);
    setIsGenerating(false);

    // Smooth scroll down to result box
    setTimeout(() => {
      const resultBox = document.getElementById('gam-result-box');
      if (resultBox) {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveResource({
      type: 'Experiencia gamificada',
      topic: tema,
      modo: modo,
      codes: [...Array.from(selectedExperiences), ...Array.from(selectedMechanics), ...Array.from(selectedVisuals), ...Array.from(selectedAccessibility)],
      prompt: generatedPrompt,
      subject: materia,
      grade: grado
    });
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#061a2b]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#fbfaf6] border border-[#e7e4dc] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#09243a] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-2">
              <Gamepad2 className="w-4 h-4 text-[#d7ad32]" />
              GAMIFICACIÓN 2.0 · MÉTODO L.I.D.E.R.©
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white m-0">
              Diseñador de Experiencias Gamificadas
            </h2>
            <p className="text-[#d6e1e7] text-xs sm:text-sm mt-1">
              Diseña la experiencia. L.I.D.E.R. construye la instrucción con interactividad real.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors font-bold"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* NUEVA OPCIÓN: ¿Cómo quieres que funcione tu recurso? */}
          <div className="bg-white border-2 border-[#eadfb8] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#d7ad32]" />
              <h3 className="text-[#09243a] font-extrabold text-sm sm:text-base m-0">
                ¿Cómo quieres que funcione tu experiencia gamificada?
              </h3>
            </div>
            <p className="text-xs text-[#68747d] mb-4">
              Selecciona la modalidad. Si eliges Interactivo o Híbrido, la IA programará la interactividad real y funcional.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Imprimible */}
              <button
                type="button"
                onClick={() => setModo('imprimible')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  modo === 'imprimible'
                    ? 'border-[#09243a] bg-[#f8edc5]/30 ring-2 ring-[#09243a]/20'
                    : 'border-[#e7e4dc] bg-white hover:border-[#d7ad32]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4 text-[#09243a]" />
                  <strong className="text-sm text-[#09243a]">📄 Imprimible</strong>
                </div>
                <p className="text-[11px] text-[#68747d] m-0 leading-relaxed">
                  Tablero o tarjetas para recortar y jugar en papel.
                </p>
              </button>

              {/* Interactivo */}
              <button
                type="button"
                onClick={() => setModo('interactivo')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  modo === 'interactivo'
                    ? 'border-[#09243a] bg-[#09243a]/5 ring-2 ring-[#09243a]/20'
                    : 'border-[#e7e4dc] bg-white hover:border-[#d7ad32]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Monitor className="w-4 h-4 text-[#09243a]" />
                  <strong className="text-sm text-[#09243a]">💻 Interactivo</strong>
                </div>
                <p className="text-[11px] text-[#68747d] m-0 leading-relaxed">
                  Botones, respuestas, puntuación, retroalimentación y reinicio reales.
                </p>
              </button>

              {/* Híbrido */}
              <button
                type="button"
                onClick={() => setModo('hibrido')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  modo === 'hibrido'
                    ? 'border-[#09243a] bg-[#f8edc5]/30 ring-2 ring-[#09243a]/20'
                    : 'border-[#e7e4dc] bg-white hover:border-[#d7ad32]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <RefreshCw className="w-4 h-4 text-[#09243a]" />
                  <strong className="text-sm text-[#09243a]">🔄 Híbrido</strong>
                </div>
                <p className="text-[11px] text-[#68747d] m-0 leading-relaxed">
                  Versión imprimible para el aula + versión digital interactiva.
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Actividades Integradas y Mundos */}
            <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[#09243a] font-extrabold text-sm m-0">
                    1. Tipos de actividad integrados (Multiselección)
                  </h3>
                  <span className="text-[10px] bg-[#09243a] text-[#fde047] font-black px-2 py-0.5 rounded-full">
                    {selectedExperiences.size} activas
                  </span>
                </div>
                <p className="text-xs text-[#68747d] m-0">
                  Puedes combinar varias dinámicas: Memoria, Secuencia, Sopa de letras, Quiz, etc.
                </p>
              </div>

              {/* Botones de selección rápida destacada */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['/memory', '🧠 Memoria', 'Parejas de operaciones y respuestas'],
                  ['/sequence', '🔢 Secuencia', 'Completar patrones y series numéricas'],
                  ['/wordsearch', '🔤 Sopa de Letras', 'Búsqueda de términos y números'],
                  ['/quiz', '🧩 Quiz Rápido', 'Preguntas con feedback explicativo'],
                  ['/wheel', '🎡 Ruleta Retos', 'Giros con desafíos al azar'],
                  ['/escape', '🔐 Escape Room', 'Candados con claves numéricas']
                ].map(([code, label, desc]) => {
                  const active = selectedExperiences.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleSetItem(setSelectedExperiences, code)}
                      className={`p-2.5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                        active
                          ? 'bg-[#09243a] text-white border-[#09243a] shadow-xs'
                          : 'bg-[#fbfaf6] text-[#24313b] border-[#e7e4dc] hover:border-[#d7ad32]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-[#d7ad32]" />}
                      </div>
                      <div className={`text-[10px] mt-0.5 line-clamp-1 ${active ? 'text-slate-200' : 'text-[#68747d]'}`}>
                        {desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selector de Niveles de Complejidad o Mundos */}
              <div className="pt-3 border-t border-[#e7e4dc] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#09243a] flex items-center gap-1">
                    <span>🌍</span>
                    <span>Niveles de complejidad / Mundos:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: '2', label: '2 Niveles' },
                      { id: '3', label: '3 Mundos (Recomendado)' },
                      { id: '4', label: '4 Mundos + Jefe' }
                    ].map(w => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWorlds(w.id as any)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                          selectedWorlds === w.id
                            ? 'bg-[#09243a] text-[#fde047]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-slate-700 text-center">
                  <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded-lg text-emerald-950">
                    🟢 Mundo 1: Básico
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-1.5 rounded-lg text-amber-950">
                    🟡 Mundo 2: Intermedio
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-1.5 rounded-lg text-rose-950">
                    🔴 Mundo 3: Avanzado
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contexto Curricular */}
            <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5 space-y-3">
              <div>
                <h3 className="text-[#09243a] font-extrabold text-sm mb-0.5">
                  2. Contenido curricular académico
                </h3>
                <p className="text-[11px] text-[#68747d] m-0">
                  Las preguntas y desafíos evaluarán 100% este contenido escolar (NO la ambientación del juego).
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#09243a] mb-1">
                  Tema o habilidad escolar a evaluar *
                </label>
                <input
                  id="gam-input-tema"
                  type="text"
                  value={tema}
                  onChange={(e) => {
                    setTema(e.target.value);
                    if (temaNotice) setTemaNotice(null);
                  }}
                  placeholder="Ej. Sumas y restas para 1° y 2°, Fracciones, Fotosíntesis..."
                  className="w-full p-2.5 rounded-xl border border-[#e7e4dc] text-xs focus:border-[#d7ad32] focus:ring-2 focus:ring-[#d7ad32]/20 outline-none"
                />
                
                {/* Sugerencias rápidas de tema escolar */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-bold mr-0.5">Temas sugeridos:</span>
                  {[
                    '➕ Sumas y restas (1° y 2°)',
                    '📐 Fracciones simples',
                    '🌿 Fotosíntesis y plantas',
                    '☀️ El Sistema Solar',
                    '📖 Comprensión lectora',
                    '💧 Ciclo del agua',
                    '📜 Civilizaciones antiguas',
                    '🔤 Ortografía y acentuación'
                  ].map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        const cleanTopic = sug.replace(/^[^\s]+\s/, '');
                        setTema(cleanTopic);
                        setTemaNotice(null);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#09243a] mb-1">
                    Materia
                  </label>
                  <select
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#e7e4dc] text-xs focus:border-[#d7ad32] outline-none"
                  >
                    <option value="">Selecciona</option>
                    <option>Español / Lengua</option>
                    <option>Matemáticas</option>
                    <option>Ciencias</option>
                    <option>Estudios Sociales</option>
                    <option>Inglés</option>
                    <option>Arte</option>
                    <option>Tecnología</option>
                    <option>Otra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#09243a] mb-1">
                    Nivel / Grado
                  </label>
                  <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#e7e4dc] text-xs focus:border-[#d7ad32] outline-none"
                  >
                    <option value="">Selecciona</option>
                    <option>Preescolar / Kinder</option>
                    <option>1° - 2° grado</option>
                    <option>3° - 5° grado</option>
                    <option>6° - 8° grado</option>
                    <option>9° - 10° grado</option>
                    <option>11° - 12° grado</option>
                    <option>Universidad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#09243a] mb-1">
                  Objetivo pedagógico
                </label>
                <textarea
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="¿Qué deben aprender o consolidar jugando?"
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-[#e7e4dc] text-xs focus:border-[#d7ad32] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Mecánicas */}
          <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5">
            <h3 className="text-[#09243a] font-extrabold text-sm mb-1">
              3. Mecánicas lúdicas de participación
            </h3>
            <p className="text-xs text-[#68747d] mb-3">
              Selecciona las que desees activar.
            </p>
            <div className="flex flex-wrap gap-2">
              {GAM_MECHANICS.map(([code, label]) => {
                const active = selectedMechanics.has(code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleSetItem(setSelectedMechanics, code)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#09243a] text-white border-[#09243a]'
                        : 'bg-white text-[#24313b] border-[#e7e4dc] hover:border-[#d7ad32]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Estilo y Accesibilidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5">
              <h3 className="text-[#09243a] font-extrabold text-sm mb-2">
                4. Estilo visual
              </h3>
              <div className="flex flex-wrap gap-2">
                {GAM_VISUALS.map(([code, label]) => {
                  const active = selectedVisuals.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleSetItem(setSelectedVisuals, code)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#09243a] text-white border-[#09243a]'
                          : 'bg-white text-[#24313b] border-[#e7e4dc] hover:border-[#d7ad32]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5">
              <h3 className="text-[#09243a] font-extrabold text-sm mb-2">
                5. Inclusión y accesibilidad
              </h3>
              <div className="flex flex-wrap gap-2">
                {GAM_ACCESSIBILITY.map(([code, label]) => {
                  const active = selectedAccessibility.has(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleSetItem(setSelectedAccessibility, code)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-[#09243a] text-white border-[#09243a]'
                          : 'bg-white text-[#24313b] border-[#e7e4dc] hover:border-[#d7ad32]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5">
            <label className="block text-[11px] font-black uppercase text-[#09243a] mb-1">
              Detalles adicionales
            </label>
            <textarea
              value={detallesAdicionales}
              onChange={(e) => setDetallesAdicionales(e.target.value)}
              placeholder="Ej. duración de 20 minutos, juego en equipos de 4, con sistema de comodines..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-[#e7e4dc] text-xs focus:border-[#d7ad32] outline-none resize-none"
            />
          </div>

          {/* Aviso contextual si se usó tema automático o advertencia */}
          {temaNotice && (
            <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-950 font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{temaNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setTemaNotice(null)}
                className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md font-black hover:bg-amber-300 transition-colors cursor-pointer shrink-0"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* Action to generate */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#68747d] hover:bg-[#e7e4dc] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-6 py-3 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-xs sm:text-sm font-extrabold shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              <Gamepad2 className={`w-4 h-4 text-[#d7ad32] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generando experiencia...' : 'Generar experiencia gamificada'}</span>
            </button>
          </div>

          {/* Result Prompt */}
          {generatedPrompt && (
            <div id="gam-result-box" className="bg-[#09243a] rounded-2xl p-5 text-white border border-[#09243a] shadow-xl mt-4 scroll-mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2 m-0">
                  <Sparkles className="w-4 h-4 text-[#d7ad32]" />
                  ✨ Tu experiencia está lista
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-black rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '¡Copiado!' : 'Copiar prompt'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-black rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-300" />
                    {saved ? 'Guardado' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-3 py-1.5 bg-[#133b5c] hover:bg-[#184870] text-[#f8edc5] border border-[#d7ad32]/40 font-black rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Abrir Kit Docente: Ficha de aula para fotocopiar, solucionario y rúbrica formativa"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#d7ad32]" />
                    Kit Docente (Ficha + Rúbrica)
                  </button>
                  {(modo === 'interactivo' || modo === 'hibrido') && (
                    <button
                      type="button"
                      onClick={() => {
                        const activeGameTheme = Array.from(selectedVisuals).find(c => 
                          ['/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade'].includes(c)
                        );
                        let cleanTopic = tema.trim();
                        cleanTopic = cleanTopic.replace(/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade)?)/gi, '').trim();
                        onOpenSandbox(cleanTopic || tema, activeGameTheme || Array.from(selectedExperiences)[0] || '/quiz', grado, materia);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Probar simulador interactivo"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Probar en vivo
                    </button>
                  )}
                </div>
              </div>

              <textarea
                readOnly
                value={generatedPrompt}
                rows={9}
                className="w-full bg-[#061a2b] text-[#edf5f8] p-3.5 rounded-xl border border-white/10 font-mono text-xs leading-relaxed outline-none"
              />
            </div>
          )}

        </div>

      </div>

      {/* Kit Docente de Aula: Ficha Imprimible, Solucionario y Rúbrica Formativa */}
      <PrintableResourceModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        data={{
          tipo: 'Experiencia gamificada',
          modo: modo,
          tema: tema || 'Sumas y Restas',
          materia: materia,
          grado: grado,
          objetivo: objetivo,
          adicional: detallesAdicionales,
          selectedCodes: Array.from(selectedExperiences)
        }}
        promptText={generatedPrompt}
      />
    </div>
  );
};
