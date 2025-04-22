
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPayoutMethodDialogProps {
  onSubmit: (methodType: 'UPI' | 'BANK', details: string) => Promise<void>;
}

export function AddPayoutMethodDialog({ onSubmit }: AddPayoutMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [methodType, setMethodType] = useState<'UPI' | 'BANK'>('UPI');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(methodType, details);
    setOpen(false);
    setDetails('');
  };

  return (
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
  );
}
