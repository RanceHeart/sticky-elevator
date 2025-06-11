// vite.config.ts
import { defineConfig } from 'vite';
import cssInjected from 'vite-plugin-css-injected-by-js';
import react from '@vitejs/plugin-react'; // ✅ 使用兼容性更好的官方 React 插件
import dts from 'vite-plugin-dts';
import path from 'node:path';

export default defineConfig(({mode }) => {
  const isLib = mode === 'lib';

  return {
    plugins: [
      react(),
      isLib && cssInjected(),          // ← 追加
      isLib && dts({ insertTypesEntry: true })
    ].filter(Boolean),

    base: isLib ? '/' : '/react-sticky-elevator/',

    build: isLib
      ? {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          name: 'Elevator',
          formats: ['es', 'cjs', 'umd'],
          fileName: f => `elevator.${f}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        },
        cssCodeSplit: true,
        outDir: 'dist'
      }
      : {
        outDir: 'gh-pages'
      }
  };
});
