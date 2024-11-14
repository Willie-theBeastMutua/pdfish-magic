import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ActionPanel } from "@/components/ActionPanel";
import { toast } from "sonner";
import { File } from "@/types/files";

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) uploaded successfully`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Document Manager</h1>
          <p className="text-sm text-gray-600">Manage your PDFs and images with ease</p>
        </header>

        <FileUploader onFilesAdded={handleFilesAdded} />
        
        {files.length > 0 && (
          <div className="space-y-4 animate-fade-up">
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
    </div>
  );
};

export default Index;