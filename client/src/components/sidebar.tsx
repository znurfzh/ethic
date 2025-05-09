import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { 
  Home, BookOpen, Users, Lightbulb, Award,
  FileText, Briefcase, MessageSquare, 
  ChevronLeft, ChevronRight, ChevronDown, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarProps {}

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const { sidebarOpen, toggleSidebar, sidebarRendered, setSidebarRendered } = useSidebar();
  
  // Local state for sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Use window width to determine if we're on mobile
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const isMobile = windowWidth < 1024;
  
  // Check if this is the first instance of the sidebar being rendered
  useEffect(() => {
    if (!sidebarRendered) {
      setSidebarRendered(true);
    }
  }, []);
  
  // Effect to update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call to set width
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  // We'll combine the global sidebar state with the local collapsed state
  const toggleCollapsed = () => {
    // On mobile, use the global context toggleSidebar
    if (isMobile) {
      toggleSidebar();
    } else {
      // On desktop, toggle the collapsed state
      setIsSidebarCollapsed(!isSidebarCollapsed);
      // Also update the global state for content margin adjustments
      toggleSidebar();
    }
  };
  
  // Determine if sidebar should be visible
  // On mobile: use the global sidebarOpen state
  // On desktop: always visible but can be collapsed
  const isSidebarVisible = isMobile ? sidebarOpen : true;
  
  type NavItem = {
    name: string;
    path: string;
    icon?: React.ReactNode;
  };
  
  type NavCategory = "Explore" | "ThinkTank" | "Hub" | "Innovation" | "Career";
  
  // Main navigation items based on the 5 category structure
  const mainNavItems: Array<NavItem & { name: NavCategory }> = [
    { name: "Explore", path: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "ThinkTank", path: "/resources", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Hub", path: "/hub", icon: <Users className="h-5 w-5" /> },
    { name: "Innovation", path: "/challenges", icon: <Lightbulb className="h-5 w-5" /> },
    { name: "Career", path: "/career", icon: <Briefcase className="h-5 w-5" /> }
  ];
  
  // Secondary navigation items - submenu items for each main category
  const subNavItems: Record<NavCategory, NavItem[]> = {
    "Explore": [
      { name: "Recent Activity", path: "/" },
      { name: "Recommended for You", path: "/?tab=recommended" },
      { name: "Notifications", path: "/?tab=notifications" }
    ],
    "ThinkTank": [
      { name: "Repository", path: "/resources" },
      { name: "Pathways", path: "/learning-paths" }
    ],
    "Hub": [
      { name: "Forum", path: "/hub?tab=forum" },
      { name: "Member Directory", path: "/hub?tab=members" },
      { name: "Events", path: "/hub?tab=events" }
    ],
    "Innovation": [
      { name: "Spotlight", path: "/challenges?tab=spotlight" },
      { name: "Challenge", path: "/challenges" }
    ],
    "Career": [
      { name: "Resources", path: "/career" },
      { name: "Mentorship", path: "/mentorship" }
    ]
  };
  
  const [expandedMenu, setExpandedMenu] = useState<NavCategory | null>(null);
  
  const isActive = (path: string) => {
    // Check if this is a path with query parameters
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      return location === basePath || location.startsWith(basePath + '/');
    }
    return location === path;
  };
  
  const isMainActive = (item: { name: NavCategory, path: string }) => {
    // If exactly on this path
    if (isActive(item.path)) return true;
    
    // If on a subpath 
    return subNavItems[item.name].some((subItem: NavItem) => 
      location === subItem.path || 
      (subItem.path.includes('?') 
        ? location === subItem.path.split('?')[0] || location.startsWith(subItem.path.split('?')[0] + '/')
        : location.startsWith(subItem.path + '/'))
    );
  };

  const toggleMenu = (menuName: NavCategory) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };
  
  return (
    <>
      {/* Floating toggle button for desktop - positioned on the edge of sidebar */}
      {!isMobile && (
        <button 
          onClick={toggleCollapsed}
          className={`fixed rounded-full w-7 h-7 flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:shadow-xl border border-gray-300 z-30 top-16 ${isSidebarCollapsed ? 'left-9' : 'left-[185px]'} transition-all duration-300 ease-in-out hover:scale-110`}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      )}
      
      {/* Sidebar container */}
      <aside 
        className={`fixed h-full top-[48px] pb-16 bg-white border-r border-gray-200 overflow-y-auto z-20 shadow-lg 
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed && !isMobile ? 'w-[50px]' : 'w-[200px]'}
          ${isSidebarVisible ? "left-0" : "-left-64"}
          ${!isMobile ? "shadow-none z-20" : "shadow-lg z-20"}`}
      >
        <nav className={`${isSidebarCollapsed && !isMobile ? 'px-2' : 'px-4'} space-y-1 pt-5`}>
          <div className="">
            {mainNavItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <div className={`flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'px-3'} py-3 text-sm font-medium rounded-md mb-2 cursor-pointer ${
                  isMainActive(item) 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                }`}>
                  <div className={`${isMainActive(item) ? "text-primary-500" : "text-gray-400"}`}>
                    {item.icon}
                  </div>
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile - close sidebar when clicking outside */}
      {isMobile && isSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}