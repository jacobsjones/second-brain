"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileService_1 = require("../services/fileService");
const router = (0, express_1.Router)();
const fileService = new fileService_1.FileService();
// Get all notes
router.get('/', async (req, res) => {
    try {
        const { section } = req.query;
        let notes;
        if (section && typeof section === 'string') {
            notes = await fileService.getNotesBySection(section);
        }
        else {
            notes = await fileService.getAllNotes();
        }
        // Return metadata only for list view
        const metadata = notes.map(note => ({
            id: note.id,
            title: note.title,
            tags: note.tags,
            section: note.section,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            linkCount: note.links.length
        }));
        res.json(metadata);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});
// Search notes
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Query parameter required' });
        }
        const notes = await fileService.searchNotes(q);
        res.json(notes);
    }
    catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});
// Get single note
router.get('/:id', async (req, res) => {
    try {
        const note = await fileService.getNoteById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});
// Create note
router.post('/', async (req, res) => {
    try {
        const { section, title, content } = req.body;
        if (!section || !title) {
            return res.status(400).json({ error: 'Section and title required' });
        }
        const note = await fileService.createNote(section, title, content || '');
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});
// Update note
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await fileService.updateNote(req.params.id, { title, content });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});
// Delete note
router.delete('/:id', async (req, res) => {
    try {
        const success = await fileService.deleteNote(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});
exports.default = router;
//# sourceMappingURL=notes.js.map