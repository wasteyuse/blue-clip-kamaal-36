
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMEYzNDYwIiBzdHJva2Utd2lkdGg9Ii41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIuMiI+PGNpcmNsZSBjeD0iNDAwIiBjeT0iNDAwIiByPSI0MCIvPjxjaXJjbGUgY3g9IjgwMCIgY3k9IjQwMCIgcj0iNDAiLz48Y2lyY2xlIGN4PSIxMjAwIiBjeT0iNDAwIiByPSI0MCIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <Badge variant="blue" className="mb-4">For Indian Creators</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
                Monetize Your Content & Earn With Every View
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Join BlueHustle and earn ₹1 per 1000 views plus 20% commission on affiliate sales. Create content with admin-provided assets and start earning.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/apply')}>
                  Apply as Creator
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/how-it-works')}>
                  Learn How It Works
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-2/5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur-md opacity-75"></div>
                <div className="relative bg-white rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="/placeholder.svg" 
                    alt="Creator Dashboard" 
                    className="w-full h-auto"
                  />
                  <div className="absolute top-0 inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <p className="text-white font-medium">
                        Track your earnings in real-time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="default" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How BlueHustle Works</h2>
            <p className="text-lg text-gray-600">
              Our platform makes it easy to create, share, and earn from your content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply</h3>
              <p className="text-gray-600">
                Submit your application to join our creator community and get approved.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create</h3>
              <p className="text-gray-600">
                Use admin-provided assets to create engaging videos and content.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-indian-rupee"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn</h3>
              <p className="text-gray-600">
                Get ₹1 per 1000 views and 20% commission on affiliate links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">₹1</h3>
              <p className="text-blue-100">Per 1000 Views</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">20%</h3>
              <p className="text-blue-100">Affiliate Commission</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">₹10</h3>
              <p className="text-blue-100">Minimum Payout</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">₹500</h3>
              <p className="text-blue-100">Maximum Payout</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of Indian creators who are already monetizing their content with BlueHustle.
            </p>
            <Button size="lg" onClick={() => navigate('/apply')}>
              Apply Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
