import { useRef, useCallback } from 'react';

/**
 * Custom hook for auto-scrolling during drag operations
 * @param {Object} options - Configuration options
 * @returns {Object} - Auto-scroll handlers and refs
 */
export const useAutoScroll = (options = {}) => {
  const {
    scrollSpeed = 20,
    edgeSize = 50,
    horizontalScroll = true,
    verticalScroll = true,
  } = options;

  const scrollIntervalRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  const clearAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback((deltaX, deltaY) => {
    clearAutoScroll();
    
    if (!containerRef.current || (deltaX === 0 && deltaY === 0)) return;

    scrollIntervalRef.current = setInterval(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      
      if (horizontalScroll && deltaX !== 0) {
        container.scrollLeft += deltaX;
      }
      
      if (verticalScroll && deltaY !== 0) {
        container.scrollTop += deltaY;
      }
    }, 16); // ~60fps
  }, [clearAutoScroll, horizontalScroll, verticalScroll]);

  const handleDragOver = useCallback((e) => {
    if (!containerRef.current) return;

    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the auto-scroll to reduce glitching
    debounceTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let deltaX = 0;
      let deltaY = 0;

      // Check horizontal edges with reduced sensitivity
      if (horizontalScroll) {
        if (x < edgeSize && container.scrollLeft > 0) {
          deltaX = -scrollSpeed;
        } else if (x > rect.width - edgeSize && container.scrollLeft < container.scrollWidth - container.clientWidth) {
          deltaX = scrollSpeed;
        }
      }

      // Check vertical edges with reduced sensitivity
      if (verticalScroll) {
        if (y < edgeSize && container.scrollTop > 0) {
          deltaY = -scrollSpeed;
        } else if (y > rect.height - edgeSize && container.scrollTop < container.scrollHeight - container.clientHeight) {
          deltaY = scrollSpeed;
        }
      }

      if (deltaX !== 0 || deltaY !== 0) {
        startAutoScroll(deltaX, deltaY);
      } else {
        clearAutoScroll();
      }
    }, 50); // 50ms debounce to reduce conflicts
  }, [edgeSize, scrollSpeed, horizontalScroll, verticalScroll, startAutoScroll, clearAutoScroll]);

  const handleDragLeave = useCallback(() => {
    clearAutoScroll();
  }, [clearAutoScroll]);

  const handleDrop = useCallback(() => {
    clearAutoScroll();
  }, [clearAutoScroll]);

  return {
    containerRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearAutoScroll,
  };
};
