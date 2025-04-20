
import { Button } from "@/components/ui/button";
import { Ban, Check } from "lucide-react";

interface UserActionsProps {
  userId: string;
  isBanned?: boolean;
  onToggleCreator: (userId: string, status: boolean) => Promise<void>;
  onToggleAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
  onToggleBan: (userId: string, isBanned: boolean) => Promise<void>;
  isCreator?: boolean;
  isAdmin?: boolean;
}

export function UserActions({ 
  userId, 
  isBanned, 
  onToggleCreator, 
  onToggleAdmin, 
  onToggleBan,
  isCreator,
  isAdmin
}: UserActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant={isCreator ? "destructive" : "outline"} 
        size="sm"
        onClick={() => onToggleCreator(userId, isCreator || false)}
      >
        {isCreator ? 'Disable Creator' : 'Enable Creator'}
      </Button>
      
      <Button 
        variant={isAdmin ? "destructive" : "default"} 
        size="sm"
        onClick={() => onToggleAdmin(userId, isAdmin || false)}
      >
        {isAdmin ? 'Remove Admin' : 'Make Admin'}
      </Button>
      
      <Button 
        variant={isBanned ? "outline" : "destructive"} 
        size="sm"
        onClick={() => onToggleBan(userId, isBanned || false)}
      >
        {isBanned ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Unban
          </>
        ) : (
          <>
            <Ban className="h-4 w-4 mr-1" />
            Ban
          </>
        )}
      </Button>
    </div>
  );
}
