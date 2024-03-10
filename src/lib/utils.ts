import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { config } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = async (url: string, options: any = {}): Promise<{ data: any }> => {
  const response = await fetch(`${config.API_BASE_URL}${url}`, options);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return response.json();
};
