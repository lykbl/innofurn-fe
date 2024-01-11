import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatCurrency(value: number) {
  return value;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

//TODO add smarter typing
export const createAction = (type: string, payload: any): Action => {
  return { type, payload }
};
