import { useState, useEffect, useCallback } from 'react';
import { Section, NoteMetadata } from '@/types';
import Sidebar from '@/components/Sidebar';
import NoteList from '@/components/NoteList';
import NoteEditor from '@/components/NoteEditor';
import GraphView from '@/components/GraphView';
import NewNoteModal from '@/components/NewNoteModal';

const SIDEBAR_WIDTH = 240;
const NOTELIST_WIDTH = 320;

export default function App() {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isGraphView, setIsGraphView] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_WIDTH);
  const [noteListWidth, setNoteListWidth] = useState(NOTELIST_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingNoteList, setIsResizingNoteList] = useState(false);

  // Handle wiki-link clicks
  useEffect(() => {
    const handleWikiLink = async (e: CustomEvent<string>) => {
      const title = e.detail;
      try {
        // Search for note with this title
        const res = await fetch(`/api/notes/search?q=${encodeURIComponent(title)}`);
        const notes = await res.json();
        const matchingNote = notes.find((n: NoteMetadata) => 
          n.title.toLowerCase() === title.toLowerCase()
        );
        if (matchingNote) {
          setSelectedNoteId(matchingNote.id);
          setIsGraphView(false);
        }
      } catch (error) {
        console.error('Failed to open wiki-link:', error);
      }
    };

    window.addEventListener('open-wiki-link' as any, handleWikiLink);
    return () => window.removeEventListener('open-wiki-link' as any, handleWikiLink);
  }, []);

  // Resizing handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        setSidebarWidth(Math.max(180, Math.min(400, e.clientX)));
      }
      if (isResizingNoteList) {
        const newWidth = e.clientX - sidebarWidth;
        setNoteListWidth(Math.max(240, Math.min(500, newWidth)));
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingNoteList(false);
    };

    if (isResizingSidebar || isResizingNoteList) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingNoteList, sidebarWidth]);

  const handleSectionChange = (section: Section | null) => {
    setActiveSection(section);
    setIsGraphView(false);
    setSelectedNoteId(null);
  };

  const handleGraphView = () => {
    setIsGraphView(true);
    setSelectedNoteId(null);
  };

  const handleSelectNote = (note: NoteMetadata) => {
    setSelectedNoteId(note.id);
    setIsGraphView(false);
  };

  const handleNoteUpdated = () => {
    // Trigger refresh of note list
    setSelectedNoteId(prev => prev);
  };

  return (
    <div className="h-screen w-screen bg-obsidian-950 flex overflow-hidden">
      {/* Sidebar */}
      <div 
        className="flex-shrink-0 h-full"
        style={{ width: sidebarWidth }}
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          onGraphView={handleGraphView}
          isGraphView={isGraphView}
          onNewNote={() => setIsNewNoteModalOpen(true)}
        />
      </div>

      {/* Sidebar Resize Handle */}
      <div
        className="w-1 h-full cursor-col-resize hover:bg-accent-purple/50 transition-colors"
        onMouseDown={() => setIsResizingSidebar(true)}
      />

      {/* Note List */}
      {!isGraphView && (
        <>
          <div 
            className="flex-shrink-0 h-full border-r border-obsidian-800"
            style={{ width: noteListWidth }}
          >
            <NoteList
              section={activeSection}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
            />
          </div>

          {/* Note List Resize Handle */}
          <div
            className="w-1 h-full cursor-col-resize hover:bg-accent-purple/50 transition-colors"
            onMouseDown={() => setIsResizingNoteList(true)}
          />
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden">
        {isGraphView ? (
          <GraphView onNodeClick={setSelectedNoteId} />
        ) : (
          <NoteEditor
            noteId={selectedNoteId}
            onNoteUpdated={handleNoteUpdated}
          />
        )}
      </div>

      {/* Modals */}
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        onNoteCreated={handleNoteUpdated}
      />
    </div>
  );
}