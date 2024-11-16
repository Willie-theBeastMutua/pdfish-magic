import React, { useState } from 'react';
import { Button } from './ui/button';
import { Merge, Scissors, Archive, RotateCw, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import { SidePanel } from './pdf/SidePanel';

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
    
    // Update pages array with new order
    setPages(items.map((item, index) => ({
      ...item,
      pageNumber: index + 1,
    })));
    
    // Update current page to follow the dragged item
    if (currentPage === result.source.index + 1) {
      setCurrentPage(result.destination.index + 1);
    }
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

        <SidePanel
          pages={pages}
          currentPage={currentPage}
          onPageSelect={setCurrentPage}
          onPageDelete={onPageDelete}
          onDragEnd={handleDragEnd}
          isSidePanelOpen={isSidePanelOpen}
          onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        />
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