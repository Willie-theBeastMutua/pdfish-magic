import React from "react";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface PageThumbnailProps {
  id: string;
  pageNumber: number;
  thumbnail: string;
  isCurrentPage: boolean;
  onPageSelect: () => void;
  onPageDelete?: (index: number) => void;
  index: number;
  dragHandleProps: any;
  draggableProps: any;
}

export const PageThumbnail = React.forwardRef<HTMLDivElement, PageThumbnailProps>(
  (
    {
      id,
      pageNumber,
      thumbnail,
      isCurrentPage,
      onPageSelect,
      onPageDelete,
      index,
      dragHandleProps,
      draggableProps,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        {...draggableProps}
        {...dragHandleProps}
        className={cn(
          "group relative aspect-[3/4] rounded-lg cursor-move overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all duration-200",
          isCurrentPage && "ring-2 ring-primary"
        )}
        onClick={onPageSelect}
      >
        <div className="w-full h-full bg-white">
          <iframe
            src={thumbnail}
            className="w-full h-full pointer-events-none"
            title={`Page ${pageNumber} thumbnail`}
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
          <span className="text-sm text-white">Page {pageNumber}</span>
          {onPageDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPageDelete(index);
              }}
              className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

PageThumbnail.displayName = "PageThumbnail";