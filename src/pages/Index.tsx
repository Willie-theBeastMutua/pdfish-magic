import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ActionPanel } from "@/components/ActionPanel";
import { PDFViewer } from "@/components/PDFViewer";
import { File } from "@/types/files";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const selectedPDFFile = selectedFiles.length === 1 && files.find(f => 
    f.id === selectedFiles[0] && f.type.includes('pdf')
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {selectedPDFFile ? (
        <PDFViewer selectedFile={selectedPDFFile.url} />
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
                onMerge={() => {/* Implement in next iteration */}}
                onSplit={() => {/* Implement in next iteration */}}
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