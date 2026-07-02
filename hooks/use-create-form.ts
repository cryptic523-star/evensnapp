"use client";
import { useState, useMemo } from "react";

export const SWATCHES = [
  { hex: "#f0f0f0", name: "White & Black" },
  { hex: "#2563eb", name: "Blue" },
  { hex: "#0f766e", name: "Teal" },
  { hex: "#b91c1c", name: "Red" },
  { hex: "#7c3aed", name: "Purple" },
  { hex: "#b45309", name: "Amber" },
  { hex: "#be185d", name: "Pink" },
  { hex: "#166534", name: "Green" },
  { hex: "#1e293b", name: "Navy" },
  { hex: "#78350f", name: "Brown" },
];

export const EVENT_TYPES = [
  "Anniversary", "Grand Opening", "Sale & Promotion", "Product Launch", "Seasonal Event",
  "Community Event", "Awards", "Holiday Celebration", "Workshop", "Charity & Fundraiser",
];

export const INDUSTRIES = [
  "Restaurant & Café", "Bar & Nightlife", "Retail Shop", "Hair & Beauty Salon", "Gym & Fitness Studio",
  "Medical & Health", "Real Estate Agency", "Construction & Trades", "Photography & Creative",
  "Technology & Software", "Event Venue", "School & Education", "Non-Profit / Community", "Other",
];

export const CONTENT_TYPES = [
  "Instagram Post", "Instagram Story", "Facebook Post", "LinkedIn Post", "Flyer", "Event Banner", "Poster", "Square Graphic",
];

export const STYLES = [
  { value: "promotional poster", label: "Promo Poster" },
  { value: "elegant luxury design", label: "Elegant & Luxury" },
  { value: "bold modern graphic", label: "Bold & Modern" },
  { value: "warm rustic vintage", label: "Warm & Rustic" },
  { value: "clean minimalist design", label: "Minimalist" },
  { value: "vibrant festive design", label: "Vibrant & Festive" },
  { value: "dark premium aesthetic", label: "Dark & Premium" },
];

export function useCreateForm(defaults?: Partial<{
  businessName: string; industry: string; style: string; contentType: string;
  color: string; colorName: string;
}>) {
  const [businessName, setBusinessName] = useState(defaults?.businessName || "");
  const [industry, setIndustry] = useState(defaults?.industry || "");
  const [contentType, setContentType] = useState(defaults?.contentType || CONTENT_TYPES[0]);
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [milestone, setMilestone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [tagline, setTagline] = useState("");
  const [style, setStyle] = useState(defaults?.style || STYLES[0].value);
  const [color, setColor] = useState(defaults?.color || SWATCHES[0].hex);
  const [colorName, setColorName] = useState(defaults?.colorName || SWATCHES[0].name);

  const prompt = useMemo(() => {
    if (!businessName.trim()) return "";
    let p = `${style} ${contentType.toLowerCase()} for a ${industry || "business"} called "${businessName}". `;
    p += `Event: ${eventType}${milestone ? " — " + milestone : ""}. `;
    p += `Colours: ${colorName}.`;
    if (eventDate) p += ` Date: ${eventDate}.`;
    if (tagline) p += ` Message: "${tagline}".`;
    return p;
  }, [businessName, industry, style, contentType, eventType, milestone, eventDate, tagline, colorName]);

  return {
    businessName, setBusinessName,
    industry, setIndustry,
    contentType, setContentType,
    eventType, setEventType,
    milestone, setMilestone,
    eventDate, setEventDate,
    tagline, setTagline,
    style, setStyle,
    color, setColor, colorName, setColorName,
    prompt,
  };
}
