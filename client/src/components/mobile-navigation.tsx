import { Link, useLocation } from "wouter";
import { 
  Home, BookOpen, Lightbulb, Briefcase, 
  MessageSquare
} from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Main navigation items based on the 5 category structure
  const navItems = [
    { name: "Explore", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "ThinkTank", path: "/resources", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Hub", path: "/forum", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Innovation", path: "/challenges", icon: <Lightbulb className="h-5 w-5" /> },
    { name: "Career", path: "/career", icon: <Briefcase className="h-5 w-5" /> }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => (
          <Link key={item.name} href={item.path}>
            <div className={`flex flex-col items-center p-2 cursor-pointer ${
              isActive(item.path) 
                ? "text-primary-600" 
                : "text-gray-500 hover:text-gray-900"
            }`}>
              <div>{item.icon}</div>
              <span className="text-xs mt-1">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}