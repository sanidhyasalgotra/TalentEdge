// Details shown on the Privacy Policy and Terms pages.
// The legal pages show a "Draft" warning while any of the first three values still starts with "[".
export const LEGAL = {
  operator: 'Sanidhya Salgotra',
  contactEmail: 'sanidhyasalgotra1878@gmail.com',
  jurisdiction: 'India',
  effectiveDate: 'November 17, 2026',
  // Set to true only after you enable billing on your Google Cloud project for the Gemini API.
  // The Privacy Policy wording changes to match.
  geminiPaidTier: false,
}

export const hasPlaceholders = () =>
  [LEGAL.operator, LEGAL.contactEmail, LEGAL.jurisdiction].some((v) => v.startsWith('['))