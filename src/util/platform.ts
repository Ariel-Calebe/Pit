// src/utils/platform.ts
import type { Platform } from "../models/Game";

export const PLATFORMS = ["pc","xbox","playstation","switch","mobile"] as const;
export const isPlatform = (s: string): s is Platform =>
  (PLATFORMS as readonly string[]).includes(s);

export function toPlatforms(input: unknown): Platform[] {
  if (!Array.isArray(input)) return [];
  return input
    .map(v => String(v).toLowerCase().trim())
    .filter(isPlatform) as Platform[];
}
