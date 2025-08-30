/// <reference types="vitest" />

import { createRequire } from 'node:module'
import path from 'node:path'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vitejs.dev/config/

const require = createRequire(import.meta.url)
const process = require('node:process')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  const chunkName = mode === 'prebuild' ? '[name]' : 'chunk'

  return {
    base: mode === 'file' ? './' : '/log-lottery/',
    plugins: [
      vue(),
      mode === 'file'
        ? legacy({
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
          })
        : null,
      // vueDevTools(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      visualizer({
        emitFile: true, // Whether to be touched
        filename: 'test.html', // Generated analysis webpage filename
        open: true, // Open the generated file in the default user agent
        gzipSize: true, // Collect gzip size from source code and display it in the chart
        brotliSize: true, // Collect brotli size from source code and display it in the chart
      }),

      createSvgIconsPlugin({
        // Specify the icon folder that needs to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      AutoImport({
        resolvers: [
          // Auto import icon components
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
        dts: path.resolve(path.resolve(__dirname, 'src'), 'auto-imports.d.ts'),
      }),
      Components({
        resolvers: [
          // Auto register icon components
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
        dts: path.resolve(path.resolve(__dirname, 'src'), 'components.d.ts'),
      }),
      Icons({
        autoInstall: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/style/global.scss" as *;',
        },
      },
      // postcss: {
      //     plugins: [
      //         require('tailwindcss'),
      //         require('autoprefixer'),
      //     ]
      // }
    },
    server: {
      host: 'localhost',
      port: 6719,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          // Whether cross-origin
          changeOrigin: true,
          // Keep /api prefix for backend routes
          // rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // Remove console in production environment
          drop_console: true,
          drop_debugger: true,
        },
      },
      //   Close file calculation
      reportCompressedSize: false,
      //   Close generating map files to reduce package size
      sourcemap: false, // This must be turned off in production environment, otherwise the packaged product will be very large
      rollupOptions: {
        output: {
          chunkFileNames: `js/${chunkName}-[hash].js`, // Name of the imported file
          entryFileNames: `js/${chunkName}-[hash].js`, // Package entry file name
          assetFileNames: `[ext]/${chunkName}-[hash].[ext]`, // Asset files like fonts, images, etc.
          manualChunks(id: any): string {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
        },
      },
    },
    // To use this, you must add /// <reference types="vitest" /> above, otherwise there will be type errors
    test: {
      globals: true, // --> 0.8.1+  Please change to globals
      environment: 'jsdom',
      // include: ['**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      // passWithNoTests: true,
      transformMode: {
        web: [/\.[jt]sx$/],
      },
    },
  }
})
