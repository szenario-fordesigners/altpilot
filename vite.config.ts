import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

const frontendEntry = fileURLToPath(
  new URL('./src/web/assets/altpilotfrontend/src/main.ts', import.meta.url),
);

const nodeEnv = process.env.NODE_ENV ?? 'production';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/web/assets/altpilotfrontend/src', import.meta.url)),
    },
  },
  define: {
    'process.env': JSON.stringify({ NODE_ENV: nodeEnv }),
    __VUE_PROD_DEVTOOLS__: true,
  },
  build: {
    lib: {
      entry: frontendEntry,
      name: 'AltPilotApp',
      formats: ['iife'],
      fileName: () => 'main.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: '[name][extname]',
      },
    },
    outDir: './src/web/assets/altpilotfrontend/dist',
    emptyOutDir: true,

    sourcemap: true,
    minify: false,
  },
});
