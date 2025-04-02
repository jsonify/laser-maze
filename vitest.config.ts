import react from '@vitejs/plugin-react';

/** @type {import('vitest').UserConfigExport} */
export default {
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__tests__/**',
      ],
    },
    setupFiles: ['./src/setupTests.ts'],
  },
};
