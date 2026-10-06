import { defineWorkspace } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineWorkspace([
  {
    // browser (jsdom) tests, Svelte resolved to its client runtime
    plugins: [sveltekit(), svelteTesting()],
    test: {
      name: 'client',
      include: ['src/**/*.{test,spec}.{js,ts}'],
      exclude: ['src/**/*.ssr.spec.{js,ts}'],
      setupFiles: ['./tests/setup.ts'],
      globals: true,
      environment: 'jsdom'
    }
  },
  {
    // server-side rendering tests, Svelte resolved to its server runtime
    plugins: [sveltekit()],
    test: {
      name: 'ssr',
      include: ['src/**/*.ssr.spec.{js,ts}'],
      globals: true,
      environment: 'node'
    }
  }
]);
