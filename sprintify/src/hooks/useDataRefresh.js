import { useEffect, useRef } from "react";

// Simple event emitter for data refresh events
class DataRefreshEmitter {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(eventType) {
    this.listeners.forEach((callback) => callback(eventType));
  }
}

// Global instance
const dataRefreshEmitter = new DataRefreshEmitter();

// Hook to listen for data refresh events
export function useDataRefresh(callback, dependencies = []) {
  const callbackRef = useRef(callback);

  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, dependencies);

  useEffect(() => {
    const unsubscribe = dataRefreshEmitter.subscribe((eventType) => {
      callbackRef.current(eventType);
    });

    return unsubscribe;
  }, []);
}

// Function to trigger data refresh
export function triggerDataRefresh(eventType = "general") {
  dataRefreshEmitter.emit(eventType);
}

export default {
  useDataRefresh,
  triggerDataRefresh,
};
