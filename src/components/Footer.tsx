
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-dearminder-purple to-dearminder-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-playfair font-bold bg-gradient-to-r from-dearminder-purple-dark to-dearminder-blue bg-clip-text text-transparent">
                DearMinder
              </span>
            </div>
            <p className="text-gray-500 mb-6 max-w-md">
              DearMinder helps you strengthen your relationships with timely reminders and personalized wishes for all the special moments in life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-dearminder-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-dearminder-purple transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-dearminder-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-dearminder-purple transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-dearminder-purple transition-colors">System Status</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} DearMinder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-dearminder-purple text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-dearminder-purple text-sm transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-dearminder-purple text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
