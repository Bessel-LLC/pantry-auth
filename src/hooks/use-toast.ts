import { useCallback } from 'react';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  // Replace with your preferred toast library or custom implementation
  return {
    toast: useCallback((options: ToastOptions) => {
      window.alert(`${options.title}\n${options.description || ''}`);
    }, []),
  };
}
