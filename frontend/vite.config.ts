import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

const frontendEntry = fileURLToPath(new URL('./src/main.ts', import.meta.url));

const nodeEnv = process.env.NODE_ENV ?? 'production';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    __VUE_PROD_DEVTOOLS__: nodeEnv !== 'production',
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
        codeSplitting: false,
        assetFileNames: '[name][extname]',
      },
    },
    outDir: '../src/assetbundles/altpilotfrontend/dist',
    emptyOutDir: true,

    sourcemap: nodeEnv !== 'production',
    minify: nodeEnv === 'production',
  },
});
