import { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';

type SidebarContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarRendered: boolean;
  setSidebarRendered: (value: boolean) => void;
  resetSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  // Track if sidebar has been rendered in the current page
  const [sidebarRendered, setSidebarRendered] = useState(false);
  
  // Reset rendered state when navigating to a new page
  const resetSidebar = () => {
    setSidebarRendered(false);
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSidebarOpen(window.innerWidth >= 1024);
      
      const handleResize = () => {
        setSidebarOpen(window.innerWidth >= 1024);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ 
      sidebarOpen, 
      toggleSidebar, 
      sidebarRendered, 
      setSidebarRendered,
      resetSidebar 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
