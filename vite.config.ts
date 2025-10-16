import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/BuyOrRent/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Radix UI components (split into logical groups)
          'radix-ui-core': [
            '@radix-ui/react-slot',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
          ],
          'radix-ui-overlay': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dropdown-menu',
          ],
          'radix-ui-forms': [
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-progress',
          ],
          'radix-ui-layout': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-tabs',
            '@radix-ui/react-navigation-menu',
          ],
          'radix-ui-misc': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-toggle',
          ],

          // Chart library (large dependency)
          'charts': ['recharts'],

          // Form libraries
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // UI utilities
          'ui-utils': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
          ],

          // Other UI libraries
          'ui-misc': [
            'lucide-react',
            'embla-carousel-react',
            'react-resizable-panels',
            'vaul',
          ],
        },
      },
    },
    // Increase chunk size warning limit (optional, but recommended with manual chunks)
    chunkSizeWarningLimit: 600,
  },
})
