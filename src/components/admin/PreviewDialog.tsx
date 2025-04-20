
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: { url: string; type: string } | null;
  creatorName?: string;
}

export function PreviewDialog({ open, onOpenChange, content, creatorName }: PreviewDialogProps) {
  const renderPreviewContent = () => {
    if (!content) return null;
    
    if (content.type?.toLowerCase() === 'video') {
      return (
        <video 
          src={content.url} 
          controls 
          className="max-h-[500px] w-full object-contain"
        />
      );
    } else if (content.type?.toLowerCase() === 'image') {
      return (
        <img 
          src={content.url} 
          alt="Content preview" 
          className="max-h-[500px] w-full object-contain"
        />
      );
    } else {
      return (
        <div className="p-4 text-center">
          <p>Preview not available for this content type</p>
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline mt-2 block"
          >
            Open content URL
          </a>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Content Preview</DialogTitle>
          <DialogDescription>
            Previewing content by {creatorName || 'Unknown Creator'}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          {renderPreviewContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
