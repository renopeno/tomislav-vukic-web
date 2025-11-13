import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.js',
      output: {
        format: 'es', // ✅ ES module
        entryFileNames: 'index.js' // ✅ Isti naziv lokalno i u produkciji
      }
    }
  },
  server: {
    port: 5500, // ✅ Isti port kao što koristite
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});