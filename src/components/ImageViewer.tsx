import React from 'react';
import { Button } from './ui/button';
import { Download, RotateCw, Crop, Archive } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ImageViewerProps {
  selectedFile: string;
  onCompress?: () => void;
}

export const ImageViewer = ({ selectedFile, onCompress }: ImageViewerProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(selectedFile);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed-image' + selectedFile.substring(selectedFile.lastIndexOf('.'));
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b shadow-sm overflow-x-auto sticky top-0 z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button onClick={onCompress} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Archive className="w-4 h-4 mr-2" /> Compress
          </Button>
          <Button onClick={() => {}} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <RotateCw className="w-4 h-4 mr-2" /> Rotate
          </Button>
          <Button onClick={() => {}} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Crop className="w-4 h-4 mr-2" /> Crop
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors whitespace-nowrap bg-white/90">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg h-full p-4 flex items-center justify-center animate-fade-in">
          <img 
            src={selectedFile} 
            alt="Preview" 
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};