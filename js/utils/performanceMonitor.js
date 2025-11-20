// ================================
// PERFORMANCE MONITOR
// ================================

class PerformanceMonitor {
  constructor() {
    this.timings = new Map();
    this.enabled = false; // Set to true in development
  }

  /**
   * Start timing an operation
   */
  start(label) {
    if (!this.enabled) return;
    this.timings.set(label, performance.now());
  }

  /**
   * End timing and log result
   */
  end(label) {
    if (!this.enabled) return;
    
    const startTime = this.timings.get(label);
    if (startTime === undefined) {
      console.warn(`No start time found for: ${label}`);
      return;
    }
    
    const duration = performance.now() - startTime;
    this.timings.delete(label);
    
    const color = duration > 100 ? 'red' : duration > 50 ? 'orange' : 'green';
    console.log(
      `%c⏱️ ${label}: ${duration.toFixed(2)}ms`,
      `color: ${color}; font-weight: bold;`
    );
    
    return duration;
  }

  /**
   * Enable performance monitoring
   */
  enable() {
    this.enabled = true;
    console.log('🔍 Performance monitoring enabled');
  }

  /**
   * Disable performance monitoring
   */
  disable() {
    this.enabled = false;
    console.log('🔇 Performance monitoring disabled');
  }

  /**
   * Measure function execution time
   */
  measure(label, fn) {
    if (!this.enabled) return fn();
    
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }
}

export const perfMonitor = new PerformanceMonitor();

// Enable in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  perfMonitor.enable();
}

// Export for debugging
if (typeof window !== 'undefined') {
  window.__perfMonitor = perfMonitor;
}
