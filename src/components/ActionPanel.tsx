import { Merge, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 gap-4 border border-gray-100">
      <div className="text-sm text-gray-600">
        {hasSelection ? (
          <span>{selectedFiles.length} file(s) selected</span>
        ) : (
          <span>Select files to perform actions</span>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none hover:bg-primary hover:text-white transition-colors"
          disabled={selectedFiles.length < 2}
          onClick={onMerge}
        >
          <Merge className="w-4 h-4 mr-2" />
          Merge
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none hover:bg-primary hover:text-white transition-colors"
          disabled={selectedFiles.length !== 1}
          onClick={onSplit}
        >
          <Scissors className="w-4 h-4 mr-2" />
          Split
        </Button>
      </div>
    </div>
  );
};