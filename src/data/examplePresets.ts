/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResourceFormData } from '../types';

export interface ExamplePreset {
  id: string;
  badge: string;
  title: string;
  level: string;
  color: string;
  data: ResourceFormData;
}

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: 'infografia-ecosistemas',
    badge: '📊 Infografía · Estilo Acuarela',
    title: 'Infografía: Ecosistemas Marinos y Cadenas Tróficas',
    level: 'Primaria',
    color: 'from-sky-50 to-blue-50 border-sky-200 text-sky-950',
    data: {
      tipo: 'Infografía',
      modo: 'hibrido',
      tema: 'Cadenas tróficas marinas y niveles ecológicos de los océanos',
      materia: 'Ciencias',
      grado: '3° - 5° grado',
      objetivo: 'Sintetizar visualmente la transferencia de energía desde el fitoplancton hasta los grandes depredadores con métricas clave, datos curiosos y conectores de causa-efecto.',
      adicional: 'Diseño en formato póster vertical con paleta de acuarela marina suave, bloques de datos destacados y mini comprobador de retención al final.',
      selectedCodes: ['/infographic', '/watercolor', '/highcontrast', 'I-02']
    }
  },
  {
    id: 'mapamental-democracia',
    badge: '🧠 Mapa Mental · Estilo Doodle',
    title: 'Mapa Mental: Ramas del Poder Público y la Constitución',
    level: 'Secundaria',
    color: 'from-amber-50 to-orange-50 border-amber-200 text-amber-950',
    data: {
      tipo: 'Mapa mental',
      modo: 'interactivo',
      tema: 'Estructura del Estado, división de poderes y derechos fundamentales',
      materia: 'Estudios Sociales',
      grado: '6° - 8° grado',
      objetivo: 'Estructurar un mapa mental radial con 4 ramas principales (Ejecutivo, Legislativo, Judicial y Órganos de Control) con nodos interactivos clicables y desafío de conexiones.',
      adicional: 'Estilo gráfico tipo doodle de cuaderno escolar con tonos pastel, ramas desplegables y puntuación formativa al completar los nodos.',
      selectedCodes: ['/mindmap', '/doodle', '/pastel', 'D-02']
    }
  },
  {
    id: 'folleto-salud',
    badge: '📰 Folleto Tríptico · Flat & Papercraft',
    title: 'Folleto Plegable: Decálogo de Hábitos Saludables',
    level: 'Secundaria',
    color: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950',
    data: {
      tipo: 'Folleto plegable (Tríptico / Guía)',
      modo: 'imprimible',
      tema: 'Alimentación balanceada, actividad física y bienestar digital',
      materia: 'Educación Física',
      grado: '6° - 8° grado',
      objetivo: 'Maquetar un folleto tríptico de 3 paneles (6 caras) con portada motivadora, infografía compacta, decálogo práctico y lista de chequeo de hábitos diarios.',
      adicional: 'Estética limpia de capas papercraft y flat design, líneas de doblado señalizadas y espacio para compromisos personales del estudiante.',
      selectedCodes: ['/booklet', '/flatdesign', '/papercraft', 'D-01', 'R-01']
    }
  },
  {
    id: 'match-agua',
    badge: '🔗 Match Interactivo · Cartoon',
    title: 'Juego de Match: Ciclo del Agua y Fenómenos Terrestres',
    level: 'Primaria',
    color: 'from-cyan-50 to-blue-50 border-cyan-200 text-cyan-950',
    data: {
      tipo: 'Juego de emparejamiento interactivo (Match)',
      modo: 'interactivo',
      tema: 'Fases del ciclo del agua y fenómenos meteorológicos',
      materia: 'Ciencias',
      grado: '3° - 5° grado',
      objetivo: 'Emparejar cada concepto (Evaporación, Condensación, Precipitación, Infiltración) con su fenómeno real en el planeta con conexiones visuales, comprobación en vivo y puntuación.',
      adicional: 'Mecánica interactiva de dos columnas con estilo ilustrado cartoon, marcador dinámico de puntos y botón de barajar.',
      selectedCodes: ['/matching', '/scoreboard', '/cartoon', 'D-02', 'E-03']
    }
  },
  {
    id: 'memory-historia',
    badge: '🃏 Memory Cards · Pixel Art',
    title: 'Memorama: Civilizaciones Antiguas y sus Grandes Invenciones',
    level: 'Secundaria',
    color: 'from-purple-50 to-indigo-50 border-purple-200 text-purple-950',
    data: {
      tipo: 'Juego de memoria interactivo (Memory Cards)',
      modo: 'interactivo',
      tema: 'Grandes civilizaciones de la antigüedad e hitos de la humanidad',
      materia: 'Estudios Sociales',
      grado: '6° - 8° grado',
      objetivo: 'Descubrir y emparejar parejas de cartas volteables asociando cada civilización (Egipto, Mesopotamia, Grecia, Roma) con sus grandes aportes culturales y tecnológicos.',
      adicional: 'Cuadrícula interactiva con efecto de giro 3D de cartas con estética pixel art retro, contador de movimientos y sistema de niveles.',
      selectedCodes: ['/memory', '/pixelart', '/levelup', 'D-03', 'E-02']
    }
  },
  {
    id: 'escape-pitagoras',
    badge: '🔐 Escape Room · Pizarra y Tiza',
    title: 'Escape Room: El Enigma del Teorema de Pitágoras',
    level: 'Secundaria',
    color: 'from-stone-50 to-slate-100 border-stone-300 text-stone-900',
    data: {
      tipo: 'Escape Room digital interactivo con candados',
      modo: 'interactivo',
      tema: 'Aplicación del Teorema de Pitágoras para descifrar enigmas geométricos',
      materia: 'Matemáticas',
      grado: '9° - 10° grado',
      objetivo: 'Superar 3 salas temáticas resolviendo problemas prácticos de distancias y triángulos rectángulos para descifrar las claves numéricas de los candados.',
      adicional: 'Estética de pizarra escolar con tiza de alto contraste, candados interactivos para ingresar códigos y pistas graduadas.',
      selectedCodes: ['/escape', '/chalkboard', '/hints', 'D-02', 'I-01']
    }
  },
  {
    id: 'dua-adaptacion-matematicas',
    badge: '🧩 Ficha DUA · Inclusión & Diversidad',
    title: 'Ficha Multinivel DUA: Sumas, Restas y Retos Adaptados',
    level: 'Primaria / Inclusión',
    color: 'from-amber-50 to-emerald-50 border-emerald-300 text-emerald-950',
    data: {
      tipo: 'Hoja de trabajo didáctica adaptada (DUA)',
      modo: 'hibrido',
      tema: 'Sumas y Restas cotidianas con apoyos visuales y multinivel',
      materia: 'Matemáticas',
      grado: '1° - 3° Primaria',
      objetivo: 'Garantizar el dominio de la suma y resta mediante múltiples formas de representación (recta numérica, apoyos manipulativos) y niveles progresivos (básico, intermedio y enriquecimiento).',
      adicional: 'Incluir casillas de verificación para TDAH, recta numérica visible para discalculia, opciones de respuesta gráfica y preguntas de pensamiento divergente.',
      selectedCodes: ['/dua', '/tdah', '/discalculia', '/altascapacidades', 'E-02', 'D-01']
    }
  }
];
