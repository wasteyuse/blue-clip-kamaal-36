
import { Button } from "@/components/ui/button";

interface PayoutMethodCardProps {
  id: string;
  methodType: string;
  details: string;
  isDefault: boolean;
  onSetDefault: (id: string) => void;
}

export function PayoutMethodCard({ id, methodType, details, isDefault, onSetDefault }: PayoutMethodCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div>
        <div className="font-medium">{methodType}</div>
        <div className="text-sm text-muted-foreground">{details}</div>
      </div>
      <Button
        variant={isDefault ? "default" : "outline"}
        size="sm"
        onClick={() => !isDefault && onSetDefault(id)}
      >
        {isDefault ? "Default" : "Make Default"}
      </Button>
    </div>
  );
}
