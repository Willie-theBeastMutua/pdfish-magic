import { useState, useEffect } from "react";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ActionPanel } from "@/components/ActionPanel";
import { PDFViewer } from "@/components/PDFViewer";
import { ImageViewer } from "@/components/ImageViewer";
import { File } from "@/types/files";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setSelectedFiles([newFiles[0].id]); // Auto-select the first uploaded file
    }
  };

  // Processing functions
  const handleMerge = async () => {
    toast({
      title: "Processing PDFs",
      description: "Merging selected PDF files...",
    });
    // Implement PDF merge logic here
  };

  const handleSplit = async () => {
    toast({
      title: "Processing PDF",
      description: "Splitting PDF into separate pages...",
    });
    // Implement PDF split logic here
  };

  const handleCompress = async () => {
    toast({
      title: "Processing File",
      description: "Compressing your file...",
    });
    // Implement compression logic here
  };

  // Find the selected file
  const selectedFile = files.find(f => f.id === selectedFiles[0]);
  const isPDF = selectedFile?.type?.includes('pdf');
  const isImage = selectedFile?.type?.includes('image');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {selectedFile ? (
        isPDF ? (
          <PDFViewer 
            selectedFile={selectedFile.url} 
            onCompress={handleCompress}
            onMerge={handleMerge}
            onSplit={handleSplit}
          />
        ) : isImage ? (
          <ImageViewer 
            selectedFile={selectedFile.url}
            onCompress={handleCompress} 
          />
        ) : null
      ) : (
        <div className="max-w-lg mx-auto px-4 py-8 space-y-8 animate-fade-in">
          <header className="text-center space-y-3">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Document Manager
            </h1>
            <p className="text-sm text-gray-600">
              Transform your documents effortlessly
            </p>
          </header>

          <FileUploader onFilesAdded={handleFilesAdded} />
          
          {files.length > 0 && (
            <div className="space-y-6 animate-fade-up">
              <ActionPanel 
                selectedFiles={selectedFiles}
                onMerge={handleMerge}
                onSplit={handleSplit}
                onCompress={handleCompress}
              />
              
              <FileList
                files={files}
                selectedFiles={selectedFiles}
                onSelectionChange={setSelectedFiles}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;