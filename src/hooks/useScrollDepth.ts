import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '../lib/analytics';

/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 100%)
 * Tracks each milestone only once per page load
 */
export const useScrollDepth = () => {
  const milestones = useRef<Set<number>>(new Set());
  const pagePath = useRef<string>(window.location.pathname);

  useEffect(() => {
    // Reset milestones when path changes
    if (pagePath.current !== window.location.pathname) {
      milestones.current.clear();
      pagePath.current = window.location.pathname;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Avoid division by zero
      if (docHeight <= 0) return;
      
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track milestones: 25%, 50%, 75%, 100%
      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !milestones.current.has(milestone)) {
          milestones.current.add(milestone);
          trackScrollDepth(milestone, window.location.pathname);
        }
      });
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check in case page is already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export default useScrollDepth;
