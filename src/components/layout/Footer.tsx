
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 w-8 h-8 rounded-md flex items-center justify-center">
                <span className="font-bold text-white">BH</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                BlueHustle
              </span>
            </Link>
            <p className="text-sm text-gray-600 max-w-xs">
              The premier platform for Indian creators to monetize content and earn through views and affiliate marketing.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/creators" className="text-sm text-gray-600 hover:text-primary">
                  Creators
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-sm text-gray-600 hover:text-primary">
                  Apply to Join
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm text-gray-600 hover:text-primary">
                  Content Guidelines
                </Link>
              </li>
              <li>
                <Link to="/payout-rules" className="text-sm text-gray-600 hover:text-primary">
                  Payout Rules
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} BlueHustle. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary">
              <span className="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary">
              <span className="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary">
              <span className="sr-only">YouTube</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
