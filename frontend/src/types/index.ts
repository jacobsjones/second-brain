export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  section: string;
  createdAt: string;
  updatedAt: string;
  links: string[];
}

export interface NoteMetadata {
  id: string;
  title: string;
  tags: string[];
  section: string;
  createdAt: string;
  updatedAt: string;
  linkCount: number;
}

export interface GraphNode {
  id: string;
  title: string;
  section: string;
  radius: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type Section = 'Ideas' | 'Trading' | 'Projects' | 'Journal' | 'Articles';

export const SECTIONS: Section[] = ['Ideas', 'Trading', 'Projects', 'Journal', 'Articles'];

export const SECTION_COLORS: Record<Section, string> = {
  Ideas: '#8b5cf6',    // purple
  Trading: '#f59e0b',  // orange  
  Projects: '#3b82f6', // blue
  Journal: '#10b981',  // green
  Articles: '#ec4899', // pink
};