import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/web/assets/altpilotfrontend/src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: './src/web/assets/altpilotfrontend/src/main.ts',
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
    outDir: './src/web/assets/altpilotfrontend/dist',
    emptyOutDir: true,
  },
});
