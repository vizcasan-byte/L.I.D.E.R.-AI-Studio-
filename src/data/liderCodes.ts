/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiderCategory } from '../types';

export const LIDER_CATEGORIES: LiderCategory[] = [
  {
    name: "⚡ Comandos Rápidos de Aula (Los 14 Comandos Docentes)",
    items: [
      ["/mindmap", "Mapa Mental", "Organiza ideas en formato radial con núcleo central y ramas visuales"],
      ["/summary", "Resumen Estructurado", "Sintetiza la información clave en causas, hechos y consecuencias"],
      ["/simple", "Explícalo Fácil", "Convierte conceptos complejos en lenguaje accesible: versión compleja vs versión simple"],
      ["/explain", "Paso a Paso", "Desarrolla el tema paso a paso: definición, tipos, representación gráfica y práctica"],
      ["/example", "Ejemplos Reales", "Casos cotidianos y aplicaciones prácticas para fijar el concepto"],
      ["/analogy", "Analogía Visual", "Compara conceptos difíciles con la vida real (ej. 'la célula es como una fábrica')"],
      ["/quiz", "Genera Preguntas", "Cuestionarios tipo test, opción múltiple o V/F con solución explicada"],
      ["/timeline", "Línea de Tiempo", "Cronología secuencial ilustrada con fechas, hitos e íconos conectores"],
      ["/create", "Material Multinivel", "Fichas de comprensión y actividades graduadas (Básico, Intermedio y Avanzado)"],
      ["/design", "Visual Thinking", "Carteles, pósters, normas de aula y rutinas en cuadrícula numerada"],
      ["/compare", "Compara y Organiza", "Tabla comparativa A vs B con características, dibujos y 'Diferencia clave 🔑'"],
      ["/review", "Ficha de Repaso", "Actividades variadas de refuerzo: escribir, comparar, colorear y resolver"],
      ["/stickersheet", "Plancha de Stickers", "Hoja de stickers e íconos kawaii con borde blanco troquelado en cuadrícula"],
      ["/comicdidactico", "Cómic Didáctico", "Historieta educativa con viñetas secuenciales, bocadillos de diálogo y personajes"]
    ]
  },
  {
    name: "👑 Códigos del Método L.I.D.E.R.© (Fases Pedagógicas)",
    items: [
      ["L-01", "L · Descarga Cognitiva", "Superación de tecnofobia: delegar borradores y estructuración en la IA"],
      ["L-02", "L · Copiloto de Planificación", "Automatización de secuencias didácticas y optimización del tiempo docente"],
      ["L-03", "L · Tiempo para lo Humano", "Recuperar energía docente para la escucha, mediación y vínculo con el alumno"],
      ["I-01", "I · Alineación Curricular", "Vinculación estricta con competencias clave, criterios y estándares oficiales"],
      ["I-02", "I · Taxonomía de Bloom", "Gradación de objetivos desde comprensión y aplicación hasta evaluación y creación"],
      ["I-03", "I · Juicio y Fact-Checking", "Verificación rigurosa de fuentes, pensamiento crítico y ética de la información"],
      ["D-01", "D · Diseño Imprimible", "Fichas didácticas de aula limpias, maquetadas y listas para fotocopiar"],
      ["D-02", "D · Interactividad Real", "Recurso digital ejecutable con botones, puntuación y retroalimentación activa"],
      ["D-03", "D · Gamificación Pedagógica", "Dinámica lúdica estructurada con retos multinivel, pistas e insignias"],
      ["E-01", "E · Evaluación Formativa", "Rúbricas analíticas ágiles, tickets de salida y autoevaluación sin sobrecarga"],
      ["E-02", "E · Andamiaje Adaptativo", "Pistas progresivas y atención a la diversidad para distintos ritmos de aula"],
      ["E-03", "E · Feedback Oportuno", "Retroalimentación explicativa inmediata para aprender del error sin penalización"],
      ["R-01", "R · Transferencia al Claustro", "Documentación pedagógica y buenas prácticas para compartir con colegas"],
      ["R-02", "R · Ética e IA Responsable", "Uso crítico y transparente de la IA con propósito humano transformador"],
      ["R-03", "R · Liderazgo e Innovación", "Trascendencia educativa y posicionamiento del docente como referente escolar"]
    ]
  },
  {
    name: "🎨 Ilustración y arte",
    items: [
      ["/handwrittenillustration", "Ilustración a mano", "Trazo cálido y hecho a mano"],
      ["/doodle", "Doodle", "Garabatos educativos dinámicos"],
      ["/watercolor", "Acuarela", "Acuarela suave y estética"],
      ["/crayon", "Crayón", "Textura de crayón escolar"],
      ["/papercraft", "Papercraft", "Collage y capas de papel"],
      ["/lineart", "Line art", "Contornos limpios y definidos"],
      ["/claymorphism", "Plastilina 3D", "Formas suaves con volumen"],
      ["/chalkboard", "Pizarra y tiza", "Estética tradicional de aula"]
    ]
  },
  {
    name: "🗒️ Organización visual",
    items: [
      ["/stickynotes", "Notas adhesivas", "Post-its y notas de colores"],
      ["/indexcard", "Ficha", "Tarjeta educativa estructurada"],
      ["/notebooklines", "Cuaderno", "Hoja rayada o cuadriculada"],
      ["/corkboard", "Corcho", "Tablero visual colaborativo"],
      ["/foldedpaper", "Papel doblado", "Efecto papel con pliegues"],
      ["/washitape", "Washi tape", "Cinta decorativa de fijación"],
      ["/kraftpaper", "Papel kraft", "Textura natural y orgánica"]
    ]
  },
  {
    name: "🖥️ Diseño gráfico",
    items: [
      ["/flatdesign", "Flat design", "Diseño plano y moderno"],
      ["/cartoon", "Cartoon", "Estilo caricaturesco e ilustrado infantil"],
      ["/handwritten", "Apuntes a mano", "Estilo de libreta de apuntes escolar (studygram / sketchnotes) con caligrafía manuscrita, esquemas con flechas y subrayados"],
      ["/3d", "Render 3D", "Modelado tridimensional suave estilo Pixar"],
      ["/visualthinking", "Visual Thinking", "Secuencia visual explicativa: Antes, El Hecho, Ahora"],
      ["/pixelart", "Pixel art", "Estética retro tipo 8-bit"],
      ["/isometric", "Isométrico", "Perspectiva isométrica 3D"],
      ["/minimal", "Minimal", "Diseño limpio y sin distracciones"],
      ["/highcontrast", "Alto contraste", "Contraste marcado para máxima legibilidad"],
      ["/outline", "Outline", "Contornos destacados y definidos"]
    ]
  },
  {
    name: "🌎 Temáticas de ambientación",
    items: [
      ["/pastel", "Pastel", "Paleta suave y relajante"],
      ["/neon", "Neón", "Colores luminosos y vibrantes"],
      ["/retro", "Retro", "Estética vintage nostálgica"],
      ["/space", "Espacio", "Universo, galaxias y planetas"],
      ["/ocean", "Océano", "Mundo submarino y vida marina"],
      ["/jungle", "Selva", "Naturaleza tropical y expedición"],
      ["/farm", "Granja", "Animales y vida rural"]
    ]
  },
  {
    name: "🎮 Mecánicas de Gamificación",
    items: [
      ["/badge", "Insignia", "Medalla o emblema de logro pedagógico"],
      ["/leaderboard", "Tabla de posiciones", "Ranking con propósito formativo"],
      ["/progressbar", "Barra de progreso", "Visualización de avance continuo"],
      ["/levelup", "Subir de nivel", "Desbloqueo de etapas de mayor dificultad"],
      ["/questmap", "Mapa de misiones", "Ruta de aventura con paradas clave"],
      ["/scoreboard", "Marcador", "Sistema dinámico de puntos y aciertos"],
      ["/avatar", "Avatar", "Personaje de identificación del alumno"]
    ]
  },
  {
    name: "🕹️ Universos de Videojuegos y Temáticas Populares",
    items: [
      ["/mariokart", "Mario Kart / Carreras", "Pistas de velocidad, cajas de sorpresa '?', monedas, turbos por acierto y podio final"],
      ["/minecraft", "Minecraft / Voxel", "Bloques cúbicos de tierra/madera, corazones de vida, crafteo de herramientas y aventura de supervivencia"],
      ["/roblox", "Roblox / Obby", "Pista de obstáculos flotantes de colores neón sobre lava, saltos por acierto y checkpoints dorados"],
      ["/lego", "Lego / Bloques", "Construcción colaborativa pieza a pieza, ladrillos ensamblables de colores y ensamble de estructuras"],
      ["/pokemon", "Pokémon / Duelo RPG", "Batalla por turnos con barra de vida (HP), ataques de conocimiento y captura de criaturas del saber"],
      ["/arcade", "Arcade Retro / 8-Bit", "Estética de recreativa clásica, monedas, vidas extra '1UP' y música chiptune"]
    ]
  },
  {
    name: "🧠 Organizadores gráficos",
    items: [
      ["/mindmap", "Mapa mental", "Nodos ramificados y conexiones"],
      ["/diagrama", "Diagrama pedagógico", "Esquema visual estructurado de flujo, procesos y causas"],
      ["/venndiagram", "Diagrama de Venn", "Comparación y solapamiento conceptual"],
      ["/flowchart", "Diagrama de flujo", "Secuencia de decisiones y pasos"],
      ["/timeline", "Línea de tiempo", "Orden cronológico de eventos"],
      ["/kwlchart", "Tabla SQA", "Lo que sé / quiero saber / aprendí"],
      ["/conceptmap", "Mapa conceptual", "Conceptos jerarquizados con conectores"]
    ]
  },
  {
    name: "📊 Evaluación y metacognición",
    items: [
      ["/rubric", "Rúbrica", "Criterios claros y descriptores de nivel"],
      ["/checklist", "Checklist", "Lista de verificación de tareas"],
      ["/exitticket", "Exit ticket", "Boleto de salida para chequeo rápido"],
      ["/certificate", "Certificado", "Diploma de logro de meta"],
      ["/reportcard", "Boletín", "Resumen formativo de competencias"]
    ]
  },
  {
    name: "🧩 Inclusión, DUA y Adaptaciones Curriculares",
    items: [
      ["/dua", "Diseño Universal (DUA)", "3 Principios: Múltiples medios de representación, acción/expresión e implicación"],
      ["/tdah", "Adaptación TDAH", "Instrucciones fragmentadas paso a paso, checklists de foco, baja carga textual y pausas activas"],
      ["/discalculia", "Adaptación Discalculia", "Apoyo concreto, recta numérica visual, cuadrícula espaciada y andamiaje manipulativo"],
      ["/altascapacidades", "Altas Capacidades", "Enriquecimiento curricular: preguntas abiertas de pensamiento divergente y retos metacognitivos"],
      ["/lecturafacil", "Lectura Fácil & Dislexia", "Enunciados directos en lenguaje accesible, apoyo con pictogramas y tipografía clara"],
      ["/andamiaje", "Andamiaje Progresivo", "Pistas graduales (Nivel 1: modelado, Nivel 2: guía parcial, Nivel 3: autonomía)"],
      ["/pausasactivas", "Pausas Cognitivas", "Micro-descansos de autorregulación emocional y respiración consciente integrados"]
    ]
  },
  {
    name: "🏫 Gestión del aula",
    items: [
      ["/seatingchart", "Mapa de asientos", "Organización espacial del salón"],
      ["/classroomrules", "Normas", "Acuerdos visuales de convivencia"],
      ["/calendar", "Calendario", "Planificador temporal de metas"],
      ["/behaviorchart", "Semáforo", "Autorregulación y conducta positiva"],
      ["/nametag", "Gafete", "Identificación personal del estudiante"],
      ["/hallpass", "Pase de salida", "Control y autonomía en pasillos"]
    ]
  },
  {
    name: "🖨️ Formatos pedagógicos base",
    items: [
      ["/worksheet", "Hoja de trabajo", "Ficha práctica de ejercicios"],
      ["/comicdidactico", "Cómic didáctico", "Historieta educativa con viñetas secuenciales, bocadillos de diálogo y personajes"],
      ["/flashcard", "Flashcard", "Tarjeta de pregunta/desafío y solución"],
      ["/infographic", "Infografía", "Síntesis gráfica de conceptos"],
      ["/poster", "Cartel mural", "Material visual para pared de aula"],
      ["/bookmark", "Separador", "Marcador de lectura con pistas"],
      ["/booklet", "Folleto plegable", "Material en tríptico o mini-guía"]
    ]
  },
  {
    name: "👨‍👩‍👧 Vinculación familiar",
    items: [
      ["/newsletter", "Boletín informativo", "Resumen periódico para familias"],
      ["/parentletter", "Carta para casa", "Comunicación clara de metas escolares"],
      ["/flyer", "Volante", "Invitación o aviso importante"],
      ["/qrcode", "Código QR", "Enlace a recursos digitales complementarios"]
    ]
  },
  {
    name: "⭐ Elementos complementarios",
    items: [
      ["/lineicon", "Íconos de línea", "Pictogramas claros y minimalistas"],
      ["/stickersheet", "Plancha de stickers", "Incentivos visuales coleccionables"],
      ["/emojidecoration", "Emojis pedagógicos", "Anclaje emocional y lúdico"]
    ]
  }
];

