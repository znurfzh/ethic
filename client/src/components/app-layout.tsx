import { ReactNode, useEffect } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useSidebar } from "@/hooks/use-sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Use the shared sidebar context
  const { sidebarOpen, sidebarRendered, resetSidebar } = useSidebar();

  // Reset the sidebar rendered state when component is mounted
  // This ensures that when navigating to a new page, we start fresh
  useEffect(() => {
    resetSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Only render the sidebar if it hasn't already been rendered */}
      {!sidebarRendered && <Sidebar />}
      
      <main 
        className={`
          transition-all duration-300 ease-in-out
          pt-[70px] pb-6
          ${sidebarOpen 
            ? 'lg:ml-[220px]' 
            : 'lg:ml-[50px]'
          }
          px-4 md:px-6
          max-w-screen-2xl
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
