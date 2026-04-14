import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['tr', 'en'],

  // Default locale when no match
  defaultLocale: 'tr',
});