export const LIDER_PEDAGOGICAL_MEANINGS: Record<string, string> = {
  "L-01": "Descarga cognitiva: superar tecnofobia y delegar borradores o estructuración inicial en la IA.",
  "L-02": "Copiloto diario: diseñar secuencias didácticas completas reduciendo tiempos de preparación.",
  "L-03": "Tiempo para lo humano: liberar horas docentes para la mediación, empatía y vínculo con el estudiante.",
  "I-01": "Alineación curricular: vincular actividades con competencias, estándares y criterios oficiales.",
  "I-02": "Taxonomía de Bloom: progresar desde el recuerdo/comprensión hasta el análisis, evaluación y creación.",
  "I-03": "Juicio crítico y Fact-Checking: enseñar a dudar metodológicamente y contrastar fuentes confiables.",
  "D-01": "Diseño imprimible de aula: formato limpio, tipografía legible y pauta lista para fotocopiar.",
  "D-02": "Interactividad real funcional: código web con botones, comprobación activa, puntuación y reinicio.",
  "D-03": "Gamificación con sentido: niveles progresivos, retos desafiantes, pistas contextuales e insignias.",
  "E-01": "Evaluación formativa ágil: tickets de salida y rúbricas analíticas cualitativas sin sobrecarga.",
  "E-02": "Andamiaje adaptativo: pistas graduadas y apoyos visuales para respetar ritmos diversos de aprendizaje.",
  "E-03": "Feedback oportuno: retroalimentación inmediata que explica el 'por qué' del error para construir aprendizaje.",
  "R-01": "Transferencia entre pares: documentar y compartir recursos pedagógicos abiertos con la comunidad escolar.",
  "R-02": "Ética e IA responsable: formar ciudadanos digitales con valores éticos, privacidad y pensamiento crítico.",
  "R-03": "Liderazgo docente: trascender en el claustro y convertirse en referente de innovación educativa.",
  "/worksheet": "Estructura de hoja de trabajo con consignas paso a paso, área de resolución y rúbrica rápida.",
  "/flashcard": "Diseño en formato tarjeta de doble cara o reto/respuesta con preguntas detonadoras.",
  "/infographic": "Jerarquización visual rigurosa: título magnético, datos clave, conectores y resumen de impacto.",
  "/rubric": "Tabla con filas de competencias evaluadas y columnas con descriptores cualitativos (Inicial, En proceso, Logrado, Destacado).",
  "/checklist": "Lista secuencial con casillas de verificación para fomentar la autonomía del estudiante.",
  "/exitticket": "Ticket de salida breve (3 a 5 minutos) con 2 preguntas de contenido y 1 de reflexión metacognitiva.",
  "/badge": "Insignia o logro visual otorgado al alcanzar un criterio específico de aprendizaje.",
  "/scoreboard": "Sistema de puntos o conteo de progreso para gamificar la experiencia sin penalizar el error.",
  "/progressbar": "Barra de avance visual que muestra etapas completadas y el camino restante.",
  "/chalkboard": "Estética de pizarra oscura con tiza clara, excelente contraste y tipografía legible.",
  "/doodle": "Ilustraciones con estilo garabato pedagógico cálido, accesible y estimulante.",
  "/space": "Ambientación espacial con metáforas astronómicas (misiones, órbitas, constelaciones de conocimiento).",
  "/highcontrast": "Relación de contraste WCAG AAA entre fondo y elementos de texto/interacción.",
  "/mindmap": "Nodo central y ramificaciones conceptuales ordenadas por color y nivel de abstracción con anclajes visuales e íconos.",
  "/comicdidactico": "Historieta didáctica con narrativa secuencial de viñetas, bocadillos de diálogo, personajes y dilema pedagógico.",
  "/diagrama": "Esquema visual estructurado de flujo, procesos, relaciones causa-efecto y cajas de decisión.",
  "/summary": "Resumen estructurado en 3 columnas o bloques visuales: causas, hechos principales y consecuencias.",
  "/simple": "Explicación accesible contrastada: versión compleja vs. versión simple con lenguaje cotidiano y analogía gráfica.",
  "/explain": "Explicación paso a paso: 1. ¿Qué es?, 2. Tipos, 3. Representación gráfica, 4. Ejemplos de la vida real, 5. ¡Práctica!",
  "/example": "Colección de ejemplos cotidianos y cercanos que transforman conceptos abstractos en experiencias tangibles.",
  "/analogy": "Analogía pedagógica visual que compara el concepto con un sistema comprensible de la vida real (ej. célula = fábrica).",
  "/quiz": "Cuestionario estructurado con preguntas tipo test, opción múltiple o V/F, iconos ilustrados y hoja de respuestas.",
  "/timeline": "Línea del tiempo cronológica con fechas, hitos secuenciales, conectores e ilustraciones de época.",
  "/create": "Ficha de comprensión o actividad multinivel con preguntas clasificadas en Nivel Básico, Intermedio y Avanzado.",
  "/design": "Cartel de Visual Thinking con cuadrícula numerada de normas, acuerdos o pasos con dibujos y frases directas.",
  "/compare": "Tabla comparativa A vs. B enfrentando características, ilustraciones de cada categoría y la 'Diferencia clave 🔑'.",
  "/review": "Ficha de repaso activo de 4 ejercicios variados: escribir, comparar, colorear/dibujar y resolver problema.",
  "/stickersheet": "Plancha de stickers ilustrados con pequeños iconos temáticos, borde blanco grueso troquelado y cuadrícula ordenada.",
  "/cartoon": "Estilo cartoon caricaturesco con personajes expresivos, alegres y cercanos al público infantil.",
  "/3d": "Renderizado 3D digital con volumen suave, iluminación cinematográfica y profundidad táctil estilo animación 3D.",
  "/visualthinking": "Pensamiento visual y graphic recording con viñetas secuenciales (Antes, El Hecho, Ahora) y rótulos ilustrados a mano.",
  "/mariokart": "Ambientación y dinámica estilo carreras / Mario Kart: pistas de asfalto, cajas sorpresa con '?', monedas doradas, turbos por acierto y podio.",
  "/minecraft": "Estética voxel y supervivencia estilo Minecraft: bloques cúbicos, corazones de salud, mesa de crafteo y herramientas desbloqueables.",
  "/roblox": "Pista de obstáculos tipo Obby / Roblox: plataformas flotantes sobre lava de neón, saltos por acierto y checkpoints dorados.",
  "/lego": "Estética de bloques de construcción Lego: ladrillos de colores ensamblables, studs plásticos y construcción colaborativa paso a paso.",
  "/pokemon": "Duelo de conocimiento estilo RPG / Pokémon: batallas por turnos, barra de puntos de vida (HP), ataques conceptuales y captura de criaturas.",
  "/arcade": "Estética de recreativa clásica y 8-Bit: tipografía de píxel, vidas '1UP', efectos de sonido chiptune y tabla de puntuación récord.",
  "/dua": "Diseño Universal para el Aprendizaje: 3 principios (múltiples medios de representación, expresión e implicación) garantizando acceso equitativo.",
  "/tdah": "Adaptación para TDAH: reducción de carga textual, fragmentación de pasos con casillas de verificación, destacados en negrita y pausas activas.",
  "/discalculia": "Adaptación para Discalculia: recta numérica visible, apoyos manipulativos gráficos, espaciado amplio y asociación de signos.",
  "/altascapacidades": "Enriquecimiento para Altas Capacidades: preguntas divergentes de orden superior, pensamiento metacognitivo y reto creador.",
  "/lecturafacil": "Lectura Fácil: pautas de accesibilidad lingüística, oraciones directas sin ambigüedad y pictogramas de apoyo.",
  "/andamiaje": "Andamiaje progresivo: desvanecimiento gradual de apoyos (modelado docente, práctica guiada y resolución autónoma).",
  "/pausasactivas": "Pausas cognitivas: micro-descansos de 60 segundos de respiración consciente y estiramiento para autorregulación emocional."
};

