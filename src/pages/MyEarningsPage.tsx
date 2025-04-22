
import React from 'react';
import { EarningsContent } from "@/components/earnings/EarningsContent";
import { useAuth } from "@/contexts/AuthContext";

export default function MyEarningsPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view your earnings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EarningsContent />
    </div>
  );
}
