import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // or '404.html' or null depending on needs
			precompress: false,
			strict: true
		}),
		// Ensure prerendering is enabled for all pages for a static site
		prerender: { entries: ['*'] }
	}
};

export default config;
// Ensure global prerender is enabled
export const prerender = true;
