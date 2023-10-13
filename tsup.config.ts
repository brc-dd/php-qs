import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node18',
  minify: true,
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true
})
