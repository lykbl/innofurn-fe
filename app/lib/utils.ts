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

//TODO add smarter typing
export const createAction = (type: string, payload: any): Action => {
  return { type, payload };
};

//TODO replace with proxy
// export const modifyClassMethods = (classProto) => {
//   Object.getOwnPropertyNames(Object.getPrototypeOf(classProto)).forEach((methodName) => {
//     const originalMethod = classProto[methodName];
//     // Check if the property is a function (method)
//     if (typeof originalMethod === 'function') {
//       // Create a new function that logs before calling the original method
//       classProto[methodName] = function(...args) {
//         console.log(`Calling method: ${methodName}`);
//         return originalMethod.apply(this, args);
//         // console.log(`Method ${methodName} called successfully`);
//       };
//     }
//   });
// }
