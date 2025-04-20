
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HowItWorksPage() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">How It Works</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">For Content Creators</h2>
          <p className="text-gray-600">Join BlueHustle and start monetizing your content through our platform. Share your expertise, earn from views, and build your audience.</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Simple 3-Step Process</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">1. Apply</h3>
              <p className="text-gray-600 text-sm">Submit your application and showcase your expertise.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">2. Create</h3>
              <p className="text-gray-600 text-sm">Upload your content and reach your target audience.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">3. Earn</h3>
              <p className="text-gray-600 text-sm">Get paid for your views and affiliate conversions.</p>
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/apply')} size="lg">
            Apply Now
          </Button>
          <Button variant="outline" onClick={() => navigate('/creators')} size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
