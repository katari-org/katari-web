import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 競合を解消し、クラスをクリーンに結合する関数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
