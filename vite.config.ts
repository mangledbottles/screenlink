import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              plugins: [
                alias({
                  entries: [
                    {
                      find: "./lib-cov/fluent-ffmpeg",
                      replacement: "./lib/fluent-ffmpeg",
                    },
                  ],
                }),
              ],
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
        // If you need to handle ffmpeg in your preload script, you can add the vite property here as well
        // TODO: Add vite property for ffmpeg handling in preload script if necessary
      },
      renderer: {},
    }),
  ],
})