/**
 * One phone number, one format, everywhere.
 *
 * The owner's number lives in content/site.json (and can be changed from
 * /admin). Everything on the site shows it as "+354 834 0999" and dials it as
 * "tel:+3548340999" — country code included, so a tap works from any country.
 */

/** "+3548340999" -> "+354 834 0999". Falls back to the raw value if unusual. */
export function formatPhone(intl: string): string {
  const digits = intl.replace(/[^\d]/g, "");
  if (digits.startsWith("354") && digits.length === 10) {
    const n = digits.slice(3); // 7 Icelandic digits
    return `+354 ${n.slice(0, 3)} ${n.slice(3)}`;
  }
  return intl;
}

/** The href for a call button: never spaces, always the country code. */
export function telHref(intl: string): string {
  const digits = intl.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? digits : `+${digits}`}`;
}

/** Screen-reader label, e.g. "Call Honey Volcano at +354 834 0999". */
/**
 * The spoken name of a call button.
 *
 * It opens with the words on the button, because WCAG 2.5.3 (Label in Name)
 * asks that the accessible name contain the visible one — otherwise someone
 * driving the page by voice can read "Call to taste" aloud and have nothing
 * happen. The number follows, so a screen reader announces what will be
 * dialled.
 */
export function callAriaLabel(visible: string, pretty?: string): string {
  const number = pretty && pretty !== visible ? `, ${pretty}` : "";
  return `${visible} — Honey Volcano${number}`;
}
