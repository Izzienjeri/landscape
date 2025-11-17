import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { compression } from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react({
      // Optimize React refresh
      fastRefresh: true,
      babel: {
        plugins: [
          // Remove console logs in production
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ]
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      manifest: {
        name: 'YouLandscape - Professional Landscape Architecture',
        short_name: 'YouLandscape',
        description: 'Kenya\'s premier landscape architecture and design services',
        theme_color: '#2F855A',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/logo.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: '/logo.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      }
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/]
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/]
    })
  ],
  base: '/',
  build: {
    // Target modern browsers
    target: 'es2020',
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          
          // Animation library (heavy)
          'animation': ['framer-motion'],
          
          // Icons (heavy - split by usage)
          'icons': ['react-icons/fa', 'react-icons/md'],
          
          // Helmet for SEO
          'helmet': ['react-helmet-async'],
        },
        
        // Better file naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 800,
    
    // Optimize CSS
    cssCodeSplit: true,
    
    // Source maps for production debugging (can disable for smaller builds)
    sourcemap: false
  },
  
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'framer-motion',
      '@headlessui/react',
      '@heroicons/react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Server optimization
  server: {
    port: 3000,
    strictPort: false,
    hmr: {
      overlay: true
    }
  },
  
  // Preview optimization
  preview: {
    port: 4173,
    strictPort: false
  }
});