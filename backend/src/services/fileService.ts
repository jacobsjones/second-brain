import fs from 'fs';
import path from 'path';
import { Note, NoteMetadata, GraphData, GraphNode, GraphLink } from '../types';

const DATA_DIR = path.join(__dirname, '../../data/notes');
const SECTIONS = ['Ideas', 'Trading', 'Projects', 'Journal', 'Articles'];

export class FileService {
  constructor() {
    this.ensureDirectoryStructure();
  }

  private ensureDirectoryStructure(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    SECTIONS.forEach(section => {
      const sectionPath = path.join(DATA_DIR, section);
      if (!fs.existsSync(sectionPath)) {
        fs.mkdirSync(sectionPath, { recursive: true });
      }
    });
  }

  private getNotePath(id: string, section: string): string {
    return path.join(DATA_DIR, section, `${id}.md`);
  }

  private extractTags(content: string): string[] {
    const tagRegex = /#(\w+)/g;
    const tags: string[] = [];
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      tags.push(match[1]);
    }
    return [...new Set(tags)];
  }

  private extractLinks(content: string): string[] {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    const links: string[] = [];
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      links.push(match[1]);
    }
    return [...new Set(links)];
  }

  private parseNoteFile(filePath: string, section: string): Note {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath, '.md');
    const stats = fs.statSync(filePath);
    
    // First line is title if it starts with #
    const lines = content.split('\n');
    const title = lines[0].startsWith('#') 
      ? lines[0].replace(/^#+\s*/, '').trim()
      : filename;

    return {
      id: filename,
      title,
      content,
      tags: this.extractTags(content),
      section,
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
      links: this.extractLinks(content)
    };
  }

  async getAllNotes(): Promise<Note[]> {
    const notes: Note[] = [];
    
    for (const section of SECTIONS) {
      const sectionPath = path.join(DATA_DIR, section);
      if (!fs.existsSync(sectionPath)) continue;
      
      const files = fs.readdirSync(sectionPath).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        const filePath = path.join(sectionPath, file);
        notes.push(this.parseNoteFile(filePath, section));
      }
    }
    
    return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getNoteById(id: string): Promise<Note | null> {
    // Search in all sections
    for (const section of SECTIONS) {
      const filePath = path.join(DATA_DIR, section, `${id}.md`);
      if (fs.existsSync(filePath)) {
        return this.parseNoteFile(filePath, section);
      }
    }
    return null;
  }

  async createNote(section: string, title: string, content: string): Promise<Note> {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const fullContent = `# ${title}\n\n${content}`;
    const filePath = path.join(DATA_DIR, section, `${id}.md`);
    
    fs.writeFileSync(filePath, fullContent);
    
    return this.parseNoteFile(filePath, section);
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const note = await this.getNoteById(id);
    if (!note) return null;

    const newContent = updates.content || note.content;
    const newTitle = updates.title || note.title;
    const fullContent = newContent.startsWith('#') 
      ? newContent 
      : `# ${newTitle}\n\n${newContent}`;
    
    const filePath = path.join(DATA_DIR, note.section, `${id}.md`);
    fs.writeFileSync(filePath, fullContent);
    
    return this.parseNoteFile(filePath, note.section);
  }

  async deleteNote(id: string): Promise<boolean> {
    for (const section of SECTIONS) {
      const filePath = path.join(DATA_DIR, section, `${id}.md`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    }
    return false;
  }

  async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getAllNotes();
    const lowerQuery = query.toLowerCase();
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getGraphData(): Promise<GraphData> {
    const notes = await this.getAllNotes();
    
    const nodes: GraphNode[] = notes.map(note => ({
      id: note.id,
      title: note.title,
      section: note.section,
      radius: Math.max(5, Math.min(20, 5 + note.links.length * 2))
    }));

    const links: GraphLink[] = [];
    const noteMap = new Map(notes.map(n => [n.title.toLowerCase(), n.id]));
    
    for (const note of notes) {
      for (const linkTitle of note.links) {
        const targetId = noteMap.get(linkTitle.toLowerCase());
        if (targetId && targetId !== note.id) {
          links.push({
            source: note.id,
            target: targetId
          });
        }
      }
    }

    return { nodes, links };
  }

  async getNotesBySection(section: string): Promise<Note[]> {
    const notes = await this.getAllNotes();
    return notes.filter(note => note.section === section);
  }
}