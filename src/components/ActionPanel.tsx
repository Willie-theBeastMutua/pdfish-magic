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
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-gray-600">
        {hasSelection ? (
          <span>{selectedFiles.length} file(s) selected</span>
        ) : (
          <span>Select files to perform actions</span>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={selectedFiles.length < 2}
          onClick={onMerge}
        >
          <Merge className="w-4 h-4 mr-2" />
          Merge
        </Button>
        <Button
          variant="outline"
          size="sm"
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