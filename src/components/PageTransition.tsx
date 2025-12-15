import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      // Wait for fade out, then change page
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      {/* Transition overlay */}
      <div 
        className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-300 bg-neutral-900 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Page content with fade effect */}
      <div 
        className={`transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default PageTransition;