export const GAM_EXPERIENCES = [
  ["/quiz", "🧩 Quiz Interactivo", "Preguntas con retroalimentación inmediata"],
  ["/escape", "🔐 Escape Room", "Retos encadenados con pistas y claves"],
  ["/memory", "🧠 Juego de Memoria", "Asociación de parejas de conceptos y definiciones"],
  ["/wheel", "🎡 Ruleta de Desafíos", "Selección aleatoria de preguntas y pruebas"],
  ["/race", "🏁 Carrera de Aprendizaje", "Tablero de avance por metas superadas"],
  ["/mission", "🗺️ Misión Pedagógica", "Aventura por etapas con objetivo final"],
  ["/matching", "🔗 Emparejamiento Dinámico", "Arrastrar o unir conceptos correspondientes"],
  ["/wordsearch", "🔤 Sopa de Letras / Vocabulario", "Búsqueda activa de términos clave"],
  ["/sequence", "🔢 Ordenar Secuencias", "Organización lógica y cronológica de pasos"],
  ["/completion", "✏️ Completar Desafíos", "Relleno interactivo con validación instantánea"]
];

export const GAM_MECHANICS = [
  ["/points", "⭐ Puntos por logro"],
  ["/xp", "⚡ Puntos de experiencia (XP)"],
  ["/badge", "🏅 Insignias desbloqueables"],
  ["/mission", "🗺️ Misiones guiadas"],
  ["/timer", "⏱️ Temporizador configurable"],
  ["/streak", "🔥 Contador de rachas"],
  ["/reward", "🎁 Recompensas formativas"],
  ["/teams", "👥 Dinámica de equipos"],
  ["/leaderboard", "🏆 Tabla de reconocimiento"],
  ["/progressbar", "📈 Barra de progreso en vivo"],
  ["/avatar", "🧑‍🚀 Identidad de avatar"],
  ["/levelup", "⬆️ Niveles de dificultad progresiva"],
  ["/hints", "💡 Sistema de pistas graduales"],
  ["/feedback", "💬 Retroalimentación inmediata explicativa"]
];

