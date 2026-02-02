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
  Tag,
  Clock,
  Hash,
  Link as LinkIcon,
  MoreVertical,
  SplitSquareHorizontal
} from 'lucide-react';
import { Note, SECTION_COLORS } from '@/types';
import { api } from '@/api';

interface NoteEditorProps {
  noteId: string | null;
  onNoteUpdated?: () => void;
  onClose?: () => void;
}

// WikiLink component for rendered markdown
const WikiLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-wiki-link', { detail: href }));
  };

  return (
    <button 
      onClick={handleClick}
      className="wiki-link"
    >
      {children}
    </button>
  );
};

// Custom renderer for ReactMarkdown to handle wiki-links
const MarkdownComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (href?.startsWith('[[') && href?.endsWith(']]')) {
      const linkContent = href.slice(2, -2);
      return <WikiLink href={linkContent}>{linkContent}</WikiLink>;
    }
    return <a href={href} className="text-accent-blue-light hover:underline">{children}</a>;
  },
  code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <div className="relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-obsidian-500 font-mono">{match?.[1] || 'code'}</span>
        </div>
        <pre className={className} {...props}>
          <code className={className}>{children}</code>
        </pre>
      </div>
    ) : (
      <code className="bg-obsidian-800 text-accent-purple-light px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }
};

export default function NoteEditor({ noteId, onNoteUpdated, onClose }: NoteEditorProps) {
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (noteId) {
      loadNote(noteId);
    } else {
      setNote(null);
      setIsEditing(false);
    }
  }, [noteId]);

  useEffect(() => {
    // Calculate word count
    const words = editedContent.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, [editedContent]);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (isEditing) {
        handleSave();
      }
    }
    if (e.key === 'Escape' && isEditing) {
      handleCancel();
    }
  }, [isEditing, editedContent, editedTitle]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!noteId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-content-muted bg-surface-primary">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 flex items-center justify-center mb-6">
          <Edit3 size={40} className="text-accent-purple/50" />
        </div>
        <p className="text-lg font-medium text-obsidian-300 mb-2">Select a note to view or edit</p>
        <p className="text-sm text-obsidian-600">Choose from the list or create a new note</p>
      </div>
    );
  }

  if (loading || !note) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-content-muted bg-surface-primary">
        <div className="w-10 h-10 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mb-4" />
        <span className="text-sm">Loading note...</span>
      </div>
    );
  }

  const sectionColor = SECTION_COLORS[note.section as keyof typeof SECTION_COLORS] || '#8b5cf6';

  return (
    <div className={`w-full h-full bg-surface-primary flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* Left side - Title & Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input font-semibold text-xl bg-transparent border-0 px-0 focus:ring-0 w-full max-w-md"
              placeholder="Note title..."
            />
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-obsidian-100 truncate">{note.title || 'Untitled'}</h1>
              <span 
                className="badge flex items-center gap-1.5"
                style={{ 
                  backgroundColor: `${sectionColor}15`,
                  color: sectionColor,
                  borderColor: `${sectionColor}30`
                }}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: sectionColor }}
                />
                {note.section}
              </span>
            </div>
          )}
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className={`btn-icon ${showPreview ? 'active' : ''}`}
                title={showPreview ? 'Hide preview' : 'Show preview'}
              >
                <SplitSquareHorizontal size={18} />
              </button>
              <div className="w-px h-6 bg-obsidian-800 mx-2" />
              <button 
                onClick={handleSave} 
                className="btn-primary text-sm"
              >
                <Save size={16} />
                Save
              </button>
              <button 
                onClick={handleCancel} 
                className="btn-secondary text-sm"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-primary text-sm"
              >
                <Edit3 size={16} />
                Edit
              </button>
              <div className="w-px h-6 bg-obsidian-800 mx-2" />
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="btn-icon"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="btn-icon"
                >
                  <X size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex">
            {/* Editor */}
            <div className={`${showPreview ? 'flex-1' : 'w-full'} h-full flex flex-col`}>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="editor-textarea flex-1 p-6"
                placeholder="# Start writing...\n\nUse [[Wiki Links]] to connect notes.\nUse #tags to categorize."
                spellCheck={false}
              />
              {/* Editor footer */}
              <div className="px-6 py-2 border-t border-obsidian-800 bg-obsidian-900/30 flex items-center justify-between text-xs text-obsidian-500">
                <span>{wordCount} words</span>
                <span className="flex items-center gap-4">
                  <span>Ctrl+S to save</span>
                  <span>Esc to cancel</span>
                </span>
              </div>
            </div>
            
            {/* Preview */}
            {showPreview && (
              <div className="flex-1 border-l border-obsidian-800 bg-surface-primary overflow-y-auto">
                <div className="p-8">
                  <div className="prose prose-invert prose-lg max-w-none editor-preview">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {editedContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              {/* Note metadata header */}
              <div className="flex items-center gap-4 text-sm text-content-muted mb-6 pb-6 border-b border-obsidian-800">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  Updated {formatDate(note.updatedAt)}
                </span>
                <span className="text-obsidian-700">•</span>
                <span className="flex items-center gap-1.5">
                  <LinkIcon size={14} />
                  {note.links.length} link{note.links.length !== 1 ? 's' : ''}
                </span>
                <span className="text-obsidian-700">•</span>
                <span>{wordCount} words</span>
              </div>

              {/* Rendered content */}
              <div className="prose prose-invert prose-lg max-w-none editor-preview">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {note.content}
                </ReactMarkdown>
              </div>
              
              {/* Tags footer */}
              {note.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-obsidian-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag size={16} className="text-accent-purple-light" />
                    {note.tags.map((tag) => (
                      <span key={tag} className="wiki-link">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
