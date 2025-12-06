import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'vite-plugin-javascript-obfuscator';
import strip from '@rollup/plugin-strip';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  const plugins = [
    react(),
    ...(isProduction
      ? [
          strip({
            include: ['**/*.js', '**/*.ts', '**/*.vue', '**/*.tsx', '**/*.jsx'],
            functions: ['console.log', 'console.debug', 'console.info', 'console.error', 'assert'],
          }),
          obfuscator({
            controlFlowFlattening: true,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.2,
            disableConsoleOutput: true,
          }) as any,
        ]
      : []),
  ];

  return {
    plugins,
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },
  };
});
