import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { File } from "@/types/files";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
}

export const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: any[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    onFilesAdded(newFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 touch-manipulation bg-white/80 backdrop-blur-sm",
        isDragActive 
          ? "border-primary bg-primary/5 scale-[0.99]" 
          : "border-gray-200 hover:border-primary hover:scale-[0.99]"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-primary animate-bounce" />
      <p className="text-base font-medium text-gray-700">
        {isDragActive ? (
          "Drop your files here..."
        ) : (
          "Tap to select files"
        )}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Supports PDF, PNG, JPG and GIF files
      </p>
    </div>
  );
};