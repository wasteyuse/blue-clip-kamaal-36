
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the PayoutMethod interface
interface PayoutMethod {
  id: string;
  user_id: string;
  method_type: 'UPI' | 'BANK';
  details: string;
  is_default: boolean;
}

export function PayoutMethods() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [methodType, setMethodType] = useState<'UPI' | 'BANK'>('UPI');
  const [details, setDetails] = useState('');

  const { data: payoutMethods, refetch } = useQuery({
    queryKey: ['payoutMethods', user?.id],
    queryFn: async () => {
      // Using a direct SQL query with RPC to bypass type checking
      const { data, error } = await supabase
        .rpc('get_user_payout_methods', { user_id_param: user?.id }) as any;

      if (error) {
        console.error("Error fetching payout methods:", error);
        throw error;
      }
      return data as PayoutMethod[];
    },
    enabled: !!user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Using a direct SQL query with RPC to bypass type checking
      const { error } = await supabase
        .rpc('add_payout_method', {
          user_id_param: user?.id,
          method_type_param: methodType,
          details_param: details,
          is_default_param: !payoutMethods?.length
        }) as any;

      if (error) throw error;
      
      toast.success('Payout method added successfully');
      setOpen(false);
      setDetails('');
      refetch();
    } catch (error) {
      console.error('Error adding payout method:', error);
      toast.error('Failed to add payout method');
    }
  };

  const setDefaultMethod = async (methodId: string) => {
    try {
      // Using a direct SQL query with RPC to bypass type checking
      const { error } = await supabase
        .rpc('set_default_payout_method', {
          user_id_param: user?.id,
          method_id_param: methodId
        }) as any;

      if (error) throw error;
      
      toast.success('Default payout method updated');
      refetch();
    } catch (error) {
      console.error('Error updating default method:', error);
      toast.error('Failed to update default method');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Payout Methods</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Method</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payout Method</DialogTitle>
              <DialogDescription>
                Add a new UPI ID or bank account for receiving payouts.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="method-type">Method Type</Label>
                <Select
                  value={methodType}
                  onValueChange={(value: 'UPI' | 'BANK') => setMethodType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="BANK">Bank Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details">
                  {methodType === 'UPI' ? 'UPI ID' : 'Bank Account Details'}
                </Label>
                <Input
                  id="details"
                  placeholder={methodType === 'UPI' ? 'name@upi' : 'IFSC, Account Number'}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit">Add Method</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!payoutMethods || payoutMethods.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No payout methods added yet
        </div>
      ) : (
        <div className="space-y-2">
          {payoutMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{method.method_type}</div>
                <div className="text-sm text-muted-foreground">{method.details}</div>
              </div>
              <Button
                variant={method.is_default ? "default" : "outline"}
                size="sm"
                onClick={() => !method.is_default && setDefaultMethod(method.id)}
              >
                {method.is_default ? "Default" : "Make Default"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
