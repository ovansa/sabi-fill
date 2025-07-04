const SABI_FILL_STORAGE_KEY = 'sabifill_settings';

export interface CustomSettings {
	customEmailDomain?: string;
	customPassword?: string;
}

export class SettingsManager {
	private static readonly STORAGE_KEY = SABI_FILL_STORAGE_KEY;
	private browser: any;

	constructor() {
		this.browser = (globalThis as any).browser || (globalThis as any).chrome;
	}

	async getSettings(): Promise<CustomSettings> {
		try {
			const result = await this.browser.storage.sync.get(
				SettingsManager.STORAGE_KEY
			);
			return result[SettingsManager.STORAGE_KEY] || {};
		} catch (error) {
			console.error('[SabiFill] Failed to get settings:', error);
			return {};
		}
	}

	async saveSettings(settings: CustomSettings): Promise<void> {
		try {
			await this.browser.storage.sync.set({
				[SettingsManager.STORAGE_KEY]: settings,
			});
			console.log('[SabiFill] Settings saved:', settings);
		} catch (error) {
			console.error('[SabiFill] Failed to save settings:', error);
			throw error;
		}
	}

	async getEmailDomain(): Promise<string> {
		const settings = await this.getSettings();
		return settings.customEmailDomain || 'gmail.com';
	}

	async getPassword(): Promise<string | null> {
		const settings = await this.getSettings();
		return settings.customPassword || null;
	}

	async updateEmailDomain(domain: string): Promise<void> {
		const settings = await this.getSettings();
		settings.customEmailDomain = domain;
		await this.saveSettings(settings);
	}

	async updatePassword(password: string): Promise<void> {
		const settings = await this.getSettings();
		settings.customPassword = password;
		await this.saveSettings(settings);
	}

	async clearSettings(): Promise<void> {
		await this.browser.storage.sync.remove(SettingsManager.STORAGE_KEY);
	}

	static isValidEmailDomain(domain: string): boolean {
		const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
		return domainRegex.test(domain);
	}

	static isValidPassword(password: string): boolean {
		return password.length >= 8;
	}
}
