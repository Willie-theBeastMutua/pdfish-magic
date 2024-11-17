import React, { useState } from 'react';
import { Button } from './ui/button';
import { Merge, Scissors, Archive, RotateCw, Download } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';
import { SidePanel } from './pdf/SidePanel';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

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
  const [numPages, setNumPages] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedPages = items.map((item, index) => ({
      ...item,
      pageNumber: index + 1
    }));
    
    setPages(updatedPages);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b shadow-sm overflow-x-auto sticky top-0 z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button onClick={onMerge} variant="outline" size="sm" className="hover:bg-pink-500 hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Merge className="w-4 h-4 mr-2" /> Merge PDF
          </Button>
          <Button onClick={onSplit} variant="outline" size="sm" className="hover:bg-purple-500 hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Scissors className="w-4 h-4 mr-2" /> Split PDF
          </Button>
          <Button onClick={onCompress} variant="outline" size="sm" className="hover:bg-indigo-500 hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Archive className="w-4 h-4 mr-2" /> Compress
          </Button>
          <Button onClick={() => {}} variant="outline" size="sm" className="hover:bg-pink-500 hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <RotateCw className="w-4 h-4 mr-2" /> Rotate
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm" className="hover:bg-purple-500 hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Download className="w-4 h-4 mr-2" /> Save PDF
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
            <div className="bg-white/95 rounded-lg shadow-lg h-full animate-fade-in overflow-auto">
              <Document
                file={selectedFile}
                onLoadSuccess={({ numPages }: any) => setNumPages(numPages)}
                className="flex justify-center p-4"
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-lg text-purple-600">
                      Loading PDF...
                    </div>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                      Error loading PDF
                    </div>
                    <p className="text-gray-600">
                      Please make sure the file is a valid PDF document and try again
                    </p>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                  loading={
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-pulse text-purple-600">
                        Loading page...
                      </div>
                    </div>
                  }
                />
              </Document>
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
    </div>
  );
};