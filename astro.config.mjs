// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://abravastudio.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Keep every stylesheet external so the CSP can stay `style-src 'self'` (see SECURITY.md).
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline scripts or assets: everything ships as a same-origin file,
      // which keeps the CSP at `script-src 'self'` with no hashes or 'unsafe-inline'.
      assetsInlineLimit: 0,
    },
  },
  devToolbar: { enabled: false },
  server: { port: 4321 },
});
