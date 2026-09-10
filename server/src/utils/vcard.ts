import { DigitalProfile } from "../models/types";

export function generateVCard(profile: DigitalProfile, siteBaseUrl: string = "http://localhost:5173"): string {
  const profileUrl = `${siteBaseUrl}/p/${profile.slug}`;
  const names = profile.ownerName.trim().split(" ");
  const lastName = names.length > 1 ? names.slice(1).join(" ") : "";
  const firstName = names[0] || "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${profile.ownerName}`,
    profile.companyName ? `ORG:${profile.companyName}` : "",
    profile.jobTitle ? `TITLE:${profile.jobTitle}` : "",
    profile.phone ? `TEL;TYPE=CELL,VOICE:${profile.phone}` : "",
    profile.whatsapp ? `TEL;TYPE=WORK,MSG:${profile.whatsapp}` : "",
    profile.email ? `EMAIL;TYPE=INTERNET,WORK:${profile.email}` : "",
    profile.website ? `URL:${profile.website}` : `URL:${profileUrl}`,
    profile.address || profile.city
      ? `ADR;TYPE=WORK:;;${profile.address || ""};${profile.city || ""};;;Maroc`
      : "",
    profile.bio ? `NOTE:${profile.bio.replace(/\n/g, "\\n")}` : "",
    `URL;TYPE=DIGITAL_PROFILE:${profileUrl}`,
    "END:VCARD"
  ];

  return lines.filter(Boolean).join("\r\n");
}
