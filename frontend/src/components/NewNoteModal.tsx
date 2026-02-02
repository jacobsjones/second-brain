import { useState } from 'react';
import { X, Folder } from 'lucide-react';
import { Section, SECTIONS } from '@/types';
import { api } from '@/api';

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: () => void;
}

export default function NewNoteModal({ isOpen, onClose, onNoteCreated }: NewNoteModalProps) {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<Section>('Ideas');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      await api.createNote(section, title, content);
      setTitle('');
      setContent('');
      setSection('Ideas');
      onNoteCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-obsidian-900 rounded-xl border border-obsidian-800 w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-obsidian-800">
          <h2 className="text-lg font-semibold">Create New Note</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-obsidian-800 rounded-lg text-obsidian-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-obsidian-400 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-400 mb-1">
              Section
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSection(s)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    section === s 
                      ? 'border-accent-purple bg-accent-purple/10 text-accent-purple' 
                      : 'border-obsidian-700 hover:border-obsidian-600'
                  }`}
                >
                  <Folder size={16} />
                  <span className="text-sm">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-400 mb-1">
              Content (optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              rows={5}
              className="input font-mono text-sm resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}