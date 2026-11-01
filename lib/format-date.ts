/**
 * A date written the way the language being read writes it.
 *
 * The policy pages carried the literal string "31 October 2026" in all six
 * languages, so a Lithuanian reader got an English month — which is what sent
 * his friend a list of Lithuanian month names.
 *
 * Intl does the work where it can, because these dates inflect and a word
 * list will not tell you that: Lithuanian wants "2026 m. spalio 31 d.", not
 * "spalis", and Russian wants "октября", not "октябрь".
 *
 * Icelandic is written out here instead. Not every browser ships Icelandic
 * locale data — the one the tests run in has none — and when it is missing
 * Intl does not say so, it quietly returns US English. Silently showing the
 * wrong language is the bug being fixed, so the one market where that would
 * matter most does not go through Intl at all. Icelandic dates need no
 * inflection: "31. október 2026".
 */

const IS_MONTHS = [
  "janúar",
  "febrúar",
  "mars",
  "apríl",
  "maí",
  "júní",
  "júlí",
  "ágúst",
  "september",
  "október",
  "nóvember",
  "desember",
];

export function formatDate(date: Date, lang: string): string {
  if (lang === "is") {
    return `${date.getUTCDate()}. ${IS_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  }

  // Any other language the browser has no data for would come back as
  // English. An ISO date is plainer, but it is nobody's wrong language.
  if (Intl.DateTimeFormat.supportedLocalesOf([lang]).length === 0) {
    return date.toISOString().slice(0, 10);
  }

  return new Intl.DateTimeFormat(lang, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
