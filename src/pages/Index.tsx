import { useState } from "react";
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
    console.log('Files added:', newFiles);
  };

  const selectedFile = selectedFiles.length === 1 && files.find(f => f.id === selectedFiles[0]);
  const isPDF = selectedFile?.type.includes('pdf');
  const isImage = selectedFile?.type.includes('image');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {selectedFile ? (
        isPDF ? (
          <PDFViewer selectedFile={selectedFile.url} />
        ) : isImage ? (
          <ImageViewer selectedFile={selectedFile.url} />
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
                onMerge={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
                onSplit={() => {
                  toast({
                    title: "Coming Soon",
                    description: "This feature will be available soon!",
                  });
                }}
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