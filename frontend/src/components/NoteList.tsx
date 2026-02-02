import { useState, useEffect } from 'react';
import { Search, Clock, Trash2, Hash, Link2, X } from 'lucide-react';
import { NoteMetadata, Section, SECTION_COLORS } from '@/types';
import { api } from '@/api';

interface NoteListProps {
  section: Section | null;
  selectedNoteId: string | null;
  onSelectNote: (note: NoteMetadata) => void;
  onNotesLoaded?: (notes: NoteMetadata[]) => void;
}

export default function NoteList({ 
  section, 
  selectedNoteId, 
  onSelectNote,
  onNotesLoaded 
}: NoteListProps) {
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [section]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await api.getNotes(section || undefined);
      setNotes(data);
      onNotesLoaded?.(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.deleteNote(id);
      loadNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getSectionColor = (noteSection: string) => {
    return SECTION_COLORS[noteSection as keyof typeof SECTION_COLORS] || '#8b5cf6';
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-content-muted">
        <div className="w-8 h-8 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mb-3" />
        <span className="text-sm">Loading notes...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-surface-primary flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle bg-surface-secondary/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-obsidian-100">
              {section || 'All Notes'}
            </h2>
            <span className="badge-purple">
              {filteredNotes.length}
            </span>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-500" size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-obsidian-500 hover:text-obsidian-300 hover:bg-obsidian-800 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-content-muted">
            <div className="w-16 h-16 rounded-2xl bg-obsidian-900 flex items-center justify-center mb-4">
              <Search size={24} className="opacity-30" />
            </div>
            <p className="text-sm font-medium mb-1">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </p>
            <p className="text-xs text-obsidian-600">
              {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isActive = selectedNoteId === note.id;
            const sectionColor = getSectionColor(note.section);
            
            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`note-item ${isActive ? 'active' : ''}`}
              >
                {/* Title Row */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`note-title ${isActive ? 'text-white' : ''}`}>
                    {note.title || 'Untitled'}
                  </h3>
                  
                  {/* Delete button - visible on hover */}
                  <button 
                    onClick={(e) => handleDelete(e, note.id)}
                    className="
                      opacity-0 group-hover:opacity-100 
                      p-1.5 rounded-lg text-obsidian-500 
                      hover:text-red-400 hover:bg-red-500/10
                      transition-all duration-200
                      flex-shrink-0
                    "
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {note.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="note-tag">
                        <Hash size={10} className="mr-0.5 opacity-60" />
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 4 && (
                      <span className="text-xs text-obsidian-500 flex items-center px-1">
                        +{note.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Meta Row */}
                <div className="note-meta">
                  {/* Section indicator */}
                  <span 
                    className="flex items-center gap-1.5 font-medium"
                    style={{ color: sectionColor }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: sectionColor }}
                    />
                    {note.section}
                  </span>
                  
                  <span className="text-obsidian-700">•</span>
                  
                  {/* Date */}
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {formatDate(note.updatedAt)}
                  </span>
                  
                  {/* Link count */}
                  {note.linkCount > 0 && (
                    <>
                      <span className="text-obsidian-700">•</span>
                      <span className="flex items-center gap-1 text-accent-blue-light/70">
                        <Link2 size={11} />
                        {note.linkCount}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
