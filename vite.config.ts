// vite.config.js
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './neutron/index.ts',
      name: 'neutron-core',
      fileName: 'neutron-core',
      formats: ['es']
    }
  },
  plugins: [
    dts({})
  ]
});
