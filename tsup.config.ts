import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  env: { NODE_ENV: 'production' },
  format: ['cjs', 'esm'],
  target: ['es2018'],
  esbuildOptions: (options) => {
    options.sourcemap = true;
  },
  treeshake: true,
});
