import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Standalone idea-enhancer app. Two design concepts live under /a and /b and
// share the enhancement engine in src/shared. The Claude proxy is api/enhance.ts
// (Vercel serverless); locally there is no /api route, so the client falls back
// to the deterministic mock — see src/shared/enhance.ts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
