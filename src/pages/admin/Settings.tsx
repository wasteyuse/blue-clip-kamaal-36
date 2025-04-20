import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentSettingsPage() {
  const { toast } = useToast();
  
  // Payment method settings
  const [bankEnabled, setBankEnabled] = useState(true);
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  
  // Payment limits
  const [minPayout, setMinPayout] = useState("500");
  const [maxPayout, setMaxPayout] = useState("50000");
  
  // Commission rates
  const [videoCommissionRate, setVideoCommissionRate] = useState("1");
  const [imageCommissionRate, setImageCommissionRate] = useState("0.8");
  const [productCommissionRate, setProductCommissionRate] = useState("20");
  
  // Payment frequency
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");
  
  // Verification requirements
  const [requireIDVerification, setRequireIDVerification] = useState(true);
  const [requirePANVerification, setRequirePANVerification] = useState(true);
  
  // State for saving
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving to the database
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Payment settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-gray-500" />
        <h1 className="text-3xl font-bold">Payment Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Configure which payment methods are available for creators to receive payments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bank-transfer">Bank Transfer</Label>
                <p className="text-sm text-gray-500">Direct bank transfers (NEFT/IMPS/RTGS)</p>
              </div>
              <Switch
                id="bank-transfer"
                checked={bankEnabled}
                onCheckedChange={setBankEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="upi">UPI</Label>
                <p className="text-sm text-gray-500">Unified Payments Interface</p>
              </div>
              <Switch
                id="upi"
                checked={upiEnabled}
                onCheckedChange={setUpiEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="paypal">PayPal</Label>
                <p className="text-sm text-gray-500">International payments via PayPal</p>
              </div>
              <Switch
                id="paypal"
                checked={paypalEnabled}
                onCheckedChange={setPaypalEnabled}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Limits</CardTitle>
            <CardDescription>
              Set minimum and maximum payout amounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min-payout">Minimum Payout Amount (₹)</Label>
              <Input
                id="min-payout"
                type="number"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
              />
              <p className="text-sm text-gray-500">Creators must accumulate at least this amount before requesting a payout</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-payout">Maximum Payout Amount (₹)</Label>
              <Input
                id="max-payout"
                type="number"
                value={maxPayout}
                onChange={(e) => setMaxPayout(e.target.value)}
              />
              <p className="text-sm text-gray-500">Maximum amount that can be withdrawn in a single payout request</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Commission Rates</CardTitle>
            <CardDescription>
              Configure earnings rates for different content types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-rate">Video Content (₹ per 1000 views)</Label>
              <Input
                id="video-rate"
                type="number"
                value={videoCommissionRate}
                onChange={(e) => setVideoCommissionRate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-rate">Image Content (₹ per 1000 views)</Label>
              <Input
                id="image-rate"
                type="number"
                value={imageCommissionRate}
                onChange={(e) => setImageCommissionRate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-rate">Product Content (% commission on sales)</Label>
              <Input
                id="product-rate"
                type="number"
                value={productCommissionRate}
                onChange={(e) => setProductCommissionRate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
            <CardDescription>
              Configure payment frequency and verification requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-frequency">Payment Frequency</Label>
              <Select
                value={paymentFrequency}
                onValueChange={setPaymentFrequency}
              >
                <SelectTrigger id="payment-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">How often automatic payouts are processed</p>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-4">
              <Label>Verification Requirements</Label>
              
              <div className="flex items-center justify-between">
                <div>
                  <p>Require ID Verification</p>
                  <p className="text-sm text-gray-500">Creators must verify identity before payouts</p>
                </div>
                <Switch
                  checked={requireIDVerification}
                  onCheckedChange={setRequireIDVerification}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p>Require PAN Card</p>
                  <p className="text-sm text-gray-500">Creators must provide PAN card for tax purposes</p>
                </div>
                <Switch
                  checked={requirePANVerification}
                  onCheckedChange={setRequirePANVerification}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
