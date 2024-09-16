import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    rollupOptions: {
      external: [
        'crypto',
        'http',
        'https',
        'zlib',
        'url',
        'stream',
      ],
    },
  },
  resolve: {
    alias: {
      'crypto': 'crypto-browserify',
      'http': 'stream-http',
      'https': 'https-browserify',
      'zlib': 'browserify-zlib',
      'url': 'url',
      'stream': 'stream-browserify',
    },
  },
});