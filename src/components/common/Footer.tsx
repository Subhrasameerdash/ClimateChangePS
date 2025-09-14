
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Heart, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground shadow-inner mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center mb-4">
              <AlertTriangle size={20} className="mr-2" />
              <span className="text-xl font-bold">DisasterAlert</span>
            </Link>
            <p className="text-sm opacity-80">
              Real-time disaster monitoring and alerts to keep you and your loved ones safe.
            </p>
            <div className="mt-4 flex items-center text-sm">
              <span>Made with </span>
              <Heart size={14} className="mx-1 text-alert-critical" />
              <span>for community safety</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/alerts" className="hover:underline">Disaster Alerts</Link>
              </li>
              <li>
                <Link to="/map" className="hover:underline">Disaster Map</Link>
              </li>
              <li>
                <Link to="/shelters" className="hover:underline">Emergency Shelters</Link>
              </li>
              <li>
                <Link to="/tips" className="hover:underline">Safety Tips</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/report" className="hover:underline">Report Incident</Link>
              </li>
              <li>
                <a href="https://www.ready.gov/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Ready.gov
                </a>
              </li>
              <li>
                <a href="https://www.fema.gov/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  FEMA
                </a>
              </li>
              <li>
                <a href="https://www.redcross.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Red Cross
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Contact Emergency Services</h3>
            <div className="space-y-2 text-sm">
              <a href="tel:911" className="flex items-center hover:underline">
                <Phone size={16} className="mr-2" />
                <span>911 (Emergency)</span>
              </a>
              <a href="mailto:info@disasteralert.example" className="flex items-center hover:underline">
                <Mail size={16} className="mr-2" />
                <span>info@disasteralert.example</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-primary-foreground/20 text-sm opacity-80 text-center">
          <p>© {new Date().getFullYear()} DisasterAlert. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/accessibility" className="hover:underline">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
