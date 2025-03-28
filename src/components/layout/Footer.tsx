import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black/90 text-gray-400 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">StreamFlix</h3>
            <p className="text-sm">
              The ultimate streaming platform for movies and TV shows.
              Watch anywhere, anytime.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/browse" className="hover:text-white transition">Browse</Link></li>
              <li><Link to="/watchlist" className="hover:text-white transition">My List</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">Account</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Preferences</a></li>
              <li><a href="#" className="hover:text-white transition">Corporate Information</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} StreamFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}