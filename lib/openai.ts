import OpenAI from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function buildImagePrompt(req: {
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
}) {
  let p = `Create a ${req.style} ${req.contentType.toLowerCase()} graphic for a ${req.industry || "business"} called "${req.businessName}". `;
  p += `Event: ${req.eventType}${req.milestone ? " — " + req.milestone : ""}. `;
  p += `Brand colour: ${req.colorName} (${req.brandColor}). `;
  if (req.eventDate) p += `Date: ${req.eventDate}. `;
  if (req.tagline) p += `Message: "${req.tagline}". `;
  p += `Business name "${req.businessName}" must be clearly visible. High quality, professional, no spelling errors, no watermarks.`;
  if (req.variantNote) p += ` ${req.variantNote}`;
  return p;
}
