"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(__dirname, '../../data/notes');
const SECTIONS = ['Ideas', 'Trading', 'Projects', 'Journal', 'Articles'];
class FileService {
    constructor() {
        this.ensureDirectoryStructure();
    }
    ensureDirectoryStructure() {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        SECTIONS.forEach(section => {
            const sectionPath = path_1.default.join(DATA_DIR, section);
            if (!fs_1.default.existsSync(sectionPath)) {
                fs_1.default.mkdirSync(sectionPath, { recursive: true });
            }
        });
    }
    getNotePath(id, section) {
        return path_1.default.join(DATA_DIR, section, `${id}.md`);
    }
    extractTags(content) {
        const tagRegex = /#(\w+)/g;
        const tags = [];
        let match;
        while ((match = tagRegex.exec(content)) !== null) {
            tags.push(match[1]);
        }
        return [...new Set(tags)];
    }
    extractLinks(content) {
        const linkRegex = /\[\[([^\]]+)\]\]/g;
        const links = [];
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            links.push(match[1]);
        }
        return [...new Set(links)];
    }
    parseNoteFile(filePath, section) {
        const content = fs_1.default.readFileSync(filePath, 'utf-8');
        const filename = path_1.default.basename(filePath, '.md');
        const stats = fs_1.default.statSync(filePath);
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
    async getAllNotes() {
        const notes = [];
        for (const section of SECTIONS) {
            const sectionPath = path_1.default.join(DATA_DIR, section);
            if (!fs_1.default.existsSync(sectionPath))
                continue;
            const files = fs_1.default.readdirSync(sectionPath).filter(f => f.endsWith('.md'));
            for (const file of files) {
                const filePath = path_1.default.join(sectionPath, file);
                notes.push(this.parseNoteFile(filePath, section));
            }
        }
        return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    async getNoteById(id) {
        // Search in all sections
        for (const section of SECTIONS) {
            const filePath = path_1.default.join(DATA_DIR, section, `${id}.md`);
            if (fs_1.default.existsSync(filePath)) {
                return this.parseNoteFile(filePath, section);
            }
        }
        return null;
    }
    async createNote(section, title, content) {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const fullContent = `# ${title}\n\n${content}`;
        const filePath = path_1.default.join(DATA_DIR, section, `${id}.md`);
        fs_1.default.writeFileSync(filePath, fullContent);
        return this.parseNoteFile(filePath, section);
    }
    async updateNote(id, updates) {
        const note = await this.getNoteById(id);
        if (!note)
            return null;
        const newContent = updates.content || note.content;
        const newTitle = updates.title || note.title;
        const fullContent = newContent.startsWith('#')
            ? newContent
            : `# ${newTitle}\n\n${newContent}`;
        const filePath = path_1.default.join(DATA_DIR, note.section, `${id}.md`);
        fs_1.default.writeFileSync(filePath, fullContent);
        return this.parseNoteFile(filePath, note.section);
    }
    async deleteNote(id) {
        for (const section of SECTIONS) {
            const filePath = path_1.default.join(DATA_DIR, section, `${id}.md`);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                return true;
            }
        }
        return false;
    }
    async searchNotes(query) {
        const notes = await this.getAllNotes();
        const lowerQuery = query.toLowerCase();
        return notes.filter(note => note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowerQuery)));
    }
    async getGraphData() {
        const notes = await this.getAllNotes();
        const nodes = notes.map(note => ({
            id: note.id,
            title: note.title,
            section: note.section,
            radius: Math.max(5, Math.min(20, 5 + note.links.length * 2))
        }));
        const links = [];
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
    async getNotesBySection(section) {
        const notes = await this.getAllNotes();
        return notes.filter(note => note.section === section);
    }
}
exports.FileService = FileService;
//# sourceMappingURL=fileService.js.map