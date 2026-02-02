import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Edit3, 
  Eye, 
  Save, 
  X, 
  Maximize2, 
  Minimize2,
  Link as LinkIcon,
  Tag
} from 'lucide-react';
import { Note, Section, SECTIONS } from '@/types';
import { api } from '@/api';

interface NoteEditorProps {
  noteId: string | null;
  onNoteUpdated?: () => void;
  onClose?: () => void;
}

// Custom wiki-link component for markdown
const WikiLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <span 
      className="wiki-link"
      onClick={() => {
        // Emit event to open linked note
        window.dispatchEvent(new CustomEvent('open-wiki-link', { detail: href }));
      }}
    >
      {children}
    </span>
  );
};

export default function NoteEditor({ noteId, onNoteUpdated, onClose }: NoteEditorProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (noteId) {
      loadNote(noteId);
    } else {
      setNote(null);
      setIsEditing(false);
    }
  }, [noteId]);

  const loadNote = async (id: string) => {
    try {
      setLoading(true);
      const data = await api.getNote(id);
      setNote(data);
      setEditedContent(data.content);
      setEditedTitle(data.title);
    } catch (error) {
      console.error('Failed to load note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note) return;
    
    try {
      await api.updateNote(note.id, editedTitle, editedContent);
      await loadNote(note.id);
      setIsEditing(false);
      onNoteUpdated?.();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleCancel = () => {
    if (note) {
      setEditedContent(note.content);
      setEditedTitle(note.title);
    }
    setIsEditing(false);
  };

  // Process content to highlight wiki-links and tags in preview
  const processContent = (content: string) => {
    return content
      .replace(/\[\[([^\]]+)\]\]/g, '[[$1]]') // Keep wiki-links as is
      .replace(/#(\w+)/g, '**#$1**'); // Bold tags
  };

  if (!noteId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-obsidian-500">
        <div className="text-center">
          <Edit3 size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a note to view or edit</p>
        </div>
      </div>
    );
  }

  if (loading || !note) {
    return (
      <div className="w-full h-full flex items-center justify-center text-obsidian-500">
        Loading...
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-obsidian-950 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-obsidian-800">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input font-semibold text-lg bg-transparent border-0 px-0 focus:ring-0"
              placeholder="Note title..."
            />
          ) : (
            <h1 className="text-lg font-semibold">{note.title}</h1>
          )}
          <span className="text-xs text-obsidian-500 bg-obsidian-900 px-2 py-1 rounded">
            {note.section}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn-primary flex items-center gap-1 text-sm">
                <Save size={14} />
                Save
              </button>
              <button onClick={handleCancel} className="btn-secondary text-sm">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className={`p-2 rounded-lg ${showPreview ? 'text-accent-purple' : 'text-obsidian-400'} hover:bg-obsidian-800`}
                title={showPreview ? 'Hide preview' : 'Show preview'}
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg text-obsidian-400 hover:bg-obsidian-800"
                title="Edit"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg text-obsidian-400 hover:bg-obsidian-800"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg text-obsidian-400 hover:bg-obsidian-800"
                >
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 bg-obsidian-950 text-obsidian-100 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Start writing in markdown..."
              spellCheck={false}
            />
            {showPreview && (
              <div className="flex-1 border-l border-obsidian-800 p-4 overflow-y-auto">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {editedContent}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  text: ({ children }) => {
                    if (typeof children === 'string') {
                      // Highlight wiki-links
                      const parts = children.split(/(\[\[[^\]]+\]\])/g);
                      return (
                        <>
                          {parts.map((part, i) => {
                            const match = part.match(/^\[\[([^\]]+)\]\]$/);
                            if (match) {
                              return (
                                <WikiLink key={i} href={match[1]}>
                                  {match[1]}
                                </WikiLink>
                              );
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </>
                      );
                    }
                    return <>{children}</>;
                  }
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>
            
            {/* Tags footer */}
            {note.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-obsidian-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-obsidian-500" />
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}