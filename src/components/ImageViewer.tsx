import React from 'react';
import { FileDown, Crop, RotateCw, Archive } from 'lucide-react';
import { Button } from './ui/button';

interface ImageViewerProps {
  selectedFile: string;
}

export const ImageViewer = ({ selectedFile }: ImageViewerProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm overflow-x-auto">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <FileDown className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <Crop className="w-4 h-4 mr-2" /> Crop
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <RotateCw className="w-4 h-4 mr-2" /> Rotate
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white transition-colors">
            <Archive className="w-4 h-4 mr-2" /> Compress
          </Button>
        </div>
      </div>

      {/* Image Preview */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 min-h-[800px] flex items-center justify-center animate-fade-in">
          <img
            src={selectedFile}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};