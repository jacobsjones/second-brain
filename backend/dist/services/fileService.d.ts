import { Note, GraphData } from '../types';
export declare class FileService {
    constructor();
    private ensureDirectoryStructure;
    private getNotePath;
    private extractTags;
    private extractLinks;
    private parseNoteFile;
    getAllNotes(): Promise<Note[]>;
    getNoteById(id: string): Promise<Note | null>;
    createNote(section: string, title: string, content: string): Promise<Note>;
    updateNote(id: string, updates: Partial<Note>): Promise<Note | null>;
    deleteNote(id: string): Promise<boolean>;
    searchNotes(query: string): Promise<Note[]>;
    getGraphData(): Promise<GraphData>;
    getNotesBySection(section: string): Promise<Note[]>;
}
//# sourceMappingURL=fileService.d.ts.map