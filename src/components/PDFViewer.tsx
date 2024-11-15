import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Trash2, FileDown, Lock, Scissors, Merge, Archive } from 'lucide-react';
import { Button } from './ui/button';

interface PDFViewerProps {
  selectedFile: string;
  onPageDelete?: (pageIndex: number) => void;
}

export const PDFViewer = ({ selectedFile, onPageDelete }: PDFViewerProps) => {
  // Mock pages array - in real implementation this would come from PDF parsing
  const pages = Array.from({ length: 5 }, (_, i) => ({
    id: `page-${i + 1}`,
    pageNumber: i + 1
  }));

  const handleDragEnd = (result: any) => {
    // Implement drag and drop logic here
    console.log('Page reordered:', result);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
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
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Preview */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 min-h-[800px]">
            {/* PDF content will go here */}
            <iframe
              src={selectedFile}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-64 bg-white border-l overflow-y-auto p-4">
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
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span>Page {page.pageNumber}</span>
                          <button
                            onClick={() => onPageDelete?.(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="flex justify-around items-center">
          <Button variant="ghost" size="sm">
            <FileDown className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Lock className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Scissors className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Merge className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Archive className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};