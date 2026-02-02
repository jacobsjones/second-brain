import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  FolderKanban, 
  BookOpen, 
  FileText,
  Network,
  Plus,
  Settings
} from 'lucide-react';
import { Section, SECTIONS, SECTION_COLORS } from '@/types';

interface SidebarProps {
  activeSection: string | null;
  onSectionChange: (section: Section | null) => void;
  onGraphView: () => void;
  isGraphView: boolean;
  onNewNote: () => void;
}

const sectionIcons: Record<Section, React.ReactNode> = {
  Ideas: <Lightbulb size={18} />,
  Trading: <TrendingUp size={18} />,
  Projects: <FolderKanban size={18} />,
  Journal: <BookOpen size={18} />,
  Articles: <FileText size={18} />,
};

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  onGraphView, 
  isGraphView,
  onNewNote 
}: SidebarProps) {
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Fetch note counts for each section
    Promise.all(
      SECTIONS.map(async (section) => {
        const res = await fetch(`/api/notes?section=${section}`);
        const notes = await res.json();
        return [section, notes.length];
      })
    ).then((counts) => {
      setNoteCounts(Object.fromEntries(counts));
    });
  }, []);

  return (
    <div className="w-full h-full bg-obsidian-900 border-r border-obsidian-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-obsidian-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-blue rounded-lg flex items-center justify-center">
            <Network size={20} className="text-white" />
          </div>
          <span className="font-semibold text-lg">Second Brain</span>
        </div>
        
        <button 
          onClick={onNewNote}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          New Note
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Graph View */}
        <button
          onClick={onGraphView}
          className={`w-full nav-item mb-2 ${isGraphView ? 'active' : ''}`}
        >
          <Network size={18} />
          <span>Graph View</span>
        </button>

        <div className="mt-4 mb-2 px-3 text-xs font-medium text-obsidian-500 uppercase tracking-wider">
          Sections
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => onSectionChange(section)}
            className={`w-full nav-item mb-1 ${activeSection === section ? 'active' : ''}`}
          >
            <span style={{ color: SECTION_COLORS[section] }}>
              {sectionIcons[section]}
            </span>
            <span className="flex-1 text-left">{section}</span>
            {noteCounts[section] > 0 && (
              <span className="text-xs text-obsidian-500 bg-obsidian-800 px-2 py-0.5 rounded-full">
                {noteCounts[section]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-obsidian-800">
        <button className="w-full nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}