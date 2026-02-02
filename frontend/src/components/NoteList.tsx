import { useState, useEffect } from 'react';
import { Search, Clock, Tag, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import { NoteMetadata, Section } from '@/types';
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
    if (!confirm('Delete this note?')) return;
    
    try {
      await api.deleteNote(id);
      loadNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-obsidian-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-obsidian-950 flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-obsidian-800">
        <h2 className="text-lg font-semibold mb-3">
          {section || 'All Notes'}
          <span className="ml-2 text-sm font-normal text-obsidian-500">
            ({filteredNotes.length})
          </span>
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-500" size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-obsidian-500 py-8">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`note-item group relative ${selectedNoteId === note.id ? 'active' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-obsidian-200 line-clamp-2 flex-1">
                  {note.title}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button 
                    onClick={(e) => handleDelete(e, note.id)}
                    className="p-1 hover:bg-obsidian-700 rounded text-obsidian-400 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-obsidian-500">+{note.tags.length - 3}</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-2 text-xs text-obsidian-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(note.updatedAt)}
                </span>
                {note.linkCount > 0 && (
                  <span>{note.linkCount} link{note.linkCount !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}