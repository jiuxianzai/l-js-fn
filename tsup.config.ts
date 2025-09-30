import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  clean: true,
  outExtension({ format }) {
    if (format === 'cjs') return { js: '.cjs' }
    return { js: '.js' }
  },
})
