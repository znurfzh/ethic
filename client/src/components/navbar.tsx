import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Search, Menu, ChevronDown, Bell,
  Home, BookOpen, Users, Lightbulb, Briefcase
} from "lucide-react";
import Sidebar from "./sidebar";
import NotificationDropdown from "./notification-dropdown";
import SearchDropdown from "./search-dropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Force navigation to landing page after logout
        window.location.href = "/";
      }
    });
  };
  
  // List of main navigation items
  const mainNavItems = [
    { name: "Explore", path: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "ThinkTank", path: "/learning-paths", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Hub", path: "/forum", icon: <Users className="h-5 w-5" /> },
    { name: "Innovate", path: "/challenges", icon: <Lightbulb className="h-5 w-5" /> },
    { name: "Career", path: "/mentorship", icon: <Briefcase className="h-5 w-5" /> },
  ];

  const [location] = useLocation();
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      {/* Sidebar moved to app-layout to prevent duplicates */}
      <header className="fixed top-0 left-0 right-0 z-30">
        <div className="bg-white shadow">
          <div className="w-full mx-auto px-2 py-2 md:px-4">
            <div className="flex justify-between items-center">
              {/* Left - Menu Button and Brand */}
              <div className="flex items-center">
                {/* Menu Button - Only visible on mobile */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 mr-2 rounded-md text-gray-700 hover:bg-gray-100 lg:hidden"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Brand */}
                <h1 className="text-xl font-bold text-gray-900">ETHIC</h1>
                <p className="text-sm md:text-base text-gray-700 ml-2 font-medium hidden md:block">
                  Educational Technology Hub for Indonesian Community
                </p>
              </div>
            
              {/* Right - Search & Actions */}
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="hidden md:block">
                  <SearchDropdown />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                {user && <NotificationDropdown />}
                
                {user ? (
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none">
                          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                            {user?.avatarUrl ? (
                              <img 
                                src={user.avatarUrl} 
                                alt={`${user.displayName}'s avatar`} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white">
                                {user.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="hidden lg:block text-sm font-medium text-gray-700">
                            {user.displayName}
                          </span>
                          <ChevronDown className="hidden lg:block text-xs text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <Link href={`/profile/${user.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            Your Profile
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={handleLogout}
                        >
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button size="sm">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}