const browserAPI = (globalThis as any).browser || (globalThis as any).chrome;

console.log('[SharpFilla] Background script loaded');

// Check if storage API is available
if (!browserAPI || !browserAPI.storage || !browserAPI.storage.sync) {
	console.error('[SharpFilla] Storage API not available');
	throw new Error('Browser storage API not available');
}

browserAPI.runtime.onInstalled.addListener(() => {
	console.log('[SharpFilla] Extension installed');

	// Set default configuration with error handling
	browserAPI.storage.sync
		.set({
			config: {
				animationSpeed: 'medium',
				visualFeedback: true,
				skipHiddenFields: true,
				respectRequiredOnly: false,
				currentProfile: 'Default Professional',
			},
		})
		.then(() => {
			console.log('[SharpFilla] Default config saved');
		})
		.catch((error: any) => {
			console.error('[SharpFilla] Failed to save config:', error);
		});
});

browserAPI.runtime.onMessage.addListener(
	(message: any, sender: any, sendResponse: any) => {
		console.log('[SharpFilla] Background received message:', message);
		sendResponse({ status: 'received' });
	}
);
