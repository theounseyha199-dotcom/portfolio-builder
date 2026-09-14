export const portfolioFonts = [
  { id: "inter", name: "Inter", stack: "Inter, ui-sans-serif, system-ui, sans-serif" }, { id: "geist", name: "Geist", stack: "Geist, ui-sans-serif, system-ui, sans-serif" }, { id: "geist-mono", name: "Geist Mono", stack: "ui-monospace, SFMono-Regular, Menlo, monospace" }, { id: "manrope", name: "Manrope", stack: "Manrope, ui-sans-serif, system-ui, sans-serif" }, { id: "source-sans", name: "Source Sans 3", stack: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif" }, { id: "playfair", name: "Playfair Display", stack: "'Playfair Display', Georgia, serif" },
] as const;
export function getFontStack(id: string) { return portfolioFonts.find((font) => font.id === id)?.stack ?? portfolioFonts[0].stack; }
