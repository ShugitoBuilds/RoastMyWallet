import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state") || "initial";
  const miniRoast = searchParams.get("miniRoast") || "";
  const grade = searchParams.get("grade") || "";

  // Generate dynamic SVG based on state
  let svg: string;

  if (state === "roasted" && miniRoast) {
    // Show mini roast result
    svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#09090b"/>
      <stop offset="50%" style="stop-color:#18181b"/>
      <stop offset="100%" style="stop-color:#09090b"/>
    </linearGradient>
    <linearGradient id="flame-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f97316"/>
      <stop offset="50%" style="stop-color:#dc2626"/>
      <stop offset="100%" style="stop-color:#f97316"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg-grad)"/>
  <ellipse cx="600" cy="150" rx="400" ry="200" fill="url(#glow)"/>
  
  <!-- Grade Circle -->
  <circle cx="600" cy="180" r="80" fill="none" stroke="${getGradeColor(grade)}" stroke-width="6"/>
  <text x="600" y="200" font-family="system-ui, sans-serif" font-size="64" font-weight="bold" fill="${getGradeColor(grade)}" text-anchor="middle">${grade}</text>
  
  <!-- Mini Roast -->
  <text x="600" y="320" font-family="system-ui, sans-serif" font-size="32" fill="#e4e4e7" text-anchor="middle">"${escapeXml(miniRoast)}"</text>
  
  <!-- CTA -->
  <rect x="400" y="420" width="400" height="60" rx="12" fill="url(#flame-grad)"/>
  <text x="600" y="460" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Get Full Savage Report</text>
  
  <!-- Footer -->
  <text x="600" y="560" font-family="system-ui, sans-serif" font-size="20" fill="#52525b" text-anchor="middle">roastmywallet.xyz • Built on Base</text>
</svg>`.trim();
  } else {
    // Initial state - show call to action
    svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#09090b"/>
      <stop offset="50%" style="stop-color:#18181b"/>
      <stop offset="100%" style="stop-color:#09090b"/>
    </linearGradient>
    <linearGradient id="flame-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f97316"/>
      <stop offset="50%" style="stop-color:#dc2626"/>
      <stop offset="100%" style="stop-color:#f97316"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg-grad)"/>
  <ellipse cx="600" cy="250" rx="500" ry="300" fill="url(#glow)"/>
  
  <!-- Flame Icon (simplified) -->
  <path d="M600 80 C600 80 560 140 560 180 C560 200 575 220 600 220 C625 220 640 200 640 180 C640 140 600 80 600 80" fill="#f97316"/>
  <path d="M560 180 C560 140 600 80 600 80 C540 100 520 140 520 180 C520 220 550 260 600 280 C650 260 680 220 680 180 C680 140 660 100 600 80 C600 80 640 140 640 180 C640 200 625 220 600 220 C575 220 560 200 560 180" fill="#dc2626"/>
  
  <!-- Title -->
  <text x="600" y="340" font-family="system-ui, sans-serif" font-size="72" font-weight="bold" fill="url(#flame-grad)" text-anchor="middle">Roast My Wallet</text>
  
  <!-- Subtitle -->
  <text x="600" y="400" font-family="system-ui, sans-serif" font-size="28" fill="#a1a1aa" text-anchor="middle">Get your crypto portfolio ruthlessly roasted by AI</text>
  
  <!-- CTA -->
  <rect x="400" y="450" width="400" height="60" rx="12" fill="url(#flame-grad)"/>
  <text x="600" y="490" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Get Mini Roast (Free)</text>
  
  <!-- Footer -->
  <text x="600" y="580" font-family="system-ui, sans-serif" font-size="18" fill="#52525b" text-anchor="middle">Built on Base • Powered by AI</text>
</svg>`.trim();
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    "A+": "#22c55e",
    "A": "#22c55e",
    "B": "#84cc16",
    "C": "#eab308",
    "D": "#f97316",
    "D-": "#ef4444",
    "F": "#dc2626",
    "F-": "#991b1b",
  };
  return colors[grade] || "#ef4444";
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .substring(0, 80); // Limit length for SVG
}


