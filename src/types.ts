/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ResourceFunctionMode = 'imprimible' | 'interactivo' | 'hibrido' | 'visual';
export type PaperSize = 'carta' | 'a4' | 'oficio';
export type OrientationMode = 'vertical' | 'horizontal';
export type ImageAspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface LiderCodeItem {
  code: string;
  label: string;
  description: string;
  instruction?: string;
}

export interface LiderCategory {
  name: string;
  items: [string, string, string][]; // [code, label, description]
}

export interface ResourceFormData {
  tipo: string;
  modo: ResourceFunctionMode;
  tema: string;
  materia: string;
  grado: string;
  objetivo: string;
  adicional: string;
  selectedCodes: string[];
  paperSize?: PaperSize;
  orientation?: OrientationMode;
  aspectRatio?: ImageAspectRatio;
}

export interface SavedResource {
  id: string;
  type: string;
  topic: string;
  modo: ResourceFunctionMode;
  codes: string[];
  prompt: string;
  date: string;
  subject?: string;
  grade?: string;
  generatedCode?: string;
}
