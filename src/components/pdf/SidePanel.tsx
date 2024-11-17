import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PageThumbnail } from "./PageThumbnail";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SidePanelProps {
  pages: Array<{ id: string; pageNumber: number; thumbnail: string }>;
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
  onPageDelete?: (index: number) => void;
  onDragEnd: (result: any) => void;
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
}

export const SidePanel = ({
  pages,
  currentPage,
  onPageSelect,
  onPageDelete,
  onDragEnd,
  isSidePanelOpen,
  onToggleSidePanel,
}: SidePanelProps) => {
  return (
    <>
      <button
        onClick={onToggleSidePanel}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-l-lg shadow-md z-10 hover:bg-gray-50 transition-colors"
        aria-label={isSidePanelOpen ? "Close side panel" : "Open side panel"}
      >
        <ChevronRight className={cn("w-4 h-4", isSidePanelOpen && "rotate-180")} />
      </button>

      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-80 bg-white/90 backdrop-blur-sm border-l transition-all duration-300 ease-in-out shadow-lg h-screen pt-16",
          isSidePanelOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 h-full">
          <h3 className="font-semibold mb-4 text-gray-700">Pages</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pdf-pages">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[calc(100vh-8rem)]"
                >
                  {pages.map((page, index) => (
                    <Draggable key={page.id} draggableId={page.id} index={index}>
                      {(provided, snapshot) => (
                        <PageThumbnail
                          {...page}
                          ref={provided.innerRef}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                          isCurrentPage={currentPage === page.pageNumber}
                          onPageSelect={() => onPageSelect(page.pageNumber)}
                          onPageDelete={onPageDelete}
                          index={index}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
};