/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import type { ESBuildOptions } from 'vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const oneDayInSeconds = 86400;

export default defineConfig(({ mode }) => {
   function buildOptions(): ESBuildOptions {
      const isProd = mode === 'production';
      return isProd ? { drop: ['console', 'debugger'] } : {};
   }

   return {
      esbuild: buildOptions(),
      plugins: [
         react(),
         VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
               enabled: true,
            },
            workbox: {
               disableDevLogs: true,
               cleanupOutdatedCaches: true,
               skipWaiting: true,
               clientsClaim: true,
               runtimeCaching: [
                  {
                     urlPattern: /https?:\/\/.*googleapis\.com/,
                     handler: 'NetworkFirst',
                     method: 'GET',
                     options: {
                        cacheName: 'sw-fetch-cache',
                        expiration: {
                           maxEntries: 500,
                           maxAgeSeconds: oneDayInSeconds,
                        },
                        cacheableResponse: {
                           statuses: [0, 200],
                        },
                        matchOptions: {
                           ignoreSearch: false,
                        },
                     },
                  },
               ],
            },
            manifest: {
               name: 'Rat Hunt',
               short_name: 'Rat Hunt',
               description: 'Find the rat!',
               display: 'standalone',
               orientation: 'natural',
               start_url: '/?application=true',
               scope: '/',
               icons: [
                  {
                     src: '/icons/logo-192x192.png',
                     sizes: '192x192',
                     type: 'image/png',
                     purpose: 'any',
                  },
                  {
                     src: '/icons/logo-512x512.png',
                     sizes: '512x512',
                     type: 'image/png',
                     purpose: 'maskable',
                  },
               ],
            },
         }),
      ],
      test: {
         globals: true,
         environment: 'jsdom',
         setupFiles: ['./src/setupTests.ts'],
      },
   };
});
