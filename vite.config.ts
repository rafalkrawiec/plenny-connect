import { defineConfig } from 'vite';
import { externalizer } from '@plenny/vite-externalizer';
import { readFile, appendFile } from 'node:fs/promises';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    externalizer(),
    dts({
      rollupTypes: true,
      async afterBuild() {
        await appendFile('./dist/connect.d.ts', await readFile('./src/extensions.d.ts'));
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        connect: 'src/connect.ts',
      },
      formats: ['es', 'cjs'],
    },
    minify: 'terser',
  },
});
