import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [sveltekit()],
    define: {
      __RANKING_LIST__: JSON.stringify(Number(env.RANKING_LIST) || 10),
      __HIGHLIGHT_START__: JSON.stringify(Number(env.HIGHLIGHT_START) || 3)
    }
  };
});
