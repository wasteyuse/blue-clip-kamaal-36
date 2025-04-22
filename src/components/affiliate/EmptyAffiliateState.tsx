
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export function EmptyAffiliateState() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-6 text-center">
      <div className="inline-flex mx-auto mb-4 p-3 rounded-full bg-blue-100">
        <Link className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-blue-800 mb-2">No Active Affiliate Promotions</h3>
      <p className="text-blue-700 mb-4">You don't have any approved affiliate promotions yet.</p>
      <Button variant="outline" className="bg-white" onClick={() => window.location.href = '/dashboard/submit'}>
        Create Content to Earn
      </Button>
    </div>
  );
}
