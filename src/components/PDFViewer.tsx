import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Trash2, FileDown, Lock, Scissors, Merge, Archive, ChevronRight, ChevronLeft, RotateCw, Download } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';

interface PDFViewerProps {
  selectedFile: string;
  onPageDelete?: (pageIndex: number) => void;
  onCompress?: () => void;
  onMerge?: () => void;
  onSplit?: () => void;
}

export const PDFViewer = ({ 
  selectedFile, 
  onPageDelete,
  onCompress,
  onMerge,
  onSplit 
}: PDFViewerProps) => {
  const [pages, setPages] = useState(Array.from({ length: 5 }, (_, i) => ({
    id: `page-${i + 1}`,
    pageNumber: i + 1,
    thumbnail: `${selectedFile}#page=${i + 1}`
  })));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPages(items);
    // Update current page view if needed
    setCurrentPage(result.destination.index + 1);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(selectedFile);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed-document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b shadow-sm overflow-x-auto sticky top-0 z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button onClick={onMerge} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Merge className="w-4 h-4 mr-2" /> Merge
          </Button>
          <Button onClick={onSplit} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Scissors className="w-4 h-4 mr-2" /> Split
          </Button>
          <Button onClick={onCompress} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Archive className="w-4 h-4 mr-2" /> Compress
          </Button>
          <Button onClick={() => {}} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <RotateCw className="w-4 h-4 mr-2" /> Rotate
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* PDF Preview */}
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidePanelOpen ? "pr-80" : "pr-0"
        )}>
          <div className="h-full p-4">
            <div className="bg-white rounded-lg shadow-lg h-full animate-fade-in">
              <iframe
                src={`${selectedFile}#page=${currentPage}`}
                className="w-full h-full rounded-lg"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>

        {/* Toggle Side Panel Button */}
        <button
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-l-lg shadow-md z-10 hover:bg-gray-50 transition-colors"
          aria-label={isSidePanelOpen ? "Close side panel" : "Open side panel"}
        >
          {isSidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Side Panel */}
        <div className={cn(
          "fixed right-0 top-0 bottom-0 w-80 bg-white/80 backdrop-blur-sm border-l transition-all duration-300 ease-in-out shadow-lg h-screen pt-16",
          isSidePanelOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-4 h-full">
            <h3 className="font-semibold mb-4 text-gray-700">Pages</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="pdf-pages">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 gap-3 h-[calc(100%-2rem)] overflow-y-auto"
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
                              "group relative aspect-[3/4] rounded-lg cursor-move overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all duration-200",
                              snapshot.isDragging && "shadow-lg scale-105",
                              currentPage === page.pageNumber && "ring-2 ring-primary"
                            )}
                            onClick={() => setCurrentPage(page.pageNumber)}
                          >
                            <iframe
                              src={page.thumbnail}
                              className="w-full h-full scale-[0.99] origin-top-left bg-white"
                              title={`Page ${page.pageNumber} thumbnail`}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                              <span className="text-sm text-white">Page {page.pageNumber}</span>
                              {onPageDelete && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onPageDelete(index);
                                  }}
                                  className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-white/20 transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t py-3 px-4 shadow-lg">
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