
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format event type for display (capitalize first letter)
 */
export const formatEventType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Get date with adjusted year for recurring events
 */
export const getAdjustedEventDate = (dateString: string): Date => {
  const today = new Date();
  const eventDate = new Date(dateString);
  
  // Set year to current year to handle yearly recurring events
  eventDate.setFullYear(today.getFullYear());
  
  // If the event has already occurred this year, check for next year
  if (eventDate < today) {
    eventDate.setFullYear(today.getFullYear() + 1);
  }
  
  return eventDate;
};

/**
 * Calculate number of days between two dates
 */
export const calculateDaysBetween = (date1: Date, date2: Date): number => {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
