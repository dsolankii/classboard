"use client"

// Put the emails of people who should have full admin permissions here.
// They will be auto-promoted to role "admin" at login/register
// and can add/remove/edit users in the app.
export const ADMIN_WHITELIST: readonly string[] = [
  "admin@classboard.local",
  // "you@your-domain.com",
]

export function isWhitelisted(email: string | undefined | null) {
  if (!email) return false
  return ADMIN_WHITELIST.includes(email.toLowerCase())
}
