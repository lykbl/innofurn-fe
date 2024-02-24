import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function formatCurrency(value: number) {
  return value;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  if (!process.browser) {
    return null;
  }

  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

export function cookieSet(name: string) {
  if (!process.browser) {
    return false;
  }

  const cookies = document.cookie.split(';');

  return cookies.some((cookie) => cookie.trim().startsWith(`${name}=`));
}

export const calculatePercentage = (amount: number, total: number) => {
  return Math.round((amount / total) * 100);
};
