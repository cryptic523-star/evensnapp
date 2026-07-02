export type { Database } from "./database";

export interface GenerateImageRequest {
  businessName: string;
  industry: string;
  contentType: string;
  eventType: string;
  milestone?: string;
  eventDate?: string;
  tagline?: string;
  style: string;
  brandColor: string;
  colorName: string;
  variantNote?: string;
}

export interface GeneratedImageResult {
  id: string;
  url: string;
  storagePath: string;
}

export interface CaptionResult {
  instagram: string;
  facebook: string;
  linkedin: string;
  hashtags: string[];
}
