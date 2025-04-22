
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
  asset: {
    type?: string;
    title?: string;
    file_url?: string;
  } | null;
}

export function PreviewDialog({ open, onOpenChange, asset }: PreviewDialogProps) {
  if (!asset) return null;

  const renderPreview = () => {
    const url = `https://wrvkgerfvxijlvxzstnc.supabase.co/storage/v1/object/public/assets/${asset.file_url}`;

    switch(asset.type?.toLowerCase()) {
      case 'video':
        return (
          <video 
            src={url} 
            controls 
            className="max-h-[600px] w-full object-contain"
          />
        );
      case 'image':
        return (
          <img 
            src={url} 
            alt={asset.title} 
            className="max-h-[600px] w-full object-contain"
          />
        );
      default:
        return (
          <div className="text-center p-4">
            <p className="mb-2">Preview not available for this type of asset</p>
            <a 
              href={url}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Open in new tab
            </a>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{asset.title}</DialogTitle>
          <DialogDescription>
            Asset Preview
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