export const GAM_VISUALS = [
  ["/mariokart", "🏎️ Mario Kart / Carreras"],
  ["/minecraft", "⛏️ Minecraft / Voxel 3D"],
  ["/roblox", "🧱 Roblox / Obby de Obstáculos"],
  ["/lego", "🧩 Lego / Bloques Ensamblables"],
  ["/pokemon", "⚡ Pokémon / Batalla RPG"],
  ["/arcade", "🕹️ Arcade Retro / 8-Bit"],
  ["/space", "🚀 Aventura Espacial"],
  ["/doodle", "✏️ Garabato / Cuaderno"],
  ["/cartoon", "🎨 Caricatura / Cartoon"],
  ["/pixelart", "👾 Pixel Art Retro"],
  ["/watercolor", "🖌️ Acuarela Pedagógica"],
  ["/flatdesign", "✨ Flat Design Moderno"],
  ["/handwrittenillustration", "📝 Ilustración a mano"],
  ["/chalkboard", "🏫 Pizarra y tiza"],
  ["/pastel", "🌈 Tonos Pastel Suaves"],
  ["/neon", "💜 Neón Lúdico"]
];

export const GAM_ACCESSIBILITY = [
  ["/highcontrast", "Alto contraste visual"],
  ["/simplifiedlanguage", "Lenguaje claro y directo"],
  ["/visualicons", "Apoyo iconográfico"],
  ["/audioinstructions", "Opción de locución / audio"],
  ["/extendedtime", "Sin límite de tiempo penalizante"],
  ["/bilingual", "Bilingüe (Español / Inglés)"],
  ["/nee", "Adaptaciones para NEE / DUA"],
  ["/reducedmotion", "Movimiento reducido"],
  ["/adjustablefont", "Texto de alta legibilidad"]
];
