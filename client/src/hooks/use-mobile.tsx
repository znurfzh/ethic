import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if screen width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is lg breakpoint in Tailwind
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}