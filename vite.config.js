import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.js',
      output: {
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    }
  }
});