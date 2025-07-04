const SABI_FILL_STORAGE_KEY = 'sabifill_settings';

const popupBrowser = (globalThis as any).browser || (globalThis as any).chrome;

console.log('[SabiFill] Popup script loaded');

interface FillResponse {
	status: 'success' | 'error';
	fieldsFilled: number;
	message: string;
}

interface Settings {
	customEmailDomain: string;
	customPassword: string;
}

interface PopupUI {
	fillButton: HTMLElement;
	statusDiv: HTMLElement;
	settingsButton: HTMLElement;
	mainPanel: HTMLElement;
	settingsPanel: HTMLElement;
	emailDomainInput: HTMLInputElement;
	customPasswordInput: HTMLInputElement;
	saveSettingsButton: HTMLElement;
	backToMainButton: HTMLElement;
}

class PopupController {
	private ui: PopupUI;
	private currentPanel: 'main' | 'settings' = 'main';

	constructor() {
		this.ui = {
			fillButton: document.getElementById('fill')!,
			statusDiv: document.getElementById('status')!,
			settingsButton: document.getElementById('settings')!,
			mainPanel: document.getElementById('main-panel')!,
			settingsPanel: document.getElementById('settings-panel')!,
			emailDomainInput: document.getElementById(
				'email-domain'
			)! as HTMLInputElement,
			customPasswordInput: document.getElementById(
				'custom-password'
			)! as HTMLInputElement,
			saveSettingsButton: document.getElementById('save-settings')!,
			backToMainButton: document.getElementById('back-to-main')!,
		};
	}

	init(): void {
		this.setupEventListeners();
		this.loadSettings();
		this.updateUI();
	}

	private setupEventListeners(): void {
		this.ui.fillButton.addEventListener('click', () => this.handleFillClick());
		this.ui.settingsButton.addEventListener('click', () => this.showSettings());
		this.ui.saveSettingsButton.addEventListener('click', () =>
			this.saveSettings()
		);
		this.ui.backToMainButton.addEventListener('click', () => this.showMain());
	}

	private async handleFillClick(): Promise<void> {
		const button = this.ui.fillButton;
		const originalText = button.textContent;

		try {
			// Update UI state
			button.textContent = 'Filling...';
			button.setAttribute('disabled', 'true');
			this.updateStatus('Filling form...', 'info');

			// Get active tab
			const [tab] = await popupBrowser.tabs.query({
				active: true,
				currentWindow: true,
			});

			if (!tab?.id) {
				throw new Error('No active tab found');
			}

			// Send message to content script
			const response = await new Promise<FillResponse>((resolve, reject) => {
				popupBrowser.tabs.sendMessage(
					tab.id!,
					'fill-form',
					(response: FillResponse) => {
						if (popupBrowser.runtime.lastError) {
							reject(new Error(popupBrowser.runtime.lastError.message));
						} else {
							resolve(response);
						}
					}
				);
			});

			if (response.status === 'success') {
				button.textContent = 'Success!';
				button.style.backgroundColor = '#28a745';
				this.updateStatus(
					`✅ Filled ${response.fieldsFilled} fields`,
					'success'
				);
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			console.error('[SabiFill] Error:', error);
			button.textContent = 'Error!';
			button.style.backgroundColor = '#dc3545';
			this.updateStatus(
				`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
				'error'
			);
		}

		// Reset button after delay
		setTimeout(() => {
			button.textContent = originalText;
			button.style.backgroundColor = '';
			button.removeAttribute('disabled');
			this.updateStatus('Ready to fill forms', 'ready');
		}, 3000);
	}

	private showSettings(): void {
		this.ui.mainPanel.style.display = 'none';
		this.ui.settingsPanel.style.display = 'block';
		this.ui.settingsButton.classList.add('active');
		this.currentPanel = 'settings';
	}

	private showMain(): void {
		this.ui.mainPanel.style.display = 'block';
		this.ui.settingsPanel.style.display = 'none';
		this.ui.settingsButton.classList.remove('active');
		this.currentPanel = 'main';
	}

	private async loadSettings(): Promise<void> {
		try {
			const result = await popupBrowser.storage.sync.get(SABI_FILL_STORAGE_KEY);
			const settings: Settings = result[SABI_FILL_STORAGE_KEY] || {
				customEmailDomain: 'gmail.com',
				customPassword: '',
			};

			this.ui.emailDomainInput.value = settings.customEmailDomain;
			this.ui.customPasswordInput.value = settings.customPassword;
		} catch (error) {
			console.error('[SharpFilla] Failed to load settings:', error);
		}
	}

	private async saveSettings(): Promise<void> {
		const saveButton = this.ui.saveSettingsButton;
		const emailDomain = this.ui.emailDomainInput.value.trim();
		const customPassword = this.ui.customPasswordInput.value.trim();

		// Validate email domain
		if (!this.isValidEmailDomain(emailDomain)) {
			this.updateStatus('❌ Invalid email domain', 'error');
			return;
		}

		// Validate password if provided
		if (customPassword && customPassword.length < 8) {
			this.updateStatus('❌ Password must be at least 8 characters', 'error');
			return;
		}

		saveButton.setAttribute('disabled', 'true');
		saveButton.textContent = 'Saving...';

		try {
			const settings: Settings = {
				customEmailDomain: emailDomain,
				customPassword: customPassword,
			};

			await popupBrowser.storage.sync.set({
				[SABI_FILL_STORAGE_KEY]: settings,
			});

			this.updateStatus('✅ Settings saved!', 'success');
			saveButton.textContent = '💾 Save Settings';

			// Go back to main panel after successful save
			setTimeout(() => {
				this.showMain();
			}, 1500);
		} catch (error) {
			console.error('[SabiFill] Failed to save settings:', error);
			this.updateStatus('❌ Failed to save settings', 'error');
			saveButton.textContent = '💾 Save Settings';
		} finally {
			saveButton.removeAttribute('disabled');
		}
	}

	private isValidEmailDomain(domain: string): boolean {
		const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
		return domainRegex.test(domain);
	}

	private updateStatus(
		message: string,
		type: 'info' | 'success' | 'error' | 'ready'
	): void {
		if (!this.ui.statusDiv) return;

		this.ui.statusDiv.textContent = message;
		this.ui.statusDiv.className = `status status-${type}`;
	}

	private updateUI(): void {
		this.updateStatus('Ready to fill forms', 'ready');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const popup = new PopupController();
	popup.init();
});
