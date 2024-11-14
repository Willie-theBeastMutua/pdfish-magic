import { 
  Merge, 
  Scissors, 
  RotateCw, 
  FileDown, 
  ImageDown, 
  FileText, 
  Archive, 
  Lock,
  Crop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionPanelProps {
  selectedFiles: string[];
  onMerge: () => void;
  onSplit: () => void;
}

export const ActionPanel = ({
  selectedFiles,
  onMerge,
  onSplit,
}: ActionPanelProps) => {
  const hasSelection = selectedFiles.length > 0;
  const isPDF = selectedFiles.every(file => file.endsWith('.pdf'));
  const isImage = selectedFiles.every(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
  
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 gap-4 border border-gray-100">
      <div className="text-sm text-gray-600">
        {hasSelection ? (
          <span>{selectedFiles.length} file(s) selected</span>
        ) : (
          <span>Select files to perform actions</span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {/* PDF Actions */}
        {isPDF && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none hover:bg-primary hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>PDF Operations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onMerge} disabled={selectedFiles.length < 2}>
                <Merge className="w-4 h-4 mr-2" /> Merge PDFs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSplit} disabled={selectedFiles.length !== 1}>
                <Scissors className="w-4 h-4 mr-2" /> Split PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" /> Compress PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock className="w-4 h-4 mr-2" /> Protect PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="w-4 h-4 mr-2" /> Convert to Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Image Actions */}
        {isImage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none hover:bg-primary hover:text-white transition-colors"
              >
                <ImageDown className="w-4 h-4 mr-2" />
                Image Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Image Operations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" /> Compress Image
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RotateCw className="w-4 h-4 mr-2" /> Rotate Image
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="w-4 h-4 mr-2" /> Convert Format
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Crop className="w-4 h-4 mr-2" /> Crop Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};