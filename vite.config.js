import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				content: 'src/content.ts',
				popup: 'src/popup.ts',
				background: 'src/background.ts',
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
				manualChunks: undefined,
			},
		},
		// Disable code splitting for extensions
		lib: false,
		minify: false,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: 'popup.html', dest: '.' },
				{ src: 'public/icon.png', dest: '.' },
				// { src: 'manifest.json', dest: '.' },
				{
					src: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
					dest: '.',
				},
			],
		}),
	],
	// Ensure proper module resolution for extensions
	resolve: {
		alias: {
			'@': '/src',
		},
	},
});
