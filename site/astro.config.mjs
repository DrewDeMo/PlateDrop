import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://platedrop.fit',
  devToolbar: {
    enabled: false
  },
  integrations: [
    tailwind({
      applyBaseStyles: false, // We'll handle base styles ourselves
    }),
    sitemap(),
    mdx()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  outDir: '../dist',
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  scopedStyleStrategy: 'where',
  vite: {
    server: {
      fs: {
        allow: ['..']
      },
      hmr: {
        overlay: false
      }
    },
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@styles': '/src/styles'
      }
    },
    ssr: {
      noExternal: ['lucide-astro']
    },
    optimizeDeps: {
      exclude: ['lucide-astro']
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'lucide': ['lucide-astro']
          }
        }
      }
    }
  }
});
