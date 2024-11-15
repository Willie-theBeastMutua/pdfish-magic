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
    thumbnail: `${selectedFile}#page=${i + 1}` // This will work with PDF URLs
  })));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPages(items);
    console.log('Pages reordered:', items);
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b overflow-x-auto">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button variant="outline" size="sm">
            <Lock className="w-4 h-4 mr-2" /> Protect
          </Button>
          <Button variant="outline" size="sm">
            <Scissors className="w-4 h-4 mr-2" /> Split
          </Button>
          <Button variant="outline" size="sm">
            <Merge className="w-4 h-4 mr-2" /> Merge
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" /> Compress
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* PDF Preview */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 min-h-[800px]">
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
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-md z-10 md:hidden"
        >
          {isSidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Side Panel */}
        <div className={cn(
          "w-64 bg-white border-l overflow-y-auto transition-transform duration-300 ease-in-out",
          !isSidePanelOpen && "transform translate-x-full md:transform-none"
        )}>
          <div className="p-4">
            <h3 className="font-semibold mb-4">Pages</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="pdf-pages">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {pages.map((page, index) => (
                      <Draggable
                        key={page.id}
                        draggableId={page.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex flex-col p-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                            onClick={() => setCurrentPage(page.pageNumber)}
                          >
                            {/* Thumbnail Preview */}
                            <div className="relative w-full aspect-[3/4] mb-2 bg-white rounded border">
                              <iframe
                                src={page.thumbnail}
                                className="w-full h-full pointer-events-none"
                                title={`Page ${page.pageNumber} thumbnail`}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Page {page.pageNumber}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPageDelete?.(index);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="flex justify-around items-center">
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm">Page {currentPage} of {pages.length}</span>
          <Button variant="ghost" size="sm" onClick={() => setCurrentPage(Math.min(pages.length, currentPage + 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};