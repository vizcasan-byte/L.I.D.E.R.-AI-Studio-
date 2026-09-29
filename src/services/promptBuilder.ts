/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResourceFormData, ResourceFunctionMode } from '../types';
import { LIDER_CATEGORIES, LIDER_PEDAGOGICAL_MEANINGS } from '../data/liderCodes';

export function getModalityLabel(modo: ResourceFunctionMode): string {
  switch (modo) {
    case 'imprimible':
      return '📄 Imprimible — listo para imprimir y trabajar en papel';
    case 'interactivo':
      return '💻 Interactivo — botones, respuestas, puntuación, retroalimentación y reinicio cuando corresponda';
    case 'hibrido':
      return '🔄 Híbrido — versión imprimible + versión interactiva';
    case 'visual':
      return '🎨 Solo Recurso Visual — prompt para generadores de imágenes (Midjourney, DALL-E, Ideogram, ChatGPT)';
    default:
      return '💻 Interactivo';
  }
}

export function buildResourcePrompt(data: ResourceFormData): string {
  const {
    tipo,
    modo,
    tema,
    materia,
    grado,
    objetivo,
    adicional,
    selectedCodes,
    paperSize = 'carta',
    orientation = 'vertical',
    aspectRatio = orientation === 'horizontal' ? '16:9' : '3:4'
  } = data;

  // Intelligent separation between academic topic and game setting if user typed both into tema
  let cleanTema = (tema || '').trim();
  let explicitSettingFromTema = '';
  
  if (/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade))/i.test(cleanTema)) {
    const match = cleanTema.match(/(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade)/i);
    if (match) {
      explicitSettingFromTema = match[0].toLowerCase();
    }
    cleanTema = cleanTema.replace(/(\s*(,|y|\.|\-)?\s*(que\s+)?(la\s+)?(ambientaci[oó]n|tem[aá]tica|estilo|universo|mundo|juego)\s*(del\s+juego)?\s*(sea|es|tipo|de)?\s*(minecraft|mario\s*kart|roblox|lego|pok[eé]mon|arcade)?)/gi, '').trim();
  }
  if (!cleanTema) cleanTema = tema.trim() || 'Contenido curricular';

  // Compile selected code descriptions
  const codeDetails: string[] = [];
  selectedCodes.forEach(code => {
    let foundLabel = '';
    let foundDesc = '';
    for (const cat of LIDER_CATEGORIES) {
      const match = cat.items.find(item => item[0] === code);
      if (match) {
        foundLabel = match[1];
        foundDesc = match[2];
        break;
      }
    }
    const meaning = LIDER_PEDAGOGICAL_MEANINGS[code] || foundDesc || 'Elemento de diseño pedagógico';
    const labelPart = foundLabel ? `${code} · ${foundLabel}` : code;
    codeDetails.push(`• ${labelPart}: ${meaning}`);
  });

  const tipoLower = (tipo || '').toLowerCase();

  const is3D = selectedCodes.includes('/3d') || 
               tema.toLowerCase().includes('3d') || 
               adicional.toLowerCase().includes('3d') ||
               (objetivo || '').toLowerCase().includes('3d') ||
               tipoLower.includes('3d');

  const isPixel = selectedCodes.includes('/pixelart') || 
                  tema.toLowerCase().includes('pixel') || 
                  adicional.toLowerCase().includes('pixel');

  const isClay = selectedCodes.includes('/claymorphism') || 
                 tema.toLowerCase().includes('plastilina') || 
                 adicional.toLowerCase().includes('plastilina');

  const isHandwritten = selectedCodes.includes('/handwritten') ||
                        tema.toLowerCase().includes('apuntes') ||
                        tema.toLowerCase().includes('handwritten') ||
                        adicional.toLowerCase().includes('apuntes') ||
                        adicional.toLowerCase().includes('handwritten');

  const isVisualThinkingCode = tipoLower.includes('visual thinking') || 
                               selectedCodes.includes('/visualthinking') ||
                               tema.toLowerCase().includes('visual thinking');

  const isMarioKart = selectedCodes.includes('/mariokart') ||
                      explicitSettingFromTema.includes('mario') ||
                      tema.toLowerCase().includes('mario kart') ||
                      adicional.toLowerCase().includes('mario kart');

  const isMinecraft = selectedCodes.includes('/minecraft') ||
                      explicitSettingFromTema.includes('minecraft') ||
                      tema.toLowerCase().includes('minecraft') ||
                      adicional.toLowerCase().includes('minecraft');

  const isRoblox = selectedCodes.includes('/roblox') ||
                   explicitSettingFromTema.includes('roblox') ||
                   tema.toLowerCase().includes('roblox') ||
                   adicional.toLowerCase().includes('roblox');

  const isLego = selectedCodes.includes('/lego') ||
                 explicitSettingFromTema.includes('lego') ||
                 tema.toLowerCase().includes('lego') ||
                 adicional.toLowerCase().includes('lego');

  const isPokemon = selectedCodes.includes('/pokemon') ||
                    selectedCodes.includes('/pokémon') ||
                    explicitSettingFromTema.includes('pokemon') ||
                    explicitSettingFromTema.includes('pokémon') ||
                    tema.toLowerCase().includes('pokemon') ||
                    tema.toLowerCase().includes('pokémon') ||
                    adicional.toLowerCase().includes('pokemon') ||
                    adicional.toLowerCase().includes('pokémon');

  const isArcade = selectedCodes.includes('/arcade') ||
                   explicitSettingFromTema.includes('arcade') ||
                   tema.toLowerCase().includes('arcade') ||
                   adicional.toLowerCase().includes('arcade');

  // Resolución dinámica del estilo visual elegido por el docente
  let spanishStyle = 'ilustración didáctica limpia, contornos nítidos y diseño equilibrado';
  let englishStyle = 'clean educational illustration, crisp outlines, balanced composition';
  let styleHeaderSpanish = '';
  let styleHeaderEnglish = '';
  let negativePrompt = '';

  if (is3D) {
    styleHeaderSpanish = '🧊 [TÉCNICA VISUAL OBLIGATORIA: RENDER 3D DIGITAL / CGI PIXAR]\nATENCIÓN IA: CERO ilustración 2D plana, CERO dibujo a mano, CERO estilo libro de cuentos tradicional. Cada elemento, personaje y escena debe ser un MODELADO 3D VOLUMÉTRICO DIGITAL estilo película animada de Pixar/Disney, con iluminación cinematográfica de estudio, sombras suaves y profundidad de campo real.\n\n';
    styleHeaderEnglish = '3D CGI digital render, authentic 3D volumetric character modeling, Pixar Disney 3D animation style, soft studio raytraced lighting, ambient occlusion, depth of field, tactile smooth materials, no 2D, no flat drawing, no sketch';
    negativePrompt = ' --no 2d, flat, drawing, sketch, paper, outline, lineart, picture book, storybook';
    spanishStyle = 'render digital 3D de alta calidad con volumen suave, iluminación cinematográfica, texturas táctiles y profundidad de campo estilo animación 3D Pixar/Disney (CERO dibujo 2D, CERO cartoon plano)';
  } else if (isMarioKart) {
    styleHeaderSpanish = '🏎️ [TÉCNICA VISUAL OBLIGATORIA: UNIVERSO MARIO KART / RACING ARCADE]\nATENCIÓN IA: Ambientación completa de circuito de carreras estilo Mario Kart de Nintendo. Pistas de asfalto dinámicas con líneas de meta a cuadros blancos y negros, cajas misteriosas flotantes con signo de interrogación "?", monedas doradas coleccionables, karts veloces y coloridos, estelas de turbo nitro luminosas y podio de victoria.\n\n';
    styleHeaderEnglish = 'Mario Kart arcade racing game aesthetic, colorful race track with checkered finish line, glowing question mark mystery item boxes, floating gold coins, vibrant go-karts, speed booster lines, celebratory winner podium, Nintendo video game art';
    negativePrompt = ' --no realistic, dark, grunge, boring, dull colors';
    spanishStyle = 'universo de carreras estilo Mario Kart con pista de asfalto, cajas sorpresa con signo "?", monedas doradas y podio de trofeos';
  } else if (isMinecraft) {
    styleHeaderSpanish = '⛏️ [TÉCNICA VISUAL OBLIGATORIA: UNIVERSO MINECRAFT / VOXEL 3D]\nATENCIÓN IA: Estética cúbica de vóxeles y bloques 3D estilo Minecraft. Terrenos escalonados de bloques de tierra con hierba, piedra, madera y minerales, barra de interfaz superior con corazones rojos de vida y muslos de comida, mesa de trabajo de crafteo de 3x3, herramientas pixeladas (pico de diamante/hierro) y sol cuadrado radiante.\n\n';
    styleHeaderEnglish = 'Authentic Minecraft voxel 3D blocky game style, cubic landscape with textured dirt grass stone blocks, pixelated game HUD with red heart health bar, crafting grid elements, blocky trees and tools, warm blocky sunlight';
    negativePrompt = ' --no smooth round circles, realistic, 2D flat, curved shapes';
    spanishStyle = 'estilo voxel y bloques cúbicos 3D tipo Minecraft con texturas pixeladas, corazones de vida, mesa de crafteo y herramientas de bloques';
  } else if (isRoblox) {
    styleHeaderSpanish = '🧱 [TÉCNICA VISUAL OBLIGATORIA: UNIVERSO ROBLOX / OBBY PARKOUR]\nATENCIÓN IA: Estética de pista de obstáculos "Obby" de Roblox. Plataformas flotantes geométricas de colores brillantes neón (azul cian, amarillo lima, magenta eléctrico) suspendidas sobre suelo de lava o vacío, checkpoints dorados en forma de estrella/placa, avatares geométricos simpáticos saltando entre bloques y marcadores de niveles o stages.\n\n';
    styleHeaderEnglish = 'Roblox Obby parkour obstacle course aesthetic, colorful neon floating geometric platforms over orange lava, glowing golden stage checkpoints, blocky avatar characters jumping, bright cheerful multiplayer game UI';
    negativePrompt = ' --no grim, photorealistic, drab, dark realism';
    spanishStyle = 'estilo pista de obstáculos Obby de Roblox con plataformas flotantes de colores neón, checkpoints dorados y desafíos de salto';
  } else if (isLego) {
    styleHeaderSpanish = '🧩 [TÉCNICA VISUAL OBLIGATORIA: CONSTRUCCIÓN LEGO 3D / BRICK ART]\nATENCIÓN IA: Todo el entorno, personajes y objetos deben estar construidos íntegramente con ladrillos y bloques de plástico ensamblables tipo LEGO®. Con conectores cilíndricos ("studs") visibles en la parte superior de cada pieza, acabado de plástico brillante con bordes biselados, colores primarios vivos y minifiguras LEGO con expresiones características.\n\n';
    styleHeaderEnglish = 'Authentic Lego brick toy construction style, built entirely out of plastic toy bricks with visible studs, glossy toy plastic texture with subtle edge bevels, Lego minifigures, bright primary colors, macro toy photography lighting';
    negativePrompt = ' --no flat 2D, non-brick textures, realistic skin, organic curves';
    spanishStyle = 'estilo de construcción de juguetes con ladrillos plásticos tipo Lego, con studs cilíndricos visibles y minifiguras';
  } else if (isPokemon) {
    styleHeaderSpanish = '⚡ [TÉCNICA VISUAL OBLIGATORIA: BATALLA RPG POKÉMON]\nATENCIÓN IA: Estética de batalla de gimnasio / RPG por turnos estilo Pokémon. Arena de duelo con plataformas circulares en el suelo, cajas de estado con barra de vida verde (HP), nombres y niveles (Nv. 50), recuadro inferior de menú de comandos [LUCHAR / CONOCIMIENTO / MOCHILA / HUIR] y criaturas fantásticas entrañables.\n\n';
    styleHeaderEnglish = 'Classic Pokemon turn-based RPG battle scene, battle arena circle ground, HP health bar status boxes with levels, retro command battle dialogue box, anime monster battle perspective, vibrant nostalgic game art';
    negativePrompt = ' --no dark realism, gory, violent, photorealistic';
    spanishStyle = 'estilo batalla RPG Pokémon con barras de salud HP, menú de comandos en combate y arena de duelo por turnos';
  } else if (isArcade) {
    styleHeaderSpanish = '🕹️ [TÉCNICA VISUAL OBLIGATORIA: MÁQUINA ARCADE RETRO / 8-BIT]\nATENCIÓN IA: Estética de videojuego de salón recreativo arcade clásico. Luces de neón en marquesinas, tipografía pixelada brillante "INSERT COIN" y "1UP", contadores numéricos de "SCORE" y "HIGH SCORE", barra de vidas con íconos retro y marco con efecto curvado de monitor CRT con scanlines suaves.\n\n';
    styleHeaderEnglish = '80s 90s retro arcade cabinet screen, pixel art video game HUD with glowing SCORE and HI-SCORE, 1UP lives indicator, neon arcade marquee glow, CRT scanline effect, nostalgic coin-op video game';
    negativePrompt = ' --no modern minimalism, corporate flat, dull';
    spanishStyle = 'estilo de máquina arcade retro de los 80s/90s con marcadores de SCORE, luces de neón y vidas 1UP';
  } else if (isHandwritten) {
    styleHeaderSpanish = '📝 [TÉCNICA VISUAL OBLIGATORIA: APUNTES DE CUADERNO / HANDWRITTEN STUDY NOTES]\nATENCIÓN IA: Todo el diseño debe simular fielmente una página de libreta o cuaderno escolar de apuntes ilustrados a mano (estilo sketchnote / studygram). Tipografía caligráfica manuscrita clara y cuidada, títulos rotulados con plumón o marcador, palabras clave destacadas como con resaltador fluorescente o marcador amarillo/verde pastel, esquemas con flechas dibujadas a mano, pequeños bocetos y doodles al margen, y textura de fondo de hoja cuadriculada o rayada de libreta escolar.\n\n';
    styleHeaderEnglish = 'Authentic handwritten study notes aesthetic, beautiful student notebook page, handwritten calligraphy lettering, sketchnote diagram layout, margin doodles and tiny sketches, arrows and flowchart connectors, soft pastel highlighter pen accents, clean grid or ruled notebook paper background, cozy studygram illustration style';
    negativePrompt = ' --no 3d render, photograph, corporate vector, digital ui, modern sans-serif fonts, sterile layout';
    spanishStyle = 'estilo de libreta de apuntes escolar a mano (study notes / sketchnote), con caligrafía manuscrita cuidada, esquemas con flechas, resaltador pastel y bocetos al margen';
  } else if (isPixel) {
    styleHeaderSpanish = '👾 [TÉCNICA VISUAL OBLIGATORIA: AUTÉNTICO PIXEL ART RETRO 16-BIT]\nATENCIÓN IA: Cero ilustraciones vectoriales suaves, cero degradados realistas, cero 3D. Genera auténtico pixel art de videojuego retro de 16 bits (SNES / Game Boy Advance) con píxeles cuadrados visibles, cuadrícula retro nítida y paleta limitada de colores retro.\n\n';
    styleHeaderEnglish = 'Authentic 16-bit retro pixel art game sprite graphics, crisp visible square pixel grid, nostalgic classic video game aesthetic, limited retro palette, sharp pixelated edges, no smooth lines, no vector, no 3D';
    negativePrompt = ' --no 3d, smooth, vector, realistic, gradient, photographic, picture book';
    spanishStyle = 'estilo pixel art retro 16-bit con píxeles cuadrados visibles y estética de videojuego clásico (CERO trazos vectoriales lisos)';
  } else if (isClay) {
    styleHeaderSpanish = '🧱 [TÉCNICA VISUAL OBLIGATORIA: PLASTILINA 3D / CLAYMATION]\nATENCIÓN IA: No hagas dibujos planos. Modela las figuras en plastilina/arcilla 3D con volumen escultórico real, sombras suaves y estética táctil de animación stop-motion.\n\n';
    styleHeaderEnglish = 'Claymation stop-motion plasticine 3D style, tactile sculpted clay models, volumetric figures, gentle ambient lighting, handmade tactile clay look, no flat 2d';
    negativePrompt = ' --no 2d, flat, digital drawing, vector, picture book';
    spanishStyle = 'estilo plastilina 3D claymation, figuras moldeadas a mano con texturas suaves de arcilla, volumen táctil y sombras amables';
  } else if (isVisualThinkingCode) {
    styleHeaderSpanish = '📐 [TÉCNICA VISUAL: VISUAL THINKING / GRAPHIC RECORDING]\nEstructura en viñetas explicativas secuenciales (Antes, El Hecho, Ahora), bocetos claros, rotulación dibujada a mano e íconos didácticos.\n\n';
    styleHeaderEnglish = 'Visual Thinking graphic recording style, clear storyboard panels (Before, The Event, Now), friendly hand-drawn educational sketches, clean hand lettering and arrows';
    spanishStyle = 'estilo Visual Thinking y Graphic Recording: viñetas explicativas secuenciales, bocetos claros, rotulación dibujada a mano e íconos didácticos';
  } else if (selectedCodes.includes('/papercraft')) {
    styleHeaderSpanish = '📄 [TÉCNICA VISUAL OBLIGATORIA: PAPERCRAFT EN CAPAS]\nCapas superpuestas de cartulina recortada con sombras de relieve realistas entre capas, profundidad táctil de papel artesanal.\n\n';
    styleHeaderEnglish = 'Layered papercraft craft art, layered cut paper sheets with realistic cast shadows, tactile depth, craft paper textures';
    negativePrompt = ' --no 3d cgi, flat digital vector';
    spanishStyle = 'papercraft y collage en capas de papel recortado con sombras de relieve realistas';
  } else if (selectedCodes.includes('/cartoon')) {
    styleHeaderSpanish = '🎨 [ESTILO: CARTOON INFANTIL ILUSTRADO]\nPersonajes expresivos, simpáticos y amables, trazos limpios y estética cálida de libro de cuentos.\n\n';
    styleHeaderEnglish = 'Charming cartoon illustration style, cute expressive characters, cheerful storybook art, lively hand-drawn aesthetic';
    spanishStyle = 'estilo cartoon ilustrado, caricaturesco con personajes amables y expresivos, trazos limpios y estética de libro infantil';
  } else if (selectedCodes.includes('/chalkboard')) {
    spanishStyle = 'pizarra escolar oscura con tizas de colores brillantes de alto contraste';
    englishStyle = 'school chalkboard texture with bright chalk drawings and high contrast lettering';
  } else if (selectedCodes.includes('/doodle')) {
    spanishStyle = 'estilo doodle / garabatos a mano alzada en libreta, espontáneo y didáctico';
    englishStyle = 'playful hand-drawn doodle style, notebook sketches, charming loose outlines';
  } else if (selectedCodes.includes('/flatdesign')) {
    spanishStyle = 'flat design moderno, vectores geométricos planos y contornos minimalistas';
    englishStyle = 'modern flat vector design, clean geometric shapes, minimalist graphic illustration';
  } else if (selectedCodes.includes('/watercolor')) {
    spanishStyle = 'acuarela suave con pinceladas traslúcidas, salpicaduras artísticas y degradados delicados';
    englishStyle = 'soft delicate watercolor wash, translucent brush strokes, artistic gradients';
  } else if (selectedCodes.includes('/lineart')) {
    spanishStyle = 'line art limpio y definido, contornos de tinta nítidos con alto contraste';
    englishStyle = 'crisp clean line art, bold ink outlines, high clarity';
  }

  // Paleta cromática dinámica
  let paletteSpanish = 'paleta de colores armónica y relajante';
  let paletteEnglish = 'harmonious balanced palette';

  if (selectedCodes.includes('/pastel')) {
    paletteSpanish = 'paleta suave de tonos pastel (rosa cuarzo, azul cielo, amarillo mantequilla y verde menta)';
    paletteEnglish = 'gentle pastel palette (baby blue, soft peach, butter yellow, mint green)';
  } else if (selectedCodes.includes('/neon')) {
    paletteSpanish = 'paleta neón luminosa y vibrante de alto contraste';
    paletteEnglish = 'vibrant glowing neon colors, high contrast saturation';
  } else if (selectedCodes.includes('/retro')) {
    paletteSpanish = 'paleta vintage retro cálida de los años 70 y 80';
    paletteEnglish = 'warm vintage retro 70s/80s palette, slightly aged paper tone';
  } else if (selectedCodes.includes('/space')) {
    paletteSpanish = 'paleta cósmica espacial con azul noche, violeta y destellos dorados';
    paletteEnglish = 'deep cosmic space palette, midnight blue, nebula purple, starlight glow';
  } else if (selectedCodes.includes('/highcontrast')) {
    paletteSpanish = 'alto contraste en blanco y negro o colores primarios sólidos';
    paletteEnglish = 'high contrast black and white or bold solid primary colors';
  }

  const finishSpanish = selectedCodes.includes('/outline') ? 'con bordes blancos gruesos estilo troquelado (die-cut outline)' : 'acabado limpio y nítido';
  const finishEnglish = selectedCodes.includes('/outline') ? 'thick white die-cut sticker borders around each element' : 'clean sharp finish';

  // MODO VISUAL: Generación exclusiva de prompts para generadores de imágenes (Midjourney, DALL-E, Ideogram, ChatGPT)
  if (modo === 'visual') {
    const isStickers = tipoLower.includes('sticker') || selectedCodes.includes('/stickersheet') || tipoLower.includes('pegatina');
    const isComic = tipoLower.includes('comic') || tipoLower.includes('cómic') || tipoLower.includes('historieta') || selectedCodes.includes('/comicdidactico');
    const isVisualThinking = tipoLower.includes('visual thinking') || selectedCodes.includes('/visualthinking');

    if (isStickers) {
      return `${styleHeaderSpanish}Crea una hoja de stickers organizada en cuadrícula sobre "${tema}"${grado ? ` para nivel ${grado}` : ''}, con pequeños íconos tiernos de tareas, símbolos representativos y elementos educativos.
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
- Acabado: ${finishSpanish}.
- Composición: fondo blanco liso o transparente, cuadrícula ordenada de 8 a 16 stickers individuales separados, cada uno con una pequeña etiqueta o título legible en la base.
- Aspecto limpio y listo para recortar o usar en agenda digital y escolar.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Cute sticker sheet of "${tema}", ${styleHeaderEnglish ? `${styleHeaderEnglish}, ` : ''}${englishStyle}, ${paletteEnglish}, ${finishEnglish}, neatly organized in a 4x4 grid on a clean white background, high quality, isolated elements, cheerful aesthetic, educational children sticker pack --ar 1:1${negativePrompt} --v 6.0`.trim();
    }

    if (isVisualThinking) {
      return `${styleHeaderSpanish}Crea una lámina ilustrada de Visual Thinking / Historia Gráfica educativa sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Título destacado superior en letras dibujadas a mano: "¡${tema.toUpperCase()}!".
- Estructura en 3 paneles secuenciales de alto impacto visual (en cuadrícula horizontal):
  * Panel 1 "ANTES": Ilustración del contexto histórico/situación previa con globos explicativos y etiquetas claras.
  * Panel 2 "EL HECHO": El acontecimiento decisivo o proceso central con fecha/reloj destacado, símbolos clave y personajes protagónicos.
  * Panel 3 "AHORA": Las consecuencias positivas, valores en acción (paz, unión, participación) y aplicación cotidiana.
- Pancarta inferior de lema o cierre reflexivo ("¡${tema} Libre y Soberana!").
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
${styleHeaderEnglish ? `${styleHeaderEnglish}, ` : ''}Educational Visual Thinking storyboard infographic about "${tema}", clean 3-panel sequential layout ("Before", "The Event", "Now"), expressive friendly characters, clear illustrated symbols, hand-lettered labels and speech boxes, ${englishStyle}, ${paletteEnglish}, white background, educational poster design --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isHandwritten) {
      return `${styleHeaderSpanish}Crea una lámina ilustrada que simule una auténtica página de libreta o cuaderno escolar de apuntes a mano (Handwritten study notes / Sketchnote) sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: página de libreta o cuaderno escolar con textura de papel cuadriculado o rayado de espiral.
- Título principal: rotulado caligráfico artístico con plumón grueso: "MIS APUNTES: ${tema.toUpperCase()}".
- Estructura de apuntes ilustrados: conceptos clave conectados con flechas dibujadas con bolígrafo, subtítulos enmarcados y palabras destacadas con resaltador pastel (amarillo / menta).
- Elementos gráficos: pequeños dibujos y bocetos didácticos explicativos, notas estilo post-it con chincheta y casillas de verificación dibujadas a mano ( ◯ ).
- Dirección de arte: estética auténtica de libreta de estudiante (studygram / sketchnotes), acogedora, clara, limpia y muy didáctica.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Authentic handwritten illustrated study notes page about "${tema}", beautiful student notebook page on ruled/grid paper, handwritten calligraphy lettering, sketchnote diagram layout with hand-drawn arrows, margin doodles and tiny explanatory sketches, soft pastel highlighter pen accents, cozy studygram aesthetic, educational visual notes --ar 4:3${negativePrompt} --v 6.0`.trim();
    }

    if (isComic) {
      const panelCharacters = is3D 
        ? 'Personajes modelados en 3D volumétrico digital (estilo animación Pixar/Disney) en cada escena con bocadillos de diálogo (speech bubbles) limpios sobre el render 3D'
        : isPixel
        ? 'Personajes en sprites pixelados de 16-bit con bocadillos de diálogo pixelados sobre fondo retro de videojuego'
        : 'Personajes infantiles ilustrados (un aprendiz curioso y un mentor o personaje sabio) con bocadillos de diálogo (speech bubbles) claros y legibles';

      const comicStyleEnglish = is3D
        ? '3D Pixar Disney style CGI characters in volumetric 3D panels, raytraced lighting, speech bubbles, 3D render'
        : isPixel
        ? '16-bit retro pixel art game comic strip, visible pixel grid, retro video game sprites'
        : 'wholesome pedagogical picture book style';

      return `${styleHeaderSpanish}Crea una ficha de cómic didáctico ${is3D ? 'en 3D render digital' : isPixel ? 'en pixel art' : 'ilustrado'} en una sola página sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Encabezado escolar superior: espacio para "Nombre del estudiante:", "Fecha:", "Grado / Grupo:" y "Calificación:".
- Marco decorativo alrededor de la página acorde al tema.
- Estructura en cuadrícula de 6 viñetas (2 filas x 3 columnas):
  * Viñetas 1 a 5: ${panelCharacters} explicando la historia y valores de "${tema}".
  * Viñeta 6 (Actividad del estudiante): Recuadro en blanco titulado "¿Qué aprendimos? ¡Es tu turno de brillar! Dibuja tu parte favorita del cuento" con un recuadro de dibujo y 2 líneas de escritura para reflexionar.
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney / Ideogram / DALL-E 3):
${styleHeaderEnglish ? `${styleHeaderEnglish}, ` : ''}Educational comic book worksheet page about "${tema}", student name header at the top, decorative border, 6-panel grid layout (2 rows by 3 columns), cute characters with speech bubbles explaining the topic, the last 6th panel is an empty drawing activity box with lines for writing, ${englishStyle}, ${paletteEnglish}, ${comicStyleEnglish}, high resolution, page layout --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isMarioKart) {
      return `${styleHeaderSpanish}Crea una lámina o tablero visual educativo estilo pista de carreras de Mario Kart sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: circuito de carreras aéreo con curvas, línea de salida y meta con estampado a cuadros blanco y negro.
- Elementos clave: karts de carreras coloridos, cajas sorpresa flotantes con el símbolo "?", monedas doradas coleccionables y cartel superior estilo torneo "GRAN PREMIO: ${tema.toUpperCase()}".
- Estaciones o curvas temáticas: 4 paradas numeradas a lo largo de la pista donde cada parada ilustra un concepto clave de "${tema}".
- Podio de ganadores al final con trofeo dorado de 1er lugar.
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Mario Kart inspired educational racing board game track about "${tema}", aerial view of winding racetrack with checkered finish line, glowing question mark item boxes, floating gold coins, cute colorful racing karts, 4 numbered track checkpoints illustrating key learning concepts, trophy victory podium, vibrant Nintendo game aesthetic, high resolution --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isMinecraft) {
      return `${styleHeaderSpanish}Crea una lámina educativa visual estilo mundo de bloques 3D / Minecraft sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: paisaje de bloques cúbicos (voxel art) con terreno de bloques de hierba, piedra y madera.
- Elementos clave: personajes tipo aventurero de bloques explorando, mesa de crafteo de 3x3 que muestra los ingredientes para aprender sobre "${tema}", barra superior de corazones de vida (10 corazones rojos) y herramientas de diamante/hierro.
- Zonas de exploración: diferentes biomas o recuadros de bloques que explican los puntos clave de "${tema}".
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Minecraft voxel 3D style educational infographic poster about "${tema}", blocky terrain with grass and stone cubes, pixelated heart health bar UI, 3x3 crafting table showing recipe components, blocky explorer characters learning, warm isometric sunlight, high quality Minecraft game aesthetic --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isRoblox) {
      return `${styleHeaderSpanish}Crea una lámina educativa visual estilo pista de obstáculos (Obby) de Roblox sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: circuito de plataformas flotantes geométricas de colores neón sobre un fondo de lava brillante o cielo virtual.
- Elementos clave: avatares de bloques simpáticos saltando de plataforma en plataforma, postes de Checkpoint dorados con estrellas, y cartel superior "OBBY DEL SABER: ${tema.toUpperCase()}".
- Recorridos: 4 o 5 plataformas numeradas (Stage 1 al 5) con carteles flotantes que sintetizan los conceptos de "${tema}".
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Roblox Obby obstacle parkour course educational poster about "${tema}", colorful neon floating platforms over glowing lava, golden star checkpoint flags, blocky avatar characters jumping, stage numbers from 1 to 5 with concept signs, vibrant playful game aesthetic --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isLego) {
      return `${styleHeaderSpanish}Crea una lámina educativa visual de construcción con bloques de plástico tipo Lego sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: maqueta o diorama construido íntegramente con ladrillos de construcción de plástico brillante con studs cilíndricos visibles.
- Elementos clave: minifiguras Lego como científicos/exploradores, modelo paso a paso que se va armando con piezas de colores para explicar "${tema}".
- Rótulos y carteles: piezas de Lego planas serigrafiadas con los términos principales.
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Authentic Lego brick toy educational infographic model of "${tema}", built entirely of glossy plastic toy bricks with visible studs, cute Lego minifigures holding tools and pointing to learning diagrams, bright primary colors, macro toy photography lighting, high resolution --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isPokemon) {
      return `${styleHeaderSpanish}Crea una lámina educativa visual de batalla RPG estilo Pokémon sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: pantalla de combate de gimnasio Pokémon con arena circular y perspectiva dinámica.
- Elementos clave: criatura o avatar del conocimiento en un lado y el "Reto de ${tema}" en el otro, barra de vida verde (HP 100/100), cuadro de diálogo inferior con menú de 4 comandos [Aprender, Responder, Pistas, Victoria].
- Cartel superior: ficha estilo Pokédex con los datos clave y habilidades conceptuales de "${tema}".
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Classic Pokemon turn-based RPG battle arena educational screen about "${tema}", monster battle field, HP health bars with levels and topic names, bottom battle menu with 4 action commands, anime monster learning style, nostalgic retro game art, high quality --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    if (isArcade) {
      return `${styleHeaderSpanish}Crea una pantalla de videojuego arcade retro de los 80s/90s sobre "${tema}" para estudiantes de ${grado || 'primaria'}:
- Formato: pantalla de máquina recreativa (coin-op arcade) con marco de monitor CRT y luces de neón en la marquesina superior.
- Elementos clave: tipografía pixel art luminosa con "SCORE", "HI-SCORE" y "STAGE 1: ${tema.toUpperCase()}", vidas con íconos de corazón o '1UP', y sprites pixelados de 16-bit explicando los conceptos centrales.
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
Retro arcade coin-op game screen about "${tema}", 16-bit pixel art graphics, glowing neon marquee, pixelated HUD with SCORE and HI-SCORE, 1UP lives, CRT monitor frame with scanlines, colorful nostalgic 80s video game poster --ar 16:9${negativePrompt} --v 6.0`.trim();
    }

    // General visual prompt for other types (infografía, cartel, ilustración)
    return `${styleHeaderSpanish}Crea una ilustración visual educativa de alta calidad sobre "${tema}" (${tipo || 'recurso visual'}), diseñada para ${grado || 'estudiantes'}:
- Formato y orientación: ${orientation === 'horizontal' ? 'HORIZONTAL / APAISADO (Landscape)' : 'VERTICAL (Portrait)'} (proporción ${aspectRatio}).
- Dirección de arte: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
- Composición: jerarquía visual clara, elementos centrales destacados, libre de sobrecarga, con espacios bien distribuidos y rotulación gráfica legible.
- Propósito: material didáctico ilustrado para fijación visual de conceptos sin textos densos ni planes de clase.
${adicional ? `- Detalles adicionales: ${adicional}` : ''}

🇬🇧 PROMPT EN INGLÉS (Optimizado para Midjourney v6 / Ideogram / DALL-E 3):
${styleHeaderEnglish ? `${styleHeaderEnglish}, ` : ''}Educational visual illustration of "${tema}", ${tipo || 'learning visual'}, ${orientation === 'horizontal' ? 'horizontal panoramic landscape orientation' : 'vertical portrait orientation'}, ${englishStyle}, ${paletteEnglish}, minimalist and organized composition, high resolution graphic design for students, isolated elements, inspiring educational art --ar ${aspectRatio}${negativePrompt} --v 6.0`.trim();
  }

  // Interactivity / Functionality block
  let functionalityBlock = '';

  // Specialized instructions by resource type
  let typeSpecificDirective = '';

  if (tipoLower.includes('mapa mental')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL ESTRICTA PARA MAPA MENTAL:
Debes diseñar un MAPA MENTAL AUTÉNTICO Y ESTRUCTURADO:
- Estructura radial jerárquica con un concepto o nodo central nuclear ("${tema}").
- Mínimo 4 ramas principales conectadas radialmente al centro con colores y categorías diferenciadas.
- Sub-ramas secundarias que desprendan definiciones, conceptos clave y ejemplos de cada rama principal.
- Conectores visuales y palabras de enlace entre nodos.

SI EL RECURSO ES INTERACTIVO O HÍBRIDO:
❌ NO entregues un cuestionario de preguntas múltiples tipo test.
✅ CONSTRUYE UNA INTERFAZ DE MAPA MENTAL INTERACTIVO COMPLETA en código HTML, SVG y JavaScript autocontenido:
1. Representación visual del mapa mental con nodo central y nodos ramificados conectados con trazados SVG o conectores CSS.
2. Nodos interactivos clicables: al hacer clic en cualquier rama o concepto, se despliega una ficha con la explicación, datos clave o multimedia.
3. Desafío interactivo integrado en el mapa (ejemplo: "Ubica los conceptos en la rama correcta" o "Completa las conexiones"), con comprobación instantánea al hacer clic o arrastrar.
4. Marcador de puntos en tiempo real por conceptos correctamente explorados o conectados.
5. Botones de control: "Expandir todas las ramas", "Colapsar ramas", y botón visible de "Reiniciar mapa" para volver al estado inicial.`;
  } else if (tipoLower.includes('tarjetas') || tipoLower.includes('flashcard')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA TARJETAS / FLASHCARDS:
Diseña una baraja de tarjetas de estudio con preguntas detonadoras en el anverso y explicaciones claras en el reverso.
SI ES IMPRIMIBLE: Diseña la plantilla recortable completa con anverso y reverso alineados para recortar y doblar (mínimo 8 a 10 tarjetas completamente redactadas, sin dejar ninguna vacía).
SI ES INTERACTIVO: Construye tarjetas interactivas 3D con efecto de giro (flip) al hacer clic, botones "Siguiente" y "Anterior", contador de tarjetas aprendidas vs. por repasar, y botón de reinicio de la baraja.`;
  } else if (tipoLower.includes('rúbrica') || tipoLower.includes('rubrica')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL OBLIGATORIA PARA RÚBRICA DE EVALUACIÓN:
DEBES ENTREGAR LA MATRIZ COMPLETA DE EVALUACIÓN FORMATEADA EN TABLA, LISTA PARA USAR:
1. Encabezado institucional: Nombre del estudiante, Grado/Grupo, Fecha, Proyecto o Evidencia a evaluar.
2. Tabla completa con mínimo 4 a 5 criterios pedagógicos observables (filas) y 4 niveles de logro (columnas):
   - Nivel 4 (Destacado / Experto - 100%)
   - Nivel 3 (Logrado / Competente - 80%)
   - Nivel 2 (En proceso / Básico - 60%)
   - Nivel 1 (Inicial / Requiere apoyo - 40%)
3. PROHIBIDO dejar celdas vacías o poner 'ídem': redacta el descriptor específico de cada nivel celda por celda.
4. Columna de ponderación porcentual y puntaje obtenido.
5. Espacio final para retroalimentación formativa cualitativa y firma del evaluador.
SI ES INTERACTIVO: Construye una rúbrica interactiva con celdas seleccionables por clic, cálculo automático de la puntuación total acumulada en vivo, retroalimentación cualitativa según el nivel alcanzado y botón de reiniciar evaluación.`;
  } else if (tipoLower.includes('lista') || tipoLower.includes('checklist')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL OBLIGATORIA PARA LISTA DE VERIFICACIÓN (CHECKLIST):
DEBES ENTREGAR LA LISTA DE VERIFICACIÓN COMPLETA, MAQUETADA Y LISTA PARA IMPRIMIR Y USAR:
1. Encabezado escolar completo:
   - Título destacado: "LISTA DE VERIFICACIÓN: ${tema.toUpperCase()}"
   - Datos del estudiante: Nombre: ___________________________________________  Fecha: ____________
   - Grado / Sección: ____________________  Puntaje / Nivel alcanzado: __________
2. Instrucciones directas al estudiante: cómo autoevaluarse y qué marcar en cada columna.
3. TABLA ESTRUCTURADA DE VERIFICACIÓN con casillas [ ] y entre 10 y 14 criterios específicos observables, divididos en 3 momentos pedagógicos:
   - FASE 1: Preparación y Contenido Inicial (Criterios 1 al 4) [ ] Sí | [ ] En proceso | [ ] Por mejorar
   - FASE 2: Desarrollo, Calidad y Profundidad (Criterios 5 al 9) [ ] Sí | [ ] En proceso | [ ] Por mejorar
   - FASE 3: Presentación, Cuidado y Entrega (Criterios 10 al 13) [ ] Sí | [ ] En proceso | [ ] Por mejorar
4. REDACCIÓN EN PRIMERA PERSONA ("He identificado...", "Verifiqué que...", "Mis explicaciones son claras...").
5. PROHIBIDO poner "... continúa con más criterios". ESCRIBE TODOS LOS CRITERIOS COMPLETOS UNO POR UNO.
6. Sección de Autoevaluación y Reflexión:
   - ¿Qué aspecto de mi trabajo considero más logrado?: _____________________________________
   - ¿En qué punto necesito apoyo o puedo mejorar?: ________________________________________
7. Registro de firmas: Firma del estudiante y Firma / Observaciones del docente.
SI ES INTERACTIVO: Casillas de verificación interactivas funcionales con clic, barra de progreso porcentual dinámica en tiempo real y mensaje motivador al completar el 100%.`;
  } else if (tipoLower.includes('hoja de trabajo') || tipoLower.includes('actividad educativa') || tipoLower.includes('ficha didáctica')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA HOJA DE TRABAJO DIDÁCTICA:
DEBES ENTREGAR LA HOJA DE TRABAJO ÍNTEGRA Y LISTA PARA FOTOCOPIAR:
1. Encabezado escolar completo (Nombre, Fecha, Grado/Grupo, Calificación).
2. Breve texto disparador o contexto temático motivador (1-2 párrafos).
3. Batería de 4 a 6 actividades prácticas secuenciadas:
   - Actividad 1: Reconocimiento y conceptos clave (opción múltiple o completar espacios).
   - Actividad 2: Aplicación práctica y resolución con líneas rayadas para responder a mano.
   - Actividad 3: Análisis visual o gráfico (esquema, tabla o recuadro para dibujo/diagrama).
   - Actividad 4: Pregunta de reflexión personal o pensamiento crítico.
4. CERO resúmenes o placeholders: escribe todas las preguntas y opciones redactadas al 100%.
5. Clave de soluciones comentada para el docente en sección separada al final.`;
  } else if (tipoLower.includes('emparejamiento') || tipoLower.includes('match') || tipoLower.includes('unir')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA JUEGO DE EMPAREJAMIENTO (MATCH):
Construye un juego interactivo de emparejar dos columnas (Conceptos en Columna A vs. Manifestaciones/Definiciones en Columna B):
1. Mecánica de selección: El estudiante hace clic en un concepto de la Columna A y luego en su pareja correspondiente en la Columna B.
2. Validación en tiempo real:
   - Si coinciden: animación de acierto, conexión visual con color verde y bloqueo de ambas tarjetas como resueltas (+10 pts).
   - Si no coinciden: retroalimentación amable con pista explicativa y deselección automática para volver a intentar.
3. Marcador dinámico: Contador de "Parejas encontradas: X / Total" e intentos.
4. Botón de reinicio: Botón visible de "Barajar / Reiniciar juego" que desordene los elementos aleatoriamente para una nueva partida.`;
  } else if (tipoLower.includes('memoria') || tipoLower.includes('memory') || tipoLower.includes('memorama')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA JUEGO DE MEMORIA (MEMORY CARDS):
Construye un memorama interactivo en cuadrícula (grid de tarjetas con reverso ilustrado):
1. Cuadrícula de cartas con efecto de volteo 3D (flip card) al hacer clic.
2. Mecánica de parejas: Permite voltear 2 cartas por turno. Si coinciden concepto y su aporte/definición, quedan descubiertas con borde dorado y suman puntos. Si no coinciden, se voltean boca abajo tras 1 segundo.
3. Marcador dinámico: Contador de "Parejas descubiertas", "Movimientos realizados" y mensaje de felicitación al completar el tablero.
4. Botón de reinicio: Botón visible de "Nueva partida / Barajar cartas" que mezcle las posiciones aleatoriamente.`;
  } else if (tipoLower.includes('escape') || tipoLower.includes('candado')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA ESCAPE ROOM EDUCATIVO:
Construye un Escape Room digital inmersivo por salas o desafíos sucesivos:
1. Mínimo 3 salas o enigmas temáticos encadenados sobre "${tema}".
2. Candados interactivos: Cada sala plantea un problema aplicado y un campo para introducir el código numérico o palabra clave secreta.
3. Validación de candados: Animación visual de candado abriéndose al ingresar el código correcto, sonido/efecto de logro y desbloqueo inmediato de la siguiente sala.
4. Sistema de pistas: Botón de "Pista del mentor" con andamiaje progresivo sin dar la solución directa.
5. Pantalla de victoria final con diploma o medalla desbloqueada y resumen pedagógico.`;
  } else if (tipoLower.includes('infografía') || tipoLower.includes('infografia') || selectedCodes.includes('/infographic')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA INFOGRAFÍA EDUCATIVA:
Diseña una infografía con jerarquía visual de alto impacto pedagógico sobre "${tema}":
- Título magnético, subtítulo de contexto y línea editorial clara.
- 4 a 5 bloques de contenido ordenados con datos numéricos, métricas destacadas y síntesis visual.
- Diagrama o conector central que explique la relación causa-efecto o el proceso paso a paso.
- Sección de "¿Sabías que...?" o dato curioso formativo para enganchar al estudiante.
- Conclusión accionable y fuentes o referencias recomendadas.
SI ES INTERACTIVA: Bloques con zoom o expansión al pasar el cursor o hacer clic, gráficos dinámicos interactivos, selector de capas de información y mini comprobador de retención con retroalimentación en vivo.`;
  } else if (tipoLower.includes('folleto') || tipoLower.includes('tríptico') || tipoLower.includes('triptico') || tipoLower.includes('booklet') || selectedCodes.includes('/booklet')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA FOLLETO PLEGABLE / TRÍPTICO (BOOKLET):
Diseña la maqueta completa de un folleto tríptico pedagógico (3 paneles / 6 caras de lectura):
- Cara 1 (Portada exterior): Título atractivo, lema motivador, objetivo de la guía y membrete escolar.
- Caras 2, 3 y 4 (Paneles interiores centrales): Desglose temático en pasos prácticos, infografía compacta, decálogo de buenas prácticas y ejemplos cotidianos.
- Cara 5 (Panel interior de acción): Reto o autoevaluación rápida con casillas de verificación.
- Cara 6 (Contraportada exterior): Recursos clave para profundizar, contactos de ayuda y notas finales.
SI ES INTERACTIVO: Maqueta con pestañas navegables por cada panel ("Portada", "Paneles Interiores 1, 2, 3", "Autoevaluación"), simulación visual de folleto plegable y casillas marcables interactivas.`;
  } else if (tipoLower.includes('ruleta') || tipoLower.includes('rueda') || tipoLower.includes('wheel') || selectedCodes.includes('/wheel')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA RULETA DE DESAFÍOS (/wheel):
Construye una auténtica RULETA GIRATORIA INTERACTIVA (Spinning Wheel) en código web autocontenido (HTML+CSS+JS):
1. RUEDA CIRCULAR: Gráfico circular dividido en 8 sectores de colores vibrantes con temas/desafíos específicos de "${tema}".
2. BOTÓN DE GIRO: Botón "¡GIRAR RULETA!" con animación CSS de rotación suave con desaceleración y aguja indicadora fija en la parte superior.
3. DESAFÍO EN MODAL: Al detenerse la ruleta, muestra una tarjeta o ventana emergente con el reto/pregunta detonadora del sector seleccionado.
4. VALIDACIÓN Y PUNTOS: Opciones de respuesta con comprobación en tiempo real, suma de puntos y botón para volver a girar.
${selectedCodes.includes('/space') || selectedCodes.includes('/cartoon') ? '5. AMBIENTACIÓN ESPACIAL CARTOON: Fondo cósmico azul noche, estrellas ilustradas, planetas y estética de caricatura espacial.' : ''}`;
  } else if (tipoLower.includes('comic') || tipoLower.includes('cómic') || tipoLower.includes('historieta') || selectedCodes.includes('/comicdidactico')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA CÓMIC DIDÁCTICO / HISTORIETA EDUCATIVA (/comicdidactico):
Diseña una historieta pedagógica estructurada en 4 a 6 viñetas secuenciales sobre "${tema}":
1. PERSONAJES GUÍA: Define 2 personajes contrastados (ej. un aprendiz curioso y un mentor o guía que cuestiona y reflexiona).
2. ESTRUCTURA NARRATIVA:
   - Viñeta 1: Planteamiento de la situación cotidiana o enigma.
   - Viñetas 2-3: Desarrollo del conflicto o dilema conceptual.
   - Viñeta 4-5: Descubrimiento del principio clave con explicación visual clara.
   - Viñeta Final: Conclusión, moraleja formativa y aplicación práctica.
3. ELEMENTOS GRÁFICOS: Bocadillos de diálogo (speech bubbles), cartelas de narrador, onomatopeyas y descripciones visuales detalladas de cada escena.
SI ES INTERACTIVO: Visor de cómic viñeta a viñeta con botones "Siguiente" y "Anterior", efectos de sonido/onomatopeya interactivos y un reto de comprensión final de 2 preguntas.`;
  } else if (tipoLower.includes('diagrama') || selectedCodes.includes('/diagrama')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA DIAGRAMA PEDAGÓGICO (/diagrama):
Diseña un esquema visual estructurado de flujo, procesos y relaciones sobre "${tema}":
1. BLOQUES LÓGICOS: Cajas de conceptos, nodos de decisión (rombos Sí/No), entradas y salidas claramente diferenciadas.
2. CONECTORES DIRECCIONALES: Flechas con etiquetas explicativas que muestren la secuencia causa-efecto.
3. CÓDIGO DE COLORES: Paleta diferenciada por fases (ej. Verde: inicio, Azul: análisis, Ámbar: decisión, Morado: resultado).
SI ES INTERACTIVO: Nodos clicables que se iluminan al pasar el cursor (hover), visualizador de caminos que resalta la ruta paso a paso y comprobador interactivo de secuencias.`;
  } else if (tipoLower.includes('tiempo') || tipoLower.includes('timeline') || selectedCodes.includes('/timeline')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA LÍNEA DEL TIEMPO CRONOLÓGICA (/timeline):
Diseña una cronología visual ordenada, clara y atractiva sobre "${tema}":
1. LÍNEA CONECTORA: Eje temporal secuencial (horizontal o vertical) con flechas de avance y estaciones numeradas.
2. HITOS HISTÓRICOS / CLAVE: Mínimo 5 a 6 momentos decisivos con:
   - Año / Fecha destacada en caja de alto contraste.
   - Título del acontecimiento o fase.
   - Breve síntesis narrativa (2 líneas directas) explicando qué ocurrió y por qué fue trascendental.
   - Ícono o ilustración sugerida representativa del hito.
3. SECCIÓN DE CONCLUSIÓN: Resumen de "Impacto y legado" que conecta el pasado con el presente.
SI ES INTERACTIVO: Eje cronológico navegable con barra de tiempo, tarjetas desplegables al hacer clic en cada fecha y un minirreto de "Ordenar los eventos en orden cronológico" con validación instantánea.`;
  } else if (tipoLower.includes('compare') || tipoLower.includes('comparativ') || selectedCodes.includes('/compare')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA TABLA COMPARATIVA A vs B (/compare):
Diseña un esquema visual comparativo de alto contraste sobre "${tema}":
1. ENCABEZADO DUAL: Dos columnas claramente diferenciadas por color (ej. Azul para Concepto A, Rosa/Rojo para Concepto B).
2. FILAS DE CONTRASTE: Mínimo 4 criterios paralelos de comparación:
   - Definición esencial / Rasgo distintivo.
   - Estructura y composición.
   - Función o comportamiento.
   - Ejemplos cotidianos ilustrados con pequeños íconos representativos.
3. RECUADRO DE "DIFERENCIA CLAVE 🔑": Caja destacada en la parte inferior con fondo contrastante que sintetiza en una sola frase contundente la distinción fundamental para que el alumno nunca los confunda.
SI ES INTERACTIVO: Selector de tarjetas para clasificar elementos en la columna A o columna B con feedback inmediato y contador de aciertos.`;
  } else if (tipoLower.includes('analogy') || tipoLower.includes('analogía') || tipoLower.includes('analogia') || selectedCodes.includes('/analogy')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA ANALOGÍA PEDAGÓGICA VISUAL (/analogy):
Explica "${tema}" a través de una analogía memorable y cercana a la vida real:
1. TÍTULO METAFÓRICO: Presentación directa de la equivalencia (ej. "La célula vegetal es como una fábrica", "La constitución es como el reglamento de un juego").
2. MAPA DE EQUIVALENCIAS: Desglosa mínimo 5 elementos del concepto abstracto vinculándolos con su par en la vida real:
   - Elemento científico/técnico ➔ Su equivalente cotidiano ➔ La función que comparten.
3. DIBUJO O ESQUEMA INTEGRADO: Descripción de la escena ilustrada con etiquetas señalizadoras.
4. FRASE DE ANCLAJE: Conclusión motivadora que sintetiza la analogía para fijarla en la memoria a largo plazo.
SI ES INTERACTIVO: Ilustración interactiva donde el alumno hace clic en los elementos de la fábrica/sistema cotidiano para revelar el concepto científico correspondiente.`;
  } else if (tipoLower.includes('simple') || selectedCodes.includes('/simple')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA EXPLICACIÓN SIMPLE / ACCESIBLE (/simple):
Diseña una ficha que transforme la complejidad de "${tema}" en claridad cristalina:
1. CONTRASTE DE VERSIONES:
   - Caja Izquierda "VERSIÓN COMPLEJA": Texto formal con terminología densa (como en manuales o enciclopedias) con etiqueta "Demasiada información".
   - Caja Derecha "VERSIÓN SIMPLE": Explicación con lenguaje cercano, analogía visual amable y pasos lógicos fáciles de asimilar.
2. ESQUEMA GRÁFICO CENTRAL: Diagrama visual ilustrado con flechas sencillas (ej. la planta tomando sol, agua y aire para liberar oxígeno).
3. RESUMEN EN UNA FRASE: Conclusión directa que cualquier estudiante de este nivel pueda recordar y repetir con sus propias palabras.`;
  } else if (tipoLower.includes('explain') || selectedCodes.includes('/explain')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA EXPLICACIÓN PASO A PASO (/explain):
Estructura la lección sobre "${tema}" en 5 bloques secuenciales y didácticos:
1. ¿Qué es?: Definición concisa y amigable en máximo 2 renglones con apoyo visual.
2. Tipos o Clasificación: Desglose en etiquetas de colores con sus nombres y ejemplos.
3. Representación Gráfica: Esquema visual o dibujo rotulado que represente el concepto.
4. Ejemplos en la Vida Real: 2 o 3 situaciones cotidianas donde el estudiante experimenta este tema.
5. ¡Práctica Guiada!: Actividad breve de 2 ejercicios prácticos para comprobar la comprensión de inmediato.`;
  } else if (tipoLower.includes('review') || tipoLower.includes('repaso') || selectedCodes.includes('/review')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA FICHA DE REPASO ACTIVO (/review):
Diseña una ficha de consolidación sobre "${tema}" estructurada en 4 ejercicios complementarios y variados:
1. Ejercicio 1 (Identificación): Escribe el término o concepto que representa la imagen o descripción.
2. Ejercicio 2 (Comparación y Relación): Compara elementos usando símbolos (<, >, =) o emparejamiento.
3. Ejercicio 3 (Visual / Creativo): Colorea, dibuja o completa el esquema gráfico indicado.
4. Ejercicio 4 (Aplicación / Resolución): Resuelve una operación, enigma o problema aplicado.
- Encabezado escolar completo y mensaje motivador de cierre: "¡Tú puedes! Pequeños repasos, grandes logros".
SI ES INTERACTIVO: Panel interactivo con los 4 desafíos para resolver en pantalla con validación paso a paso.`;
  } else if (tipoLower.includes('summary') || tipoLower.includes('resumen') || selectedCodes.includes('/summary')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA RESUMEN ESTRUCTURADO (/summary):
Sintetiza la información esencial de "${tema}" en 3 columnas o bloques visuales ordenados:
1. CAUSAS / ANTECEDENTES: Puntos clave que originaron el fenómeno o situación.
2. HECHOS PRINCIPALES: Hitos y acontecimientos centrales ordenados por viñetas o cronología con años destacados.
3. CONSECUENCIAS / EFECTOS: Impacto social, científico o humano resultante.
4. CÁPSULA DE SÍNTESIS: Franja inferior con un lema "Un antes y un después" y las palabras clave rectoras.`;
  } else if (tipoLower.includes('design') || tipoLower.includes('visual thinking') || selectedCodes.includes('/design')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA CARTEL DE VISUAL THINKING (/design):
Diseña un cartel mural en cuadrícula organizada sobre "${tema}":
1. TÍTULO EN PANCARTA / BANNER: Título central visual y llamativo con subtítulo motivador.
2. CUADRÍCULA NUMERADA DE REGLAS / PASOS: 6 a 8 recuadros independientes, cada uno con:
   - Número destacado en círculo de color.
   - Frase corta y directa en positivo (máximo 1 línea).
   - Pequeño ícono o dibujo visual explicativo.
   - Frase explicativa de apoyo en 1 renglón.
3. ESTILO VISUAL THINKING: Trazos limpios, íconos sencillos tipo doodle o flat design y alto impacto visual para el aula.`;
  } else if (tipoLower.includes('create') || tipoLower.includes('multinivel') || selectedCodes.includes('/create')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA COMPRENSIÓN MULTINIVEL (/create):
Diseña una actividad de lectura y análisis sobre "${tema}" graduada en 3 niveles de complejidad:
1. TEXTO BASE O CASO DE ESTUDIO: Lectura clara, interesante y adecuada a la edad (3 a 4 párrafos).
2. TABLA DE PREGUNTAS GRADUADAS:
   - Preguntas 1 y 2 (NIVEL BÁSICO / LITERAL): Recuperación directa de datos e idea principal del texto.
   - Preguntas 3 y 4 (NIVEL INTERMEDIO / INFERENCIAL): Deducción de causas, intenciones y relaciones no explícitas.
   - Pregunta 5 (NIVEL AVANZADO / CRÍTICO): Opinión fundamentada, juicio de valor y propuesta personal del estudiante.`;
  } else if (tipoLower.includes('presentación') || tipoLower.includes('presentacion') || tipoLower.includes('diapositiva') || tipoLower.includes('slide')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA PRESENTACIÓN / DIAPOSITIVAS:
DEBES DISEÑAR EL GUION Y ESTRUCTURA COMPLETA DE UNA PRESENTACIÓN DE ALTO IMPACTO (MÍNIMO 7 A 10 DIAPOSITIVAS):
Para CADA diapositiva debes detallar de forma completa:
- [DIAPOSITIVA N° Y TÍTULO DE LA DIAPOSITIVA]
- Contenido visual y textual en pantalla (titular, máximo 3 a 4 puntos clave directos y sintetizados, y descripción de la imagen o diagrama que la acompaña).
- NOTAS DEL ORADOR / GUION DIDÁCTICO PARA EL DOCENTE: Qué debe decir y explicar el profesor en voz alta durante esa diapositiva.
- PREGUNTA O ACTIVIDAD DE ENGANCHE: Pregunta rápida de participación para los estudiantes.

ESTRUCTURA DIDÁCTICA DE LA PRESENTACIÓN:
• Diapositiva 1: Portada impactante con título provocador y objetivo de la clase.
• Diapositiva 2: Gancho / Pregunta detonadora ("¿Alguna vez te has preguntado...?").
• Diapositivas 3 a 6: Desarrollo conceptual paso a paso con metáforas, datos asombrosos y comparaciones claras.
• Diapositiva 7: Caso práctico o aplicación en la vida real.
• Diapositiva 8: Reto o ejercicio relámpago en parejas / grupo.
• Diapositiva 9: Resumen de ideas clave ("¿Qué nos llevamos hoy?").
• Diapositiva 10: Ticket de salida / Pregunta de cierre reflexivo.

SI ES INTERACTIVO: Construye un visor web de diapositivas interactivo completo (Slide Deck) con botones "Anterior" y "Siguiente", contador de diapositivas (ej. 3/10), barra de progreso, tarjetas de contenido elegantes y atajos de teclado (flechas izquierda/derecha).
SI ES IMPRIMIBLE: Diseña la guía de diapositivas maquetada en fichas cuadradas listas para fotocopiar como folleto de apuntes para los estudiantes.`;
  } else if (tipoLower.includes('quiz') || tipoLower.includes('cuestionario')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA CUESTIONARIO EVALUATIVO / QUIZ (/quiz):
DEBES ENTREGAR EL CUESTIONARIO COMPLETO Y LISTO PARA APLICAR (MÍNIMO 6 A 8 PREGUNTAS):
1. Encabezado escolar completo listo para rellenar (Nombre, Fecha, Grado, Puntaje obtenido).
2. Variedad de reactivos de pensamiento y comprensión:
   - Preguntas 1 a 4: Opción múltiple con 4 alternativas (A, B, C, D), donde solo una es correcta y los distractores tienen valor pedagógico.
   - Preguntas 5 y 6: Verdadero o Falso con renglón para justificar la respuesta.
   - Preguntas 7 y 8: Pregunta abierta de aplicación a la vida cotidiana o reflexión crítica.
3. Clave de respuestas comentada para el docente con justificación explicativa de cada respuesta.
SI ES INTERACTIVO: Quiz interactivo web con botones de opción marcables, validación inmediata al hacer clic, puntuación en vivo (ej. "Aciertos: 5/8"), retroalimentación formativa en verde/rojo y botón de reiniciar quiz.`;
  } else if (tipoLower.includes('juego educativo') || tipoLower.includes('gamificad')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA JUEGO EDUCATIVO GAMIFICADO:
Construye una experiencia de aprendizaje lúdica completa con mecánicas de juego:
1. NARRATIVA Y MISIÓN: Contexto de aventura motivadora ("Misión de rescate", "Expedición científica").
2. NIVELES PROGRESIVOS: 3 etapas de dificultad creciente (Nivel Novato ➔ Nivel Explorador ➔ Nivel Maestro).
3. SISTEMA DE RECOMPENSAS: Puntos por desafío superado, desbloqueo de insignias o avatares.
4. PANTALLA O CEREMONIA DE VICTORIA: Mensaje de felicitación con resumen de los conocimientos dominados.
SI ES INTERACTIVO: Juego web jugable completo con vidas, marcador de puntos dinámico, temporizador opcional, validación en tiempo real y botón de reinicio.`;
  } else if (tipoLower.includes('stickersheet') || tipoLower.includes('plancha de stickers') || tipoLower.includes('pegatina')) {
    typeSpecificDirective = `
🎯 DIRECTRIZ ESTRUCTURAL PARA PLANCHA DE STICKERS (/stickersheet):
Diseña una plantilla de 8 a 12 stickers didácticos individuales para recortar y pegar:
- Cada sticker debe tener un borde delimitado de recorte (die-cut outline).
- Mensaje motivador corto o concepto clave (ej: "¡Gran observador!", "Hito 1821", "Mente científica").
- Ícono o ilustración sugerida representativa.
- Propósito pedagógico: evaluación formativa, refuerzo positivo en cuadernos o medalla de tarea cumplida.`;
  }

  // Visual style directives based on selected codes
  const visualStyleCodes = selectedCodes.filter(c => 
    ['/watercolor', '/doodle', '/handwritten', '/claymorphism', '/chalkboard', '/flatdesign', '/papercraft', '/pixelart', '/pastel', '/neon', '/lineart', '/kraftpaper', '/corkboard', '/cartoon', '/3d', '/visualthinking', '/retro', '/space', '/ocean', '/highcontrast', '/minimal', '/outline', '/mariokart', '/minecraft', '/roblox', '/lego', '/pokemon', '/arcade'].includes(c)
  );
  let visualStyleDirective = '';
  if (visualStyleCodes.length > 0 || isHandwritten || isMarioKart || isMinecraft || isRoblox || isLego || isPokemon || isArcade) {
    visualStyleDirective = `\n\n🎨 IDENTIDAD Y ESTILO VISUAL OBLIGATORIO:
Aplica rigurosamente la dirección de arte de los códigos visuales seleccionados (${visualStyleCodes.length > 0 ? visualStyleCodes.join(', ') : 'temática de juego'}):
- Estilo y técnica gráfica: ${spanishStyle}.
- Paleta cromática: ${paletteSpanish}.
- Acabado y presentación: ${finishSpanish}.`;

    if (selectedCodes.includes('/mariokart') || isMarioKart) {
      visualStyleDirective += `\n🏎️ MECÁNICAS Y AMBIENTACIÓN DE MARIO KART:
- NARRATIVA DE CARRERA: El recurso es un Gran Premio de velocidad y conocimiento sobre "${cleanTema}".
- SI ES INTERACTIVO: Construye una carrera de 3 vueltas (Laps) en HTML/CSS/JS. Cada acierto otorga un "Champiñón Turbo 🍄" (+30 km/h y animación de avance veloz); cada error hace resbalar al kart con una "Cáscara de Banana 🍌" con pista pedagógica para corregir. Incluye velocímetro, monedas doradas recolectadas y podio final de victoria con copa dorada.
- SI ES IMPRIMIBLE: Diseña la hoja con un circuito de pista con 3 sectores (Curva 1, Curva 2, Recta Final), casillas con cajas misteriosas [ ? ] para las preguntas y podio con casillas de autoevaluación (1er, 2do y 3er puesto).`;
    }

    if (selectedCodes.includes('/minecraft') || isMinecraft) {
      visualStyleDirective += `\n⛏️ MECÁNICAS Y AMBIENTACIÓN DE MINECRAFT (VOXEL):
- NARRATIVA DE SUPERVIVENCIA Y CRAFTEO: La misión es recolectar recursos para craftear el "Trofeo de Diamante del Conocimiento" sobre "${cleanTema}".
- SI ES INTERACTIVO: Barra de vida con 5 corazones (❤️❤️❤️❤️❤️) que parpadean ante errores y se regeneran con aciertos; cuadrícula de crafteo 3x3 donde cada respuesta correcta coloca un recurso (hierro, oro, redstone, diamante) hasta completar la herramienta; botón de reinicio "Reaparecer / Respawn".
- SI ES IMPRIMIBLE: Estructura de cuadrícula de inventario con marcos de bloques, corazones de vida dibujados para colorear por cada acierto y receta de crafteo para completar.`;
    }

    if (selectedCodes.includes('/roblox') || isRoblox) {
      visualStyleDirective += `\n🧱 MECÁNICAS Y AMBIENTACIÓN DE ROBLOX (OBBY PARKOUR):
- NARRATIVA DE OBBY: Superar un circuito de plataformas flotantes y saltos sobre lava hasta la cima del conocimiento de "${cleanTema}".
- SI ES INTERACTIVO: 5 etapas (Stages) progresivas con plataformas de colores neón, botón de Checkpoint que guarda el progreso, contador de "Caídas al vacío" y corona dorada al superar el último salto.
- SI ES IMPRIMIBLE: Mapa de etapas numeradas (Stage 1 a Stage 5), sellos de checkpoint para estampar o marcar, y tabla de puntuación con gemas de victoria.`;
    }

    if (selectedCodes.includes('/lego') || isLego) {
      visualStyleDirective += `\n🧩 MECÁNICAS Y AMBIENTACIÓN DE LEGO (CONSTRUCCIÓN CON BLOQUES):
- NARRATIVA DE MONTAJE: Construir una estructura o invento pieza a pieza respondiendo preguntas de "${cleanTema}".
- SI ES INTERACTIVO: Modelo visual que va ensamblando ladrillos plásticos de colores con cada respuesta correcta, con contador de piezas colocadas (ej. "8/8 bloques colocados") y botón de desmontar/reiniciar.
- SI ES IMPRIMIBLE: Manual de instrucciones de construcción ilustrado por pasos (Paso 1: Coloca la base, Paso 2: Ensambla las columnas...), con casillas en forma de bloques para colorear.`;
    }

    if (selectedCodes.includes('/pokemon') || isPokemon) {
      visualStyleDirective += `\n⚡ MECÁNICAS Y AMBIENTACIÓN DE POKÉMON (BATALLA RPG):
- NARRATIVA DE DUELO DE GIMNASIO: Derrotar al "Jefe de la Confusión" o capturar a la criatura legendaria de "${cleanTema}".
- SI ES INTERACTIVO: Barra de vida del rival (HP 100) que se reduce con cada respuesta correcta ("¡Ataque súper efectivo!"); menú de 4 ataques donde cada ataque es una opción de respuesta; medalla de gimnasio desbloqueable al ganar.
- SI ES IMPRIMIBLE: Ficha de Entrenador del estudiante con nivel y medallas, menú de combate con 4 ataques por pregunta, y tarjeta Pokédex para completar con el resumen del tema.`;
    }

    if (selectedCodes.includes('/arcade') || isArcade) {
      visualStyleDirective += `\n🕹️ MECÁNICAS Y AMBIENTACIÓN DE ARCADE RETRO (8-BIT):
- NARRATIVA DE MÁQUINA RECREATIVA: Superar la pantalla "Stage 1" y alcanzar el récord "HIGH SCORE" en "${cleanTema}".
- SI ES INTERACTIVO: Estética retro con tipografía de píxel, vidas "1UP", sonidos estilo chiptune sugeridos, marcador de SCORE dinámico y pantalla de "GAME OVER / CONTINUE? 9..8..7..".
- SI ES IMPRIMIBLE: Maqueta de pantalla de videojuego con marco arcade, tabla de récord para inscribir el nombre de 3 iniciales y casillas pixeladas.`;
    }

    if (isMarioKart || isMinecraft || isRoblox || isLego || isPokemon || isArcade) {
      visualStyleDirective += `\n\n🚨 REGLA DE ORO DE CONTENIDO CURRICULAR (ESTRICTO Y OBLIGATORIO):
LAS PREGUNTAS Y ACTIVIDADES DEBEN EVALUAR EXCLUSIVAMENTE EL CONTENIDO ACADÉMICO REAL: "${cleanTema}" (${grado || 'escolar'}).
❌ PROHIBIDO FORMULAR PREGUNTAS SOBRE EL VIDEOJUEGO O AMBIENTACIÓN: CERO preguntas sobre Minecraft, Mario Kart, Roblox, Lego o Pokémon (NO preguntes por personajes como Steve o Mario, ni por mobs, recetas de crafteo, objetos o reglas del videojuego). El alumno NO está siendo evaluado sobre videojuegos.
✅ LA AMBIENTACIÓN ES ÚNICAMENTE UNA METÁFORA VISUAL Y NARRATIVA:
   - Ejemplo si el tema es "Sumas y restas para 1° y 2° grado": Las preguntas deben ser sumas y restas reales adecuadas a la edad (ej: "¿Cuánto es 5 + 3?", o situaciones cotidianas escolares con lápices, manzanas o monedas).
   - Cualquier estudiante debe poder responder el 100% de los desafíos sin necesidad de conocer o haber jugado jamás dicho videojuego.`;
    }

    if (selectedCodes.includes('/handwritten') || isHandwritten) {
      visualStyleDirective += `\n⚠️ INSTRUCCIÓN ESPECÍFICA PARA APUNTES A MANO (HANDWRITTEN STUDY NOTES):
DEBES ESTRUCTURAR EL DOCUMENTO COMO UNA VERDADERA PÁGINA DE LIBRETA DE APUNTES ILUSTRADOS (ESTILO STUDYGRAM / SKETCHNOTES):
- RÓTULO PRINCIPAL EN MAYÚSCULAS DE PLUMÓN: Encabezado artístico enmarcado como en un cuaderno (ej. ╔═══ ✎ MIS APUNTES: ${tema.toUpperCase()} ═══╗).
- DESTACADOS CON RESALTADOR: Señala palabras clave y definiciones con marcas de marcador fluorescente o pastel (ej. 🖍️ ==Concepto Clave== o [RESALTADO: Término]).
- ESQUEMAS VISUALES CON FLECHAS DIBUJADAS: Conecta conceptos con flechas manuscritas ( ──► , ╰─► , ➔ ).
- NOTAS AL MARGEN (MARGIN CALLOUTS): Cajas de notas rápidas enmarcadas ("📌 Recordatorio clave:", "💡 Tip para recordar:").
- LÍNEAS DE LIBRETA ESCOLAR: Renglones continuos rayados para respuestas a mano (__________________________________).
- MINI-BOCETOS AL MARGEN: Pequeños íconos y diagramas sencillos junto a los conceptos como si hubieran sido dibujados con bolígrafo y plumón.`;
    }

    if (selectedCodes.includes('/doodle')) {
      visualStyleDirective += `\n⚠️ INSTRUCCIÓN ESPECÍFICA PARA ESTILO DOODLE EN EL RECURSO IMPRIMIBLE:
No te limites a decir en la teoría que aplicaste /doodle. DEBES PLASMARLO EN LA MAQUETACIÓN MISMA DE LA HOJA:
- Usa marcos y separadores decorativos dibujados (ej: ✎ ────────── ✦ ────────── ✎, ╭┈┈┈┈┈┈┈┈┈┈╮).
- Inserta recuadros de notas estilo 'Post-it' o notas con chincheta (📌 NOTA / RECORDATORIO DE GARABATO: ...).
- Diseña casillas de verificación amigables y dibujadas a mano ( ( ◯ ) o [ ✏️ ] ).
- Incluye al menos 1 o 2 pequeños espacios de dibujo rápido para el alumno: "[ ✏️ Mini-doodle: Dibuja un garabato o símbolo rápido que represente esto ]".
- Títulos enmarcados como pancartas de libreta escolar.`;
    }

    if (selectedCodes.includes('/visualthinking')) {
      visualStyleDirective += `\n⚠️ INSTRUCCIÓN ESPECÍFICA PARA VISUAL THINKING:
- Organiza el contenido en bloques visuales secuenciales tipo viñetas (Antes ➔ El Hecho / Causa ➔ Ahora / Consecuencia).
- Usa flechas, conectores lógicos, íconos y cajas rotuladas a mano para que la lectura sea totalmente visual.`;
    }

    if (selectedCodes.includes('/cartoon')) {
      visualStyleDirective += `\n⚠️ INSTRUCCIÓN ESPECÍFICA PARA ESTILO CARTOON:
- Incorpora un personaje o mascota guía que acompaña las instrucciones con diálogos amables y expresiones cómicas.
- Presenta las preguntas o retos como misiones divertidas con viñetas y globos de texto.`;
    }
  }

  if (modo === 'interactivo') {
    functionalityBlock = `
MODALIDAD DE FUNCIONAMIENTO OBLIGATORIA:
💻 INTERACTIVO (FUNCIONALIDAD REAL EN EL RECURSO)

🎯 REGLA DE ORO DE INTERACTIVIDAD (L.I.D.E.R. FUNCIONAL):
No describas la interacción: IMPLEMÉNTALA.
Los botones, campos, comprobación de respuestas, puntuación, retroalimentación y reinicio DEBEN FUNCIONAR REALMENTE en el recurso generado.

REQUISITOS FUNCIONALES OBLIGATORIOS QUE DEBES CONSTRUIR:
1. BOTONES Y CAMPOS ACTIVOS: Los botones deben tener eventos reales (clic, selección de opciones o ingreso de texto) totalmente funcionales.
2. COMPROBACIÓN DE RESPUESTAS: Validación instantánea en tiempo real al interactuar o hacer clic en "Comprobar". No dejes la evaluación en suspenso.
3. PUNTUACIÓN EN VIVO: Contador dinámico visible (ejemplo: "Puntos: X / Total" o porcentaje de aciertos) que se actualice de inmediato tras cada acción.
4. RETROALIMENTACIÓN FORMATIVA INMEDIATA: Mensajes explicativos automáticos: verde y mensaje de refuerzo ante aciertos; aviso amable con pista pedagógica ante errores explicando el porqué.
5. BOTÓN DE REINICIO OPERATIVO: Un botón visible de "Reiniciar / Intentar de nuevo" que restablezca el recurso a su estado original, limpie los campos y reinicie el puntaje a 0 para permitir nueva práctica.
6. FORMATO DE ENTREGA: Entrega el código COMPLETO, sin placeholders ni "continúa aquí", en un único bloque de HTML con CSS y JavaScript integrado listo para guardar como archivo .html y ejecutar directamente en cualquier navegador web o plataforma educativa (Google Classroom, Canvas, Moodle).
${typeSpecificDirective}`;
  } else if (modo === 'hibrido') {
    functionalityBlock = `
MODALIDAD DE FUNCIONAMIENTO OBLIGATORIA:
🔄 HÍBRIDO (VERSIÓN IMPRIMIBLE + VERSIÓN INTERACTIVA)

EL RECURSO DEBE ENTREGARSE EN DOS VERSIONES COMPLEMENTARIAS:

PARTE 1 · VERSIÓN IMPRIMIBLE (PARA EL AULA Y PAPEL):
- Formato estructurado para impresión en hoja A4 o Carta.
- Encabezado escolar completo (Nombre del estudiante, Fecha, Grado/Grupo, Puntuación).
- Líneas y casillas de respuesta generosas para escribir a mano.
- Hoja de respuestas y guía de corrección para el docente al final.

PARTE 2 · VERSIÓN INTERACTIVA (FUNCIONALIDAD REAL DIGITAL):
🎯 REGLA DE ORO DE INTERACTIVIDAD:
No describas la interacción: IMPLEMÉNTALA.
Los botones, campos, comprobación de respuestas, puntuación, retroalimentación y reinicio DEBEN FUNCIONAR REALMENTE en el recurso generado.
- Proporciona el código funcional completo (HTML+CSS+JS autocontenido en un solo bloque) con botones activos, comprobación de respuestas automática, puntuación en vivo, retroalimentación explicativa inmediata y botón de reinicio operativo.
${typeSpecificDirective}`;
  } else {
    functionalityBlock = `
MODALIDAD DE FUNCIONAMIENTO OBLIGATORIA:
📄 IMPRIMIBLE (RECURSO COMPLETO MAQUETADO Y LISTO PARA FOTOCOPIAR)

🚨 MANDATO SUPREMO DE ENTREGA PARA EL DOCENTE:
Tu prioridad número uno es entregar el PRODUCTO FINAL IMPRIMIBLE 100% DESARROLLADO.
- CERO resúmenes teóricos, CERO planes de clase abstractos, CERO puntos suspensivos ("...").
- DEBES ESCRIBIR EL RECURSO ÍNTEGRO listo para que el docente lo copie a Word/Docs o lo mande a imprimir directamente a los alumnos.
- Delimita el recurso imprimible dentro de una sección visual clara:
  ================================================================================
  📄 [TÍTULO DEL RECURSO] · MATERIAL DE TRABAJO LISTO PARA EL ESTUDIANTE
  ================================================================================
  * Con encabezado escolar listo para rellenar (Nombre, Fecha, Grado/Grupo, Calificación).
  * Con todas las preguntas, textos, tablas, casillas [ ] o líneas rayadas desarrolladas una por una.
${typeSpecificDirective}`;
  }

  // Assemble full master prompt
  let prompt = `Actúa como diseñador instruccional experto en educación, diseño pedagógico y desarrollo de experiencias de aprendizaje con inteligencia artificial (Método L.I.D.E.R.© de Katya Sánchez).

DISEÑA EL SIGUIENTE RECURSO EDUCATIVO:
Tipo de recurso: ${tipo || 'Actividad educativa'}
Tema central curricular: "${cleanTema}"`;

  if (isMarioKart || isMinecraft || isRoblox || isLego || isPokemon || isArcade) {
    const gameName = isMinecraft ? 'Minecraft (Voxel 3D)' :
                     isMarioKart ? 'Mario Kart (Carreras arcade)' :
                     isRoblox ? 'Roblox (Obby de plataformas)' :
                     isLego ? 'Lego (Construcción con bloques)' :
                     isPokemon ? 'Pokémon (Batalla RPG)' : 'Arcade Retro (8-bit)';
    prompt += `\nAmbientación temática de juego: ${gameName} (NOTA: Las preguntas son 100% sobre el contenido académico "${cleanTema}"; la ambientación es solo el envoltorio visual y lúdico).`;
  }

  if (materia) {
    prompt += `\nMateria / Asignatura: ${materia}`;
  }

  if (grado) {
    prompt += `\nNivel educativo / Grado: ${grado}`;
  }

  if (objetivo) {
    prompt += `\n\nOBJETIVO DE APRENDIZAJE:\n${objetivo}`;
  }

  prompt += `\n${functionalityBlock}`;

  if (codeDetails.length > 0) {
    prompt += `\n\nCÓDIGOS L.I.D.E.R.™ SELECCIONADOS POR EL DOCENTE:\n${codeDetails.map(c => `- ${c}`).join('\n')}\n\nIntegra cada uno de estos códigos como decisiones concretas de diseño, estructura, estética y experiencia didáctica.`;
  }

  // DUA & Inclusion Pedagogical Directive
  const hasInclusionCode = selectedCodes.includes('/dua') ||
                           selectedCodes.includes('/tdah') ||
                           selectedCodes.includes('/discalculia') ||
                           selectedCodes.includes('/altascapacidades') ||
                           selectedCodes.includes('/lecturafacil') ||
                           selectedCodes.includes('/andamiaje') ||
                           selectedCodes.includes('/pausasactivas') ||
                           adicional.toLowerCase().includes('dua') ||
                           adicional.toLowerCase().includes('inclusión') ||
                           adicional.toLowerCase().includes('inclusion') ||
                           adicional.toLowerCase().includes('tdah');

  if (hasInclusionCode) {
    prompt += `\n\n🧩 DIRECTRICES DE INCLUSIÓN, DUA Y ATENCIÓN A LA DIVERSIDAD:
Asegúrate de que este recurso incorpore activamente los 3 principios del Diseño Universal para el Aprendizaje (DUA):
1. PRINCIPIO DE REPRESENTACIÓN (El qué del aprendizaje):
   - Combina múltiples formatos: texto claro, diagramas visuales, tablas ordenadas y organizadores gráficos.
   ${selectedCodes.includes('/discalculia') ? '• DISCALCULIA: Incluye una recta numérica explícita (0 a 20) y andamiaje manipulativo gráfico (puntos, bloques o fichas de conteo).' : ''}
   ${selectedCodes.includes('/lecturafacil') ? '• LECTURA FÁCIL: Frases directas, apoyo iconográfico/pictogramas en cada consigna y vocabulario accesible sin oraciones subordinadas complejas.' : ''}

2. PRINCIPIO DE ACCIÓN Y EXPRESIÓN (El cómo del aprendizaje):
   - Ofrece al estudiante opciones diversificadas para responder (escribir número, emparejar con flechas, colorear o dibujar).
   ${selectedCodes.includes('/tdah') ? '• TDAH & FUNCIONES EJECUTIVAS: Desglosa cada ejercicio en pasos cortos numerados con casillas de verificación [ ] para marcar avance; resalta palabras clave en negrita y evita saturación de estímulos.' : ''}
   ${selectedCodes.includes('/andamiaje') ? '• ANDAMIAJE PROGRESIVO: Nivel 1 (ejemplo resuelto modelado), Nivel 2 (ejercicio con guía parcial), Nivel 3 (resolución autónoma).' : ''}

3. PRINCIPIO DE IMPLICACIÓN (El por qué del aprendizaje):
   - Conecta el tema con situaciones de la vida real del estudiante; fomenta la autonomía y la autorregulación.
   ${selectedCodes.includes('/pausasactivas') || selectedCodes.includes('/tdah') ? '• PAUSA COGNITIVA: Incluye una breve pausa activa de autorregulación (respiración profunda o estiramiento de 60 segundos) a mitad de la actividad.' : ''}
   ${selectedCodes.includes('/altascapacidades') ? '• ALTAS CAPACIDADES (ENRIQUECIMIENTO): Agrega una sección de "Zona de Reto & Pensamiento Divergente" con preguntas abiertas, análisis de métodos alternativos y un reto para crear un problema propio.' : ''}`;
  }

  if (visualStyleDirective) {
    prompt += visualStyleDirective;
  }

  if (adicional) {
    prompt += `\n\nDETALLES ADICIONALES ESPECIFICADOS:\n${adicional}`;
  }

  prompt += `\n\n📐 ESPECIFICACIONES DE MAQUETACIÓN FÍSICA Y FORMATO:
- Tamaño de papel: ${paperSize === 'carta' ? 'Carta / Letter (8.5" x 11" · 216 x 279 mm - Estándar escolar en América/Costa Rica)' : paperSize === 'oficio' ? 'Oficio / Legal (8.5" x 14" · 216 x 356 mm - Amplio)' : 'A4 (210 x 297 mm - Estándar Internacional)'}.
- Orientación de página: ${orientation === 'horizontal' ? 'HORIZONTAL / APAISADO (Landscape - ideal para infografías, esquemas, líneas de tiempo y carteles)' : 'VERTICAL (Portrait - ideal para fichas de trabajo, guías, rúbricas y exámenes)'}.
- Diagramación: Márgenes limpios de 8mm a 10mm, encabezado escolar institucional superior y distribución de contenido en columnas o cuadrícula adaptada a la orientación seleccionada.`;

  prompt += `\n\nPRINCIPIOS PEDAGÓGICOS L.I.D.E.R.:
- Adecuación rigurosa al nivel cognitivo y edad del grupo (${grado || 'escolar'}).
- Claridad instruccional absoluta: consignas directas que cualquier estudiante entienda sin ambigüedad.
- Pedagogía antes que decoración: cada elemento visual o interactivo responde a un propósito formativo.
- Lenguaje inclusivo, accesible y motivador.

ESTRUCTURA DE ENTREGA OBLIGATORIA (RESPETA ESTE ORDEN EXACTO):

PARTE 1 · GUÍA BREVE DEL DOCENTE (Breve síntesis de 1 párrafo: objetivo, tiempo y sugerencia de aplicación).

PARTE 2 · EL RECURSO EDUCATIVO COMPLETO LISTO PARA EL AULA (MÁXIMA PRIORIDAD):
================================================================================
📄 MATERIAL DIDÁCTICO LISTO PARA IMPRIMIR Y ENTREGAR A LOS ESTUDIANTES
================================================================================
(Entrega aquí el recurso 100% desarrollado de principio a fin, con encabezado escolar, todas sus consignas, preguntas, tablas con casillas [ ], líneas de respuesta y espacios listos para trabajar. PROHIBIDO resumir o poner placeholders como 'continúa aquí...').

PARTE 3 · CLAVE DE RESPUESTAS Y GUÍA DE VALORACIÓN (SOLUCIONARIO PARA EL DOCENTE):
- Soluciones completas, respuestas esperadas o rúbrica de valoración comentada.`;

  if (isHandwritten || is3D || isPixel || isMarioKart || isMinecraft || isRoblox || isLego || isPokemon || isArcade || selectedCodes.includes('/doodle') || selectedCodes.includes('/cartoon')) {
    let imgPromptStr = '';
    if (isHandwritten) {
      imgPromptStr = `Authentic handwritten illustrated study notes page about '${tema}', beautiful student notebook page on ruled/grid paper, handwritten calligraphy lettering, sketchnote diagram layout with hand-drawn arrows, margin doodles and tiny explanatory sketches, soft pastel highlighter pen accents, cozy studygram aesthetic, educational visual notes --ar 4:3 --no 3d render, photograph, corporate vector, digital ui, modern sans-serif fonts --v 6.0`;
    } else if (isMarioKart) {
      imgPromptStr = `Mario Kart inspired educational racing board game track about '${tema}', aerial view of winding racetrack with checkered finish line, glowing question mark item boxes, floating gold coins, cute colorful racing karts, 4 numbered track checkpoints, trophy victory podium, vibrant Nintendo game aesthetic --ar 16:9 --v 6.0`;
    } else if (isMinecraft) {
      imgPromptStr = `Minecraft voxel 3D style educational infographic poster about '${tema}', blocky terrain with grass and stone cubes, pixelated heart health bar UI, 3x3 crafting table showing recipe components, blocky explorer characters learning, warm isometric sunlight, high quality Minecraft game aesthetic --ar 16:9 --v 6.0`;
    } else if (isRoblox) {
      imgPromptStr = `Roblox Obby obstacle parkour course educational poster about '${tema}', colorful neon floating platforms over glowing lava, golden star checkpoint flags, blocky avatar characters jumping, stage numbers from 1 to 5 with concept signs, vibrant playful game aesthetic --ar 16:9 --v 6.0`;
    } else if (isLego) {
      imgPromptStr = `Authentic Lego brick toy educational infographic model of '${tema}', built entirely of glossy plastic toy bricks with visible studs, cute Lego minifigures holding tools, bright primary colors, macro toy photography lighting --ar 16:9 --v 6.0`;
    } else if (isPokemon) {
      imgPromptStr = `Classic Pokemon turn-based RPG battle arena educational screen about '${tema}', monster battle field, HP health bars with levels and topic names, bottom battle menu with 4 action commands, anime monster learning style, nostalgic retro game art --ar 16:9 --v 6.0`;
    } else if (isArcade) {
      imgPromptStr = `Retro arcade coin-op game screen about '${tema}', 16-bit pixel art graphics, glowing neon marquee, pixelated HUD with SCORE and HI-SCORE, 1UP lives, CRT monitor frame with scanlines, colorful nostalgic 80s video game poster --ar 16:9 --v 6.0`;
    } else if (is3D) {
      imgPromptStr = `3D Pixar Disney style CGI render, authentic 3D volumetric character modeling, soft studio raytraced lighting, ambient occlusion, depth of field, educational worksheet about '${tema}', cute 3D elements, no 2D, no flat drawing --ar 4:3 --no 2d, flat, drawing, sketch --v 6.0`;
    } else if (isPixel) {
      imgPromptStr = `Authentic 16-bit retro pixel art game sprite worksheet about '${tema}', visible square pixel grid, nostalgic classic video game aesthetic, limited retro palette, sharp pixelated edges, no smooth lines, no 3D --ar 4:3 --no 3d, smooth, vector --v 6.0`;
    }

    if (imgPromptStr) {
      prompt += `\n\n================================================================================
🎨 OPCIÓN ILUSTRACIÓN VISUAL (SI DESEAS GENERARLO COMO IMAGEN EN CHATGPT / DALL-E 3 / MIDJOURNEY):
================================================================================
Si en lugar de un documento de texto prefieres una lámina ilustrada completa:
Copia este prompt en ChatGPT Imagen / DALL-E 3 / Midjourney:
"${imgPromptStr}"`;
    }
  }

  return prompt.trim();
}
