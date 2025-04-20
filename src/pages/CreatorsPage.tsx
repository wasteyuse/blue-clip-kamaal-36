
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CreatorsPage() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">For Creators</h1>
      <div className="space-y-8 max-w-3xl">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why Choose BlueHustle?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Fair Compensation</h3>
              <p className="text-gray-600">Earn competitive rates for your content and expertise.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Wide Reach</h3>
              <p className="text-gray-600">Access a growing audience of engaged users.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Multiple Revenue Streams</h3>
              <p className="text-gray-600">Earn through views and affiliate marketing.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Support & Resources</h3>
              <p className="text-gray-600">Get the tools and guidance you need to succeed.</p>
            </div>
          </div>
        </section>

        <Button onClick={() => navigate('/apply')} size="lg">
          Start Creating Today
        </Button>
      </div>
    </div>
  );
}
