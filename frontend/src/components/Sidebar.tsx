import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  FolderKanban, 
  BookOpen, 
  FileText,
  Network,
  Plus,
  Settings,
  Sparkles
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
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  useEffect(() => {
    // Fetch note counts for each section
    Promise.all(
      SECTIONS.map(async (section) => {
        try {
          const res = await fetch(`/api/notes?section=${section}`);
          const notes = await res.json();
          return [section, notes.length];
        } catch {
          return [section, 0];
        }
      })
    ).then((counts) => {
      setNoteCounts(Object.fromEntries(counts));
    });
  }, []);

  return (
    <div className="w-full h-full bg-surface-secondary border-r border-border-subtle flex flex-col">
      {/* Header / Logo Area */}
      <div className="p-4 border-b border-border-subtle">
        <div 
          className="flex items-center gap-3 mb-5 px-1"
          onMouseEnter={() => setIsHoveringLogo(true)}
          onMouseLeave={() => setIsHoveringLogo(false)}
        >
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-accent-purple to-accent-blue
            shadow-glow-purple transition-all duration-300
            ${isHoveringLogo ? 'scale-110 shadow-glow-purple-lg' : ''}
          `}>
            <Sparkles size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-gradient">
              Second Brain
            </span>
            <span className="text-xs text-content-muted font-medium">
              Knowledge Base
            </span>
          </div>
        </div>
        
        <button 
          onClick={onNewNote}
          className="w-full btn-primary group"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90" />
          <span>New Note</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-3">
        {/* Graph View */}
        <button
          onClick={onGraphView}
          className={`w-full nav-item mb-1 ${isGraphView ? 'active' : ''}`}
        >
          <div className={`
            p-1.5 rounded-lg transition-all duration-200
            ${isGraphView ? 'bg-accent-purple/20' : 'bg-obsidian-800/50'}
          `}>
            <Network size={16} className={isGraphView ? 'text-accent-purple-light' : 'text-obsidian-400'} />
          </div>
          <span>Graph View</span>
          {isGraphView && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-purple shadow-glow-purple" />
          )}
        </button>

        <div className="nav-section-header mt-5 mb-2">
          Collections
        </div>

        {/* Sections */}
        <div className="space-y-0.5">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section;
            const color = SECTION_COLORS[section];
            
            return (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`w-full nav-item ${isActive ? 'active' : ''}`}
              >
                <div 
                  className={`
                    p-1.5 rounded-lg transition-all duration-200
                    ${isActive ? 'bg-opacity-20' : 'bg-obsidian-800/50'}
                  `}
                  style={{ 
                    backgroundColor: isActive ? `${color}20` : undefined,
                    color: isActive ? color : undefined
                  }}
                >
                  <span style={{ color: isActive ? undefined : color }}>
                    {sectionIcons[section]}
                  </span>
                </div>
                <span className="flex-1 text-left font-medium">{section}</span>
                {noteCounts[section] > 0 && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-accent-purple/20 text-accent-purple-light' 
                      : 'bg-obsidian-800 text-obsidian-500'}
                  `}>
                    {noteCounts[section]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border-subtle">
        <button className="w-full nav-item text-obsidian-400">
          <div className="p-1.5 rounded-lg bg-obsidian-800/50">
            <Settings size={16} />
          </div>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
