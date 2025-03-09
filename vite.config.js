import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.js',
      output: {
        entryFileNames: 'main.js'
      }
    }
  }
});