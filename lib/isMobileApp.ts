export function isMobileApp(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).Capacitor;
  }