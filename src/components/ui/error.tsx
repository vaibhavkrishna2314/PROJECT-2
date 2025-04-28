import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={cn(
      "bg-accent-coral/10 border border-accent-coral text-accent-coral px-4 py-3 rounded-lg flex items-start",
      className
    )}>
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}