
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KycDocLinkProps {
  url: string | null;
}

export function KycDocLink({ url }: KycDocLinkProps) {
  if (!url) {
    return <span className="text-gray-500 text-sm">No document</span>;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="gap-2"
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <FileText className="h-4 w-4" />
        <span>View</span>
      </a>
    </Button>
  );
}
