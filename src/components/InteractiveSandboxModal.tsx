/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Sparkles, 
  Code2, 
  Eye, 
  Copy, 
  Check,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  CheckSquare,
  HelpCircle,
  Play,
  Lock,
  Unlock,
  Key,
  RefreshCw,
  ArrowRight,
  Printer
} from 'lucide-react';
import { PrintableResourceModal } from './PrintableResourceModal';

interface InteractiveSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  tipo: string;
  grade?: string;
  subject?: string;
}

export const InteractiveSandboxModal: React.FC<InteractiveSandboxModalProps> = ({
  isOpen,
  onClose,
  topic,
  tipo,
  grade,
  subject
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  // General Score & Attempts
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSandboxPrintOpen, setIsSandboxPrintOpen] = useState<boolean>(false);

  // Modality checks
  const isMindMap = (tipo || '').toLowerCase().includes('mapa mental');
  const isFlashcards = (tipo || '').toLowerCase().includes('tarjetas') || (tipo || '').toLowerCase().includes('flashcard');
  const isRubric = (tipo || '').toLowerCase().includes('rúbrica') || (tipo || '').toLowerCase().includes('rubrica');
  const isChecklist = (tipo || '').toLowerCase().includes('lista') || (tipo || '').toLowerCase().includes('checklist');
  const isMatching = (tipo || '').toLowerCase().includes('emparejamiento') || (tipo || '').toLowerCase().includes('match') || (tipo || '').toLowerCase().includes('unir');
  const isMemory = (tipo || '').toLowerCase().includes('memoria') || (tipo || '').toLowerCase().includes('memory') || (tipo || '').toLowerCase().includes('memorama');
  const isEscapeRoom = (tipo || '').toLowerCase().includes('escape') || (tipo || '').toLowerCase().includes('candado');
  const isInfographic = (tipo || '').toLowerCase().includes('infografía') || (tipo || '').toLowerCase().includes('infografia');
  const isBooklet = (tipo || '').toLowerCase().includes('folleto') || (tipo || '').toLowerCase().includes('tríptico') || (tipo || '').toLowerCase().includes('triptico') || (tipo || '').toLowerCase().includes('booklet');
  const isWheel = (tipo || '').toLowerCase().includes('wheel') || 
                  (tipo || '').toLowerCase().includes('rueda') || 
                  (tipo || '').toLowerCase().includes('ruleta') ||
                  (topic || '').toLowerCase().includes('wheel') ||
                  (topic || '').toLowerCase().includes('rueda') ||
                  (topic || '').toLowerCase().includes('ruleta');
  const isComic = (tipo || '').toLowerCase().includes('comic') || 
                  (tipo || '').toLowerCase().includes('cómic') || 
                  (tipo || '').toLowerCase().includes('historieta') ||
                  (topic || '').toLowerCase().includes('comic') ||
                  (topic || '').toLowerCase().includes('historieta');
  const isDiagram = (tipo || '').toLowerCase().includes('diagrama') || 
                    (tipo || '').toLowerCase().includes('flujo') || 
                    (tipo || '').toLowerCase().includes('organizador') ||
                    (topic || '').toLowerCase().includes('diagrama');
  const isTimeline = (tipo || '').toLowerCase().includes('tiempo') || 
                     (tipo || '').toLowerCase().includes('timeline') || 
                     (tipo || '').toLowerCase().includes('cronolog') ||
                     (topic || '').toLowerCase().includes('timeline') ||
                     (topic || '').toLowerCase().includes('cronologia');
  const isCompare = (tipo || '').toLowerCase().includes('compare') || 
                    (tipo || '').toLowerCase().includes('comparativ') ||
                    (topic || '').toLowerCase().includes('compare') ||
                    (topic || '').toLowerCase().includes('comparativa');

  // GAMIFICATION & THEMED GAME ARENA (Mario Kart, Minecraft, Roblox, Lego, Pokémon, Arcade)
  const isMarioTheme = (tipo || '').toLowerCase().includes('mario') || 
                       (topic || '').toLowerCase().includes('mario') ||
                       (tipo || '').toLowerCase().includes('race') ||
                       (tipo || '').toLowerCase().includes('carrera') ||
                       (tipo || '').toLowerCase().includes('/mariokart');
  const isMinecraftTheme = (tipo || '').toLowerCase().includes('minecraft') || 
                           (topic || '').toLowerCase().includes('minecraft') ||
                           (tipo || '').toLowerCase().includes('/minecraft');
  const isRobloxTheme = (tipo || '').toLowerCase().includes('roblox') || 
                        (topic || '').toLowerCase().includes('roblox') ||
                        (tipo || '').toLowerCase().includes('/roblox');
  const isLegoTheme = (tipo || '').toLowerCase().includes('lego') || 
                      (topic || '').toLowerCase().includes('lego') ||
                      (tipo || '').toLowerCase().includes('/lego');
  const isPokemonTheme = (tipo || '').toLowerCase().includes('pokemon') || 
                         (tipo || '').toLowerCase().includes('pokémon') ||
                         (topic || '').toLowerCase().includes('pokemon') ||
                         (topic || '').toLowerCase().includes('pokémon') ||
                         (tipo || '').toLowerCase().includes('/pokemon');
  const isArcadeTheme = (tipo || '').toLowerCase().includes('arcade') || 
                        (topic || '').toLowerCase().includes('arcade') ||
                        (tipo || '').toLowerCase().includes('/arcade');

  const isGameArena = (tipo || '').toLowerCase().includes('juego') || 
                      (tipo || '').toLowerCase().includes('gamificad') || 
                      (tipo || '').toLowerCase().includes('race') || 
                      (tipo || '').toLowerCase().includes('carrera') ||
                      (topic || '').toLowerCase().includes('juego') ||
                      isMarioTheme || isMinecraftTheme || isRobloxTheme || isLegoTheme || isPokemonTheme || isArcadeTheme;

  const defaultTheme: 'mariokart' | 'minecraft' | 'roblox' | 'lego' | 'pokemon' | 'arcade' = 
    isMinecraftTheme ? 'minecraft' :
    isRobloxTheme ? 'roblox' :
    isLegoTheme ? 'lego' :
    isPokemonTheme ? 'pokemon' :
    isArcadeTheme ? 'arcade' : 'mariokart';

  const [activeGameTheme, setActiveGameTheme] = useState<'mariokart' | 'minecraft' | 'roblox' | 'lego' | 'pokemon' | 'arcade'>(defaultTheme);
  const [questionStyle, setQuestionStyle] = useState<'pure' | 'themed'>('pure');

  // WORLD PROGRESSION / COMPLEXITY LEVEL (1: Básico, 2: Intermedio, 3: Avanzado)
  const [activeWorld, setActiveWorld] = useState<1 | 2 | 3>(1);

  // ACTIVITY TYPE SELECTOR (Arena, Memoria, Secuencias, Sopa de Letras)
  const [activeGamActivity, setActiveGamActivity] = useState<'arena' | 'memory' | 'sequence' | 'wordsearch'>('arena');
  const [duaSupportActive, setDuaSupportActive] = useState<boolean>(false);

  // GAME ARENA STATE
  const [gameStep, setGameStep] = useState<number>(0);
  const [gameAnswerSelected, setGameAnswerSelected] = useState<number | null>(null);
  const [gameFeedback, setGameFeedback] = useState<{ ok: boolean; title: string; desc: string; perk: string } | null>(null);

  // SEQUENCE ACTIVITY STATE
  const [sequenceStep, setSequenceStep] = useState<number>(0);
  const [sequenceAnswerSelected, setSequenceAnswerSelected] = useState<number | null>(null);
  const [sequenceFeedback, setSequenceFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // WORD SEARCH ACTIVITY STATE
  const [wordSearchSelectedCells, setWordSearchSelectedCells] = useState<Set<string>>(new Set());
  const [wordSearchFoundWords, setWordSearchFoundWords] = useState<Set<string>>(new Set());
  const [wordSearchStatus, setWordSearchStatus] = useState<string | null>(null);

  // MATH MEMORY CARDS STATE (Tailored to activeWorld)
  const [mathMemoryFlipped, setMathMemoryFlipped] = useState<number[]>([]);
  const [mathMemorySolved, setMathMemorySolved] = useState<Set<string>>(new Set());
  const [mathMemoryMoves, setMathMemoryMoves] = useState<number>(0);

  // Mario Kart specifics
  const [kartSpeed, setKartSpeed] = useState<number>(55);
  const [kartCoins, setKartCoins] = useState<number>(3);
  const [kartLap, setKartLap] = useState<number>(1);
  const [kartEvent, setKartEvent] = useState<'normal' | 'turbo' | 'banana'>('normal');

  // Minecraft specifics
  const [mcHearts, setMcHearts] = useState<number>(5);
  const [mcCraftedItem, setMcCraftedItem] = useState<string>('Pico de Madera');
  const [mcGridCount, setMcGridCount] = useState<number>(1);

  // Roblox specifics
  const [robloxStage, setRobloxStage] = useState<number>(1);
  const [robloxFalls, setRobloxFalls] = useState<number>(0);

  // Lego specifics
  const [legoBricksCount, setLegoBricksCount] = useState<number>(2);

  // Pokemon specifics
  const [pokeEnemyHp, setPokeEnemyHp] = useState<number>(100);
  const [pokeTurnMsg, setPokeTurnMsg] = useState<string>('¡El rival "Duda Conceptual" Nv.40 te desafía a un duelo de aprendizaje!');

  // Arcade specifics
  const [arcadeScore, setArcadeScore] = useState<number>(2400);
  const [arcadeLives, setArcadeLives] = useState<number>(3);

  // TIMELINE STATE
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0);
  const [timelineQuizAnswer, setTimelineQuizAnswer] = useState<number | null>(null);

  // COMPARE STATE
  const [compareActiveTab, setCompareActiveTab] = useState<'both' | 'A' | 'B'>('both');
  const [compareRevealedKey, setCompareRevealedKey] = useState<boolean>(false);

  // COMIC STATE
  const [activeComicPanel, setActiveComicPanel] = useState<number>(0);
  const [comicQuizAnswer, setComicQuizAnswer] = useState<number | null>(null);
  const [comicSoundPlayed, setComicSoundPlayed] = useState<string | null>(null);

  // DIAGRAM STATE
  const [activeDiagramNode, setActiveDiagramNode] = useState<number>(0);
  const [diagramDecision, setDiagramDecision] = useState<'yes' | 'no' | null>(null);
  const [diagramCompleted, setDiagramCompleted] = useState<boolean>(false);

  // MIND MAP EXPLORATION STATE
  const [exploredNodes, setExploredNodes] = useState<Set<string>>(new Set());
  const [activeDetailNode, setActiveDetailNode] = useState<{ title: string; desc: string; icon: string; branch: string; color: string } | null>(null);

  // WHEEL GAME STATE (Ruleta Espacial Cartoon)
  const wheelSectors = [
    { id: 0, label: '☀️ El Sol', color: '#f59e0b', textColor: '#78350f', question: '¿Cuál es el gas más abundante que alimenta la energía nuclear del Sol?', options: ['Hidrógeno (H)', 'Oxígeno (O)', 'Hierro (Fe)'], correct: 0, funFact: '¡El Sol contiene más del 99.8% de toda la masa del Sistema Solar!' },
    { id: 1, label: '🪐 Saturno', color: '#6366f1', textColor: '#ffffff', question: '¿De qué están formados principalmente los majestuosos anillos de Saturno?', options: ['Lava volcánica', 'Partículas de hielo de agua y roca', 'Polvo magnético'], correct: 1, funFact: '¡Los anillos tienen miles de km de ancho pero solo unos 10 metros de grosor medio!' },
    { id: 2, label: '🔴 Marte', color: '#ef4444', textColor: '#ffffff', question: '¿Por qué Marte tiene su característico color rojizo en su superficie?', options: ['Por óxido de hierro (herrumbre mineral)', 'Por magma activo constante', 'Por reflejos solares'], correct: 0, funFact: '¡Marte alberga el Monte Olimpo, el volcán más colosal de todo el Sistema Solar!' },
    { id: 3, label: '🌍 La Tierra', color: '#10b981', textColor: '#ffffff', question: '¿Qué escudo invisible protege a la Tierra de los vientos solares y la radiación cósmica?', options: ['La capa de hielo polar', 'La magnetosfera (campo magnético)', 'La gravedad lunar'], correct: 1, funFact: '¡Es el único planeta conocido con agua líquida superficial y vida activa!' },
    { id: 4, label: '🌪️ Júpiter', color: '#d97706', textColor: '#ffffff', question: '¿Qué es en realidad la legendaria "Gran Mancha Roja" de Júpiter?', options: ['Un cráter de impacto', 'Una tormenta anticiclónica colosal', 'Un océano de metano'], correct: 1, funFact: '¡Es tan inmensa que la Tierra entera cabría con holgura dentro de ella!' },
    { id: 5, label: '☄️ Asteroides', color: '#8b5cf6', textColor: '#ffffff', question: '¿Entre qué dos planetas orbita el Cinturón Principal de Asteroides?', options: ['Entre Mercurio y Venus', 'Entre Marte y Júpiter', 'Entre Saturno y Urano'], correct: 1, funFact: '¡El objeto más grande del cinturón es Ceres, clasificado como planeta enano!' },
    { id: 6, label: '❄️ Neptuno', color: '#0ea5e9', textColor: '#ffffff', question: '¿Qué fenómeno meteorológico extremo caracteriza la atmósfera de Neptuno?', options: ['Los vientos más veloces del sistema solar (>2.000 km/h)', 'Lluvia constante de ácido', 'Atmósfera sin vientos'], correct: 0, funFact: '¡Tarda casi 165 años terrestres en dar una sola vuelta completa alrededor del Sol!' },
    { id: 7, label: '🚀 Desafío Venus', color: '#ec4899', textColor: '#ffffff', question: '¿Cuál es el planeta con la superficie más caliente debido a su potente efecto invernadero?', options: ['Mercurio', 'Venus', 'Marte'], correct: 1, funFact: '¡Venus alcanza más de 460 °C, más caliente que Mercurio a pesar de estar más lejos!' }
  ];
  const [wheelRotation, setWheelRotation] = useState<number>(270);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedWheelSector, setSelectedWheelSector] = useState<typeof wheelSectors[0] | null>(null);
  const [wheelAnswerSelected, setWheelAnswerSelected] = useState<number | null>(null);
  const [wheelAnswerFeedback, setWheelAnswerFeedback] = useState<{ ok: boolean; msg: string; funFact: string } | null>(null);
  const [spinsCount, setSpinsCount] = useState<number>(0);

  // INFOGRAPHIC STATE
  const [activeTrophicLevel, setActiveTrophicLevel] = useState<number>(0);
  const [infoQuizAnswer, setInfoQuizAnswer] = useState<string | null>(null);
  const [infoQuizResult, setInfoQuizResult] = useState<boolean | null>(null);

  // BOOKLET STATE
  const [activeBookletPanel, setActiveBookletPanel] = useState<number>(0);
  const [bookletChecks, setBookletChecks] = useState<Set<number>>(new Set());

  // MATCHING GAME STATE
  const matchLeftItems = [
    { id: 'm1', concept: 'Evaporación', matchKey: 'k1' },
    { id: 'm2', concept: 'Condensación', matchKey: 'k2' },
    { id: 'm3', concept: 'Precipitación', matchKey: 'k3' },
    { id: 'm4', concept: 'Infiltración', matchKey: 'k4' }
  ];
  const matchRightItems = [
    { id: 'r2', matchKey: 'k2', desc: 'El vapor de agua sube, se enfría y forma las nubes en la atmósfera.' },
    { id: 'r1', matchKey: 'k1', desc: 'El agua líquida de ríos y mares se calienta con el sol y se convierte en vapor.' },
    { id: 'r4', matchKey: 'k4', desc: 'El agua caída penetra en el suelo alimentando los acuíferos subterráneos.' },
    { id: 'r3', matchKey: 'k3', desc: 'Las gotas de las nubes se condensan y caen como lluvia, nieve o granizo.' }
  ];
  const [selectedMatchLeft, setSelectedMatchLeft] = useState<string | null>(null);
  const [matchedKeys, setMatchedKeys] = useState<Set<string>>(new Set());
  const [matchStatusMsg, setMatchStatusMsg] = useState<{ ok: boolean; msg: string } | null>(null);

  // MEMORY GAME STATE
  const initialMemoryCards = [
    { id: 1, pairKey: 'egipto', label: '🏺 Egipto', desc: 'Jeroglíficos & Pirámides' },
    { id: 2, pairKey: 'egipto', label: '📜 Jeroglíficos', desc: 'Escritura monumental sagrada' },
    { id: 3, pairKey: 'mesopotamia', label: '🌾 Mesopotamia', desc: 'Tierra entre ríos y cuna urbana' },
    { id: 4, pairKey: 'mesopotamia', label: '☸️ La Rueda', desc: 'Revolución en transporte y comercio' },
    { id: 5, pairKey: 'grecia', label: '🏛️ Grecia', desc: 'Cuna de la Democracia y Filosofía' },
    { id: 6, pairKey: 'grecia', label: '🗳️ Democracia', desc: 'Asamblea de ciudadanos en Atenas' },
    { id: 7, pairKey: 'roma', label: '🛡️ Roma', desc: 'Derecho, ingeniería y grandes calzadas' },
    { id: 8, pairKey: 'roma', label: '💧 Acueductos', desc: 'Ingeniería para abastecer agua limpia' },
  ];
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [solvedPairs, setSolvedPairs] = useState<Set<string>>(new Set());
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  // ESCAPE ROOM STATE
  const [escapeCurrentRoom, setEscapeCurrentRoom] = useState<number>(0);
  const [escapeInputCode, setEscapeInputCode] = useState<string>('');
  const [escapeHintVisible, setEscapeHintVisible] = useState<boolean>(false);
  const [escapeUnlockedRooms, setEscapeUnlockedRooms] = useState<Set<number>>(new Set([0]));
  const [escapeError, setEscapeError] = useState<string | null>(null);
  const escapeChallenges = [
    {
      room: 1,
      name: 'Sala 1: El Faro y la Sombra',
      lore: 'Te encuentras en la costa. Un antiguo faro proyecta una sombra de 12 metros en la arena. La distancia medida con cuerda desde la linterna superior hasta el final de la sombra es exactamente de 15 metros.',
      question: '¿Cuál es la altura exacta del faro en metros para abrir el primer candado? (Pista: usa a² + b² = c²)',
      code: '9',
      hint: 'Aplica el teorema: altura² + 12² = 15²  ➔  altura² + 144 = 225  ➔  altura² = 81. La raíz cuadrada de 81 es la clave.'
    },
    {
      room: 2,
      name: 'Sala 2: El Mapa de la Isla Pirata',
      lore: 'Has ingresado a la cueva secreta. El mapa indica que debes caminar 6 pasos hacia el Este y luego 8 pasos hacia el Norte en ángulo recto para hallar el cofre.',
      question: '¿Cuántos pasos mide la distancia en línea recta directa (la hipotenusa) desde el origen hasta el cofre?',
      code: '10',
      hint: 'Calcula: distancia² = 6² + 8² = 36 + 64 = 100. La raíz cuadrada de 100 es la clave numérica.'
    },
    {
      room: 3,
      name: 'Sala 3: La Puerta del Tesoro Matemático',
      lore: 'Frente a ti está la gran bóveda sellada. Tiene un triángulo grabado con catetos de 3 cm y 4 cm. La clave final es la hipotenusa de ese triángulo multiplicada por 5.',
      question: 'Introduce el número secreto final para abrir la bóveda y completar la misión.',
      code: '25',
      hint: 'Catetos 3 y 4 dan una hipotenusa de √(9 + 16) = √25 = 5. Multiplica 5 × 5 para obtener el código.'
    }
  ];

  // Mind map state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [challengeResolved, setChallengeResolved] = useState<boolean>(false);
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    'branch-1': true,
    'branch-2': true,
    'branch-3': true,
    'branch-4': true,
  });

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

  // Rubric state
  const [rubricScores, setRubricScores] = useState<Record<number, number>>({ 0: 3, 1: 3, 2: 2 });

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set([0]));

  // Generic Quiz / Activity state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [activitySubmitted, setActivitySubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  let cleanInputTopic = topic.trim() || 'Sumas y Restas';
  // Strip game setting mentions if typed inside the topic field
  cleanInputTopic = cleanInputTopic.replace(/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade)?)/gi, '').trim();

  const rawTopic = cleanInputTopic || 'Sumas y Restas';
  const isSettingOnly = rawTopic.toLowerCase() === 'crafteo minecraft' || 
                        rawTopic.toLowerCase() === 'circuito mario kart' || 
                        rawTopic.toLowerCase() === 'obby roblox' || 
                        rawTopic.toLowerCase() === 'bloques lego' || 
                        rawTopic.toLowerCase() === 'duelo pokémon' || 
                        rawTopic.toLowerCase() === 'minecraft' ||
                        rawTopic.toLowerCase() === 'mario kart' ||
                        rawTopic === '';

  const academicTopic = isSettingOnly ? 'Sumas y Restas (1° y 2° Grado)' : rawTopic;
  const currentTopic = academicTopic;

  const topicCombined = (academicTopic + ' ' + (subject || '') + ' ' + (tipo || '')).toLowerCase();
  const isMathTopic = topicCombined.includes('suma') || 
                      topicCombined.includes('resta') || 
                      topicCombined.includes('matemática') || 
                      topicCombined.includes('matematica') || 
                      topicCombined.includes('número') || 
                      topicCombined.includes('numero') || 
                      topicCombined.includes('cálculo') || 
                      topicCombined.includes('calculo') || 
                      topicCombined.includes('operacion') || 
                      topicCombined.includes('operación') || 
                      topicCombined.includes('fraccion') || 
                      topicCombined.includes('multiplic') || 
                      (subject || '').toLowerCase().includes('mate');

  // Mind map dynamic data based strictly on the user's topic (6 organic branches)
  const mindMapData = {
    center: currentTopic.toUpperCase(),
    author: subject || 'Metodología L.I.D.E.R.',
    subtitle: 'Organizador radial interactivo con 6 ejes pedagógicos y conceptos clave.',
    quote: `“El aprendizaje significativo conecta las ideas clave de ${currentTopic} con el pensamiento crítico y la acción práctica.”`,
    branches: [
      {
        id: 'branch-1',
        title: 'Fundamentos y Origen',
        icon: '🌱',
        color: 'from-emerald-500 to-emerald-600',
        borderColor: 'border-emerald-300',
        bgColor: 'bg-emerald-50/70',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        subnodes: [
          { name: `Definición Esencial`, desc: `Concepto rector, principios clave y marco general de "${currentTopic}".` },
          { name: 'Antecedentes y Contexto', desc: 'Bases teóricas, origen histórico y relevancia formativa de este conocimiento.' }
        ]
      },
      {
        id: 'branch-2',
        title: 'Estructura y Componentes',
        icon: '🔬',
        color: 'from-sky-500 to-blue-600',
        borderColor: 'border-sky-300',
        bgColor: 'bg-sky-50/70',
        badgeBg: 'bg-sky-100 text-sky-800',
        subnodes: [
          { name: 'Elementos Primarios', desc: 'Factores modulares, categorías y variables que configuran el núcleo del tema.' },
          { name: 'Relaciones e Interacciones', desc: 'Vínculos de causa, efecto y reciprocidad entre cada uno de sus elementos.' }
        ]
      },
      {
        id: 'branch-3',
        title: 'Procesos y Funcionamiento',
        icon: '⚙️',
        color: 'from-amber-500 to-orange-600',
        borderColor: 'border-amber-300',
        bgColor: 'bg-amber-50/70',
        badgeBg: 'bg-amber-100 text-amber-800',
        subnodes: [
          { name: 'Secuencia Operativa Paso a Paso', desc: 'Fases metodológicas ordenadas para comprender su desarrollo integral.' },
          { name: 'Reglas y Criterios Rectores', desc: 'Normas y condiciones necesarias para su correcta ejecución y funcionamiento.' }
        ]
      },
      {
        id: 'branch-4',
        title: 'Aplicación en la Realidad',
        icon: '🌍',
        color: 'from-purple-500 to-violet-600',
        borderColor: 'border-purple-300',
        bgColor: 'bg-purple-50/70',
        badgeBg: 'bg-purple-100 text-purple-800',
        subnodes: [
          { name: 'Casos y Situaciones Cotidianas', desc: 'Escenarios reales y problemas del contexto donde se evidencia el fenómeno.' },
          { name: 'Estrategias de Resolución', desc: 'Herramientas prácticas para tomar decisiones fundamentadas y superar retos.' }
        ]
      },
      {
        id: 'branch-5',
        title: 'Análisis Crítico y Evaluación',
        icon: '📊',
        color: 'from-rose-500 to-pink-600',
        borderColor: 'border-rose-300',
        bgColor: 'bg-rose-50/70',
        badgeBg: 'bg-rose-100 text-rose-800',
        subnodes: [
          { name: 'Criterios de Calidad y Verificación', desc: 'Fact-checking, evidencias contrastadas y juicio crítico metodológico.' },
          { name: 'Impacto Social y Ética', desc: 'Reflexión metacognitiva sobre las consecuencias y responsabilidad en su uso.' }
        ]
      },
      {
        id: 'branch-6',
        title: 'Innovación y Transferencia',
        icon: '🚀',
        color: 'from-teal-500 to-emerald-600',
        borderColor: 'border-teal-300',
        bgColor: 'bg-teal-50/70',
        badgeBg: 'bg-teal-100 text-teal-800',
        subnodes: [
          { name: 'Nuevas Tendencias y Futuro', desc: 'Enfoques contemporáneos, avances recientes y prospectiva transformadora.' },
          { name: 'Creación de Nuevas Soluciones', desc: 'Diseño de propuestas originales que aporten valor a la comunidad educativa.' }
        ]
      }
    ],
    challenges: [
      {
        text: `¿En qué rama ubicarías la "Definición rectora y los principios esenciales de ${currentTopic}"?`,
        targetBranchId: 'branch-1',
        explanation: '¡Correcto! Corresponde a la rama de Fundamentos y Origen.'
      },
      {
        text: `¿A qué rama pertenece "La resolución de problemas cotidianos y casos prácticos de ${currentTopic}"?`,
        targetBranchId: 'branch-4',
        explanation: '¡Excelente! Pertenece a la rama de Aplicación en la Realidad.'
      },
      {
        text: '¿Dónde clasificarías "El juicio crítico, la verificación de fuentes y el impacto social"?',
        targetBranchId: 'branch-5',
        explanation: '¡Exacto! Corresponde a Análisis Crítico y Evaluación.'
      }
    ]
  };

  // Flashcards mock data
  const flashcardsData = [
    { q: `¿Qué define al concepto central de ${currentTopic}?`, a: 'Es la estructura que organiza los cuerpos celestes o principios formativos bajo una relación de fuerzas y leyes físicas compartidas.' },
    { q: '¿Cuál es la diferencia fundamental entre los planetas rocosos y gaseosos?', a: 'Los rocosos son más pequeños y densos con superficie sólida; los gaseosos son masivos y compuestos predominantemente de hidrógeno y helio.' },
    { q: '¿Qué papel juega la gravedad en esta dinámica?', a: 'Mantiene las órbitas elípticas estables e impide que los cuerpos salgan despedidos al espacio exterior.' }
  ];

  // Rubric mock data
  const rubricData = [
    { criterion: 'Comprensión conceptual del tema', levels: ['1 pt: Nociones vagas', '2 pts: Identifica elementos básicos', '3 pts: Explica relaciones correctas', '4 pts: Domina y articula el tema con rigor'] },
    { criterion: 'Análisis de causas y efectos', levels: ['1 pt: Descriptivo', '2 pts: Relaciona hechos aislados', '3 pts: Explica causas de fondo', '4 pts: Hipotetiza y fundamenta con solidez'] },
    { criterion: 'Claridad en la comunicación y síntesis', levels: ['1 pt: Confuso', '2 pts: Parcialmente claro', '3 pts: Estructurado y ordenado', '4 pts: Impecable jerarquía y síntesis visual'] }
  ];

  // Mind map actions
  const handleBranchClick = (branchId: string) => {
    if (!challengeResolved && activeChallengeIndex < mindMapData.challenges.length) {
      const target = mindMapData.challenges[activeChallengeIndex].targetBranchId;
      if (branchId === target) {
        setScore(prev => prev + 10);
        setFeedback({
          type: 'success',
          text: `✅ ${mindMapData.challenges[activeChallengeIndex].explanation}`
        });
        setChallengeResolved(true);
      } else {
        setFeedback({
          type: 'error',
          text: '❌ Rama incorrecta. Observa las características del concepto y vuelve a intentarlo en el mapa.'
        });
      }
    }
  };

  const nextChallenge = () => {
    if (activeChallengeIndex + 1 < mindMapData.challenges.length) {
      setActiveChallengeIndex(prev => prev + 1);
      setChallengeResolved(false);
      setFeedback(null);
    } else {
      setFeedback({
        type: 'success',
        text: `🎉 ¡Felicitaciones! Has completado con éxito todos los desafíos del mapa mental de "${currentTopic}".`
      });
    }
  };

  const resetMindMap = () => {
    setScore(0);
    setActiveChallengeIndex(0);
    setChallengeResolved(false);
    setFeedback(null);
    setSelectedNode(null);
    setExpandedBranches({
      'branch-1': true,
      'branch-2': true,
      'branch-3': true,
      'branch-4': true,
    });
  };

  const toggleBranchExpand = (bId: string) => {
    setExpandedBranches(prev => ({ ...prev, [bId]: !prev[bId] }));
  };

  // Game Arena Challenges data contextualized strictly to the academic topic & game mechanics
  // Game Arena Challenges data contextualized strictly to the academic topic, activeWorld & game mechanics
  const getGameChallenges = () => {
    if (isMathTopic) {
      // Default & requested mode: Pure school math with standard classroom items (zero videogame lore)
      if (questionStyle === 'pure') {
        if (activeWorld === 1) {
          return [
            {
              stage: 'Mundo 1 · Básico: Suma con Frutas',
              question: '➕ En una canasta hay 5 manzanas rojas y colocas 3 manzanas más. ¿Cuántas manzanas hay en total? (5 + 3 = ?)',
              options: [
                { text: '8 manzanas', correct: true, hint: '¡Correcto! 5 + 3 = 8 manzanas en total.' },
                { text: '7 manzanas', correct: false, hint: 'Cuenta de nuevo: después de 5 sumamos tres más: 6, 7, 8.' },
                { text: '12 manzanas', correct: false, hint: 'Atención: estamos sumando 5 + 3, no multiplicando.' }
              ]
            },
            {
              stage: 'Mundo 1 · Básico: Resta Escolar',
              question: '➖ Tienes 9 lápices de colores en tu estuche y prestas 4 lápices a tus compañeros. ¿Cuántos lápices te quedan? (9 - 4 = ?)',
              options: [
                { text: '5 lápices de colores', correct: true, hint: '¡Exacto! 9 - 4 = 5 lápices restantes en tu estuche.' },
                { text: '4 lápices de colores', correct: false, hint: 'Resta paso a paso: a 9 le quitas 4 y te quedan 5.' },
                { text: '13 lápices de colores', correct: false, hint: 'Cuidado: estás prestando lápices, por lo tanto restamos.' }
              ]
            },
            {
              stage: 'Mundo 1 · Básico: Suma de Estrellas',
              question: '⭐ En una prueba ganas 4 estrellas por la mañana y 4 estrellas por la tarde. ¿Cuántas estrellas acumulaste? (4 + 4 = ?)',
              options: [
                { text: '8 estrellas', correct: true, hint: '¡Brillante! 4 + 4 = 8 estrellas de logro.' },
                { text: '6 estrellas', correct: false, hint: 'Suma de dobles: 4 + 4 = 8.' },
                { text: '9 estrellas', correct: false, hint: 'Cuenta: 4 más 4 da 8.' }
              ]
            }
          ];
        } else if (activeWorld === 2) {
          return [
            {
              stage: 'Mundo 2 · Intermedio: Suma con Decenas',
              question: '🧮 En la biblioteca escolar hay 8 libros de cuentos y llegan 7 libros nuevos. ¿Cuántos libros hay en total? (8 + 7 = ?)',
              options: [
                { text: '15 libros', correct: true, hint: '¡Muy bien! 8 + 7 = 15 libros en la biblioteca.' },
                { text: '14 libros', correct: false, hint: 'Casi: 8 + 2 = 10, y más 5 son 15.' },
                { text: '16 libros', correct: false, hint: 'Verifica: 8 + 7 = 15.' }
              ]
            },
            {
              stage: 'Mundo 2 · Intermedio: Resta con Cambio',
              question: '➖ En una caja hay 16 borradores y se reparten 7 entre los alumnos. ¿Cuántos borradores sobran? (16 - 7 = ?)',
              options: [
                { text: '9 borradores', correct: true, hint: '¡Correcto! 16 - 7 = 9 borradores restantes.' },
                { text: '8 borradores', correct: false, hint: 'Calcula: 16 - 6 = 10; menos 1 = 9.' },
                { text: '11 borradores', correct: false, hint: 'Resta despacio: 16 - 7 = 9.' }
              ]
            },
            {
              stage: 'Mundo 2 · Intermedio: Operación Combinada',
              question: '🎯 Tienes 6 fichas, ganas 5 fichas más y luego entregas 3. ¿Cuántas fichas tienes al final? (6 + 5 - 3 = ?)',
              options: [
                { text: '8 fichas en total', correct: true, hint: '¡Excelente! 6 + 5 = 11, y 11 - 3 = 8 fichas.' },
                { text: '7 fichas en total', correct: false, hint: 'Primero 6 + 5 = 11; luego 11 - 3 = 8.' },
                { text: '9 fichas en total', correct: false, hint: 'Revisa: a 11 le restas 3 y quedan 8.' }
              ]
            }
          ];
        } else {
          return [
            {
              stage: 'Mundo 3 · Avanzado: Incógnita Desconocida',
              question: '❓ En un juego grupal necesitas 20 puntos para la meta. Tu equipo ya tiene 13 puntos. ¿Cuántos puntos faltan? (13 + ? = 20)',
              options: [
                { text: '7 puntos faltantes', correct: true, hint: '¡Maestría matemática! 13 + 7 = 20 puntos exactos.' },
                { text: '8 puntos faltantes', correct: false, hint: 'Comprueba: 13 + 8 = 21, te pasarías por 1.' },
                { text: '6 puntos faltantes', correct: false, hint: 'Calcula: 20 - 13 = 7.' }
              ]
            },
            {
              stage: 'Mundo 3 · Avanzado: Cálculo Mental Triple',
              question: '⚡ Resuelve el cálculo mental rápido: 9 + 8 - 5 = ?',
              options: [
                { text: '12', correct: true, hint: '¡Impresionante agilidad! 9 + 8 = 17; y 17 - 5 = 12.' },
                { text: '11', correct: false, hint: 'Paso a paso: 9 + 8 = 17; luego resta 5: queda 12.' },
                { text: '13', correct: false, hint: 'Calcula: 17 - 5 = 12.' }
              ]
            },
            {
              stage: 'Mundo 3 · Avanzado: Desafío de Bóveda Final',
              question: '🏆 En la gran bóveda hay 25 monedas de recompensa. Se entregan 10 en la primera ronda y 6 en la segunda. ¿Cuántas quedan guardadas? (25 - 10 - 6 = ?)',
              options: [
                { text: '9 monedas restantes', correct: true, hint: '¡Victoria Suprema del Saber! 25 - 10 = 15; y 15 - 6 = 9 monedas.' },
                { text: '8 monedas restantes', correct: false, hint: 'Calcula: 25 - 16 = 9.' },
                { text: '11 monedas restantes', correct: false, hint: 'Resta paso a paso: 15 - 6 = 9.' }
              ]
            }
          ];
        }
      }

      if (activeGameTheme === 'minecraft') {
        return [
          {
            stage: 'Nivel 1 · Suma en el Bosque de Bloques',
            question: '⛏️ Steve tiene 5 bloques de madera en su inventario y tala 3 bloques más de un árbol. ¿Cuántos bloques de madera tiene en total? (5 + 3 = ?)',
            options: [
              { text: '8 bloques de madera', correct: true, hint: '¡Correcto! 5 + 3 = 8. Recursos colocados en la mesa de crafteo.' },
              { text: '7 bloques de madera', correct: false, hint: 'Cuenta de nuevo: después de 5 sumamos tres más: 6, 7, 8.' },
              { text: '12 bloques de madera', correct: false, hint: 'Atención: estamos sumando 5 + 3, no multiplicando.' }
            ]
          },
          {
            stage: 'Nivel 2 · Resta en la Mina de Carbón',
            question: '⛏️ Tienes 9 trozos de carbón para iluminar la cueva y gastas 4 trozos en craftear antorchas. ¿Cuántos carbones te quedan? (9 - 4 = ?)',
            options: [
              { text: '5 trozos de carbón', correct: true, hint: '¡Exacto! 9 - 4 = 5. Te quedan 5 carbones guardados.' },
              { text: '4 trozos de carbón', correct: false, hint: 'Resta paso a paso: a 9 le quitas 4 y te quedan 5.' },
              { text: '13 trozos de carbón', correct: false, hint: 'Cuidado: estás gastando carbón, por lo tanto restamos.' }
            ]
          },
          {
            stage: 'Nivel 3 · Reto Combinado de Diamantes',
            question: '💎 Steve tiene 6 lingotes de hierro, encuentra 3 más en un cofre y gasta 2 en hacer una espada. ¿Cuántos lingotes tiene ahora? (6 + 3 - 2 = ?)',
            options: [
              { text: '7 lingotes de hierro', correct: true, hint: '¡Victoria total! 6 + 3 = 9; luego 9 - 2 = 7 lingotes de hierro.' },
              { text: '6 lingotes de hierro', correct: false, hint: 'Calcula primero 6 + 3 = 9, y luego quita 2: quedan 7.' },
              { text: '8 lingotes de hierro', correct: false, hint: 'Paso a paso: 6 + 3 = 9; luego 9 - 2 = 7.' }
            ]
          }
        ];
      } else if (activeGameTheme === 'mariokart') {
        return [
          {
            stage: 'Vuelta 1 · Monedas en la Curva (Suma)',
            question: '🏎️ Mario recoge 4 monedas doradas en la primera curva y 5 monedas más en el puente. ¿Cuántas monedas tiene en total? (4 + 5 = ?)',
            options: [
              { text: '9 monedas doradas', correct: true, hint: '¡Aceleración turbo! 4 + 5 = 9 monedas en tu contador.' },
              { text: '8 monedas doradas', correct: false, hint: 'Revisa la suma: 4 más 5 da 9.' },
              { text: '11 monedas doradas', correct: false, hint: 'Calcula despacio: 4 + 5 = 9.' }
            ]
          },
          {
            stage: 'Vuelta 2 · Desafío de Banana (Resta)',
            question: '🍌 Llevabas 8 monedas acumuladas pero resbalaste con una banana y perdiste 3 monedas. ¿Cuántas te quedan? (8 - 3 = ?)',
            options: [
              { text: '5 monedas doradas', correct: true, hint: '¡Gran recuperación! 8 - 3 = 5 monedas en tu kart.' },
              { text: '4 monedas doradas', correct: false, hint: 'Calcula: a 8 le restas 3 y te quedan 5.' },
              { text: '11 monedas doradas', correct: false, hint: 'Al resbalar se pierden monedas: 8 - 3 = 5.' }
            ]
          },
          {
            stage: 'Vuelta 3 · Recta Final y Trofeo de Oro',
            question: '🏆 En la recta final tienes 7 segundos de ventaja, recoges un champiñón que te da 4 segundos más y pierdes 2 por un bache. ¿Cuántos segundos de ventaja tienes? (7 + 4 - 2 = ?)',
            options: [
              { text: '9 segundos de ventaja', correct: true, hint: '¡Podio de 1er Lugar! 7 + 4 = 11, y 11 - 2 = 9 segundos.' },
              { text: '8 segundos de ventaja', correct: false, hint: 'Suma 7 + 4 = 11; luego resta 2: quedan 9.' },
              { text: '10 segundos de ventaja', correct: false, hint: 'Revisa: 11 - 2 = 9.' }
            ]
          }
        ];
      } else if (activeGameTheme === 'roblox') {
        return [
          {
            stage: 'Stage 1 · Salto de Bloques (Suma)',
            question: '🧱 Tu avatar salta sobre 6 bloques de neón y luego avanza 4 bloques más hasta el checkpoint. ¿Cuántos bloques recorrió? (6 + 4 = ?)',
            options: [
              { text: '10 bloques de neón', correct: true, hint: '¡Salto perfecto! 6 + 4 = 10 bloques superados.' },
              { text: '9 bloques de neón', correct: false, hint: 'Recuerda: 6 + 4 suman 10.' },
              { text: '12 bloques de neón', correct: false, hint: 'Cuenta con cuidado: 6 + 4 = 10.' }
            ]
          },
          {
            stage: 'Stage 2 · Trampa de Lava (Resta)',
            question: '🌋 El circuito tiene 10 plataformas flotantes y ya has saltado sobre 6. ¿Cuántas plataformas te faltan para la meta? (10 - 6 = ?)',
            options: [
              { text: '4 plataformas restantes', correct: true, hint: '¡Excelente! 10 - 6 = 4 plataformas para ganar.' },
              { text: '3 plataformas restantes', correct: false, hint: 'Calcula: a 10 le quitas 6 y obtienes 4.' },
              { text: '5 plataformas restantes', correct: false, hint: 'Revisa la resta: 10 - 6 = 4.' }
            ]
          },
          {
            stage: 'Stage 3 · Gran Corona de Victoria',
            question: '👑 Tienes 7 gemas, recoges 5 gemas más en una estrella y usas 2 gemas para abrir el portal final. ¿Cuántas gemas tienes ahora? (7 + 5 - 2 = ?)',
            options: [
              { text: '10 gemas doradas', correct: true, hint: '¡Corona conquistada! 7 + 5 = 12; luego 12 - 2 = 10 gemas.' },
              { text: '9 gemas doradas', correct: false, hint: 'Suma primero 7 + 5 = 12, y resta 2: 10.' },
              { text: '11 gemas doradas', correct: false, hint: 'Paso a paso: 12 - 2 = 10.' }
            ]
          }
        ];
      } else if (activeGameTheme === 'lego') {
        return [
          {
            stage: 'Nivel 1 · Base de la Torre (Suma)',
            question: '🧩 Para armar la base de la torre, colocas 7 ladrillos rojos y 3 ladrillos amarillos. ¿Cuántos ladrillos hay en total? (7 + 3 = ?)',
            options: [
              { text: '10 ladrillos Lego', correct: true, hint: '¡Click! 7 + 3 = 10 piezas ensambladas con firmeza.' },
              { text: '9 ladrillos Lego', correct: false, hint: 'Cuenta los studs: 7 + 3 = 10.' },
              { text: '12 ladrillos Lego', correct: false, hint: '7 más 3 da 10.' }
            ]
          },
          {
            stage: 'Nivel 2 · Ajuste del Modelo (Resta)',
            question: '🧩 Tenías 9 piezas colocadas y retiras 5 piezas para cambiar la ventana. ¿Cuántas piezas quedaron puestas? (9 - 5 = ?)',
            options: [
              { text: '4 piezas colocadas', correct: true, hint: '¡Bien ajustado! 9 - 5 = 4 piezas firmes.' },
              { text: '3 piezas colocadas', correct: false, hint: 'Resta paso a paso: 9 - 5 = 4.' },
              { text: '14 piezas colocadas', correct: false, hint: 'Al retirar piezas restas: 9 - 5 = 4.' }
            ]
          },
          {
            stage: 'Nivel 3 · Maqueta Completa (Combinada)',
            question: '🧩 En el techo colocas 8 ladrillos, añades 4 tejas decorativas y quitas 2 piezas sobrantes. ¿Cuántas piezas agregaste al final? (8 + 4 - 2 = ?)',
            options: [
              { text: '10 piezas en el techo', correct: true, hint: '¡Maqueta maestra terminada! 8 + 4 = 12; 12 - 2 = 10.' },
              { text: '9 piezas en el techo', correct: false, hint: '8 + 4 = 12; 12 - 2 = 10.' },
              { text: '11 piezas en el techo', correct: false, hint: 'Calcula: 12 - 2 = 10.' }
            ]
          }
        ];
      } else {
        return [
          {
            stage: 'Nivel 1 · Puntos de Combate (Suma)',
            question: '⚡ Tu criatura tiene 6 puntos de energía y gana 4 puntos más por un ataque certero. ¿Cuántos puntos tiene ahora? (6 + 4 = ?)',
            options: [
              { text: '10 puntos de energía', correct: true, hint: '¡Energía al máximo! 6 + 4 = 10 puntos.' },
              { text: '8 puntos de energía', correct: false, hint: 'Suma de nuevo: 6 + 4 = 10.' },
              { text: '12 puntos de energía', correct: false, hint: '6 + 4 = 10.' }
            ]
          },
          {
            stage: 'Nivel 2 · Escudo Defensivo (Resta)',
            question: '🛡️ Tienes 10 niveles en tu barra y gastas 3 niveles en crear un escudo protector. ¿Cuántos niveles te quedan? (10 - 3 = ?)',
            options: [
              { text: '7 niveles de energía', correct: true, hint: '¡Gran defensa! 10 - 3 = 7 niveles.' },
              { text: '6 niveles de energía', correct: false, hint: 'A 10 le restas 3 y te quedan 7.' },
              { text: '13 niveles de energía', correct: false, hint: 'Al gastar energía restamos: 10 - 3 = 7.' }
            ]
          },
          {
            stage: 'Nivel 3 · Ataque Final y Medalla',
            question: '🏅 Tienes 7 puntos de poder, sumas 5 puntos de un cristal y usas 2 para el golpe final. ¿Cuántos puntos te quedan? (7 + 5 - 2 = ?)',
            options: [
              { text: '10 puntos de poder', correct: true, hint: '¡Victoria indiscutible! 7 + 5 = 12; luego 12 - 2 = 10.' },
              { text: '9 puntos de poder', correct: false, hint: '7 + 5 = 12; 12 - 2 = 10.' },
              { text: '11 puntos de poder', correct: false, hint: 'Calcula: 12 - 2 = 10.' }
            ]
          }
        ];
      }
    }

    // Para cualquier otro tema curricular (Ciencias, Historia, Lengua, etc.)
    return [
      {
        stage: 'Nivel 1 · Conceptos Clave',
        question: `En relación con "${academicTopic}": ¿Cuál de las siguientes afirmaciones describe de forma más precisa su principio fundamental?`,
        options: [
          { text: `Es el principio rector que fundamenta los fenómenos y estructuras en ${academicTopic}.`, correct: true, hint: '¡Excelente! Base conceptual superada con rigor.' },
          { text: 'Es un elemento secundario sin mayor relevancia en el aprendizaje.', correct: false, hint: 'Atención: revisa el núcleo conceptual del tema.' },
          { text: 'Es una regla obsoleta no aceptada en los planes de estudio actuales.', correct: false, hint: 'Revisa las evidencias científicas y curriculares.' }
        ]
      },
      {
        stage: 'Nivel 2 · Causa y Efecto',
        question: `Al poner en práctica los conocimientos sobre "${academicTopic}": ¿Qué relación directa causa-efecto podemos observar?`,
        options: [
          { text: 'Los cambios en las condiciones iniciales modifican los resultados observados de manera predecible.', correct: true, hint: '¡Muy bien! Comprensión de causas y consecuencias demostrada.' },
          { text: 'Los resultados ocurren de manera puramente azarosa sin relación alguna con las causas.', correct: false, hint: 'Todo sistema tiene leyes y causas identificables.' },
          { text: 'No es posible observar ningún cambio independientemente de las acciones realizadas.', correct: false, hint: 'La experimentación demuestra transformaciones activas.' }
        ]
      },
      {
        stage: 'Nivel 3 · Aplicación en la Realidad',
        question: `Al finalizar la lección sobre "${academicTopic}": ¿Cuál es la mayor evidencia de que los estudiantes han alcanzado un aprendizaje significativo?`,
        options: [
          { text: 'Son capaces de explicar el concepto con sus propias palabras y resolver situaciones cotidianas reales.', correct: true, hint: '¡Victoria total! Has alcanzado la cúspide del aprendizaje activo.' },
          { text: 'Repetir de memoria la definición del libro sin comprender su utilidad práctica.', correct: false, hint: 'El objetivo es el pensamiento crítico, no la memoria ciega.' },
          { text: 'Olvidar el tema en cuanto termine la prueba escolar.', correct: false, hint: 'El conocimiento auténtico perdura en el tiempo.' }
        ]
      }
    ];
  };

  const gameChallenges = getGameChallenges();

  // =========================================================================
  // MULTI-ACTIVITY HELPERS: MEMORIA, SECUENCIA Y SOPA DE LETRAS
  // =========================================================================

  // 1. MEMORIA MATEMÁTICA / CURRICULAR ADAPTADA AL MUNDO
  const getMathMemoryCards = () => {
    if (activeWorld === 1) {
      return [
        { id: 1, pairKey: 'p1', label: '🍎 4 + 3', desc: 'Operación' },
        { id: 2, pairKey: 'p1', label: '7', desc: 'Resultado' },
        { id: 3, pairKey: 'p2', label: '✏️ 9 - 4', desc: 'Operación' },
        { id: 4, pairKey: 'p2', label: '5', desc: 'Resultado' },
        { id: 5, pairKey: 'p3', label: '⭐ 5 + 5', desc: 'Operación' },
        { id: 6, pairKey: 'p3', label: '10', desc: 'Resultado' },
        { id: 7, pairKey: 'p4', label: '🔵 8 - 2', desc: 'Operación' },
        { id: 8, pairKey: 'p4', label: '6', desc: 'Resultado' },
      ];
    } else if (activeWorld === 2) {
      return [
        { id: 1, pairKey: 'p1', label: '🧮 8 + 7', desc: 'Operación' },
        { id: 2, pairKey: 'p1', label: '15', desc: 'Resultado' },
        { id: 3, pairKey: 'p2', label: '➖ 14 - 6', desc: 'Operación' },
        { id: 4, pairKey: 'p2', label: '8', desc: 'Resultado' },
        { id: 5, pairKey: 'p3', label: '⚡ 9 + 5', desc: 'Operación' },
        { id: 6, pairKey: 'p3', label: '14', desc: 'Resultado' },
        { id: 7, pairKey: 'p4', label: '🎯 18 - 9', desc: 'Operación' },
        { id: 8, pairKey: 'p4', label: '9', desc: 'Resultado' },
      ];
    } else {
      return [
        { id: 1, pairKey: 'p1', label: '💎 12 + 8', desc: 'Operación' },
        { id: 2, pairKey: 'p1', label: '20', desc: 'Resultado' },
        { id: 3, pairKey: 'p2', label: '❓ 25 - 9', desc: 'Operación' },
        { id: 4, pairKey: 'p2', label: '16', desc: 'Resultado' },
        { id: 5, pairKey: 'p3', label: '🔥 7 + 6 + 2', desc: 'Operación' },
        { id: 6, pairKey: 'p3', label: '15', desc: 'Resultado' },
        { id: 7, pairKey: 'p4', label: '👑 30 - 12', desc: 'Operación' },
        { id: 8, pairKey: 'p4', label: '18', desc: 'Resultado' },
      ];
    }
  };

  const handleMathCardClick = (id: number, pairKey: string) => {
    if (mathMemoryFlipped.includes(id) || mathMemorySolved.has(pairKey) || mathMemoryFlipped.length >= 2) return;
    const newFlipped = [...mathMemoryFlipped, id];
    setMathMemoryFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMathMemoryMoves(m => m + 1);
      const cards = getMathMemoryCards();
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);
      if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
        setMathMemorySolved(prev => new Set([...prev, firstCard.pairKey]));
        setScore(s => s + 20);
        setTimeout(() => setMathMemoryFlipped([]), 500);
      } else {
        setTimeout(() => setMathMemoryFlipped([]), 950);
      }
    }
  };

  // 2. SECUENCIAS NUMÉRICAS Y LÓGICAS ADAPTADAS AL MUNDO
  const getSequenceChallenges = () => {
    if (activeWorld === 1) {
      return [
        {
          id: 1,
          title: 'Mundo 1 · Serie de 2 en 2',
          pattern: '2, 4, 6, [ ? ]',
          rule: 'Sumamos 2 a cada paso (+2)',
          options: [8, 7, 9],
          correct: 8,
          hint: '¡Exacto! 6 + 2 = 8.'
        },
        {
          id: 2,
          title: 'Mundo 1 · Números Impares',
          pattern: '1, 3, 5, [ ? ]',
          rule: 'Avanzamos de 2 en 2 con impares',
          options: [7, 6, 8],
          correct: 7,
          hint: '¡Brillante! 5 + 2 = 7.'
        },
        {
          id: 3,
          title: 'Mundo 1 · Cuenta Regresiva (-1)',
          pattern: '10, 9, 8, [ ? ]',
          rule: 'Restamos 1 en cada casilla',
          options: [7, 6, 5],
          correct: 7,
          hint: '¡Gran deducción! 8 - 1 = 7.'
        }
      ];
    } else if (activeWorld === 2) {
      return [
        {
          id: 1,
          title: 'Mundo 2 · Serie de 5 en 5',
          pattern: '5, 10, 15, [ ? ]',
          rule: 'Patrón de múltiplos de 5 (+5)',
          options: [20, 18, 25],
          correct: 20,
          hint: '¡Perfecto! 15 + 5 = 20.'
        },
        {
          id: 2,
          title: 'Mundo 2 · Secuencia Descendente (-4)',
          pattern: '20, 16, 12, [ ? ]',
          rule: 'Restamos 4 en cada salto',
          options: [8, 10, 9],
          correct: 8,
          hint: '¡Muy bien! 12 - 4 = 8.'
        },
        {
          id: 3,
          title: 'Mundo 2 · Serie de 3 en 3',
          pattern: '3, 6, 9, 12, [ ? ]',
          rule: 'Sumamos 3 consecutivamente',
          options: [15, 14, 18],
          correct: 15,
          hint: '¡Acertaste! 12 + 3 = 15.'
        }
      ];
    } else {
      return [
        {
          id: 1,
          title: 'Mundo 3 · Patrón de Duplicación',
          pattern: '2, 4, 8, 16, [ ? ]',
          rule: 'El doble del número anterior (× 2)',
          options: [32, 24, 28],
          correct: 32,
          hint: '¡Maestría! 16 × 2 = 32.'
        },
        {
          id: 2,
          title: 'Mundo 3 · Saltos Crecientes (+3, +5, +7, +9)',
          pattern: '1, 4, 9, 16, [ ? ]',
          rule: 'Números al cuadrado o suma de impares',
          options: [25, 20, 24],
          correct: 25,
          hint: '¡Increíble! 16 + 9 = 25 (5 × 5).'
        },
        {
          id: 3,
          title: 'Mundo 3 · Patrón Alternado (+5, -2)',
          pattern: '10, 15, 13, 18, 16, [ ? ]',
          rule: 'Sumar 5, luego restar 2 alternadamente',
          options: [21, 19, 20],
          correct: 21,
          hint: '¡Genio matemático! 16 + 5 = 21.'
        }
      ];
    }
  };

  const handleSequenceAnswer = (selectedVal: number, correctVal: number, hint: string) => {
    if (sequenceAnswerSelected !== null) return;
    setSequenceAnswerSelected(selectedVal);
    if (selectedVal === correctVal) {
      setScore(s => s + 20);
      setSequenceFeedback({ ok: true, msg: hint });
    } else {
      setSequenceFeedback({ ok: false, msg: `Cuidado: la respuesta correcta era ${correctVal}. Revisa el patrón con atención.` });
    }
  };

  // 3. SOPA DE LETRAS INTERACTIVA
  const wordSearchGrid = [
    ['S', 'U', 'M', 'A', 'X', 'Y', 'Z', 'W'],
    ['R', 'E', 'S', 'T', 'A', 'K', 'L', 'M'],
    ['O', 'C', 'H', 'O', 'P', 'Q', 'R', 'S'],
    ['T', 'O', 'T', 'A', 'L', 'A', 'B', 'C'],
    ['D', 'I', 'E', 'Z', 'N', 'O', 'P', 'Q'],
    ['C', 'I', 'N', 'C', 'O', 'X', 'Y', 'Z'],
    ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
    ['N', 'U', 'M', 'E', 'R', 'O', 'S', 'T']
  ];

  const wordSearchTargetWords = [
    { word: 'SUMA', cells: ['0-0', '0-1', '0-2', '0-3'], desc: 'Operación de agregar' },
    { word: 'RESTA', cells: ['1-0', '1-1', '1-2', '1-3', '1-4'], desc: 'Operación de quitar' },
    { word: 'OCHO', cells: ['2-0', '2-1', '2-2', '2-3'], desc: 'Número par (4 + 4)' },
    { word: 'TOTAL', cells: ['3-0', '3-1', '3-2', '3-3', '3-4'], desc: 'Resultado final' },
    { word: 'DIEZ', cells: ['4-0', '4-1', '4-2', '4-3'], desc: 'Decena básica' },
    { word: 'CINCO', cells: ['5-0', '5-1', '5-2', '5-3', '5-4'], desc: 'Número impar' },
  ];

  const toggleWordSearchCell = (coord: string) => {
    const next = new Set(wordSearchSelectedCells);
    if (next.has(coord)) {
      next.delete(coord);
    } else {
      next.add(coord);
    }
    setWordSearchSelectedCells(next);

    // Check if any target word is fully matched by current selection
    wordSearchTargetWords.forEach(tw => {
      if (!wordSearchFoundWords.has(tw.word)) {
        const isMatched = tw.cells.every(c => next.has(c));
        if (isMatched) {
          setWordSearchFoundWords(prev => new Set([...prev, tw.word]));
          setScore(s => s + 25);
          setWordSearchStatus(`🎉 ¡Encontraste la palabra "${tw.word}"! (+25 pts)`);
          setTimeout(() => setWordSearchStatus(null), 3000);
        }
      }
    });
  };

  const clearWordSearch = () => {
    setWordSearchSelectedCells(new Set());
    setWordSearchFoundWords(new Set());
    setWordSearchStatus(null);
  };

  const handleGameAnswer = (optIndex: number) => {
    if (gameAnswerSelected !== null) return;
    setGameAnswerSelected(optIndex);
    const curr = gameChallenges[gameStep];
    const isCorrect = curr.options[optIndex].correct;

    if (isCorrect) {
      setScore(s => s + 25);
      if (activeGameTheme === 'mariokart') {
        setKartSpeed(prev => Math.min(130, prev + 35));
        setKartCoins(prev => prev + 3);
        setKartEvent('turbo');
        setGameFeedback({
          ok: true,
          title: '🍄 ¡CHAMPIÑÓN TURBO ACTIVADO! (+35 km/h)',
          desc: curr.options[optIndex].hint,
          perk: '+3 Monedas recolectadas y aceleración máxima en la pista.'
        });
      } else if (activeGameTheme === 'minecraft') {
        setMcHearts(prev => Math.min(5, prev + 1));
        const craftedTiers = ['Pico de Madera', 'Espada de Hierro', 'Armadura de Diamante', '🏆 Trofeo de Diamante'];
        const nextItem = craftedTiers[gameStep + 1] || '🏆 Trofeo de Diamante';
        setMcCraftedItem(nextItem);
        setMcGridCount(prev => prev + 2);
        setGameFeedback({
          ok: true,
          title: '💎 ¡LOGRO CRAFTEADO: NUEVO ÍTEM!',
          desc: curr.options[optIndex].hint,
          perk: `Has crafteado: ${nextItem}. Corazones y experiencia al máximo.`
        });
      } else if (activeGameTheme === 'roblox') {
        setRobloxStage(prev => Math.min(5, prev + 2));
        setGameFeedback({
          ok: true,
          title: '⭐ ¡CHECKPOINT ALCANZADO!',
          desc: curr.options[optIndex].hint,
          perk: 'Salto perfecto a la plataforma superior sin tocar la lava.'
        });
      } else if (activeGameTheme === 'lego') {
        setLegoBricksCount(prev => Math.min(6, prev + 2));
        setGameFeedback({
          ok: true,
          title: '🧩 ¡CLICK! BLOQUES ENSAMBLADOS',
          desc: curr.options[optIndex].hint,
          perk: 'Nueva sección del modelo construida con studs plásticos de alta resistencia.'
        });
      } else if (activeGameTheme === 'pokemon') {
        setPokeEnemyHp(prev => Math.max(0, prev - 45));
        setPokeTurnMsg('¡Tu respuesta fue súper efectiva! El rival ha perdido 45 HP.');
        setGameFeedback({
          ok: true,
          title: '⚡ ¡GOLPE CRÍTICO SÚPER EFECTIVO!',
          desc: curr.options[optIndex].hint,
          perk: 'El rival retrocede. ¡Estás a un paso de la Medalla de Gimnasio!'
        });
      } else if (activeGameTheme === 'arcade') {
        setArcadeScore(prev => prev + 1500);
        setGameFeedback({
          ok: true,
          title: '🕹️ ¡STAGE CLEARED! +1500 PTS',
          desc: curr.options[optIndex].hint,
          perk: 'Bonus de precisión activado. Récord HI-SCORE en alza.'
        });
      }
    } else {
      if (activeGameTheme === 'mariokart') {
        setKartSpeed(prev => Math.max(25, prev - 20));
        setKartEvent('banana');
        setGameFeedback({
          ok: false,
          title: '🍌 ¡PATINAZO CON CÁSCARA DE BANANA!',
          desc: curr.options[optIndex].hint,
          perk: 'El kart derrapó temporalmente (-20 km/h). ¡Ajusta el rumbo y retoma el ritmo!'
        });
      } else if (activeGameTheme === 'minecraft') {
        setMcHearts(prev => Math.max(1, prev - 1));
        setGameFeedback({
          ok: false,
          title: '⚠️ ¡DAÑO RECIBIDO! (Medio corazón)',
          desc: curr.options[optIndex].hint,
          perk: 'Un Creeper se acercó. Revisa la receta conceptual antes de continuar.'
        });
      } else if (activeGameTheme === 'roblox') {
        setRobloxFalls(prev => prev + 1);
        setGameFeedback({
          ok: false,
          title: '🌋 ¡CAÍDA A LA LAVA!',
          desc: curr.options[optIndex].hint,
          perk: 'Reapareces en tu último checkpoint seguro. ¡Inténtalo de nuevo!'
        });
      } else if (activeGameTheme === 'lego') {
        setGameFeedback({
          ok: false,
          title: '🧱 PIEZA MAL ALINEADA',
          desc: curr.options[optIndex].hint,
          perk: 'El manual de construcción sugiere verificar la base de sustentación.'
        });
      } else if (activeGameTheme === 'pokemon') {
        setPokeTurnMsg('El ataque falló. El rival preparó su contraataque.');
        setGameFeedback({
          ok: false,
          title: '🛡️ EL RIVAL SE DEFENDIÓ',
          desc: curr.options[optIndex].hint,
          perk: 'Ajusta tu táctica de combate eligiendo el concepto rector.'
        });
      } else if (activeGameTheme === 'arcade') {
        setArcadeLives(prev => Math.max(1, prev - 1));
        setGameFeedback({
          ok: false,
          title: '👾 ¡MISSILE HIT! (-1 Vida)',
          desc: curr.options[optIndex].hint,
          perk: 'Presiona start mental y corrige tu trayectoria.'
        });
      }
    }
  };

  const handleNextGameStep = () => {
    if (gameStep < gameChallenges.length - 1) {
      setGameStep(prev => prev + 1);
      setGameAnswerSelected(null);
      setGameFeedback(null);
      if (activeGameTheme === 'mariokart') {
        setKartLap(prev => Math.min(3, prev + 1));
        setKartEvent('normal');
      }
    }
  };

  const handleResetGame = () => {
    setGameStep(0);
    setGameAnswerSelected(null);
    setGameFeedback(null);
    setScore(0);
    setKartSpeed(55);
    setKartCoins(3);
    setKartLap(1);
    setKartEvent('normal');
    setMcHearts(5);
    setMcCraftedItem('Pico de Madera');
    setMcGridCount(1);
    setRobloxStage(1);
    setRobloxFalls(0);
    setLegoBricksCount(2);
    setPokeEnemyHp(100);
    setPokeTurnMsg('¡El rival "Duda Conceptual" Nv.40 te desafía a un duelo de aprendizaje!');
    setArcadeScore(2400);
    setArcadeLives(3);
  };

  // Full standalone HTML code generation
  const gameHtmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego Educativo Gamificado (${activeGameTheme.toUpperCase()}) · ${currentTopic}</title>
  <style>
    :root {
      --primary: #09243a;
      --gold: #d7ad32;
      --bg: #f4f6f7;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: #1e293b;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
    }
    .game-card {
      max-width: 720px;
      width: 100%;
      background: white;
      border: 3px solid var(--gold);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 12px 36px rgba(9, 36, 58, 0.12);
    }
    .hud {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--primary);
      color: white;
      padding: 12px 18px;
      border-radius: 14px;
      margin-bottom: 20px;
      font-weight: 800;
      font-size: 14px;
    }
    .hud-badge {
      background: var(--gold);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 99px;
    }
    .opt-btn {
      display: block;
      width: 100%;
      text-align: left;
      padding: 14px 18px;
      margin: 8px 0;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .opt-btn:hover {
      border-color: var(--gold);
      background: #fefce8;
    }
    .feedback-box {
      margin-top: 16px;
      padding: 14px;
      border-radius: 12px;
      font-weight: 700;
      display: none;
    }
  </style>
</head>
<body>
  <div class="game-card">
    <div class="hud">
      <span>🎮 TEMÁTICA: ${activeGameTheme.toUpperCase()}</span>
      <span class="hud-badge" id="pts-counter">0 PTS</span>
    </div>
    <h2 style="margin:0 0 10px 0; color:var(--primary);">Desafío Gamificado: ${currentTopic}</h2>
    <p id="question-text" style="font-size:16px; font-weight:600;"></p>
    <div id="options-container"></div>
    <div id="feedback-box" class="feedback-box"></div>
  </div>
  <script>
    const questions = [
      {
        q: "En relación con '${currentTopic}': ¿Cuál es el concepto nuclear o principio rector que debemos dominar?",
        opts: [
          { t: "Es el principio rector que fundamenta los fenómenos y estructuras en ${currentTopic}.", ok: true, perk: "¡Excelente! Acierto con boost de puntos." },
          { t: "Un dato anecdótico sin trascendencia en el aprendizaje.", ok: false, perk: "Revisa los conceptos clave e inténtalo de nuevo." }
        ]
      }
    ];
    let score = 0;
    const qText = document.getElementById('question-text');
    const optBox = document.getElementById('options-container');
    const feed = document.getElementById('feedback-box');
    const pts = document.getElementById('pts-counter');
    
    qText.textContent = questions[0].q;
    questions[0].opts.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.textContent = opt.t;
      b.onclick = () => {
        feed.style.display = 'block';
        if (opt.ok) {
          score += 25;
          pts.textContent = score + ' PTS';
          feed.style.background = '#dcfce7';
          feed.style.color = '#14532d';
          feed.textContent = '✅ ' + opt.perk;
        } else {
          feed.style.background = '#ffe4e6';
          feed.style.color = '#881337';
          feed.textContent = '❌ ' + opt.perk;
        }
      };
      optBox.appendChild(b);
    });
  </script>
