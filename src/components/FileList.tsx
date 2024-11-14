import { File } from "@/types/files";
import { FileIcon, ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FileListProps {
  files: File[];
  selectedFiles: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const FileList = ({
  files,
  selectedFiles,
  onSelectionChange,
}: FileListProps) => {
  const toggleFile = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      onSelectionChange(selectedFiles.filter((id) => id !== fileId));
    } else {
      onSelectionChange([...selectedFiles, fileId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 hover:shadow-md transition-shadow animate-fade-up"
        >
          <Checkbox
            checked={selectedFiles.includes(file.id)}
            onCheckedChange={() => toggleFile(file.id)}
          />
          {file.type.includes("pdf") ? (
            <FileIcon className="w-8 h-8 text-primary" />
          ) : (
            <ImageIcon className="w-8 h-8 text-primary" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};