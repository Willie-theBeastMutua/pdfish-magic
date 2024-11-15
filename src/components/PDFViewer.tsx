import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Trash2, FileDown, Lock, Scissors, Merge, Archive, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  selectedFile: string;
  onPageDelete?: (pageIndex: number) => void;
}

export const PDFViewer = ({ selectedFile, onPageDelete }: PDFViewerProps) => {
  const [pages, setPages] = useState(Array.from({ length: 5 }, (_, i) => ({
    id: `page-${i + 1}`,
    pageNumber: i + 1,
    thumbnail: `${selectedFile}#page=${i + 1}`
  })));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPages(items);
    // Update current page if it was the one being dragged
    if (currentPage === result.source.index + 1) {
      setCurrentPage(result.destination.index + 1);
    }
    console.log('Pages reordered:', items);
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm overflow-x-auto">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <FileDown className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <Lock className="w-4 h-4 mr-2" /> Protect
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <Scissors className="w-4 h-4 mr-2" /> Split
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <Merge className="w-4 h-4 mr-2" /> Merge
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <Archive className="w-4 h-4 mr-2" /> Compress
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* PDF Preview */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 min-h-[800px] animate-fade-in">
            <iframe
              src={`${selectedFile}#page=${currentPage}`}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        </div>

        {/* Toggle Side Panel Button */}
        <button
          onClick={toggleSidePanel}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-md z-10 hover:bg-gray-50 transition-colors"
        >
          {isSidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Side Panel */}
        <div className={cn(
          "w-64 bg-white border-l overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg",
          !isSidePanelOpen && "transform translate-x-full md:transform-none"
        )}>
          <div className="p-4">
            <h3 className="font-semibold mb-4 text-gray-700">Pages</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="pdf-pages">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {pages.map((page, index) => (
                      <Draggable
                        key={page.id}
                        draggableId={page.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "flex flex-col p-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-all duration-200",
                              snapshot.isDragging && "shadow-lg scale-105",
                              currentPage === page.pageNumber && "ring-2 ring-primary"
                            )}
                            onClick={() => setCurrentPage(page.pageNumber)}
                          >
                            {/* Thumbnail Preview */}
                            <div className="relative w-full aspect-[3/4] mb-2 bg-white rounded border overflow-hidden">
                              <iframe
                                src={page.thumbnail}
                                className="w-full h-full pointer-events-none transform scale-[0.25] origin-top-left"
                                title={`Page ${page.pageNumber} thumbnail`}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Page {page.pageNumber}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPageDelete?.(index);
                                }}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {pages.length}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentPage(Math.min(pages.length, currentPage + 1))}
            disabled={currentPage === pages.length}
            className="hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};