</body>
</html>`;

  // Full standalone HTML code generation
  const generatedHtmlCode = isGameArena ? gameHtmlCode : `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mapa Mental Interactivo · ${currentTopic}</title>
  <style>
    :root {
      --navy: #09243a;
      --gold: #d7ad32;
      --light-gold: #f8edc5;
      --cream: #fbfaf6;
      --border: #e7e4dc;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--cream);
      color: #24313b;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1000px;
      margin: auto;
      background: white;
      border: 2px solid var(--border);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(9,36,58,0.08);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f4f6f7;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .badge {
      background: var(--light-gold);
      color: #735a00;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 99px;
      font-size: 13px;
    }
    /* Central Node */
    .center-node {
      background: var(--navy);
      color: white;
      text-align: center;
      padding: 18px 24px;
      border-radius: 20px;
      font-size: 20px;
      font-weight: 900;
      max-width: 380px;
      margin: 0 auto 24px;
      border: 3px solid var(--gold);
      box-shadow: 0 8px 20px rgba(9,36,58,0.15);
    }
    /* Radial Grid of Branches */
    .branches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .branch-card {
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      background: #fbfaf6;
      cursor: pointer;
      transition: all 0.2s;
    }
    .branch-card:hover {
      border-color: var(--gold);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    }
    .branch-title {
      font-weight: 800;
      font-size: 14px;
      margin-bottom: 10px;
      color: var(--navy);
    }
    .subnode {
      background: white;
      border: 1px solid var(--border);
      padding: 8px 10px;
      border-radius: 8px;
      margin-bottom: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    /* Interactive Challenge Box */
    .challenge-box {
      background: #061a2b;
      color: white;
      padding: 18px;
      border-radius: 16px;
      margin-top: 20px;
    }
    .btn {
      background: var(--gold);
      color: var(--navy);
      border: 0;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h2 style="margin:0; color:var(--navy);">MAPA MENTAL INTERACTIVO: ${currentTopic}</h2>
        <span style="font-size:12px; color:#68747d;">Estructura radial pedagógica L.I.D.E.R. con funcionalidad real</span>
      </div>
      <div class="badge" id="score">Puntuación: 0 pts</div>
    </div>

    <!-- Central Concept -->
    <div class="center-node">${mindMapData.center}</div>

    <!-- 4 Radial Branches with Subnodes -->
    <div class="branches-grid">
      ${mindMapData.branches.map(b => `
        <div class="branch-card" onclick="checkBranch('${b.id}')">
          <div class="branch-title">${b.title}</div>
          ${b.subnodes.map(s => `
            <div class="subnode" title="${s.desc}">• ${s.name}</div>
          `).join('')}
        </div>
      `).join('')}
    </div>

    <!-- Interactive Challenge -->
    <div class="challenge-box">
      <div style="font-size:11px; color:#d7ad32; font-weight:800; margin-bottom:4px;">DESAFÍO DEL MAPA MENTAL</div>
      <p id="challengeText" style="margin:0 0 12px; font-weight:600;">
        ${mindMapData.challenges[0].text}
      </p>
      <div id="feedback" style="display:none; padding:10px; border-radius:8px; margin-bottom:12px;"></div>
      <button class="btn" onclick="resetMap()">Reiniciar Mapa</button>
    </div>
  </div>

  <script>
    let score = 0;
    function checkBranch(branchId) {
      const feedback = document.getElementById('feedback');
      feedback.style.display = 'block';
      if (branchId === '${mindMapData.challenges[0].targetBranchId}') {
        score += 10;
        document.getElementById('score').innerText = 'Puntuación: ' + score + ' pts';
        feedback.style.background = '#e8f5e9';
        feedback.style.color = '#2e7d32';
        feedback.innerText = '✅ ¡Excelente! Pertenece a esta rama del mapa mental.';
      } else {
        feedback.style.background = '#ffebee';
        feedback.style.color = '#c62828';
        feedback.innerText = '❌ No corresponde a esta rama. Observa los conceptos del mapa e inténtalo de nuevo.';
      }
    }
    function resetMap() {
      score = 0;
      document.getElementById('score').innerText = 'Puntuación: 0 pts';
      document.getElementById('feedback').style.display = 'none';
    }
  </script>
</body>
</html>`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#061a2b]/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#fbfaf6] border border-[#e7e4dc] rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#09243a] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d7ad32]" />
              {isMindMap ? '🧠 MAPA MENTAL INTERACTIVO REAL' : 'CAPACIDAD L.I.D.E.R. INTERACTIVA EN ACCIÓN'}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white m-0 flex items-center gap-2">
              {isMindMap ? `Mapa Mental: ${currentTopic}` : `${tipo || 'Actividad'}: ${currentTopic}`}
            </h2>
            <p className="text-[#d6e1e7] text-xs sm:text-sm mt-1">
              {isMindMap
                ? 'Estructura radial real con nodos jerárquicos, ramas interactivas, fichas de detalle y desafío de correspondencia con comprobación y puntaje.'
                : 'Demostración en vivo: botones activos, evaluación en tiempo real, puntuación, retroalimentación y reinicio.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-xl font-bold cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-white border-b border-[#e7e4dc] px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#09243a] text-white'
                  : 'text-[#68747d] hover:bg-[#f4f6f7]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {isMindMap ? 'Vista del Mapa Mental' : 'Vista Interactiva'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-[#09243a] text-white'
                  : 'text-[#68747d] hover:bg-[#f4f6f7]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Código HTML/JS Autocontenido
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#f8edc5] text-[#735a00] font-black text-xs px-3 py-1 rounded-full">
              <Award className="w-3.5 h-3.5 text-[#d7ad32]" />
              <span>Puntuación: {score} pts</span>
            </div>

            {activeTab === 'code' && (
              <button
                type="button"
                onClick={copyCode}
                className="text-xs font-bold text-[#09243a] bg-[#f8edc5] hover:bg-[#f3e5b3] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '¡Copiado!' : 'Copiar archivo HTML'}
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'preview' ? (
            <div>
              {/* ========================================================================= */}
              {/* CASO 1: MAPA MENTAL REAL                                                  */}
              {/* ========================================================================= */}
              {isMindMap ? (
                <div className="space-y-6">
                  
                  {/* Mind Map Canvas Toolbar */}
                  <div className="bg-white border border-[#e7e4dc] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-[#09243a]">
                        {mindMapData.branches.length} Ramas Temáticas · {exploredNodes.size} de {mindMapData.branches.reduce((acc, b) => acc + b.subnodes.length, 0)} conceptos explorados
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const all: Record<string, boolean> = {};
                          mindMapData.branches.forEach(b => { all[b.id] = true; });
                          setExpandedBranches(all);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-[#09243a] bg-[#f4f6f7] hover:bg-[#e7e4dc] rounded-lg transition-all cursor-pointer"
                      >
                        Expandir todo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const none: Record<string, boolean> = {};
                          mindMapData.branches.forEach(b => { none[b.id] = false; });
                          setExpandedBranches(none);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-[#68747d] bg-[#f4f6f7] hover:bg-[#e7e4dc] rounded-lg transition-all cursor-pointer"
                      >
                        Colapsar todo
                      </button>
                      <button
                        type="button"
                        onClick={resetMindMap}
                        className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reiniciar
                      </button>
                    </div>
                  </div>

                  {/* MIND MAP VISUAL CANVAS (Illustrated Organic Design) */}
                  <div className="bg-linear-to-b from-[#fbfaf6] via-white to-[#f4f7f6] border-2 border-[#e7e4dc] rounded-3xl p-4 sm:p-7 shadow-sm relative overflow-hidden">
                    
                    {/* SVG Connecting Tentacles (Connecting central cloud to the 6 branches) */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50% 160 Q 25% 180 20% 280" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" />
                        <path d="M 50% 160 Q 75% 180 80% 280" fill="none" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 4" />
                        <path d="M 50% 220 Q 30% 320 20% 480" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
                        <path d="M 50% 220 Q 70% 320 80% 480" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="6 4" />
                        <path d="M 50% 280 Q 35% 540 25% 720" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 4" />
                        <path d="M 50% 280 Q 65% 540 75% 720" fill="none" stroke="#0d9488" strokeWidth="3" strokeDasharray="6 4" />
                      </svg>
                    </div>

                    {/* Central Core Illustrated Node (Organic Yellow Cloud Badge) */}
                    <div className="relative z-10 flex flex-col items-center justify-center mb-10 text-center">
                      <div className="relative group cursor-pointer max-w-md w-full">
                        {/* Cloud bubble decorative aura */}
                        <div className="absolute -inset-2 bg-amber-200/50 rounded-[40px] blur-sm transform group-hover:scale-105 transition-transform"></div>
                        
                        <div className="relative bg-linear-to-b from-[#fef08a] via-[#fef9c3] to-[#fef08a] border-4 border-[#d7ad32] rounded-[36px] p-6 shadow-xl text-[#09243a]">
                          {/* Educational Core Topic Badge */}
                          <div className="w-16 h-16 mx-auto mb-3 bg-[#09243a] text-white rounded-2xl shadow-lg border-2 border-[#d7ad32] flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform">
                            🧠
                          </div>

                          <span className="inline-block bg-[#09243a] text-[#fde047] text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider mb-1.5">
                            CONCEPTO NUCLEAR
                          </span>

                          <h3 className="text-xl sm:text-2xl font-black text-[#09243a] m-0 tracking-tight">
                            {mindMapData.center}
                          </h3>
                          <div className="text-xs font-black text-amber-900 uppercase tracking-widest mt-1">
                            {subject || 'Ciencias & Humanidades'} {grade ? `· ${grade}` : ''}
                          </div>
                          <p className="text-xs text-[#475569] font-medium mt-1.5 max-w-xs mx-auto leading-relaxed">
                            {mindMapData.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 6 Colored Organic Branches Grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
                      {mindMapData.branches.map((branch) => {
                        const isExpanded = expandedBranches[branch.id] !== false;
                        const isTargetBranch = !challengeResolved && mindMapData.challenges[activeChallengeIndex]?.targetBranchId === branch.id;

                        return (
                          <div
                            key={branch.id}
                            className={`border-3 rounded-3xl p-5 sm:p-6 transition-all shadow-md ${branch.bgColor} ${branch.borderColor} ${
                              isTargetBranch && challengeResolved
                                ? 'ring-4 ring-emerald-400 bg-emerald-100/40 shadow-lg'
                                : 'hover:shadow-lg'
                            }`}
                          >
                            {/* Branch Header with Illustrated Icon */}
                            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/10">
                              <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-2xl bg-white border border-black/10 shadow-sm flex items-center justify-center text-xl shrink-0">
                                  {branch.icon}
                                </span>
                                <div>
                                  <h4 className="text-base sm:text-lg font-black text-[#09243a] m-0 leading-tight">
                                    {branch.title}
                                  </h4>
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${branch.badgeBg}`}>
                                    Rama Temática
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleBranchExpand(branch.id)}
                                className="p-1.5 rounded-xl hover:bg-black/5 text-[#68747d] text-xs font-bold transition-all cursor-pointer"
                                title={isExpanded ? 'Colapsar rama' : 'Expandir rama'}
                              >
                                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* Subnodes Pills List */}
                            {isExpanded && (
                              <div className="space-y-2.5 animate-in fade-in duration-200">
                                {branch.subnodes.map((subnode) => {
                                  const isExplored = exploredNodes.has(subnode.name);
                                  const isSelected = selectedNode === subnode.name;

                                  return (
                                    <div
                                      key={subnode.name}
                                      onClick={() => {
                                        setSelectedNode(subnode.name);
                                        setExploredNodes(prev => new Set(prev).add(subnode.name));
                                        if (!isExplored) {
                                          setScore(s => s + 10);
                                        }
                                        setActiveDetailNode({
                                          title: subnode.name,
                                          desc: subnode.desc,
                                          icon: branch.icon,
                                          branch: branch.title,
                                          color: branch.color
                                        });
                                      }}
                                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#09243a] text-white border-[#09243a] shadow-md scale-[1.02]'
                                          : 'bg-white hover:bg-[#fffdf5] text-[#1e293b] border-white/80 hover:border-[#d7ad32] shadow-xs'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <span className={`w-2 h-2 rounded-full shrink-0 ${isExplored ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                          <span className="font-extrabold text-xs sm:text-sm">
                                            {subnode.name}
                                          </span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                                          isSelected
                                            ? 'bg-amber-300 text-[#09243a]'
                                            : isExplored
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                          {isExplored ? '✓ Explorado' : '+10 pts'}
                                        </span>
                                      </div>

                                      <p className={`mt-1.5 text-xs leading-relaxed m-0 ${isSelected ? 'text-sky-100' : 'text-[#64748b]'}`}>
                                        {subnode.desc}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Challenge Quick Match Button */}
                            <div className="mt-3.5 pt-2.5 border-t border-black/5 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleBranchClick(branch.id)}
                                className="text-xs font-black text-[#09243a] bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-xl border border-black/10 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Conectar concepto aquí</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Inspirational Quote Card (Matching screenshot) */}
                    {mindMapData.quote && (
                      <div className="relative z-10 mt-8 max-w-xl mx-auto bg-linear-to-r from-indigo-50 via-purple-50 to-blue-50 border-2 border-indigo-200/80 rounded-3xl p-5 sm:p-6 text-center shadow-md">
                        <div className="text-2xl text-indigo-400 mb-1 leading-none font-serif">“</div>
                        <p className="text-sm sm:text-base font-bold text-[#1e1b4b] italic m-0 leading-relaxed">
                          {mindMapData.quote}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Active Concept Explanation Drawer / Modal Preview */}
                  {activeDetailNode && (
                    <div className="bg-white border-2 border-[#d7ad32] rounded-3xl p-5 shadow-xl flex items-start justify-between gap-4 animate-in fade-in">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-black uppercase text-[#d7ad32] tracking-wider">
                          <span>{activeDetailNode.icon}</span>
                          <span>{activeDetailNode.branch}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-[#09243a] m-0">
                          {activeDetailNode.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed m-0 pt-1">
                          {activeDetailNode.desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveDetailNode(null)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* DESAFÍO INTERACTIVO DEL MAPA MENTAL */}
                  <div className="bg-[#061a2b] border-2 border-[#09243a] rounded-2xl p-5 text-white shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#d7ad32]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#d7ad32]">
                          DESAFÍO INTERACTIVO DEL MAPA MENTAL ({activeChallengeIndex + 1}/{mindMapData.challenges.length})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#d6e1e7]">
                        +10 pts por acierto
                      </span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-white leading-snug m-0">
                      {mindMapData.challenges[activeChallengeIndex]?.text}
                    </p>

                    <p className="text-xs text-[#d6e1e7] m-0">
                      👉 Haz clic en la <strong>rama correspondiente</strong> arriba en el mapa mental para colocar este concepto.
                    </p>

                    {/* Feedback message */}
                    {feedback && (
                      <div className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/80 border border-rose-500 text-rose-200'
                      }`}>
                        <span>{feedback.text}</span>
                        {feedback.type === 'success' && challengeResolved && activeChallengeIndex + 1 < mindMapData.challenges.length && (
                          <button
                            type="button"
                            onClick={nextChallenge}
                            className="px-3 py-1 bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-black rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer"
                          >
                            Siguiente concepto →
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              ) : isFlashcards ? (
                /* ========================================================================= */
                /* CASO 2: FLASHCARDS INTERACTIVAS                                           */
                /* ========================================================================= */
                <div className="max-w-xl mx-auto space-y-6 py-4">
                  <div className="flex items-center justify-between text-xs text-[#68747d]">
                    <span>Tarjeta {currentCardIndex + 1} de {flashcardsData.length}</span>
                    <span className="font-bold text-emerald-700">
                      Dominadas: {masteredCards.size} / {flashcardsData.length}
                    </span>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-64 bg-white border-2 border-[#e7e4dc] hover:border-[#d7ad32] rounded-3xl p-8 flex flex-col justify-between items-center text-center shadow-lg cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#d7ad32]">
                      {isFlipped ? '💡 RESPUESTA / EXPLICACIÓN' : '❓ PREGUNTA / CONCEPTO'}
                    </span>

                    <p className="text-base sm:text-lg font-bold text-[#09243a] leading-relaxed m-0">
                      {isFlipped ? flashcardsData[currentCardIndex].a : flashcardsData[currentCardIndex].q}
                    </p>

                    <span className="text-xs text-[#68747d] italic">
                      (Haz clic para {isFlipped ? 'ver la pregunta' : 'girar y ver la respuesta'})
                    </span>
                  </div>

                  {/* Navigation & Controls */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={currentCardIndex === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIndex(prev => Math.max(0, prev - 1));
                      }}
                      className="px-4 py-2 bg-[#f4f6f7] hover:bg-[#e7e4dc] text-[#09243a] font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer"
                    >
                      ← Anterior
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMasteredCards(prev => {
                          const next = new Set(prev);
                          next.add(currentCardIndex);
                          return next;
                        });
                        setScore(prev => prev + 10);
                        if (currentCardIndex + 1 < flashcardsData.length) {
                          setCurrentCardIndex(prev => prev + 1);
                          setIsFlipped(false);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Marcar dominada (+10 pts)
                    </button>

                    <button
                      type="button"
                      disabled={currentCardIndex >= flashcardsData.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIndex(prev => Math.min(flashcardsData.length - 1, prev + 1));
                      }}
                      className="px-4 py-2 bg-[#09243a] hover:bg-[#061a2b] text-white font-bold text-xs rounded-xl disabled:opacity-40 cursor-pointer"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              ) : isRubric ? (
                /* ========================================================================= */
                /* CASO 3: RÚBRICA INTERACTIVA                                               */
                /* ========================================================================= */
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#09243a] m-0">Matriz de Evaluación Interactiva</h3>
                      <p className="text-xs text-[#68747d] mt-0.5">Haz clic en cada celda para calificar el desempeño del estudiante en vivo.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#68747d]">Calificación total:</span>
                      <div className="text-xl font-black text-[#d7ad32]">
                        {Object.values(rubricScores).reduce((a, b) => a + b, 0)} / 12 pts
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {rubricData.map((row, rIdx) => (
                      <div key={row.criterion} className="bg-white border border-[#e7e4dc] rounded-2xl p-4 shadow-2xs">
                        <div className="font-extrabold text-xs sm:text-sm text-[#09243a] mb-2.5">
                          {rIdx + 1}. {row.criterion}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          {row.levels.map((lvl, lIdx) => {
                            const selected = rubricScores[rIdx] === (lIdx + 1);
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setRubricScores(prev => ({ ...prev, [rIdx]: lIdx + 1 }))}
                                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                  selected
                                    ? 'bg-[#09243a] text-white border-[#09243a] shadow-xs'
                                    : 'bg-[#fbfaf6] hover:bg-white text-[#24313b] border-[#e7e4dc]'
                                }`}
                              >
                                <span className={`block font-black mb-1 ${selected ? 'text-amber-200' : 'text-[#68747d]'}`}>
                                  Nivel {lIdx + 1}
                                </span>
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isMatching ? (
                /* ========================================================================= */
                /* CASO 4: JUEGO DE EMPAREJAMIENTO INTERACTIVO (MATCH)                       */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbfaf6] border border-[#e7e4dc] p-4 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#d7ad32] tracking-wider block">
                        JUEGO DE EMPAREJAMIENTO · {subject || 'Ciencias'}
                      </span>
                      <h3 className="text-base font-black text-[#09243a] m-0">
                        {currentTopic}
                      </h3>
                      <p className="text-xs text-[#68747d] mt-0.5">
                        Selecciona un concepto a la izquierda y conéctalo con su fenómeno correspondiente a la derecha.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="bg-white border border-[#e7e4dc] px-3 py-1.5 rounded-xl text-xs font-bold text-[#09243a]">
                        Pares: <span className="text-[#d7ad32] font-black">{matchedKeys.size} / {matchLeftItems.length}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMatchedKeys(new Set());
                          setSelectedMatchLeft(null);
                          setMatchStatusMsg(null);
                        }}
                        className="p-2 bg-white hover:bg-[#f4f6f7] border border-[#e7e4dc] text-[#68747d] hover:text-[#09243a] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        title="Reiniciar parejas"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {matchStatusMsg && (
                    <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      matchStatusMsg.ok 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' 
                        : 'bg-rose-50 text-rose-900 border border-rose-300'
                    }`}>
                      {matchStatusMsg.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      <span>{matchStatusMsg.msg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column: Conceptos */}
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase text-[#09243a] tracking-wider flex items-center justify-between pb-1 border-b border-[#e7e4dc]">
                        <span>Columna A · Conceptos</span>
                        <span className="text-[10px] text-[#68747d] font-normal">Paso 1: Selecciona uno</span>
                      </div>

                      {matchLeftItems.map((item) => {
                        const isMatched = matchedKeys.has(item.matchKey);
                        const isSelected = selectedMatchLeft === item.matchKey;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={isMatched}
                            onClick={() => {
                              setSelectedMatchLeft(item.matchKey);
                              setMatchStatusMsg(null);
                            }}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isMatched
                                ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold opacity-80 cursor-default'
                                : isSelected
                                ? 'bg-[#09243a] text-white border-[#09243a] shadow-md ring-2 ring-[#d7ad32]/40 scale-[1.02]'
                                : 'bg-white hover:bg-[#fbfaf6] border-[#e7e4dc] text-[#09243a] hover:border-[#d7ad32]'
                            }`}
                          >
                            <span className="font-extrabold text-sm">{item.concept}</span>
                            {isMatched ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isSelected ? (
                              <span className="text-[10px] uppercase font-black text-[#d7ad32] bg-white/10 px-2 py-0.5 rounded-md">
                                Seleccionado
                              </span>
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[#cbd5e1]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Definiciones */}
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase text-[#09243a] tracking-wider flex items-center justify-between pb-1 border-b border-[#e7e4dc]">
                        <span>Columna B · Fenómenos en la Tierra</span>
                        <span className="text-[10px] text-[#68747d] font-normal">Paso 2: Haz pareja</span>
                      </div>

                      {matchRightItems.map((item) => {
                        const isMatched = matchedKeys.has(item.matchKey);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={isMatched || !selectedMatchLeft}
                            onClick={() => {
                              if (!selectedMatchLeft) return;
                              if (selectedMatchLeft === item.matchKey) {
                                setMatchedKeys(prev => {
                                  const next = new Set(prev);
                                  next.add(item.matchKey);
                                  return next;
                                });
                                setScore(prev => prev + 10);
                                setMatchStatusMsg({ ok: true, msg: '¡Excelente emparejamiento! +10 puntos.' });
                                setSelectedMatchLeft(null);
                              } else {
                                setMatchStatusMsg({ ok: false, msg: 'No coincide ese fenómeno con el concepto seleccionado. ¡Intenta de nuevo!' });
                                setSelectedMatchLeft(null);
                              }
                            }}
                            className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                              isMatched
                                ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-medium opacity-80 cursor-default'
                                : selectedMatchLeft
                                ? 'bg-white hover:bg-[#fffdf5] border-[#e7e4dc] hover:border-[#d7ad32] text-[#334155] cursor-pointer hover:shadow-xs'
                                : 'bg-[#f8f9fa] border-[#e7e4dc] text-[#94a3b8] cursor-not-allowed opacity-60'
                            }`}
                          >
                            <span className="text-xs leading-relaxed">{item.desc}</span>
                            {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {matchedKeys.size === matchLeftItems.length && (
                    <div className="bg-linear-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-2xl text-center space-y-2 shadow-lg animate-fade-in">
                      <div className="text-2xl">🎉 ¡Completado con Éxito!</div>
                      <p className="text-xs sm:text-sm font-medium m-0">
                        Has relacionado correctamente todas las fases del ciclo con sus fenómenos reales.
                      </p>
                    </div>
                  )}
                </div>
              ) : isMemory ? (
                /* ========================================================================= */
                /* CASO 5: JUEGO DE MEMORIA (MEMORY CARDS / MEMORAMA)                        */
                /* ========================================================================= */
                <div className="max-w-2xl mx-auto space-y-6 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbfaf6] border border-[#e7e4dc] p-4 rounded-2xl">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#d7ad32] tracking-wider block">
                        MEMORAMA INTERACTIVO · {subject || 'Historia'}
                      </span>
                      <h3 className="text-base font-black text-[#09243a] m-0">
                        {currentTopic}
                      </h3>
                      <p className="text-xs text-[#68747d] mt-0.5">
                        Voltea dos cartas por turno para encontrar las parejas de civilizaciones e inventos.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="bg-white border border-[#e7e4dc] px-3 py-1.5 rounded-xl text-xs font-bold text-[#09243a]">
                        Parejas: <span className="text-[#d7ad32] font-black">{solvedPairs.size} / 4</span>
                      </div>
                      <div className="bg-white border border-[#e7e4dc] px-3 py-1.5 rounded-xl text-xs font-bold text-[#68747d]">
                        Movimientos: {memoryMoves}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFlippedCards([]);
                          setSolvedPairs(new Set());
                          setMemoryMoves(0);
                        }}
                        className="p-2 bg-white hover:bg-[#f4f6f7] border border-[#e7e4dc] text-[#68747d] hover:text-[#09243a] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                        title="Barajar cartas"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4x2 Grid of Memory Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {initialMemoryCards.map((card) => {
                      const isSolved = solvedPairs.has(card.pairKey);
                      const isCurrentlyFlipped = flippedCards.includes(card.id);
                      const showFront = isSolved || isCurrentlyFlipped;

                      return (
                        <div
                          key={card.id}
                          onClick={() => {
                            if (showFront || flippedCards.length >= 2) return;
                            const newFlipped = [...flippedCards, card.id];
                            setFlippedCards(newFlipped);

                            if (newFlipped.length === 2) {
                              setMemoryMoves(prev => prev + 1);
                              const firstCard = initialMemoryCards.find(c => c.id === newFlipped[0]);
                              const secondCard = initialMemoryCards.find(c => c.id === newFlipped[1]);

                              if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
                                setSolvedPairs(prev => {
                                  const next = new Set(prev);
                                  next.add(firstCard.pairKey);
                                  return next;
                                });
                                setScore(prev => prev + 15);
                                setFlippedCards([]);
                              } else {
                                setTimeout(() => {
                                  setFlippedCards([]);
                                }, 900);
                              }
                            }
                          }}
                          className={`h-36 rounded-2xl border-2 transition-all p-3.5 flex flex-col items-center justify-between text-center select-none cursor-pointer shadow-xs ${
                            isSolved
                              ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                              : showFront
                              ? 'bg-white border-[#d7ad32] shadow-md ring-2 ring-[#d7ad32]/30 scale-102'
                              : 'bg-linear-to-br from-[#09243a] to-[#12395b] border-[#09243a] text-white hover:scale-102'
                          }`}
                        >
                          {showFront ? (
                            <>
                              <span className="text-xs font-black text-[#09243a]">
                                {card.label}
                              </span>
                              <span className="text-[10px] text-[#64748b] leading-tight">
                                {card.desc}
                              </span>
                              <span className="text-[9px] font-extrabold text-[#d7ad32] uppercase">
                                {isSolved ? '✓ Pareja resuelta' : 'Explorando'}
                              </span>
                            </>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-1.5 opacity-80">
                              <span className="text-xl">🃏</span>
                              <span className="text-[10px] font-bold tracking-widest text-[#d7ad32]">L.I.D.E.R.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {solvedPairs.size === 4 && (
                    <div className="bg-linear-to-r from-amber-500 to-yellow-600 text-white p-5 rounded-2xl text-center space-y-2 shadow-lg animate-fade-in">
                      <div className="text-2xl">🏆 ¡Memorama Completado!</div>
                      <p className="text-xs sm:text-sm font-medium m-0">
                        Has descubierto las 4 parejas históricas en solo {memoryMoves} movimientos.
                      </p>
                    </div>
                  )}
                </div>
              ) : isEscapeRoom ? (
                /* ========================================================================= */
                /* CASO 6: ESCAPE ROOM EDUCATIVO INTERACTIVO (CON CANDADOS)                  */
                /* ========================================================================= */
                <div className="max-w-2xl mx-auto space-y-6 py-3">
                  {/* Escape Progress Bar */}
                  <div className="bg-[#09243a] text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#d7ad32]" />
                      <div>
                        <div className="text-[10px] font-black uppercase text-[#d7ad32] tracking-wider">
                          Misión Escape Room
                        </div>
                        <h3 className="text-sm font-black m-0 text-white">
                          {escapeChallenges[escapeCurrentRoom]?.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {escapeChallenges.map((ch, idx) => {
                        const isUnlocked = escapeUnlockedRooms.has(idx);
                        const isCurrent = escapeCurrentRoom === idx;

                        return (
                          <button
                            key={ch.room}
                            type="button"
                            onClick={() => {
                              if (isUnlocked) setEscapeCurrentRoom(idx);
                            }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                              isCurrent
                                ? 'bg-[#d7ad32] text-[#09243a] ring-2 ring-white'
                                : isUnlocked
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }`}
                            title={`Sala ${ch.room}`}
                          >
                            {isUnlocked ? ch.room : <Lock className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Room Riddle Card */}
                  <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                    <div className="space-y-2">
                      <div className="inline-block bg-[#f8edc5] text-[#735a00] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Enigma Curricular · Sala {escapeCurrentRoom + 1} de {escapeChallenges.length}
                      </div>
                      <p className="text-xs sm:text-sm text-[#475569] italic bg-[#fbfaf6] border border-[#e7e4dc] p-3.5 rounded-xl leading-relaxed m-0">
                        "{escapeChallenges[escapeCurrentRoom]?.lore}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-sm sm:text-base text-[#09243a] block">
                        {escapeChallenges[escapeCurrentRoom]?.question}
                      </strong>
                    </div>

                    {/* Lock Input form */}
                    <div className="bg-[#fbfaf6] border-2 border-dashed border-[#d7ad32]/50 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#d7ad32]" />
                        <span className="text-xs font-bold text-[#09243a]">
                          Candado Digital: Ingresa el código numérico
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={escapeInputCode}
                          onChange={(e) => {
                            setEscapeInputCode(e.target.value);
                            setEscapeError(null);
                          }}
                          placeholder="Código..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-base font-black tracking-widest text-[#09243a] text-center uppercase outline-none focus:border-[#d7ad32] bg-white shadow-2xs"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const targetCode = escapeChallenges[escapeCurrentRoom]?.code;
                            if (escapeInputCode.trim() === targetCode) {
                              setScore(prev => prev + 25);
                              setEscapeUnlockedRooms(prev => {
                                const next = new Set(prev);
                                next.add(escapeCurrentRoom + 1);
                                return next;
                              });
                              setEscapeError(null);
                              setEscapeInputCode('');
                              setEscapeHintVisible(false);

                              if (escapeCurrentRoom + 1 < escapeChallenges.length) {
                                setEscapeCurrentRoom(prev => prev + 1);
                              }
                            } else {
                              setEscapeError('Candado trabado: código incorrecto. Vuelve a calcular o abre la pista.');
                            }
                          }}
                          className="px-5 py-2.5 bg-[#09243a] hover:bg-[#061a2b] text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Unlock className="w-3.5 h-3.5 text-[#d7ad32]" />
                          <span>Abrir</span>
                        </button>
                      </div>

                      {escapeError && (
                        <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{escapeError}</span>
                        </div>
                      )}
                    </div>

                    {/* Hint section */}
                    <div className="pt-2 border-t border-[#f4f6f7] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setEscapeHintVisible(!escapeHintVisible)}
                        className="text-xs font-bold text-[#d7ad32] hover:text-[#b58e22] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{escapeHintVisible ? 'Ocultar pista' : '💡 Pedir pista pedagógica'}</span>
                      </button>
                    </div>

                    {escapeHintVisible && (
                      <div className="bg-[#fffdf5] border border-[#d7ad32]/40 rounded-xl p-3.5 text-xs text-[#735a00] leading-relaxed">
                        <strong>Pista del mentor:</strong> {escapeChallenges[escapeCurrentRoom]?.hint}
                      </div>
                    )}
                  </div>

                  {escapeUnlockedRooms.has(escapeChallenges.length) && (
                    <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-3xl text-center space-y-2 shadow-xl animate-fade-in">
                      <div className="text-3xl">🔓 ¡Escape Room Superado!</div>
                      <p className="text-xs sm:text-sm font-medium m-0">
                        Has descifrado los 3 candados aplicando el Teorema de Pitágoras con rigor y agilidad mental.
                      </p>
                    </div>
                  )}
                </div>
              ) : isInfographic ? (
                /* ========================================================================= */
                /* CASO 7: INFOGRAFÍA EDUCATIVA INTERACTIVA (CON ESTILO VISUAL ACUARELA)     */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Header Banner */}
                  <div className="bg-linear-to-r from-[#eef7fa] via-[#e2f1f8] to-[#fbf7ee] border border-sky-200 p-5 rounded-3xl space-y-2 text-center shadow-xs">
                    <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                      <span>🎨 Estilo Acuarela Marina · /watercolor</span>
                      <span>•</span>
                      <span>/infographic</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#09243a] m-0">
                      {currentTopic}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#475569] max-w-xl mx-auto leading-relaxed">
                      Explora los 4 niveles ecológicos y la transferencia energética en los océanos.
                    </p>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="bg-white border border-[#e7e4dc] p-4 rounded-2xl text-center shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-black text-sky-700 block">71%</span>
                      <span className="text-xs font-bold text-[#09243a]">Superficie Marina</span>
                      <p className="text-[11px] text-[#64748b] mt-1 m-0">Cubre la mayor parte de la biosfera terrestre.</p>
                    </div>
                    <div className="bg-white border border-[#e7e4dc] p-4 rounded-2xl text-center shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">&gt;50%</span>
                      <span className="text-xs font-bold text-[#09243a]">Oxígeno Planetario</span>
                      <p className="text-[11px] text-[#64748b] mt-1 m-0">Generado por el fitoplancton fotosintético.</p>
                    </div>
                    <div className="bg-white border border-[#e7e4dc] p-4 rounded-2xl text-center shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 block">10%</span>
                      <span className="text-xs font-bold text-[#09243a]">Regla de Energía</span>
                      <p className="text-[11px] text-[#64748b] mt-1 m-0">Solo el 10% pasa al siguiente nivel trófico.</p>
                    </div>
                  </div>

                  {/* Interactive Trophic Levels Selector */}
                  <div className="bg-white border border-[#e7e4dc] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#f4f6f7] pb-3">
                      <strong className="text-xs sm:text-sm font-black text-[#09243a] uppercase tracking-wider">
                        Niveles de la Cadena Trófica (Haz clic para explorar)
                      </strong>
                      <span className="text-xs text-[#d7ad32] font-bold">
                        Nivel {activeTrophicLevel + 1} de 4
                      </span>
                    </div>

                    {/* Level Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { title: '1. Productores', sub: 'Fitoplancton', color: 'bg-emerald-50 text-emerald-950 border-emerald-300' },
                        { title: '2. Consumidores 1º', sub: 'Zooplancton & Krill', color: 'bg-sky-50 text-sky-950 border-sky-300' },
                        { title: '3. Consumidores 2º', sub: 'Peces & Calamares', color: 'bg-indigo-50 text-indigo-950 border-indigo-300' },
                        { title: '4. Depredadores', sub: 'Tiburones & Orcas', color: 'bg-purple-50 text-purple-950 border-purple-300' }
                      ].map((lvl, idx) => (
                        <button
                          key={lvl.title}
                          type="button"
                          onClick={() => setActiveTrophicLevel(idx)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            activeTrophicLevel === idx
                              ? 'bg-[#09243a] text-white border-[#09243a] shadow-md ring-2 ring-[#d7ad32]/40'
                              : 'bg-[#fbfaf6] hover:bg-white border-[#e7e4dc] text-[#09243a]'
                          }`}
                        >
                          <div className="text-xs font-black leading-tight">{lvl.title}</div>
                          <div className={`text-[10px] mt-0.5 ${activeTrophicLevel === idx ? 'text-[#f8edc5]' : 'text-[#64748b]'}`}>
                            {lvl.sub}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Active Level Detail Box */}
                    <div className="bg-[#fbfaf6] border border-[#e7e4dc] rounded-2xl p-4 sm:p-5 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d7ad32]"></span>
                        <h4 className="text-sm font-black text-[#09243a] m-0">
                          {activeTrophicLevel === 0 && 'Nivel 1: Productores Primarios (Fitoplancton y Algas)'}
                          {activeTrophicLevel === 1 && 'Nivel 2: Consumidores Primarios (Herbívoros Marinos)'}
                          {activeTrophicLevel === 2 && 'Nivel 3: Consumidores Secundarios (Carnívoros Medios)'}
                          {activeTrophicLevel === 3 && 'Nivel 4: Superdepredadores del Océano (Ápice Trófico)'}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed m-0">
                        {activeTrophicLevel === 0 && 'Microorganismos fotosintéticos flotantes que aprovechan la luz solar en las capas superficiales del océano para convertir carbono en nutrientes esenciales.'}
                        {activeTrophicLevel === 1 && 'Organismos como el krill, larvas y pequeños crustáceos que pastan sobre el fitoplancton y sirven de alimento a incontables especies marinas.'}
                        {activeTrophicLevel === 2 && 'Sardinas, arenques, calamares y peces juveniles que se alimentan de consumidores primarios y regulan el equilibrio poblacional intermedio.'}
                        {activeTrophicLevel === 3 && 'Orcas, tiburones blancos y atunes gigantes. No tienen depredadores naturales en su hábitat y mantienen la salud del ecosistema eliminando individuos enfermos.'}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Quick Retention Quiz */}
                  <div className="bg-white border border-[#e7e4dc] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#09243a]">
                      <Sparkles className="w-4 h-4 text-[#d7ad32]" />
                      <span>Comprobador de Retención de la Infografía:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#334155] m-0">
                      ¿Qué porcentaje aproximado de energía se transfiere de un nivel trófico al siguiente?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {['50%', '10%', '90%'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setInfoQuizAnswer(opt);
                            if (opt === '10%') {
                              setInfoQuizResult(true);
                              setScore(prev => prev + 15);
                            } else {
                              setInfoQuizResult(false);
                            }
                          }}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            infoQuizAnswer === opt
                              ? opt === '10%'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-rose-600 text-white border-rose-600'
                              : 'bg-[#fbfaf6] hover:bg-white border-[#e7e4dc] text-[#09243a]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {infoQuizResult !== null && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${infoQuizResult ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rose-50 text-rose-900 border border-rose-300'}`}>
                        {infoQuizResult ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        <span>{infoQuizResult ? '¡Correcto! Solo cerca del 10% se aprovecha, el resto se disipa como calor metabólico. (+15 pts)' : 'Incorrecto. Recuerda la "Regla del 10%" en ecología trófica.'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : isBooklet ? (
                /* ========================================================================= */
                /* CASO 8: FOLLETO PLEGABLE / TRÍPTICO (BOOKLET INTERACTIVO)                 */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Booklet Header */}
                  <div className="bg-[#09243a] text-white p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[#d7ad32] tracking-wider">
                        <span>📰 Folleto Tríptico de 3 Paneles</span>
                        <span>•</span>
                        <span>/booklet & /flatdesign</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white m-0 mt-0.5">
                        {currentTopic}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-[#f8edc5]">
                        Compromisos: {bookletChecks.size} / 3
                      </div>
                    </div>
                  </div>

                  {/* Trifold Panel Navigator */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 0, label: 'Portada Exterior' },
                      { id: 1, label: 'Panel 1: Nutrición' },
                      { id: 2, label: 'Panel 2: Ejercicio' },
                      { id: 3, label: 'Panel 3: Bienestar Digital' },
                      { id: 4, label: 'Autoevaluación' }
                    ].map((panel) => (
                      <button
                        key={panel.id}
                        type="button"
                        onClick={() => setActiveBookletPanel(panel.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          activeBookletPanel === panel.id
                            ? 'bg-[#09243a] text-white shadow-xs ring-2 ring-[#d7ad32]/40'
                            : 'bg-white text-[#68747d] hover:text-[#09243a] border border-[#e7e4dc]'
                        }`}
                      >
                        {panel.label}
                      </button>
                    ))}
                  </div>

                  {/* Panel Content Display (Simulating Foldable Trifold Sheet) */}
                  <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm min-h-[280px] flex flex-col justify-between">
                    {activeBookletPanel === 0 && (
                      <div className="text-center space-y-4 py-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#f8edc5] text-[#735a00] flex items-center justify-center font-black text-2xl mx-auto">
                          🌱
                        </div>
                        <h2 className="text-2xl font-black text-[#09243a]">
                          Guía Práctica de Vida Saludable
                        </h2>
                        <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                          Un decálogo diseñado para transformar tus hábitos cotidianos dentro y fuera del aula escolar.
                        </p>
                        <div className="inline-block bg-[#fbfaf6] border border-[#e7e4dc] px-4 py-2 rounded-xl text-xs font-bold text-[#09243a]">
                          Nivel: Secundaria · 3 Paneles Desplegables
                        </div>
                      </div>
                    )}

                    {activeBookletPanel === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#e7e4dc] pb-2">
                          <span className="text-xl">🥗</span>
                          <h4 className="text-base font-black text-[#09243a] m-0">Panel 1: Nutrición Inteligente</h4>
                        </div>
                        <ul className="text-xs sm:text-sm text-[#475569] space-y-2 list-disc pl-5 leading-relaxed">
                          <li>Prioriza el consumo de agua natural sobre bebidas azucaradas o energéticas.</li>
                          <li>Incluye al menos 3 colores de vegetales y frutas frescas en tu plato diario.</li>
                          <li>Evita saltarte el desayuno para mantener niveles estables de concentración escolar.</li>
                        </ul>
                      </div>
                    )}

                    {activeBookletPanel === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#e7e4dc] pb-2">
                          <span className="text-xl">🏃</span>
                          <h4 className="text-base font-black text-[#09243a] m-0">Panel 2: Movimiento y Descanso</h4>
                        </div>
                        <ul className="text-xs sm:text-sm text-[#475569] space-y-2 list-disc pl-5 leading-relaxed">
                          <li>Realiza al menos 45 minutos diarios de actividad física aeróbica o recreativa.</li>
                          <li>Haz pausas activas de estiramiento por cada 50 minutos de estudio sentado.</li>
                          <li>Duerme entre 7 y 8 horas diarias sin pantallas cerca de la almohada.</li>
                        </ul>
                      </div>
                    )}

                    {activeBookletPanel === 3 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#e7e4dc] pb-2">
                          <span className="text-xl">📱</span>
                          <h4 className="text-base font-black text-[#09243a] m-0">Panel 3: Higiene Digital y Enfoque</h4>
                        </div>
                        <ul className="text-xs sm:text-sm text-[#475569] space-y-2 list-disc pl-5 leading-relaxed">
                          <li>Silencia notificaciones no esenciales durante tus horarios de clase y lectura.</li>
                          <li>Aplica la regla 20-20-20: cada 20 minutos de pantalla, mira a 20 pies de distancia por 20 segundos.</li>
                          <li>Dedica tiempo diario a actividades sin conexión: arte, deporte o diálogo familiar.</li>
                        </ul>
                      </div>
                    )}

                    {activeBookletPanel === 4 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#e7e4dc] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">✅</span>
                            <h4 className="text-base font-black text-[#09243a] m-0">Mis 3 Compromisos de Hábitos</h4>
                          </div>
                          <span className="text-xs text-[#d7ad32] font-bold">
                            {bookletChecks.size === 3 ? '🎉 ¡Todos marcados!' : 'Marca tus metas'}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            'Beber 2 litros de agua y reducir refrescos azucarados',
                            'Realizar una pausa activa y estirar durante el estudio',
                            'Apagar pantallas 40 minutos antes de ir a dormir'
                          ].map((text, idx) => {
                            const isChecked = bookletChecks.has(idx);
                            return (
                              <button
                                key={text}
                                type="button"
                                onClick={() => {
                                  setBookletChecks(prev => {
                                    const next = new Set(prev);
                                    if (next.has(idx)) next.delete(idx);
                                    else {
                                      next.add(idx);
                                      setScore(s => s + 10);
                                    }
                                    return next;
                                  });
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                                  isChecked
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                    : 'bg-[#fbfaf6] hover:bg-white border-[#e7e4dc] text-[#475569]'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${
                                  isChecked ? 'bg-emerald-600 text-white' : 'border border-[#cbd5e1] bg-white'
                                }`}>
                                  {isChecked ? '✓' : ''}
                                </span>
                                <span className="text-xs sm:text-sm">{text}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Trifold Panel Footer Controls */}
                    <div className="pt-4 border-t border-[#f4f6f7] flex items-center justify-between">
                      <button
                        type="button"
                        disabled={activeBookletPanel === 0}
                        onClick={() => setActiveBookletPanel(prev => Math.max(0, prev - 1))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeBookletPanel === 0 ? 'opacity-40 cursor-not-allowed text-[#94a3b8]' : 'bg-[#fbfaf6] hover:bg-white border border-[#e7e4dc] text-[#09243a]'
                        }`}
                      >
                        ← Panel anterior
                      </button>

                      <button
                        type="button"
                        disabled={activeBookletPanel === 4}
                        onClick={() => setActiveBookletPanel(prev => Math.min(4, prev + 1))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeBookletPanel === 4 ? 'opacity-40 cursor-not-allowed text-[#94a3b8]' : 'bg-[#09243a] hover:bg-[#061a2b] text-white shadow-xs'
                        }`}
                      >
                        Siguiente panel →
                      </button>
                    </div>
                  </div>
                </div>
              ) : isWheel ? (
                /* ========================================================================= */
                /* CASO 9: RULETA ESPACIAL DE DESAFÍOS (/wheel + /space + /cartoon)          */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Space Cartoon Cosmic Header */}
                  <div className="bg-linear-to-r from-[#061226] via-[#0b2247] to-[#130b2e] border-2 border-indigo-500/40 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-3xl opacity-20 pointer-events-none select-none">
                      🪐 ✨ 🚀 ⭐
                    </div>

                    <div className="space-y-1 relative z-10">
                      <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <span>🎡 Ruleta Espacial Cartoon</span>
                        <span>•</span>
                        <span>/wheel & /space</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white m-0">
                        {currentTopic} · Misión Cósmica
                      </h3>
                      <p className="text-xs text-sky-200 m-0">
                        Gira la ruleta galáctica, aterriza en un planeta y resuelve su enigma cósmico.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 relative z-10 shrink-0">
                      <div className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#f8edc5]">
                        Giros: {spinsCount}
                      </div>
                      <div className="bg-[#d7ad32] text-[#09243a] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Wheel & Action Area */}
                  <div className="bg-linear-to-b from-[#091b38] to-[#040e1f] border-2 border-indigo-400/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl relative">
                    
                    {/* Top Pointer Needle (Fixed Arrow pointing down at wheel) */}
                    <div className="relative flex flex-col items-center">
                      <div className="z-20 -mb-4 filter drop-shadow-md">
                        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-[#d7ad32] animate-bounce"></div>
                      </div>

                      {/* The Rotating Wheel SVG */}
                      <div className="relative p-2 rounded-full border-4 border-[#d7ad32]/40 bg-[#06142c] shadow-[0_0_40px_rgba(215,173,50,0.25)]">
                        <svg
                          width="290"
                          height="290"
                          viewBox="0 0 300 300"
                          style={{
                            transform: `rotate(${wheelRotation}deg)`,
                            transition: isSpinning ? 'transform 3.5s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
                          }}
                          className="rounded-full select-none"
                        >
                          {wheelSectors.map((sector, idx) => (
                            <g key={sector.id} transform={`rotate(${idx * 45} 150 150)`}>
                              {/* 45 degree sector path */}
                              <path
                                d="M 150 150 L 277.5 97.2 A 138 138 0 0 1 277.5 202.8 Z"
                                fill={sector.color}
                                stroke="#ffffff"
                                strokeWidth="2"
                              />
                              {/* Sector label & emoji */}
                              <text
                                x="224"
                                y="154"
                                fill={sector.textColor}
                                fontSize="10.5"
                                fontWeight="bold"
                                textAnchor="middle"
                                transform="rotate(0 224 150)"
                              >
                                {sector.label}
                              </text>
                            </g>
                          ))}

                          {/* Outer rim */}
                          <circle cx="150" cy="150" r="144" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.6" />

                          {/* Center Hub */}
                          <circle cx="150" cy="150" r="32" fill="#09243a" stroke="#d7ad32" strokeWidth="3" />
                          <circle cx="150" cy="150" r="26" fill="#133555" />
                          <text x="150" y="147" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
                            L.I.D.E.R.
                          </text>
                          <text x="150" y="158" fill="#d7ad32" fontSize="7" fontWeight="black" textAnchor="middle">
                            SPACE 🚀
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* Spin Button */}
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        disabled={isSpinning}
                        onClick={() => {
                          if (isSpinning) return;
                          setIsSpinning(true);
                          setSelectedWheelSector(null);
                          setWheelAnswerSelected(null);
                          setWheelAnswerFeedback(null);
                          setSpinsCount(c => c + 1);

                          // Pick random target sector
                          const targetIdx = Math.floor(Math.random() * wheelSectors.length);
                          
                          // In SVG coordinates, the needle is at top (270 degrees).
                          // Slice targetIdx has a base angle of (targetIdx * 45) degrees.
                          // When rotated by R degrees, slice targetIdx is at: (targetIdx * 45 + R) % 360 = 270 degrees.
                          // So the required angle modulo 360 is: (270 - targetIdx * 45 + 3600) % 360.
                          const targetAngleMod = (270 - targetIdx * 45 + 3600) % 360;
                          
                          const currentMod = wheelRotation % 360;
                          let delta = targetAngleMod - currentMod;
                          if (delta < 0) {
                            delta += 360;
                          }
                          
                          // Add 5 to 7 full rotations (clockwise)
                          const extraTurns = (5 + Math.floor(Math.random() * 3)) * 360;
                          const newAngle = wheelRotation + extraTurns + delta;

                          setWheelRotation(newAngle);

                          // Reveal result after 3.5s
                          setTimeout(() => {
                            setIsSpinning(false);
                            setSelectedWheelSector(wheelSectors[targetIdx]);
                          }, 3500);
                        }}
                        className={`px-8 py-4 rounded-2xl font-black text-sm sm:text-base transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                          isSpinning
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-linear-to-r from-[#d7ad32] to-[#f59e0b] hover:from-[#c99f2b] hover:to-[#d97706] text-[#09243a] hover:scale-105 active:scale-95 ring-4 ring-[#d7ad32]/30'
                        }`}
                      >
                        <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                        <span>{isSpinning ? '¡Girando por el cosmos...!' : '¡GIRAR RULETA ESPACIAL!'}</span>
                      </button>
                    </div>

                    {/* Result / Planetary Challenge Card */}
                    {selectedWheelSector && (
                      <div className="w-full bg-[#fbfaf6] border-2 border-[#d7ad32] rounded-3xl p-6 text-[#09243a] space-y-4 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between border-b border-[#e7e4dc] pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{selectedWheelSector.label.split(' ')[0]}</span>
                            <div>
                              <span className="text-[10px] font-black uppercase text-[#d7ad32] tracking-wider block">
                                Desafío Desbloqueado
                              </span>
                              <h4 className="text-base sm:text-lg font-black text-[#09243a] m-0">
                                {selectedWheelSector.label}
                              </h4>
                            </div>
                          </div>

                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                            +20 pts al acertar
                          </span>
                        </div>

                        <div className="space-y-3">
                          <p className="text-sm font-bold text-[#09243a] m-0 leading-relaxed">
                            {selectedWheelSector.question}
                          </p>

                          {/* Multiple Choice Options */}
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {selectedWheelSector.options.map((opt, oIdx) => {
                              const isSelected = wheelAnswerSelected === oIdx;
                              const isCorrect = oIdx === selectedWheelSector.correct;

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  disabled={wheelAnswerSelected !== null}
                                  onClick={() => {
                                    setWheelAnswerSelected(oIdx);
                                    if (isCorrect) {
                                      setScore(s => s + 20);
                                      setWheelAnswerFeedback({
                                        ok: true,
                                        msg: '¡Misión cumplida! Respuesta correcta (+20 puntos).',
                                        funFact: selectedWheelSector.funFact
                                      });
                                    } else {
                                      setWheelAnswerFeedback({
                                        ok: false,
                                        msg: '¡Cerca del cometa! Esa no era la respuesta correcta.',
                                        funFact: selectedWheelSector.funFact
                                      });
                                    }
                                  }}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-between ${
                                    wheelAnswerSelected === null
                                      ? 'bg-white hover:bg-[#fffdf5] border-[#e7e4dc] hover:border-[#d7ad32] text-[#09243a]'
                                      : isCorrect
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                      : isSelected
                                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                      : 'bg-[#f8f9fa] border-[#e7e4dc] text-[#94a3b8] opacity-60'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {wheelAnswerSelected !== null && isCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Feedback & Space Fun Fact */}
                          {wheelAnswerFeedback && (
                            <div className={`p-4 rounded-2xl space-y-2 border ${
                              wheelAnswerFeedback.ok ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-amber-50 text-amber-950 border-amber-300'
                            }`}>
                              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                                {wheelAnswerFeedback.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                                <span>{wheelAnswerFeedback.msg}</span>
                              </div>
                              <div className="text-xs bg-white/70 p-3 rounded-xl border border-black/5 leading-relaxed">
                                <strong>💡 Curiosidad Cósmica:</strong> {wheelAnswerFeedback.funFact}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ) : isComic ? (
                /* ========================================================================= */
                /* CASO 10: CÓMIC DIDÁCTICO / HISTORIETA EDUCATIVA (/comicdidactico)         */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Comic Header Banner */}
                  <div className="bg-linear-to-r from-[#1c1917] via-[#292524] to-[#44403c] border-2 border-amber-500/50 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <span>💬 Historieta Didáctica</span>
                        <span>•</span>
                        <span>/comicdidactico</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white m-0">
                        Aventuras en el Aprendizaje: {currentTopic}
                      </h3>
                      <p className="text-xs text-amber-200 m-0">
                        Narrativa visual en viñetas: descubre el dilema, reflexiona con el mentor y resuelve la misión.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200">
                        Viñeta {activeComicPanel + 1} de 4
                      </div>
                      <div className="bg-[#d7ad32] text-[#09243a] px-3 py-1.5 rounded-xl text-xs font-black shadow-md">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Comic Strip Container */}
                  <div className="bg-[#fefce8] border-4 border-[#09243a] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
                    
                    {/* Narrator Caption Box (Cartela de Narrador) */}
                    <div className="bg-[#fef08a] border-2 border-[#09243a] p-3.5 rounded-xl shadow-xs text-xs font-bold text-[#451a03] flex items-center gap-2.5">
                      <span className="bg-[#09243a] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                        NARRADOR
                      </span>
                      <span>
                        {activeComicPanel === 0 && `En un aula cotidiana, Sofía se enfrenta por primera vez a los misterios de ${currentTopic}...`}
                        {activeComicPanel === 1 && `Al revisar el primer desafío, surge la confusión: ¿cómo distinguir lo esencial de lo secundario?`}
                        {activeComicPanel === 2 && `El mentor guía el momento del descubrimiento: conectar la causa y el efecto transforma la mirada.`}
                        {activeComicPanel === 3 && `¡Misión cumplida! El aprendizaje se vuelve inolvidable y se convierte en acción transformadora.`}
                      </span>
                    </div>

                    {/* Comic Main Panel Scene */}
                    <div className="bg-white border-3 border-[#09243a] rounded-2xl p-6 shadow-md min-h-[260px] flex flex-col justify-between relative overflow-hidden">
                      {/* Decorative Comic Dots Background */}
                      <div className="absolute top-2 right-3 text-4xl opacity-15 select-none pointer-events-none">
                        🗯️ 💥 ✨
                      </div>

                      {/* Characters and Dialogue Bubbles */}
                      <div className="space-y-4 relative z-10">
                        {/* Student Bubble (Left) */}
                        <div className="flex items-start gap-3 max-w-md">
                          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-[#09243a] flex items-center justify-center text-2xl shadow-xs shrink-0">
                            🧑‍🎓
                          </div>
                          <div className="bg-[#f0f9ff] border-2 border-[#09243a] rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs sm:text-sm font-bold text-[#0c4a6e] relative">
                            {activeComicPanel === 0 && `“Profesor, ¿por qué es tan fundamental entender ${currentTopic}? ¡A veces parece muy abstracto!”`}
                            {activeComicPanel === 1 && `“¡Espere! Si no entiendo los principios rectores, cometeré errores en las decisiones prácticas.”`}
                            {activeComicPanel === 2 && `“¡Eureka! Ahora veo la conexión: cada elemento sostiene al siguiente en equilibrio.”`}
                            {activeComicPanel === 3 && `“¡Increíble! A partir de hoy, aplicaré esta lección en mis propios proyectos y decisiones.”`}
                          </div>
                        </div>

                        {/* Mentor Bubble (Right) */}
                        <div className="flex items-start justify-end gap-3 max-w-md ml-auto">
                          <div className="bg-[#fdf2f8] border-2 border-[#09243a] rounded-2xl rounded-tr-none p-3.5 shadow-sm text-xs sm:text-sm font-bold text-[#831843] text-right relative">
                            {activeComicPanel === 0 && `“¡Gran pregunta, Sofía! ${currentTopic} no es solo teoría; es el principio que ordena todo el sistema en la práctica.”`}
                            {activeComicPanel === 1 && `“¡Exacto! Observa qué ocurre cuando analizamos las relaciones de causa y efecto con pensamiento crítico.”`}
                            {activeComicPanel === 2 && `“¡Brillante! Has desbloqueado el núcleo pedagógico: no memorizar, sino comprender para actuar.”`}
                            {activeComicPanel === 3 && `“Ese es el verdadero liderazgo educativo: el conocimiento con propósito que transforma la realidad.”`}
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-[#09243a] flex items-center justify-center text-2xl shadow-xs shrink-0">
                            👩‍🏫
                          </div>
                        </div>
                      </div>

                      {/* Interactive Comic Onomatopoeia Button */}
                      <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const sounds = ['¡BOOM! 💥', '¡EUREKA! ✨', '¡CLICK! 💡', '¡ZAS! ⚡'];
                            setComicSoundPlayed(sounds[activeComicPanel]);
                            setScore(s => s + 5);
                            setTimeout(() => setComicSoundPlayed(null), 1800);
                          }}
                          className="px-3.5 py-1.5 bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] font-black rounded-xl text-xs border-2 border-[#09243a] shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Tocar onomatopeya</span>
                          <span>(+5 pts)</span>
                        </button>

                        {comicSoundPlayed && (
                          <span className="font-black text-sm text-[#09243a] animate-bounce bg-amber-200 px-3 py-1 rounded-lg border border-[#09243a]">
                            {comicSoundPlayed}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comic Panel Navigation Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        disabled={activeComicPanel === 0}
                        onClick={() => setActiveComicPanel(p => Math.max(0, p - 1))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 border-[#09243a] transition-all cursor-pointer ${
                          activeComicPanel === 0 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white hover:bg-slate-50 text-[#09243a] shadow-xs'
                        }`}
                      >
                        ← Viñeta anterior
                      </button>

                      {/* Dots indicator */}
                      <div className="flex items-center gap-2">
                        {[0, 1, 2, 3].map((dot) => (
                          <button
                            key={dot}
                            type="button"
                            onClick={() => setActiveComicPanel(dot)}
                            className={`w-3.5 h-3.5 rounded-full border-2 border-[#09243a] transition-all ${
                              activeComicPanel === dot ? 'bg-[#d7ad32] scale-125' : 'bg-white hover:bg-amber-100'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={activeComicPanel === 3}
                        onClick={() => setActiveComicPanel(p => Math.min(3, p + 1))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 border-[#09243a] transition-all cursor-pointer ${
                          activeComicPanel === 3 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-[#09243a] hover:bg-[#061a2b] text-white shadow-xs'
                        }`}
                      >
                        Siguiente viñeta →
                      </button>
                    </div>

                    {/* Comprehension Quiz at the end of Comic */}
                    {activeComicPanel === 3 && (
                      <div className="bg-white border-2 border-[#09243a] rounded-2xl p-5 space-y-3 animate-in fade-in">
                        <span className="text-[10px] font-black uppercase text-[#d7ad32] tracking-wider block">
                          RETO DE COMPRENSIÓN DEL CÓMIC (+20 PTS)
                        </span>
                        <h4 className="text-sm font-bold text-[#09243a] m-0">
                          ¿Cuál es la moraleja formativa que descubre Sofía al comprender &quot;{currentTopic}&quot;?
                        </h4>

                        <div className="space-y-2 pt-1">
                          {[
                            'El conocimiento cobra verdadero sentido cuando se comprende para aplicarlo y transformar la realidad.',
                            'Es suficiente con memorizar los términos clave antes del examen final.',
                            'Los principios teóricos nunca tienen relación con los problemas de la vida cotidiana.'
                          ].map((opt, idx) => {
                            const isCorrect = idx === 0;
                            const isSelected = comicQuizAnswer === idx;

                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={comicQuizAnswer !== null}
                                onClick={() => {
                                  setComicQuizAnswer(idx);
                                  if (isCorrect) setScore(s => s + 20);
                                }}
                                className={`w-full text-left p-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                  comicQuizAnswer === null
                                    ? 'bg-[#fbfaf6] hover:bg-white border-[#e7e4dc] hover:border-[#09243a] text-[#09243a]'
                                    : isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                    : isSelected
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                    : 'opacity-50 border-[#e7e4dc] text-slate-400'
                                }`}
                              >
                                <span>{opt}</span>
                                {comicQuizAnswer !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ) : isDiagram ? (
                /* ========================================================================= */
                /* CASO 11: DIAGRAMA PEDAGÓGICO DE FLUJO / PROCESOS (/diagrama)              */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Diagram Header */}
                  <div className="bg-linear-to-r from-[#032b43] via-[#094067] to-[#14213d] border-2 border-sky-400/40 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <span>📊 Diagrama Pedagógico de Flujo</span>
                        <span>•</span>
                        <span>/diagrama</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white m-0">
                        Ruta de Decisión y Proceso: {currentTopic}
                      </h3>
                      <p className="text-xs text-sky-200 m-0">
                        Simula la secuencia operativa paso a paso y toma decisiones pedagógicas para alcanzar el objetivo.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-200">
                        Paso {activeDiagramNode + 1} de 5
                      </div>
                      <div className="bg-[#d7ad32] text-[#09243a] px-3 py-1.5 rounded-xl text-xs font-black shadow-md">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Interactive Flow Diagram Stages */}
                  <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    
                    {/* Visual Stages Timeline */}
                    <div className="space-y-4">
                      {[
                        {
                          id: 0,
                          title: '1. Entrada y Diagnóstico Inicial',
                          icon: '🟢',
                          color: 'border-emerald-500 bg-emerald-50/60',
                          desc: `Identificación de conocimientos previos y definición del reto en torno a "${currentTopic}".`
                        },
                        {
                          id: 1,
                          title: '2. Procesamiento y Andamiaje L.I.D.E.R.',
                          icon: '🔵',
                          color: 'border-blue-500 bg-blue-50/60',
                          desc: 'Estructuración modular de contenidos, conexión conceptual y reducción de la sobrecarga cognitiva.'
                        },
                        {
                          id: 2,
                          title: '3. Nodo de Decisión Curricular',
                          icon: '🟡',
                          isDecision: true,
                          color: 'border-amber-500 bg-amber-50/60',
                          desc: '¿La comprensión del estudiante cumple con los criterios y competencias clave evaluadas?'
                        },
                        {
                          id: 3,
                          title: '4. Implementación y Aplicación Real',
                          icon: '🟣',
                          color: 'border-purple-500 bg-purple-50/60',
                          desc: 'Puesta en marcha de la actividad práctica con validación activa y retroalimentación oportuna.'
                        },
                        {
                          id: 4,
                          title: '5. Cierre Formativo y Transferencia',
                          icon: '🏁',
                          color: 'border-teal-500 bg-teal-50/60',
                          desc: 'Consolidación del aprendizaje, metacognición compartida y aplicabilidad en nuevos contextos.'
                        }
                      ].map((stage, idx) => {
                        const isCurrent = activeDiagramNode === idx;
                        const isPassed = activeDiagramNode > idx;

                        return (
                          <div key={stage.id} className="relative">
                            <div
                              onClick={() => {
                                setActiveDiagramNode(idx);
                                if (!isPassed && !isCurrent) setScore(s => s + 5);
                              }}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                isCurrent
                                  ? `${stage.color} ring-4 ring-sky-100 shadow-md scale-[1.01]`
                                  : isPassed
                                  ? 'bg-[#f8fafc] border-emerald-300 text-slate-700'
                                  : 'bg-[#fafafa] border-[#e7e4dc] opacity-60 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{stage.icon}</span>
                                  <div>
                                    <h4 className="text-sm sm:text-base font-black text-[#09243a] m-0">
                                      {stage.title}
                                    </h4>
                                    <p className="text-xs text-slate-600 m-0 mt-0.5">
                                      {stage.desc}
                                    </p>
                                  </div>
                                </div>

                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0 ${
                                  isCurrent ? 'bg-[#09243a] text-white' : isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {isCurrent ? 'Activo' : isPassed ? '✓ Superado' : 'Pendiente'}
                                </span>
                              </div>

                              {/* Decision Branching UI if Stage 2 (Decision Diamond) */}
                              {stage.isDecision && isCurrent && (
                                <div className="mt-4 pt-3 border-t border-amber-200/80 space-y-2">
                                  <span className="text-[11px] font-bold text-amber-900 block">
                                    Bifurcación de Decisión: Selecciona la ruta del flujo:
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDiagramDecision('yes');
                                        setActiveDiagramNode(3);
                                        setScore(s => s + 15);
                                      }}
                                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>[ SÍ ] Avanzar a Implementación (+15 pts)</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDiagramDecision('no');
                                        setActiveDiagramNode(1);
                                      }}
                                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                      <span>[ NO ] Bucle de Ajuste (Volver a Paso 2)</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Down Arrow between stages */}
                            {idx < 4 && (
                              <div className="flex justify-center my-1.5 text-slate-300">
                                <ArrowRight className="w-4 h-4 rotate-90" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Diagram Controls */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDiagramNode(0);
                          setDiagramDecision(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reiniciar Diagrama</span>
                      </button>

                      <button
                        type="button"
                        disabled={activeDiagramNode === 4}
                        onClick={() => {
                          setActiveDiagramNode(n => Math.min(4, n + 1));
                          setScore(s => s + 10);
                        }}
                        className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeDiagramNode === 4
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-[#09243a] hover:bg-[#061a2b] text-white shadow-md'
                        }`}
                      >
                        <span>{activeDiagramNode === 4 ? '🎉 ¡Proceso Completado!' : 'Avanzar al siguiente paso →'}</span>
                      </button>
                    </div>

                  </div>
                </div>
              ) : isTimeline ? (
                /* ========================================================================= */
                /* CASO 12: LÍNEA DEL TIEMPO CRONOLÓGICA INTERACTIVA (/timeline)             */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Timeline Header */}
                  <div className="bg-linear-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] border-2 border-indigo-400/40 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <span>⏳ Línea del Tiempo Cronológica</span>
                        <span>•</span>
                        <span>/timeline</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white m-0">
                        Eje Temporal: {currentTopic}
                      </h3>
                      <p className="text-xs text-indigo-200 m-0">
                        Explora la secuencia cronológica de hitos, causas y transformaciones históricas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-200">
                        Hito {activeTimelineStep + 1} de 5
                      </div>
                      <div className="bg-[#d7ad32] text-[#09243a] px-3 py-1.5 rounded-xl text-xs font-black shadow-md">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Timeline Interactive Canvas */}
                  <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    {/* Horizontal Step Buttons */}
                    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                      {['Hito 1 · Origen', 'Hito 2 · Crisis', 'Hito 3 · Giro', 'Hito 4 · Expansión', 'Hito 5 · Legado'].map((label, idx) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            setActiveTimelineStep(idx);
                            setScore(s => s + 5);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                            activeTimelineStep === idx
                              ? 'bg-[#09243a] text-white shadow-md scale-105'
                              : 'bg-[#f4f6f7] hover:bg-[#e7e4dc] text-[#68747d]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Active Milestone Card */}
                    <div className="bg-linear-to-b from-[#f8fafc] to-white border-2 border-indigo-200 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase">
                          {activeTimelineStep === 0 && 'AÑO FUNDACIONAL / ETAPA INICIAL'}
                          {activeTimelineStep === 1 && 'PRIMER DILEMA HISTÓRICO'}
                          {activeTimelineStep === 2 && 'PUNTO DE INFLEXIÓN Y RUPTURA'}
                          {activeTimelineStep === 3 && 'CONSOLIDACIÓN Y TRANSFORMACIÓN'}
                          {activeTimelineStep === 4 && 'PRESENTE Y TRASCENDENCIA'}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {activeTimelineStep + 1} de 5 hitos
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-lg sm:text-xl font-black text-[#09243a] m-0">
                          {activeTimelineStep === 0 && `Los Antecedentes y el Origen de "${currentTopic}"`}
                          {activeTimelineStep === 1 && `El Conflicto Inicial y las Primeras Tensiones`}
                          {activeTimelineStep === 2 && `El Descubrimiento o Acontecimiento Decisivo`}
                          {activeTimelineStep === 3 && `La Difusión y el Impacto en la Comunidad`}
                          {activeTimelineStep === 4 && `El Legado Histórico en la Actualidad`}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                          {activeTimelineStep === 0 && `Se establecen las primeras bases conceptuales y sociales. Sin este momento inicial, los desarrollos posteriores en ${currentTopic} no habrían tenido lugar.`}
                          {activeTimelineStep === 1 && `Surgen los primeros desafíos y la necesidad imperiosa de transformar las estructuras vigentes para responder a las nuevas demandas.`}
                          {activeTimelineStep === 2 && `El momento de quiebre donde se formula el principio rector o se produce el cambio que reconfigura el paradigma por completo.`}
                          {activeTimelineStep === 3 && `El conocimiento o modelo se consolida, expandiéndose a nuevos ámbitos e inspirando a generaciones sucesivas.`}
                          {activeTimelineStep === 4 && `Las lecciones aprendidas se convierten en patrimonio cultural y formativo, guiando nuestras decisiones en el siglo XXI.`}
                        </p>
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          disabled={activeTimelineStep === 0}
                          onClick={() => setActiveTimelineStep(s => Math.max(0, s - 1))}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f4f6f7] hover:bg-[#e7e4dc] disabled:opacity-40 text-[#09243a] cursor-pointer"
                        >
                          ← Hito anterior
                        </button>
                        <button
                          type="button"
                          disabled={activeTimelineStep === 4}
                          onClick={() => {
                            setActiveTimelineStep(s => Math.min(4, s + 1));
                            setScore(sc => sc + 10);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-black bg-[#09243a] hover:bg-[#061a2b] disabled:opacity-40 text-white cursor-pointer shadow-xs"
                        >
                          Siguiente hito →
                        </button>
                      </div>
                    </div>

                    {/* Timeline Quiz Challenge */}
                    <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                          DESAFÍO CRONOLÓGICO (+15 PTS)
                        </span>
                        <span className="text-xs font-bold text-amber-800">
                          Comprensión Temporal
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#09243a] m-0">
                        ¿Por qué es fundamental estudiar la secuencia cronológica al analizar &quot;{currentTopic}&quot;?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {[
                          { text: 'Porque nos permite entender las causas, la evolución y las consecuencias reales.', correct: true },
                          { text: 'Porque solo importa memorizar las fechas exactas para el examen final.', correct: false }
                        ].map((opt, oIdx) => (
                          <button
                            key={opt.text}
                            type="button"
                            disabled={timelineQuizAnswer !== null}
                            onClick={() => {
                              setTimelineQuizAnswer(oIdx);
                              if (opt.correct) setScore(s => s + 15);
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                              timelineQuizAnswer === null
                                ? 'bg-white hover:border-[#d7ad32] border-[#e7e4dc] text-[#09243a]'
                                : opt.correct
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : oIdx === timelineQuizAnswer
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'opacity-40 border-[#e7e4dc] text-slate-400'
                            }`}
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ) : isCompare ? (
                /* ========================================================================= */
                /* CASO 13: TABLA COMPARATIVA A vs B (/compare)                              */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  {/* Compare Header */}
                  <div className="bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#334155] border-2 border-slate-600 text-white p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <span>⚖️ Tabla Comparativa A vs B</span>
                        <span>•</span>
                        <span>/compare</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white m-0">
                        Análisis Comparativo: {currentTopic}
                      </h3>
                      <p className="text-xs text-slate-300 m-0">
                        Descubre similitudes, contrastes y la clave fundamental para diferenciarlos sin confusión.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-[#d7ad32] text-[#09243a] px-3 py-1.5 rounded-xl text-xs font-black shadow-md">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Dual Column Comparative Grid */}
                  <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    {/* Filter Tabs */}
                    <div className="flex items-center justify-center gap-2 border-b border-slate-100 pb-4">
                      {[
                        { id: 'both', label: 'Ver Ambos (A vs B)' },
                        { id: 'A', label: 'Enfocar Concepto A' },
                        { id: 'B', label: 'Enfocar Concepto B' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setCompareActiveTab(t.id as any)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            compareActiveTab === t.id
                              ? 'bg-[#09243a] text-white shadow-xs'
                              : 'bg-[#f4f6f7] hover:bg-[#e7e4dc] text-[#68747d]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Columns Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Concept A Column (Blue) */}
                      {(compareActiveTab === 'both' || compareActiveTab === 'A') && (
                        <div className="bg-blue-50/60 border-2 border-blue-300 rounded-3xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                                A
                              </span>
                              <h4 className="text-base font-black text-blue-950 m-0">
                                Primera Perspectiva
                              </h4>
                            </div>
                            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                              Categoría 1
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-xs">
                              <strong className="text-blue-950 block mb-0.5">🔹 Definición Esencial:</strong>
                              <span className="text-slate-600">Estructura primaria orientada al funcionamiento interno y directo.</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-xs">
                              <strong className="text-blue-950 block mb-0.5">🔹 Composición y Rasgos:</strong>
                              <span className="text-slate-600">Elementos rígidos, secuenciales y de alta estabilidad en el sistema.</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-xs">
                              <strong className="text-blue-950 block mb-0.5">🔹 Ejemplos Representativos:</strong>
                              <span className="text-slate-600">Modelos base, casos canónicos y reglas de aplicación constante.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Concept B Column (Rose/Purple) */}
                      {(compareActiveTab === 'both' || compareActiveTab === 'B') && (
                        <div className="bg-rose-50/60 border-2 border-rose-300 rounded-3xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center">
                                B
                              </span>
                              <h4 className="text-base font-black text-rose-950 m-0">
                                Segunda Perspectiva
                              </h4>
                            </div>
                            <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                              Categoría 2
                            </span>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-xs">
                              <strong className="text-rose-950 block mb-0.5">🔸 Definición Esencial:</strong>
                              <span className="text-slate-600">Estructura flexible orientada a la adaptación, el cambio y el contexto.</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-xs">
                              <strong className="text-rose-950 block mb-0.5">🔸 Composición y Rasgos:</strong>
                              <span className="text-slate-600">Elementos dinámicos, adaptables y con múltiples rutas de interacción.</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-rose-100 shadow-xs">
                              <strong className="text-rose-950 block mb-0.5">🔸 Ejemplos Representativos:</strong>
                              <span className="text-slate-600">Modelos abiertos, variantes contemporáneas y situaciones emergentes.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Key Distinction Box (La Diferencia Clave 🔑) */}
                    <div className="bg-linear-to-r from-amber-50 via-[#fef9c3] to-amber-50 border-3 border-[#d7ad32] rounded-3xl p-5 sm:p-6 text-center shadow-md space-y-3">
                      <div className="inline-flex items-center gap-2 bg-[#d7ad32] text-[#09243a] text-xs font-black px-3 py-1 rounded-full uppercase">
                        <span>🔑 LA DIFERENCIA CLAVE</span>
                      </div>

                      <p className="text-sm sm:text-base font-bold text-[#09243a] m-0 max-w-xl mx-auto leading-relaxed">
                        {compareRevealedKey 
                          ? `Mientras que la Categoría A se enfoca en la solidez y estabilidad interna, la Categoría B prioriza la adaptabilidad y respuesta al entorno exterior.`
                          : 'Haz clic en el botón para desbloquear la síntesis que nunca olvidarás:'}
                      </p>

                      {!compareRevealedKey && (
                        <button
                          type="button"
                          onClick={() => {
                            setCompareRevealedKey(true);
                            setScore(s => s + 10);
                          }}
                          className="px-5 py-2.5 bg-[#09243a] hover:bg-[#061a2b] text-[#fde047] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          🔓 Revelar la Diferencia Clave (+10 pts)
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ) : isGameArena ? (
                /* ========================================================================= */
                /* CASO 13: ARENA DE JUEGO GAMIFICADO E INTERACTIVO (MARIO, MINECRAFT, ETC.)  */
                /* ========================================================================= */
                <div className="max-w-3xl mx-auto space-y-6 py-2">
                  
                  {/* Selector de Estilo de Juego / Temática */}
                  <div className="bg-[#09243a] text-white p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-[#d7ad32]/40">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-[#d7ad32] text-[#09243a] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        <span>🎮 ARENA GAMIFICADA 2.0</span>
                        <span>•</span>
                        <span>INTERACTIVIDAD REAL</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white m-0">
                        {activeGameTheme === 'mariokart' ? '🏎️ Mario Kart: Gran Premio del Saber' :
                         activeGameTheme === 'minecraft' ? '⛏️ Minecraft: Aventura de Crafteo Voxel' :
                         activeGameTheme === 'roblox' ? '🧱 Roblox: Obby Parkour de Obstáculos' :
                         activeGameTheme === 'lego' ? '🧩 Lego: Construcción con Ladrillos 3D' :
                         activeGameTheme === 'pokemon' ? '⚡ Pokémon: Batalla RPG de Gimnasio' :
                         '🕹️ Arcade Retro: Máquina Recreativa 8-Bit'}
                      </h3>
                      <p className="text-xs text-[#d6e1e7] m-0">
                        Misión: {currentTopic} · Supera cada etapa para desbloquear premios.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDuaSupportActive(!duaSupportActive)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          duaSupportActive 
                            ? 'bg-[#d7ad32] text-[#09243a] ring-2 ring-white/50 shadow-md' 
                            : 'bg-white/10 hover:bg-white/20 text-[#d6e1e7] border border-white/20'
                        }`}
                        title="Activar apoyos del Diseño Universal para el Aprendizaje (Recta numérica y pistas visuales)"
                      >
                        <span>🧩 DUA {duaSupportActive ? 'ON' : 'OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsSandboxPrintOpen(true)}
                        className="bg-white/10 hover:bg-white/20 text-[#fde047] border border-[#d7ad32]/40 px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Imprimir Kit Docente: Ficha de aula para fotocopiar, solucionario y rúbrica formativa"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#d7ad32]" />
                        <span>Ficha & Rúbrica</span>
                      </button>

                      <div className="bg-[#d7ad32] text-[#09243a] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>{score} pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Pistas DUA en vivo (Recta numérica y apoyos) */}
                  {duaSupportActive && isMathTopic && (
                    <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-2xl space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-black text-blue-950">
                        <span className="flex items-center gap-1.5">
                          <span>🔢 Recta Numérica Visual de Apoyo (DUA / Discalculia)</span>
                        </span>
                        <span className="text-[10px] text-blue-700 font-bold">
                          ➕ Suma = Derecha ➡️ | ➖ Resta = Izquierda ⬅️
                        </span>
                      </div>
                      <div className="bg-white border border-blue-300 rounded-xl p-2 flex items-center justify-between overflow-x-auto font-mono font-black text-xs text-blue-950 select-none">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                          <div key={num} className="flex flex-col items-center px-1">
                            <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-[10px]">
                              {num}
                            </span>
                            <span className="text-[8px] text-blue-400">|</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PESTAÑAS DE ACTIVIDADES GAMIFICADAS (Arena, Memoria, Secuencia, Sopa de Letras) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-100/80 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {[
                        { id: 'arena', label: '🎮 Arena Principal', desc: 'Retos con ambientación' },
                        { id: 'memory', label: '🧠 Memoria', desc: 'Parejas de cálculo' },
                        { id: 'sequence', label: '🔢 Secuencias', desc: 'Patrones numéricos' },
                        { id: 'wordsearch', label: '🔤 Sopa de Letras', desc: 'Búsqueda de términos' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveGamActivity(tab.id as any);
                            setFeedback(null);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            activeGamActivity === tab.id
                              ? 'bg-[#09243a] text-[#fde047] shadow-md ring-2 ring-[#09243a]/30'
                              : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Selector de Mundos / Niveles de Complejidad */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
                      <span className="text-[10px] font-black uppercase text-slate-500 px-2">Mundo:</span>
                      {[
                        { id: 1, label: '🟢 M1: Básico', hint: 'Operaciones base' },
                        { id: 2, label: '🟡 M2: Intermedio', hint: 'Combinadas hasta 20' },
                        { id: 3, label: '🔴 M3: Avanzado', hint: 'Cálculo ágil e incógnitas' }
                      ].map(w => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => {
                            setActiveWorld(w.id as any);
                            setGameStep(0);
                            setGameAnswerSelected(null);
                            setGameFeedback(null);
                            setSequenceStep(0);
                            setSequenceAnswerSelected(null);
                            setSequenceFeedback(null);
                            setMathMemoryFlipped([]);
                            setMathMemorySolved(new Set());
                          }}
                          title={w.hint}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                            activeWorld === w.id
                              ? 'bg-[#09243a] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VISTA 1: ARENA PRINCIPAL (MINECRAFT, MARIO KART, ETC.) */}
                  {activeGamActivity === 'arena' && (
                    <div className="space-y-6">
                      {/* Selector rápido de temática lúdica */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { id: 'mariokart', label: '🏎️ Mario Kart' },
                      { id: 'minecraft', label: '⛏️ Minecraft' },
                      { id: 'roblox', label: '🧱 Roblox Obby' },
                      { id: 'lego', label: '🧩 Lego 3D' },
                      { id: 'pokemon', label: '⚡ Pokémon RPG' },
                      { id: 'arcade', label: '🕹️ Arcade Retro' }
                    ].map(theme => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setActiveGameTheme(theme.id as any);
                          setGameFeedback(null);
                          setGameAnswerSelected(null);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          activeGameTheme === theme.id
                            ? 'bg-[#09243a] text-[#fde047] shadow-md ring-2 ring-[#d7ad32]'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>

                  {/* Selector pedagógico de tipo de preguntas */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                        🎯
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">
                          Enfoque pedagógico de las preguntas:
                        </div>
                        <div className="text-[11px] text-slate-600">
                          {questionStyle === 'pure' 
                            ? `Preguntas 100% escolares de "${academicTopic}" (sin lore ni personajes del juego)` 
                            : `Preguntas narradas con elementos del universo ${activeGameTheme}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 shrink-0">
                      <button
                        type="button"
                        onClick={() => { setQuestionStyle('pure'); setGameStep(0); setGameAnswerSelected(null); setGameFeedback(null); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          questionStyle === 'pure'
                            ? 'bg-[#09243a] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📚 Escolares Puras (Recomendado)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestionStyle('themed'); setGameStep(0); setGameAnswerSelected(null); setGameFeedback(null); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          questionStyle === 'themed'
                            ? 'bg-[#09243a] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        🎮 Con Jerga del Juego
                      </button>
                    </div>
                  </div>

                  {/* HUD & LIENZO VISUAL TEMÁTICO */}
                  <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                    
                    {/* 1. HUD ESPECÍFICO DE LA TEMÁTICA */}
                    {activeGameTheme === 'mariokart' && (
                      <div className="bg-linear-to-r from-red-600 via-amber-500 to-blue-600 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-black shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-black/30 px-2.5 py-1 rounded-lg">🏁 Vuelta {kartLap}/3</span>
                          <span className="bg-black/30 px-2.5 py-1 rounded-lg">🏎️ {kartSpeed} km/h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-black/30 px-2.5 py-1 rounded-lg text-amber-200">🪙 {kartCoins} Monedas</span>
                          <span className="bg-[#fde047] text-[#09243a] px-2.5 py-1 rounded-lg">🏆 1º Puesto</span>
                        </div>
                      </div>
                    )}

                    {activeGameTheme === 'minecraft' && (
                      <div className="bg-[#1f2937] text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-black border border-emerald-500/30">
                        <div className="flex items-center gap-1.5 text-base">
                          <span>Salud:</span>
                          <div className="flex items-center text-rose-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>{i < mcHearts ? '❤️' : '🖤'}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                            Ítem: {mcCraftedItem}
                          </span>
                          <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg">
                            Nivel 32 XP
                          </span>
                        </div>
                      </div>
                    )}

                    {activeGameTheme === 'roblox' && (
                      <div className="bg-linear-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-black">
                        <div className="flex items-center gap-2">
                          <span className="bg-black/30 px-2.5 py-1 rounded-lg">🚩 Stage {robloxStage} / 5</span>
                          <span className="bg-black/30 px-2.5 py-1 rounded-lg text-yellow-300">⭐ Checkpoint Guardado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-black/30 px-2.5 py-1 rounded-lg">Caídas: {robloxFalls}</span>
                          <span className="bg-[#fde047] text-[#09243a] px-2.5 py-1 rounded-lg">👑 Obby Master</span>
                        </div>
                      </div>
                    )}

                    {activeGameTheme === 'lego' && (
                      <div className="bg-linear-to-r from-red-500 via-yellow-400 to-blue-600 text-[#09243a] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-black shadow-sm">
                        <div className="bg-white/80 px-3 py-1 rounded-lg">
                          🧱 Bloques Ensamblados: {legoBricksCount} / 6
                        </div>
                        <div className="bg-[#09243a] text-white px-3 py-1 rounded-lg flex items-center gap-1.5">
                          <span>🧑‍🔧 Maestro Constructor LEGO®</span>
                        </div>
                      </div>
                    )}

                    {activeGameTheme === 'pokemon' && (
                      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-black border border-indigo-500/40">
                        <div className="flex items-center gap-3">
                          <span>👾 Rival: Duda Conceptual (Nv. 45)</span>
                          <div className="w-28 sm:w-36 h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-500">
                            <div 
                              className={`h-full transition-all duration-500 ${pokeEnemyHp > 50 ? 'bg-emerald-500' : pokeEnemyHp > 20 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                              style={{ width: `${pokeEnemyHp}%` }}
                            />
                          </div>
                          <span>{pokeEnemyHp}/100 HP</span>
                        </div>
                        <div className="text-amber-400 bg-black/40 px-2.5 py-1 rounded-lg">
                          🏅 {pokeEnemyHp === 0 ? '¡Medalla del Saber Ganada!' : 'Duelo de Gimnasio'}
                        </div>
                      </div>
                    )}

                    {activeGameTheme === 'arcade' && (
                      <div className="bg-black text-[#22c55e] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-black border-2 border-[#22c55e]/50 shadow-inner">
                        <div className="flex items-center gap-3">
                          <span className="text-rose-400">1UP: {'❤️ '.repeat(arcadeLives)}</span>
                          <span className="text-yellow-400">SCORE: {String(arcadeScore).padStart(6, '0')}</span>
                        </div>
                        <div>
                          <span className="text-cyan-400">HI-SCORE: 009990</span>
                        </div>
                      </div>
                    )}

                    {/* 2. LIENZO GRÁFICO INTERACTIVO SEGÚN EL TEMA */}
                    <div className="relative rounded-2xl overflow-hidden min-h-[170px] border-2 border-slate-200 flex flex-col items-center justify-center p-4 select-none">
                      
                      {activeGameTheme === 'mariokart' && (
                        <div className="w-full space-y-3">
                          {/* Pista de asfalto */}
                          <div className="w-full h-24 bg-slate-800 rounded-xl relative overflow-hidden flex items-center px-4 border-2 border-slate-700 shadow-inner">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b-2 border-dashed border-amber-300"></div>
                            
                            {/* Kart en la pista */}
                            <div 
                              className="absolute transition-all duration-700 text-3xl flex items-center"
                              style={{ left: `${Math.min(85, 10 + gameStep * 32 + (kartEvent === 'turbo' ? 12 : 0))}%` }}
                            >
                              <span className={kartEvent === 'turbo' ? 'animate-bounce' : ''}>🏎️</span>
                              {kartEvent === 'turbo' && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse -ml-2">NITRO!</span>}
                              {kartEvent === 'banana' && <span className="text-xs bg-amber-400 text-black px-1.5 py-0.5 rounded-md font-bold -ml-1">¡SLIP!</span>}
                            </div>

                            {/* Cajas sorpresa flotantes [?] */}
                            <div className="absolute right-12 flex items-center gap-4 text-xl">
                              <span className="bg-amber-400 text-amber-950 font-black px-2 py-1 rounded-lg border-2 border-white shadow-md animate-pulse">?</span>
                              <span className="text-amber-300">🪙</span>
                              <span className="text-xs font-black text-white bg-black/60 px-2 py-1 rounded-md">🏁 META</span>
                            </div>
                          </div>

                          {/* Estado de carrera */}
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <span>Circuito: <strong>Autódromo de {currentTopic}</strong></span>
                            <span>{kartLap >= 3 && gameStep >= 2 ? '🏁 ¡Gran Premio Culminado en 1er Lugar!' : `Acelera respondiendo el desafío de la Vuelta ${kartLap}`}</span>
                          </div>
                        </div>
                      )}

                      {activeGameTheme === 'minecraft' && (
                        <div className="w-full space-y-3">
                          <div className="bg-[#2e3b2e] p-4 rounded-xl border-2 border-[#4d664d] text-white flex flex-col sm:flex-row items-center justify-around gap-4 shadow-inner">
                            {/* Mesa de crafteo 3x3 */}
                            <div className="space-y-1 text-center">
                              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest block">Mesa de Crafteo 3x3</span>
                              <div className="grid grid-cols-3 gap-1 bg-[#1a231a] p-2 rounded-lg border-2 border-[#5c7a5c]">
                                {['🪵', '🪨', '⛏️', '🔴', '💎', '🏆', '✨', '⚡', '🌟'].map((item, idx) => (
                                  <div key={idx} className="w-9 h-9 bg-[#2e3b2e] border border-[#5c7a5c] rounded flex items-center justify-center text-lg">
                                    {idx < mcGridCount ? item : ''}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Flecha de crafteo */}
                            <div className="text-2xl text-emerald-400 font-black">➔</div>

                            {/* Ítem resultante */}
                            <div className="text-center space-y-1">
                              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest block">Resultado</span>
                              <div className="w-16 h-16 bg-[#1a231a] border-2 border-emerald-400 rounded-xl flex items-center justify-center text-3xl shadow-md">
                                {mcCraftedItem.includes('Trofeo') ? '🏆' : mcCraftedItem.includes('Armadura') ? '🛡️' : '🗡️'}
                              </div>
                              <span className="text-xs font-black text-emerald-300 block">{mcCraftedItem}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeGameTheme === 'roblox' && (
                        <div className="w-full space-y-3">
                          <div className="bg-linear-to-b from-slate-900 to-orange-950 p-4 rounded-xl border-2 border-orange-500/40 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                            {/* Plataformas flotantes sobre lava */}
                            <div className="flex items-center justify-between gap-2 z-10 my-auto">
                              {[1, 2, 3, 4, 5].map((stg) => {
                                const isCurrent = robloxStage === stg;
                                const isPassed = robloxStage > stg;
                                return (
                                  <div 
                                    key={stg} 
                                    className={`flex-1 text-center py-2.5 rounded-xl border-2 transition-all font-black text-xs ${
                                      isCurrent 
                                        ? 'bg-cyan-400 text-cyan-950 border-white shadow-lg ring-4 ring-cyan-300/40 scale-105' 
                                        : isPassed 
                                        ? 'bg-emerald-500 text-white border-emerald-300' 
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}
                                  >
                                    <span className="block text-base">{isCurrent ? '🏃' : isPassed ? '⭐' : '🧱'}</span>
                                    <span>Stage {stg}</span>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Lava ardiente en la base */}
                            <div className="w-full h-3 bg-linear-to-r from-orange-600 via-amber-500 to-red-600 rounded-full mt-3 shadow-md animate-pulse"></div>
                          </div>
                        </div>
                      )}

                      {activeGameTheme === 'lego' && (
                        <div className="w-full space-y-3">
                          <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-300 flex flex-col items-center justify-center gap-3">
                            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                              Maqueta en Construcción: {currentTopic}
                            </span>
                            {/* Diorama de ladrillos apilados */}
                            <div className="flex flex-col items-center gap-1">
                              {Array.from({ length: legoBricksCount }).map((_, i) => {
                                const colors = ['bg-red-500 border-red-700', 'bg-blue-500 border-blue-700', 'bg-yellow-400 border-yellow-600 text-slate-900', 'bg-emerald-500 border-emerald-700', 'bg-purple-500 border-purple-700', 'bg-amber-500 border-amber-700'];
                                return (
                                  <div 
                                    key={i} 
                                    className={`w-40 sm:w-48 h-7 ${colors[i % colors.length]} rounded-md border-b-4 flex items-center justify-around px-2 text-white font-black text-xs shadow-md transition-all`}
                                  >
                                    <span>●</span>
                                    <span>●</span>
                                    <span>●</span>
                                    <span>●</span>
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-xs font-bold text-slate-600">
                              {legoBricksCount >= 6 ? '🎉 ¡Modelo completado al 100% con precisión técnica!' : 'Responde correctamente para ensamblar el siguiente piso de ladrillos.'}
                            </span>
                          </div>
                        </div>
                      )}

                      {activeGameTheme === 'pokemon' && (
                        <div className="w-full space-y-3">
                          <div className="bg-linear-to-b from-slate-800 to-slate-950 p-4 rounded-xl border-2 border-slate-700 text-white space-y-3">
                            {/* Duelo frente a frente */}
                            <div className="flex items-center justify-between px-3 py-2 bg-black/40 rounded-xl">
                              <div className="text-center">
                                <span className="text-3xl block">🎒</span>
                                <strong className="text-xs text-emerald-400">Estudiante L.I.D.E.R.</strong>
                              </div>
                              <div className="text-center font-black text-amber-400 text-sm">
                                ⚔️ VS ⚔️
                              </div>
                              <div className="text-center">
                                <span className="text-3xl block animate-pulse">👾</span>
                                <strong className="text-xs text-rose-400">Duda Conceptual</strong>
                              </div>
                            </div>
                            {/* Diálogo de combate */}
                            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs font-mono text-slate-200">
                              {pokeTurnMsg}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeGameTheme === 'arcade' && (
                        <div className="w-full space-y-2">
                          <div className="bg-black p-4 rounded-xl border-4 border-slate-800 text-emerald-400 font-mono text-xs space-y-2 shadow-inner">
                            <div className="flex items-center justify-between border-b border-emerald-900 pb-1 text-[11px]">
                              <span>INSERT COIN (0/1)</span>
                              <span className="animate-pulse">● STAGE 1 READY</span>
                            </div>
                            <div className="text-center py-2 text-amber-300 text-sm font-black">
                              ★ MISIÓN ARCADE: {currentTopic.toUpperCase()} ★
                            </div>
                            <p className="text-slate-300 m-0 text-[11px] leading-relaxed">
                              Supera los 3 desafíos conceptuales para grabar tus iniciales en la tabla de récords del aula.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* 3. DESAFÍO PEDAGÓGICO DE LA ETAPA ACTUAL */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#09243a]">
                          {gameChallenges[gameStep].stage}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Desafío {gameStep + 1} de {gameChallenges.length}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-[#09243a] m-0 leading-snug">
                        {gameChallenges[gameStep].question}
                      </h4>

                      {/* Opciones de respuesta */}
                      <div className="space-y-2">
                        {gameChallenges[gameStep].options.map((opt, optIdx) => {
                          const isSelected = gameAnswerSelected === optIdx;
                          let btnStyle = 'border-slate-200 bg-white hover:border-[#d7ad32] text-slate-800';

                          if (gameAnswerSelected !== null) {
                            if (opt.correct) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                            } else if (isSelected && !opt.correct) {
                              btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold';
                            } else {
                              btnStyle = 'opacity-40 border-slate-200 bg-white';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={gameAnswerSelected !== null}
                              onClick={() => handleGameAnswer(optIdx)}
                              className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 text-xs sm:text-sm cursor-pointer ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback del juego con recompensas */}
                      {gameFeedback && (
                        <div className={`p-4 rounded-xl border-2 text-xs sm:text-sm space-y-1 ${
                          gameFeedback.ok 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                            : 'bg-rose-50 border-rose-300 text-rose-950'
                        }`}>
                          <div className="font-black text-sm flex items-center gap-1.5">
                            {gameFeedback.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                            <span>{gameFeedback.title}</span>
                          </div>
                          <p className="m-0 font-medium">{gameFeedback.desc}</p>
                          <p className="m-0 text-[11px] font-bold opacity-80">{gameFeedback.perk}</p>
                        </div>
                      )}

                      {/* Botones de acción del juego */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={handleResetGame}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reiniciar Partida</span>
                        </button>

                        {gameStep < gameChallenges.length - 1 ? (
                          <button
                            type="button"
                            disabled={gameAnswerSelected === null}
                            onClick={handleNextGameStep}
                            className="px-5 py-2.5 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-xs font-black disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Siguiente Nivel →</span>
                          </button>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              ¡Partida Completada con Éxito!
                            </span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* VISTA 2: JUEGO DE MEMORIA INTERACTIVO */}
              {activeGamActivity === 'memory' && (
                <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        <span>🧠 MEMORAMA EDUCATIVO</span>
                        <span>•</span>
                        <span>MUNDO {activeWorld}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-[#09243a] m-0">
                        Empareja las Operaciones con sus Resultados
                      </h4>
                      <p className="text-xs text-slate-500 m-0">
                        Voltea las cartas para encontrar los pares correspondientes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                        Intentos: {mathMemoryMoves}
                      </span>
                      <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl">
                        Pares: {mathMemorySolved.size} / 4
                      </span>
                    </div>
                  </div>

                  {/* Cuadrícula de cartas 3D */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {getMathMemoryCards().map((card) => {
                      const isFlipped = mathMemoryFlipped.includes(card.id) || mathMemorySolved.has(card.pairKey);
                      const isSolved = mathMemorySolved.has(card.pairKey);

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleMathCardClick(card.id, card.pairKey)}
                          className={`h-28 sm:h-32 rounded-2xl border-2 p-3 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none ${
                            isSolved
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 scale-95 shadow-xs'
                              : isFlipped
                              ? 'bg-[#09243a] border-[#d7ad32] text-white shadow-lg rotate-y-180'
                              : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-400'
                          }`}
                        >
                          {isFlipped ? (
                            <>
                              <span className="text-sm sm:text-base font-black block leading-tight">
                                {card.label}
                              </span>
                              <span className={`text-[10px] mt-1 font-bold ${isSolved ? 'text-emerald-700' : 'text-amber-300'}`}>
                                {card.desc}
                              </span>
                              {isSolved && (
                                <span className="text-[10px] text-emerald-600 font-black mt-1">✓ Pareja</span>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="text-2xl block mb-1">❓</span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Voltear
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Banner de victoria en memoria */}
                  {mathMemorySolved.size >= 4 && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <div>
                          <strong className="text-sm block">¡Memorama del Mundo {activeWorld} Superado!</strong>
                          <span className="text-xs">Completaste las 4 parejas en {mathMemoryMoves} movimientos.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMathMemoryFlipped([]);
                          setMathMemorySolved(new Set());
                          setMathMemoryMoves(0);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl cursor-pointer"
                      >
                        Jugar de nuevo
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMathMemoryFlipped([]);
                        setMathMemorySolved(new Set());
                        setMathMemoryMoves(0);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar Memorama</span>
                    </button>
                    <span className="text-[11px] text-slate-500 font-bold">
                      Cambia de Mundo arriba para parejas más avanzadas
                    </span>
                  </div>
                </div>
              )}

              {/* VISTA 3: SECUENCIAS NUMÉRICAS Y LÓGICAS */}
              {activeGamActivity === 'sequence' && (
                <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  {(() => {
                    const seqChallenges = getSequenceChallenges();
                    const currentSeq = seqChallenges[sequenceStep] || seqChallenges[0];

                    return (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                          <div>
                            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                              <span>🔢 SECUENCIAS Y PATRONES</span>
                              <span>•</span>
                              <span>MUNDO {activeWorld}</span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-[#09243a] m-0">
                              {currentSeq.title}
                            </h4>
                            <p className="text-xs text-slate-500 m-0">
                              Descubre la regla lógica y selecciona el número que completa la serie.
                            </p>
                          </div>

                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                            Reto {sequenceStep + 1} de {seqChallenges.length}
                          </span>
                        </div>

                        {/* Visualización del patrón con recuadro destacado */}
                        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl text-center space-y-2 border-2 border-amber-400/40 shadow-inner">
                          <span className="text-[11px] text-amber-300 font-black uppercase tracking-widest block">
                            Regla: {currentSeq.rule}
                          </span>
                          <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#fde047]">
                            {currentSeq.pattern}
                          </div>
                        </div>

                        {/* Opciones de respuesta para la secuencia */}
                        <div className="grid grid-cols-3 gap-3">
                          {currentSeq.options.map((optVal, optIdx) => {
                            const isSelected = sequenceAnswerSelected === optVal;
                            let btnStyle = 'border-slate-200 bg-white hover:border-[#d7ad32] text-slate-800';

                            if (sequenceAnswerSelected !== null) {
                              if (optVal === currentSeq.correct) {
                                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-400';
                              } else if (isSelected && optVal !== currentSeq.correct) {
                                btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-black';
                              } else {
                                btnStyle = 'opacity-40 border-slate-200 bg-white';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={sequenceAnswerSelected !== null}
                                onClick={() => handleSequenceAnswer(optVal, currentSeq.correct, currentSeq.hint)}
                                className={`py-4 px-3 rounded-2xl border-2 text-center font-mono font-black text-lg transition-all cursor-pointer shadow-xs ${btnStyle}`}
                              >
                                {optVal}
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback de la secuencia */}
                        {sequenceFeedback && (
                          <div className={`p-4 rounded-xl border-2 text-xs sm:text-sm ${
                            sequenceFeedback.ok 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                              : 'bg-rose-50 border-rose-300 text-rose-950'
                          }`}>
                            <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                              {sequenceFeedback.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                              <span>{sequenceFeedback.ok ? '¡Patrón Correcto!' : 'Respuesta Incorrecta'}</span>
                            </div>
                            <p className="m-0 font-medium">{sequenceFeedback.msg}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSequenceStep(0);
                              setSequenceAnswerSelected(null);
                              setSequenceFeedback(null);
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reiniciar Retos</span>
                          </button>

                          {sequenceStep < seqChallenges.length - 1 ? (
                            <button
                              type="button"
                              disabled={sequenceAnswerSelected === null}
                              onClick={() => {
                                setSequenceStep(s => s + 1);
                                setSequenceAnswerSelected(null);
                                setSequenceFeedback(null);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-xs font-black disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Siguiente Secuencia →</span>
                            </button>
                          ) : (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                              🎉 ¡Todas las secuencias resueltas!
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* VISTA 4: SOPA DE LETRAS INTERACTIVA */}
              {activeGamActivity === 'wordsearch' && (
                <div className="bg-white border-2 border-[#e7e4dc] rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                        <span>🔤 SOPA DE LETRAS MATEMÁTICA</span>
                        <span>•</span>
                        <span>INTERACTIVA REAL</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-[#09243a] m-0">
                        Busca y Marca las Palabras Clave
                      </h4>
                      <p className="text-xs text-slate-500 m-0">
                        Haz clic sobre las letras en la cuadrícula para encontrarlas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        Encontradas: {wordSearchFoundWords.size} / {wordSearchTargetWords.length}
                      </span>
                    </div>
                  </div>

                  {wordSearchStatus && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-950 animate-pulse text-center">
                      {wordSearchStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Cuadrícula de 8x8 letras */}
                    <div className="md:col-span-2 bg-slate-900 p-3 sm:p-4 rounded-2xl border-2 border-slate-800 shadow-inner flex justify-center">
                      <div className="grid grid-cols-8 gap-1 sm:gap-1.5 max-w-sm w-full">
                        {wordSearchGrid.map((row, rIdx) => 
                          row.map((letter, cIdx) => {
                            const coord = `${rIdx}-${cIdx}`;
                            const isSelected = wordSearchSelectedCells.has(coord);

                            // Check if this cell belongs to any found word
                            const isPartOFoundWord = wordSearchTargetWords.some(tw => 
                              wordSearchFoundWords.has(tw.word) && tw.cells.includes(coord)
                            );

                            return (
                              <button
                                key={coord}
                                type="button"
                                onClick={() => toggleWordSearchCell(coord)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-black font-mono flex items-center justify-center transition-all cursor-pointer select-none ${
                                  isPartOFoundWord
                                    ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300 scale-105'
                                    : isSelected
                                    ? 'bg-[#fde047] text-[#09243a] shadow-md ring-2 ring-amber-300'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                                }`}
                              >
                                {letter}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Lista de palabras a buscar */}
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase text-[#09243a] flex items-center justify-between">
                        <span>Palabras a buscar:</span>
                        <span className="text-[10px] text-slate-500">Términos clave</span>
                      </div>

                      <div className="space-y-1.5">
                        {wordSearchTargetWords.map(tw => {
                          const isFound = wordSearchFoundWords.has(tw.word);
                          return (
                            <div
                              key={tw.word}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                                isFound
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div>
                                <span className="font-mono font-black">{tw.word}</span>
                                <span className="text-[10px] text-slate-500 block">{tw.desc}</span>
                              </div>
                              {isFound ? (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Highlight hint
                                    const next = new Set(wordSearchSelectedCells);
                                    tw.cells.forEach(c => next.add(c));
                                    setWordSearchSelectedCells(next);
                                    setWordSearchFoundWords(prev => new Set([...prev, tw.word]));
                                    setScore(s => s + 15);
                                    setWordSearchStatus(`💡 Revelada: "${tw.word}" (+15 pts)`);
                                    setTimeout(() => setWordSearchStatus(null), 2500);
                                  }}
                                  className="text-[10px] bg-slate-200 hover:bg-amber-200 text-slate-700 font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                                  title="Revelar palabra"
                                >
                                  Pista
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={clearWordSearch}
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reiniciar Sopa de Letras</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
              ) : (
                /* ========================================================================= */
                /* CASO 7: ACTIVIDAD EDUCATIVA / HOJA DE TRABAJO GENÉRICA                    */
                /* ========================================================================= */
                <div className="bg-white border border-[#e7e4dc] rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f4f6f7]">
                    <span className="text-xs font-bold text-[#68747d]">
                      Materia: {subject || 'Ciencias'} · Nivel: {grade || 'General'}
                    </span>
                    <span className="text-xs font-black text-[#d7ad32] bg-[#f8edc5] px-2.5 py-0.5 rounded-full">
                      Puntaje: {score} pts
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-[#d7ad32] tracking-wider block mb-1">
                      DESAFÍO INTERACTIVO
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#09243a]">
                      En relación con &quot;{currentTopic}&quot;: ¿Cuál de las siguientes afirmaciones describe de manera más precisa su principio rector?
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 0, text: `Es el principio rector que fundamenta los fenómenos y estructuras en ${currentTopic}.`, correct: true, feed: '¡Excelente! Esta opción refleja con precisión la base conceptual analizada.' },
                      { id: 1, text: 'Es un elemento meramente secundario que no altera los resultados del sistema.', correct: false, feed: 'Incorrecto: este elemento es fundamental en la estructura del tema.' },
                      { id: 2, text: 'Corresponde a una definición obsoleta no aceptada en el currículo actual.', correct: false, feed: 'Atención: revisa los conceptos clave revisados en la lección.' }
                    ].map((opt) => {
                      const isSel = selectedOption === opt.id;
                      let style = "border-[#e7e4dc] bg-white hover:border-[#d7ad32]";
                      if (isSel && !activitySubmitted) style = "border-[#09243a] bg-[#f0f5f9] ring-2 ring-[#09243a]/20";
                      if (activitySubmitted) {
                        if (opt.correct) style = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                        else if (isSel && !opt.correct) style = "border-rose-500 bg-rose-50 text-rose-950";
                        else style = "opacity-40 border-[#e7e4dc]";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={activitySubmitted}
                          onClick={() => setSelectedOption(opt.id)}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${style}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#f4f6f7] text-[#68747d] text-xs font-black flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + opt.id)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium pt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activitySubmitted && selectedOption !== null && (
                    <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 ${
                      selectedOption === 0 ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rose-50 text-rose-900 border border-rose-300'
                    }`}>
                      {selectedOption === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      <span>{selectedOption === 0 ? '¡Respuesta correcta! +10 puntos acumulados.' : 'Respuesta incorrecta. Revisa el contenido e inténtalo de nuevo.'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    {!activitySubmitted ? (
                      <button
                        type="button"
                        disabled={selectedOption === null}
                        onClick={() => {
                          setActivitySubmitted(true);
                          if (selectedOption === 0) setScore(prev => prev + 10);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#09243a] hover:bg-[#061a2b] text-white text-xs font-extrabold disabled:opacity-40 cursor-pointer"
                      >
                        Comprobar respuesta
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOption(null);
                          setActivitySubmitted(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#d7ad32] hover:bg-[#c99f2b] text-[#09243a] text-xs font-black cursor-pointer"
                      >
                        Intentar de nuevo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#68747d]">
                  HTML5 + CSS + JavaScript puro y autocontenido (con estructura interactiva real para {tipo}):
                </span>
              </div>
              <pre className="bg-[#061a2b] text-[#edf5f8] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] border border-[#09243a] leading-relaxed">
                {generatedHtmlCode}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#f4f6f7] border-t border-[#e7e4dc] px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#68747d] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {isMindMap 
                ? 'Mapa mental con nodos activos, ramas ramificadas y validación instantánea.'
                : 'Funcionalidad real ejecutable: sin placeholders ni descripciones pasivas.'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-[#09243a] hover:bg-[#e7e4dc] rounded-lg transition-colors cursor-pointer"
          >
            Cerrar simulador
          </button>
        </div>

      </div>

      {/* Kit Docente de Aula: Ficha Imprimible, Solucionario y Rúbrica Formativa */}
      <PrintableResourceModal
        isOpen={isSandboxPrintOpen}
        onClose={() => setIsSandboxPrintOpen(false)}
        data={{
          tipo: tipo || 'Experiencia gamificada',
          modo: 'imprimible',
          tema: currentTopic,
          materia: subject || 'Matemáticas',
          grado: grade || '1° - 2° Grado',
          objetivo: `Consolidar el aprendizaje escolar sobre ${currentTopic} a través de retos prácticos y evaluación formativa.`,
          adicional: '',
          selectedCodes: []
        }}
      />
    </div>
  );
};
