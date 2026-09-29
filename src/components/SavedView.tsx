/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bookmark, Trash2, Copy, Play, ArrowRight, Check, Search, Download, Upload, FileText, Monitor, RefreshCw, Eye, Printer } from 'lucide-react';
import { SavedResource } from '../types';
import { getModalityLabel } from '../services/promptBuilder';
import { PrintableResourceModal } from './PrintableResourceModal';

interface SavedViewProps {
  resources: SavedResource[];
  onDelete: (id: string) => void;
  onReuse: (resource: SavedResource) => void;
  onOpenSandbox: (topic: string, tipo: string, grade?: string, subject?: string) => void;
  onImport: (resources: SavedResource[]) => void;
  onNavigate: (view: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  resources,
  onDelete,
  onReuse,
  onOpenSandbox,
  onImport,
  onNavigate
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterModo, setFilterModo] = useState<string>('all');
  const [printResource, setPrintResource] = useState<SavedResource | null>(null);

  const handleCopy = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resources, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mis_recursos_lider_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImport(parsed);
            alert(`✨ Se importaron ${parsed.length} recursos con éxito.`);
          }
        } catch {
          alert('Error al leer el archivo JSON.');
        }
      };
    }
  };

  const filtered = resources.filter(res => {
    const matchText = !filterQuery || 
      res.topic.toLowerCase().includes(filterQuery.toLowerCase()) ||
      res.type.toLowerCase().includes(filterQuery.toLowerCase());
    const matchModo = filterModo === 'all' || res.modo === filterModo;
    return matchText && matchModo;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8edc5] text-[#09243a] text-xs font-black tracking-wide mb-2">
            <Bookmark className="w-3.5 h-3.5 text-[#d7ad32]" />
            TU BIBLIOTECA PERSONAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#09243a]">
            Mis recursos guardados
          </h1>
          <p className="text-sm sm:text-base text-[#68747d] mt-1">
            Revisa, reutiliza, exporta o ejecuta las instrucciones y recursos que has creado.
          </p>
        </div>

        {resources.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#e7e4dc] hover:border-[#d7ad32] text-[#09243a] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#68747d]" />
              Exportar copia (.json)
            </button>
            <label className="px-3.5 py-2 rounded-xl bg-white border border-[#e7e4dc] hover:border-[#d7ad32] text-[#09243a] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#68747d]" />
              Importar
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {resources.length > 0 && (
        <div className="bg-white border border-[#e7e4dc] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#68747d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar por tema o tipo..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e7e4dc] text-xs sm:text-sm focus:border-[#d7ad32] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setFilterModo('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterModo === 'all' ? 'bg-[#09243a] text-white' : 'bg-[#f4f6f7] text-[#68747d]'
              }`}
            >
              Todos ({resources.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterModo('interactivo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterModo === 'interactivo' ? 'bg-[#09243a] text-white' : 'bg-[#f4f6f7] text-[#68747d]'
              }`}
            >
              <Monitor className="w-3 h-3" />
              Interactivos
            </button>
            <button
              type="button"
              onClick={() => setFilterModo('imprimible')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterModo === 'imprimible' ? 'bg-[#09243a] text-white' : 'bg-[#f4f6f7] text-[#68747d]'
              }`}
            >
              <FileText className="w-3 h-3" />
              Imprimibles
            </button>
            <button
              type="button"
              onClick={() => setFilterModo('hibrido')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                filterModo === 'hibrido' ? 'bg-[#09243a] text-white' : 'bg-[#f4f6f7] text-[#68747d]'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              Híbridos
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {resources.length === 0 ? (
        <div className="bg-white border border-[#e7e4dc] rounded-3xl p-10 sm:p-14 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#fffdf5] border border-[#eadfb8] text-3xl flex items-center justify-center mx-auto">
            📁
          </div>
          <h3 className="text-xl font-extrabold text-[#09243a] m-0">
            Aún no tienes recursos guardados
          </h3>
          <p className="text-sm text-[#68747d]">
            Diseña tu primer recurso imprimible o interactivo en el creador y guárdalo aquí para tenerlo siempre a mano.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="px-6 py-3 bg-[#09243a] hover:bg-[#061a2b] text-white font-extrabold text-sm rounded-xl transition-all shadow-md cursor-pointer"
            >
              ✨ Crear mi primer recurso
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[#68747d] text-sm">
          No se encontraron recursos con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#e7e4dc] hover:border-[#d7ad32] rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-[#09243a] m-0">
                        {item.type}
                      </h3>
                      
                      {/* Modality badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                        item.modo === 'interactivo' 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : item.modo === 'hibrido'
                          ? 'bg-[#f8edc5] text-[#735a00] border border-[#eadfb8]'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {item.modo === 'interactivo' && <Monitor className="w-3 h-3" />}
                        {item.modo === 'imprimible' && <FileText className="w-3 h-3" />}
                        {item.modo === 'hibrido' && <RefreshCw className="w-3 h-3" />}
                        <span>{item.modo ? item.modo.toUpperCase() : 'INTERACTIVO'}</span>
                      </span>

                      {item.grade && (
                        <span className="text-xs text-[#68747d]">
                          · {item.grade}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-[#68747d] mt-1 m-0">
                      Tema: <span className="text-[#09243a]">{item.topic}</span>
                      {item.subject && ` · ${item.subject}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eliminar de guardados"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Codes chips */}
                {item.codes && item.codes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.codes.map(c => (
                      <span key={c} className="bg-[#f4f6f7] text-[#09243a] px-2 py-0.5 rounded text-[11px] font-mono font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions row */}
                <div className="pt-2 border-t border-[#f4f6f7] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="px-3 py-1.5 rounded-lg bg-[#f8edc5] hover:bg-[#f3e5b3] text-[#09243a] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? '¡Copiado!' : 'Copiar prompt'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReuse(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#f4f6f7] hover:bg-[#e7e4dc] text-[#09243a] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Abrir en creador</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrintResource(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#133b5c] hover:bg-[#184870] text-[#f8edc5] border border-[#d7ad32]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Abrir Kit Docente: Ficha de aula para fotocopiar, solucionario y rúbrica formativa"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#d7ad32]" />
                      <span>Ficha & Rúbrica</span>
                    </button>
                  </div>

                  {(item.modo === 'interactivo' || item.modo === 'hibrido') && (
                    <button
                      type="button"
                      onClick={() => onOpenSandbox(item.topic, item.type, item.grade, item.subject)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Probar simulador interactivo</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kit Docente Modal para recursos guardados */}
      {printResource && (
        <PrintableResourceModal
          isOpen={!!printResource}
          onClose={() => setPrintResource(null)}
          data={{
            tipo: printResource.type,
            modo: printResource.modo || 'imprimible',
            tema: printResource.topic,
            materia: printResource.subject || '',
            grado: printResource.grade || '',
            objetivo: '',
            adicional: '',
            selectedCodes: printResource.codes || []
          }}
          promptText={printResource.prompt}
        />
      )}

    </div>
  );
};
