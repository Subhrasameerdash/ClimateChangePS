
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Bell,
  Menu,
  MapPin,
  ShieldAlert,
  X,
  Settings,
  Github,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to navigate to tab
  const navigateToTab = (tabId: string) => {
    const tabElement = document.querySelector(`[value="${tabId}"]`);
    if (tabElement instanceof HTMLElement) {
      tabElement.click();
    }
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <AlertTriangle size={24} />
          <span className="text-xl font-bold font-heading">DisasterAlert</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink
            to="/"
            icon={<Bell size={18} />}
            label="Alerts"
            onClick={() => navigateToTab("alerts")}
          />
          <NavLink
            to="/"
            icon={<MapPin size={18} />}
            label="Map"
            onClick={() => navigateToTab("map")}
          />
          <NavLink
            to="/"
            icon={<ShieldAlert size={18} />}
            label="Shelters"
            onClick={() => navigateToTab("shelters")}
          />
          
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="ghost" size="icon">
              <HelpCircle size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
            <Button variant="outline" size="sm">
              <Github size={16} className="mr-2" />
              <span>GitHub</span>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary-foreground hover:text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden absolute w-full bg-primary shadow-lg transform transition-transform duration-200 ease-in-out z-50",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <MobileNavLink 
            to="/" 
            icon={<Bell size={20} />} 
            label="Alerts" 
            onClick={() => {
              toggleMenu();
              navigateToTab("alerts");
            }} 
          />
          <MobileNavLink 
            to="/" 
            icon={<MapPin size={20} />} 
            label="Map" 
            onClick={() => {
              toggleMenu();
              navigateToTab("map");
            }} 
          />
          <MobileNavLink 
            to="/" 
            icon={<ShieldAlert size={20} />} 
            label="Shelters" 
            onClick={() => {
              toggleMenu();
              navigateToTab("shelters");
            }} 
          />
          
          <div className="pt-2 border-t border-white/10 flex justify-around">
            <Button variant="ghost" className="text-primary-foreground">
              <HelpCircle size={20} className="mr-2" />
              Help
            </Button>
            <Button variant="ghost" className="text-primary-foreground">
              <Settings size={20} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, onClick }) => (
  <Button asChild variant="ghost" size="sm" className="flex items-center space-x-1" onClick={onClick}>
    <Link to={to}>
      {icon}
      <span>{label}</span>
    </Link>
  </Button>
);

interface MobileNavLinkProps extends NavLinkProps {}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label, onClick }) => (
  <Button asChild variant="ghost" className="w-full justify-start" onClick={onClick}>
    <Link to={to} className="flex items-center space-x-2">
      {icon}
      <span>{label}</span>
    </Link>
  </Button>
);

export default Navbar;
