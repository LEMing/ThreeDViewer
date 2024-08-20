import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/__mocks__/**/*'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SimpleViewer',
      formats: ['es', 'umd'],
      fileName: (format) => `simple-viewer.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'three'],
      output: {
        globals: {
          react: 'React',
          three: 'THREE'
        }
      }
    }
  }
})
