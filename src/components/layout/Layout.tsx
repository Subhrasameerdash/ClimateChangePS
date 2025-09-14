
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
