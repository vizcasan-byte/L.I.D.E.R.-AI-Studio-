/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PrintPdfOptions {
  paperSize?: 'carta' | 'a4' | 'oficio';
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Generates and downloads a real multi-page PDF from a DOM element
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = 'Ficha_Docente_Metodo_LIDER.pdf',
  options?: PrintPdfOptions
): Promise<void> {
  // Ensure background is visible and clean
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution for print
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  const isLandscape = options?.orientation === 'horizontal';
  const paper = options?.paperSize || 'carta';

  let baseDims = [216, 279]; // Letter / Carta mm
  let jsPdfFormat = 'letter';
  if (paper === 'a4') {
    baseDims = [210, 297];
    jsPdfFormat = 'a4';
  } else if (paper === 'oficio') {
    baseDims = [216, 356];
    jsPdfFormat = 'legal';
  }

  const pageWidth = isLandscape ? baseDims[1] : baseDims[0];
  const pageHeight = isLandscape ? baseDims[0] : baseDims[1];

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: jsPdfFormat,
  });

  const margin = 8; // 8mm margin
  const contentWidth = pageWidth - margin * 2;
  const contentAvailableHeight = pageHeight - margin * 2;

  // Calculate slice height in canvas pixels equivalent to available page height
  const pageCanvasHeight = (canvas.width * contentAvailableHeight) / contentWidth;
  let renderedHeight = 0;
  let pageIndex = 0;

  while (renderedHeight < canvas.height) {
    const chunkCanvas = document.createElement('canvas');
    chunkCanvas.width = canvas.width;
    const chunkHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);
    chunkCanvas.height = chunkHeight;
    const ctx = chunkCanvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, chunkCanvas.width, chunkCanvas.height);
      ctx.drawImage(
        canvas,
        0, renderedHeight, canvas.width, chunkHeight,
        0, 0, canvas.width, chunkHeight
      );
      
      const chunkData = chunkCanvas.toDataURL('image/jpeg', 0.95);
      const renderedMmHeight = (chunkHeight * contentWidth) / canvas.width;
      
      if (pageIndex > 0) {
        pdf.addPage();
      }
      pdf.addImage(chunkData, 'JPEG', margin, margin, contentWidth, renderedMmHeight, undefined, 'FAST');
    }
    
    renderedHeight += chunkHeight;
    pageIndex++;
  }

  pdf.save(filename);
}

/**
 * Attempts to print the DOM element in an isolated hidden iframe
 * Returns true if the browser print dialog was dispatched, false if blocked
 */
export function printElementViaIframe(
  element: HTMLElement, 
  title: string = 'Documento Docente',
  options?: PrintPdfOptions
): boolean {
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.setAttribute('title', 'Print Frame');
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return false;
    }

    const isLandscape = options?.orientation === 'horizontal';
    const paper = options?.paperSize || 'carta';
    const cssSize = paper === 'carta' ? 'letter' : paper === 'oficio' ? 'legal' : 'A4';

    // Extract all styles from current page
    const styleSheets = Array.from(document.styleSheets);
    let cssRulesText = '';
    for (const sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let i = 0; i < rules.length; i++) {
            cssRulesText += rules[i].cssText + '\n';
          }
        }
      } catch {
        // Ignore cross-origin stylesheet errors
      }
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            ${cssRulesText}
            @page {
              margin: 8mm;
              size: ${cssSize} ${isLandscape ? 'landscape' : 'portrait'};
            }
            body {
              background: #ffffff !important;
              color: #1f2937 !important;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              padding: 0;
              margin: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-container {
              width: 100%;
              max-width: ${isLandscape ? '1120px' : '820px'};
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Give the iframe resources time to render
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      } catch (err) {
        console.warn('Iframe print error:', err);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }
    }, 400);

    return true;
  } catch (error) {
    console.warn('Failed to print via iframe:', error);
    return false;
  }
}

/**
 * Downloads a standalone, print-ready HTML file that can be opened and printed in 1 click
 */
export function downloadStandaloneHtml(
  element: HTMLElement,
  filename: string = 'Ficha_Docente_Metodo_LIDER.html',
  title: string = 'Ficha de Aula y Guía Docente - Método L.I.D.E.R.©',
  options?: PrintPdfOptions
): void {
  // Extract css rules
  let cssRulesText = '';
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let i = 0; i < rules.length; i++) {
            cssRulesText += rules[i].cssText + '\n';
          }
        }
      } catch {
        // cross-origin
      }
    }
  } catch {
    // ignore
  }

  const isLandscape = options?.orientation === 'horizontal';
  const paper = options?.paperSize || 'carta';
  const cssSize = paper === 'carta' ? 'letter' : paper === 'oficio' ? 'legal' : 'A4';

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${cssRulesText}
    @page {
      margin: 8mm;
      size: ${cssSize} ${isLandscape ? 'landscape' : 'portrait'};
    }
    body {
      background-color: #f8fafc;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-bar {
      max-width: ${isLandscape ? '1120px' : '900px'};
      margin: 0 auto 20px auto;
      background: #09243a;
      color: white;
      padding: 14px 24px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .print-btn {
      background: #d7ad32;
      color: #09243a;
      font-weight: 800;
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      font-size: 14px;
    }
    .print-card {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    @media print {
      body {
        background: white !important;
        padding: 0 !important;
      }
      .print-bar {
        display: none !important;
      }
      .print-card {
        padding: 0 !important;
        box-shadow: none !important;
        max-width: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #f8edc5; text-transform: uppercase;">Método L.I.D.E.R.© · Material Listo para Aula</div>
      <div style="font-size: 16px; font-weight: 800;">${title}</div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  </div>

  <div class="print-card">
    ${element.innerHTML}
  </div>

  <script>
    // Auto-trigger print if requested via url hash #print
    if (window.location.hash === '#print') {
      window.onload = function() { setTimeout(function() { window.print(); }, 500); };
    }
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
