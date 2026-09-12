import type { Locale } from "@/content/site-config";
import { en } from "./en";
import { sq } from "./sq";

export const dictionaries = { sq, en } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
