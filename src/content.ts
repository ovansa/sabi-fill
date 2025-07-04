// content.ts
import FakeDataGenerator, { FakeDataSet } from './data-generator';

interface FillOptions {
	override?: boolean;
}

interface FillResponse {
	status: 'success' | 'error';
	message: string;
	fieldsFilled: number;
	errors?: string[];
	fillOptions?: FillOptions | {};
}

class FormFiller {
	private browser: any;
	private filledFields: number = 0;
	private errors: string[] = [];

	// Consolidated fake data
	private fakeData: FakeDataSet;

	constructor() {
		this.browser = (globalThis as any).browser || (globalThis as any).chrome;
		this.fakeData = {} as FakeDataSet;
		console.log('[SabiFill] Generated fake data:', this.fakeData);
	}

	async fillAllInputs(options: FillOptions = {}): Promise<FillResponse> {
		console.log('[SabiFill] Starting form fill process...', { options });

		// Generate new fake data each time
		this.fakeData = await FakeDataGenerator.generate();
		console.log('[SabiFill] Generated new fake data:', this.fakeData);

		this.filledFields = 0;
		this.errors = [];

		try {
			// Add a small delay to ensure page is fully loaded
			await this.delay(500);

			this.fillByLabels(options.override);
			this.fillTextInputs(options.override);
			this.fillSelects(options.override);
			this.fillCustomSelects(options.override);
			this.fillRadioButtons(options.override);
			this.fillCheckboxes(options.override);
			this.fillTextareas(options.override);

			console.log(`[SabiFill] Filled ${this.filledFields} fields`);
			return {
				status: 'success',
				fillOptions: options,
				message: `Filled ${this.filledFields} fields successfully`,
				fieldsFilled: this.filledFields,
				errors: this.errors.length > 0 ? this.errors : undefined,
			};
		} catch (error) {
			console.error('[SabiFill] Error:', error);
			return {
				status: 'error',
				fillOptions: options,
				message: 'Failed to fill form',
				fieldsFilled: this.filledFields,
				errors: [
					...this.errors,
					error instanceof Error ? error.message : 'Unknown error',
				],
			};
		}
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private fillByLabels(override = false): void {
		console.log('[SabiFill] Filling by labels...');

		// Find all labels and their associated form elements
		const labels = document.querySelectorAll('label');

		labels.forEach((label) => {
			try {
				const labelText = label.textContent?.toLowerCase().trim() || '';
				console.log('[SabiFill] Processing label:', labelText);

				// Find the associated form element
				let formElement: HTMLElement | null = null;

				// Method 1: Label with 'for' attribute
				const forAttr = label.getAttribute('for');
				if (forAttr) {
					formElement = document.getElementById(forAttr);
				}

				// Method 2: Label contains the form element
				if (!formElement) {
					formElement = label.querySelector('input, select, textarea');
				}

				// Method 3: Next sibling after label
				if (!formElement) {
					let sibling = label.nextElementSibling;
					while (sibling && !formElement) {
						if (sibling.matches('input, select, textarea')) {
							formElement = sibling as HTMLElement;
						} else {
							// Check if sibling contains form elements
							formElement = sibling.querySelector('input, select, textarea');
						}
						sibling = sibling.nextElementSibling;
					}
				}

				// Method 4: Look in parent container
				if (!formElement) {
					const container = label.parentElement;
					if (container) {
						formElement = container.querySelector(
							'input:not([type="hidden"]), select, textarea'
						);
					}
				}

				if (formElement) {
					if (!override && formElement?.hasAttribute('data-filled')) {
						return;
					}
					this.fillElementByLabel(formElement, labelText);
					formElement.setAttribute('data-filled', 'true');
				}
			} catch (error) {
				this.errors.push(
					`Failed to process label "${label.textContent}": ${error}`
				);
			}
		});
	}

	private fillElementByLabel(element: HTMLElement, labelText: string): void {
		const tagName = element.tagName.toLowerCase();

		try {
			if (tagName === 'input') {
				const input = element as HTMLInputElement;
				const value = this.getValueByLabel(labelText, input.type);

				console.log(`[SabiFill] Filling input "${labelText}" with "${value}"`);
				input.value = value;
				this.triggerEvents(input);
				this.filledFields++;
				if (value) {
					console.log(
						`[SabiFill] Filling input "${labelText}" with "${value}"`
					);
					input.value = value;
					this.triggerEvents(input);
					this.filledFields++;
				}
			} else if (tagName === 'textarea') {
				const textarea = element as HTMLTextAreaElement;
				const value = this.getValueByLabel(labelText, 'textarea');
				if (value) {
					console.log(
						`[SabiFill] Filling textarea "${labelText}" with "${value}"`
					);
					textarea.value = value;
					this.triggerEvents(textarea);
					this.filledFields++;
				}
			} else if (tagName === 'select') {
				const select = element as HTMLSelectElement;
				this.fillSelectByLabel(select, labelText);
			}
		} catch (error) {
			this.errors.push(
				`Failed to fill element for label "${labelText}": ${error}`
			);
		}
	}

	private getValueByLabel(
		labelText: string,
		inputType: string = 'text'
	): string {
		const label = labelText.toLowerCase();

		// Credit/Debit Card fields
		if (this.isCreditCardNumber(label)) {
			return this.fakeData.ccNumberFormatted;
		}

		if (this.isCreditCardName(label)) {
			return this.fakeData.ccName;
		}

		if (this.isCreditCardExpiry(label)) {
			if (label.includes('month') || label.includes('mm')) {
				return this.fakeData.ccExpiryMonth;
			} else if (label.includes('year') || label.includes('yy')) {
				return label.includes('yyyy')
					? this.fakeData.ccExpiryYear4
					: this.fakeData.ccExpiryYear;
			}
			return this.fakeData.ccExpiry;
		}

		if (this.isCreditCardCVV(label)) {
			return this.fakeData.ccCvv;
		}

		// Company name variations
		if (
			label.includes('company') ||
			label.includes('business') ||
			label.includes('organization')
		) {
			return this.fakeData.company;
		}

		// License number variations
		if (
			label.includes('license') ||
			label.includes('licence') ||
			label.includes('registration')
		) {
			return this.fakeData.licenseNumber;
		}

		// First name variations
		if (label.includes('first') && label.includes('name')) {
			return this.fakeData.firstName;
		}

		// Last name variations
		if (label.includes('last') && label.includes('name')) {
			return this.fakeData.lastName;
		}

		// Email variations
		if (label.includes('email')) {
			return label.includes('work')
				? this.fakeData.workEmail
				: this.fakeData.email;
		}

		// Phone variations
		if (
			label.includes('phone') ||
			label.includes('mobile') ||
			label.includes('tel')
		) {
			return this.fakeData.phone;
		}

		// Address variations
		if (label.includes('address') && inputType === 'textarea') {
			return this.fakeData.address;
		}

		if (label.includes('street')) {
			return this.fakeData.street;
		}

		if (label.includes('city')) {
			return this.fakeData.city;
		}

		if (label.includes('zip') || label.includes('postal')) {
			return this.fakeData.zipCode;
		}

		// URL variations
		if (
			label.includes('url') ||
			label.includes('website') ||
			inputType === 'url'
		) {
			return label.includes('webhook')
				? this.fakeData.website
				: this.fakeData.website;
		}

		// Password
		if (inputType === 'password') {
			return this.fakeData.password;
		}

		// Number inputs
		if (inputType === 'number') {
			if (label.includes('age')) return this.fakeData.age;
			if (label.includes('salary')) return this.fakeData.salary;
			return '25';
		}

		// Date inputs
		if (inputType === 'date') {
			return label.includes('birth')
				? this.fakeData.dateOfBirth
				: this.getRandomDate();
		}

		// Default text input
		if (inputType === 'text' || inputType === '') {
			// If it's a generic text field, use first name
			return this.fakeData.firstName;
		}

		return '';
	}

	private isCreditCardNumber(label: string): boolean {
		return (
			label.includes('card number') ||
			label.includes('card no') ||
			label.includes('credit card') ||
			label.includes('debit card') ||
			label.includes('cc number') ||
			label.includes('cc no') ||
			label.includes('cardnumber') ||
			(label.includes('number') &&
				(label.includes('card') || label.includes('cc')))
		);
	}

	private isCreditCardName(label: string): boolean {
		return (
			(label.includes('card') && label.includes('name')) ||
			label.includes('cardholder') ||
			label.includes('card holder') ||
			(label.includes('name') && label.includes('card'))
		);
	}

	private isCreditCardExpiry(label: string): boolean {
		return (
			label.includes('expir') ||
			label.includes('exp') ||
			label.includes('valid') ||
			(label.includes('month') && label.includes('year')) ||
			label.includes('mm/yy') ||
			label.includes('mm/yyyy')
		);
	}

	private isCreditCardCVV(label: string): boolean {
		return (
			label.includes('cvv') ||
			label.includes('cvc') ||
			label.includes('ccv') ||
			label.includes('security code') ||
			label.includes('card code') ||
			(label.includes('code') && label.includes('card'))
		);
	}

	private fillSelectByLabel(
		select: HTMLSelectElement,
		labelText: string
	): void {
		const label = labelText.toLowerCase();
		let filled = false;

		try {
			if (label.includes('country')) {
				filled =
					this.selectOption(select, 'Nigeria') ||
					this.selectOption(select, 'NG');
			} else if (label.includes('state')) {
				filled = this.selectOption(select, 'Lagos');
			} else if (label.includes('gender')) {
				filled =
					this.selectOption(select, 'male') ||
					this.selectOption(select, 'Male');
			} else if (this.isCreditCardExpiry(label)) {
				if (label.includes('month')) {
					filled =
						this.selectOption(select, '12') ||
						this.selectOption(select, 'December');
				} else if (label.includes('year')) {
					filled =
						this.selectOption(select, '2026') ||
						this.selectOption(select, '26');
				}
			} else if (select.options.length > 1) {
				// Default to first non-empty option
				select.selectedIndex = 1;
				filled = true;
			}

			if (filled) {
				console.log(`[SabiFill] Filled select "${labelText}"`);
				this.triggerEvents(select);
				this.filledFields++;
			}
		} catch (error) {
			this.errors.push(
				`Failed to fill select for label "${labelText}": ${error}`
			);
		}
	}

	private fillTextInputs(override = false): void {
		const selector = override
			? 'input:not([type="radio"]):not([type="checkbox"]):not([type="file"])'
			: 'input:not([type="radio"]):not([type="checkbox"]):not([type="file"]):not([data-filled])';
		const inputs = document.querySelectorAll(selector);

		inputs.forEach((input) => {
			try {
				const inputElement = input as HTMLInputElement;
				this.fillInput(inputElement);
				inputElement.setAttribute('data-filled', 'true');
			} catch (error) {
				this.errors.push(`Failed to fill input: ${error}`);
			}
		});
	}

	private fillInput(input: HTMLInputElement): void {
		const type = input.type.toLowerCase();
		const id = input.id.toLowerCase();
		const name = input.name.toLowerCase();
		const placeholder = input.placeholder?.toLowerCase() || '';
		const className = input.className.toLowerCase();
		const identifiers = `${id} ${name} ${placeholder} ${className}`;

		let value = '';

		// Credit card field detection
		if (this.isCreditCardField(identifiers)) {
			value = this.getCreditCardValue(identifiers, type);
		}
		// Special handling for phone input
		else if (
			input.classList.contains('PhoneInputInput') ||
			identifiers.includes('phone')
		) {
			value = this.fakeData.phone;
		} else {
			switch (type) {
				case 'text':
					value = this.getTextInputValue(identifiers);
					break;
				case 'email':
					value = identifiers.includes('work')
						? this.fakeData.workEmail
						: this.fakeData.email;
					break;
				case 'password':
					value = this.fakeData.password;
					break;
				case 'tel':
					value = this.fakeData.phone;
					break;
				case 'number':
					value = this.getNumberInputValue(identifiers);
					break;
				case 'url':
					value = this.fakeData.website;
					break;
				case 'date':
					value = identifiers.includes('birth')
						? this.fakeData.dateOfBirth
						: this.getRandomDate();
					break;
				case 'time':
					value = '14:30';
					break;
				case 'datetime-local':
					value = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
						.toISOString()
						.slice(0, 16);
					break;
				case 'color':
					value = '#3B82F6';
					break;
				case 'range':
					value = '50';
					break;
				default:
					value = this.getTextInputValue(identifiers);
			}
		}

		if (value) {
			input.value = value;
			this.triggerEvents(input);
			this.filledFields++;
		}
	}

	private isCreditCardField(identifiers: string): boolean {
		const cardKeywords = [
			'card',
			'cc',
			'credit',
			'debit',
			'payment',
			'cardnumber',
			'cardno',
			'ccnum',
			'ccnumber',
			'cvv',
			'cvc',
			'ccv',
			'security',
			'expir',
			'exp',
			'valid',
			'cardholder',
		];

		return cardKeywords.some((keyword) => identifiers.includes(keyword));
	}

	private getCreditCardValue(identifiers: string, type: string): string {
		// Card number
		if (
			identifiers.includes('number') ||
			identifiers.includes('num') ||
			identifiers.includes('ccnum')
		) {
			// Some forms expect unformatted numbers
			if (identifiers.includes('format') || type === 'tel') {
				return this.fakeData.ccNumber;
			}
			return this.fakeData.ccNumberFormatted;
		}

		// Cardholder name
		if (identifiers.includes('name') || identifiers.includes('holder')) {
			return this.fakeData.ccName;
		}

		// CVV/CVC
		if (
			identifiers.includes('cvv') ||
			identifiers.includes('cvc') ||
			identifiers.includes('ccv') ||
			identifiers.includes('security')
		) {
			return this.fakeData.ccCvv;
		}

		// Expiry month
		if (identifiers.includes('month') || identifiers.includes('mm')) {
			return this.fakeData.ccExpiryMonth;
		}

		// Expiry year
		if (identifiers.includes('year') || identifiers.includes('yy')) {
			return identifiers.includes('yyyy')
				? this.fakeData.ccExpiryYear4
				: this.fakeData.ccExpiryYear;
		}

		// General expiry
		if (
			identifiers.includes('expir') ||
			identifiers.includes('exp') ||
			identifiers.includes('valid')
		) {
			return this.fakeData.ccExpiry;
		}

		return '';
	}

	private getTextInputValue(identifiers: string): string {
		if (identifiers.includes('company')) return this.fakeData.company;
		if (identifiers.includes('license')) return this.fakeData.licenseNumber;
		if (identifiers.includes('first')) return this.fakeData.firstName;
		if (identifiers.includes('last')) return this.fakeData.lastName;
		if (identifiers.includes('user')) return this.fakeData.username;
		if (identifiers.includes('street')) return this.fakeData.street;
		if (identifiers.includes('city')) return this.fakeData.city;
		if (identifiers.includes('zip')) return this.fakeData.zipCode;
		return this.fakeData.firstName;
	}

	private getNumberInputValue(identifiers: string): string {
		if (identifiers.includes('age')) return this.fakeData.age;
		if (identifiers.includes('salary')) return this.fakeData.salary;
		// Check for credit card CVV in number fields
		if (
			identifiers.includes('cvv') ||
			identifiers.includes('cvc') ||
			identifiers.includes('security')
		) {
			return this.fakeData.ccCvv;
		}
		return '25';
	}

	private getRandomDate(): string {
		const start = new Date(2020, 0, 1);
		const end = new Date();
		const date = new Date(
			start.getTime() + Math.random() * (end.getTime() - start.getTime())
		);
		return date.toISOString().split('T')[0];
	}

	private fillSelects(override = false): void {
		const selector = override ? 'select' : 'select:not([data-filled])';
		const selects = document.querySelectorAll(selector);

		selects.forEach((select) => {
			try {
				const selectElement = select as HTMLSelectElement;
				const identifiers =
					`${selectElement.id} ${selectElement.name} ${selectElement.className}`.toLowerCase();

				if (selectElement.options.length > 1) {
					let filled = false;

					// Handle credit card expiry selects
					if (
						identifiers.includes('month') &&
						(identifiers.includes('exp') || identifiers.includes('card'))
					) {
						filled =
							this.selectOption(selectElement, '12') ||
							this.selectOption(selectElement, 'December');
					} else if (
						identifiers.includes('year') &&
						(identifiers.includes('exp') || identifiers.includes('card'))
					) {
						filled =
							this.selectOption(selectElement, '2026') ||
							this.selectOption(selectElement, '26');
					}
					// Try to find Nigeria for country selects
					else if (
						selectElement.querySelector('option[value="NG"]') ||
						selectElement.querySelector('option[value="Nigeria"]')
					) {
						filled =
							this.selectOption(selectElement, 'Nigeria') ||
							this.selectOption(selectElement, 'NG');
					} else {
						selectElement.selectedIndex = 1;
						filled = true;
					}

					if (filled) {
						this.triggerEvents(selectElement);
						this.filledFields++;
					}
					selectElement.setAttribute('data-filled', 'true');
				}
			} catch (error) {
				this.errors.push(`Failed to fill select: ${error}`);
			}
		});
	}

	private async fillCustomSelects(override = false): Promise<void> {
		console.log('[SabiFill] Filling custom selects...');

		// const selector = override ? 'select' :
		// Handle custom select dropdowns
		const customSelects = document.querySelectorAll(
			'[role="combobox"]:not([data-filled])'
		);

		for (const customSelect of customSelects) {
			try {
				const element = customSelect as HTMLElement;
				const ariaLabel =
					element.getAttribute('aria-label')?.toLowerCase() || '';
				const labelText =
					this.getCustomSelectLabel(element)?.toLowerCase() || '';
				const identifiers = `${ariaLabel} ${labelText}`;

				console.log(`[SabiFill] Processing custom select: ${identifiers}`);

				// Click to open the dropdown
				element.click();
				await this.delay(300); // Wait for dropdown to open

				let selected = false;
				if (identifiers.includes('country')) {
					selected = await this.selectCustomOption('Nigeria');
				} else if (identifiers.includes('state')) {
					selected = await this.selectCustomOption('Lagos');
				} else if (identifiers.includes('supported')) {
					selected = await this.selectCustomOption('Nigeria');
				} else if (
					identifiers.includes('month') &&
					identifiers.includes('exp')
				) {
					selected =
						(await this.selectCustomOption('12')) ||
						(await this.selectCustomOption('December'));
				} else if (
					identifiers.includes('year') &&
					identifiers.includes('exp')
				) {
					selected =
						(await this.selectCustomOption('2026')) ||
						(await this.selectCustomOption('26'));
				}

				if (selected) {
					this.filledFields++;
					element.setAttribute('data-filled', 'true');
					console.log(`[SabiFill] Filled custom select: ${identifiers}`);
				}

				// Click elsewhere to close dropdown
				document.body.click();
				await this.delay(100);
			} catch (error) {
				this.errors.push(`Failed to fill custom select: ${error}`);
			}
		}
	}

	private getCustomSelectLabel(element: HTMLElement): string {
		// Find the label in the same container
		const container = element.closest('div, label, .form-group, .input-group');
		if (container) {
			// Look for label element in container or as parent
			const label =
				container.tagName === 'LABEL'
					? container
					: container.querySelector('label');

			if (label) {
				// Clean up label text by removing any asterisks or extra whitespace
				return label.textContent?.replace(/\*/g, '').trim() || '';
			}
		}
		return '';
	}

	private async selectCustomOption(value: string): Promise<boolean> {
		await this.delay(100);

		// Expanded list of possible selectors for custom dropdown options
		const selectors = [
			'[role="option"]',
			'[role="listbox"] [role="option"]', // For more specific targeting
			'.option',
			'.dropdown-item',
			'li[data-value]',
			'div[data-value]',
			'[data-value]', // More generic
			'[data-testid*="option"]',
			'[data-testid*="item"]',
			'.select-option',
			'.dropdown-option',
			'.ant-select-item', // Ant Design
			'.MuiMenuItem-root', // Material UI
			'.el-select-dropdown__item', // Element UI
			'.v-list-item', // Vuetify
		];

		// Try to find and click the matching option
		for (const selector of selectors) {
			const options = document.querySelectorAll(selector);
			for (const option of options) {
				const optionText = option.textContent?.toLowerCase().trim() || '';
				const optionValue =
					option.getAttribute('data-value')?.toLowerCase().trim() ||
					option.getAttribute('value')?.toLowerCase().trim() ||
					option.getAttribute('aria-label')?.toLowerCase().trim() ||
					'';

				if (
					optionText.includes(value.toLowerCase()) ||
					optionValue.includes(value.toLowerCase())
				) {
					(option as HTMLElement).click();
					await this.delay(50); // Small delay after click
					return true;
				}
			}
		}

		return false;
	}

	private selectOption(select: HTMLSelectElement, value: string): boolean {
		// First try exact matches
		const exactMatch = Array.from(select.options).find(
			(opt) =>
				opt.value.toLowerCase() === value.toLowerCase() ||
				opt.text.toLowerCase() === value.toLowerCase()
		);

		if (exactMatch) {
			exactMatch.selected = true;
			return true;
		}

		// Fall back to partial matches if no exact match found
		const partialMatch = Array.from(select.options).find(
			(opt) =>
				opt.value.toLowerCase().includes(value.toLowerCase()) ||
				opt.text.toLowerCase().includes(value.toLowerCase())
		);

		if (partialMatch) {
			partialMatch.selected = true;
			return true;
		}

		return false;
	}

	private fillRadioButtons(override = false): void {
		const selector = override
			? 'input[type="radio"]'
			: 'input[type="radio"]:not([data-filled])';
		const radioGroups = new Map<string, HTMLInputElement[]>();

		document.querySelectorAll(selector).forEach((radio) => {
			const input = radio as HTMLInputElement;
			if (!radioGroups.has(input.name)) {
				radioGroups.set(input.name, []);
			}
			radioGroups.get(input.name)!.push(input);
		});

		radioGroups.forEach((radios) => {
			try {
				if (radios.length > 0) {
					if (!override && radios.some((r) => r.hasAttribute('data-filled'))) {
						return;
					}

					const radioToSelect = radios[0];
					radioToSelect.checked = true;
					this.triggerEvents(radioToSelect);
					this.filledFields++;
					radios.forEach((r) => r.setAttribute('data-filled', 'true'));
				}
			} catch (error) {
				this.errors.push(`Failed to fill radio group: ${error}`);
			}
		});
	}

	private fillCheckboxes(override = false): void {
		const selector = override
			? 'input[type="checkbox"]'
			: 'input[type="checkbox"]:not([data-filled])';

		const checkboxes = document.querySelectorAll(selector);

		checkboxes.forEach((checkbox) => {
			try {
				const input = checkbox as HTMLInputElement;

				// Skip if already filled and not overriding
				if (!override && input.hasAttribute('data-filled')) {
					return;
				}

				const label = this.getAssociatedLabel(input)?.toLowerCase() || '';
				const identifiers =
					`${input.id} ${input.name} ${input.value} ${label}`.toLowerCase();

				if (
					identifiers.includes('terms') ||
					identifiers.includes('agree') ||
					identifiers.includes('accept') ||
					identifiers.includes('conditions') ||
					identifiers.includes('privacy') ||
					input.required
				) {
					input.checked = true;
					this.triggerEvents(input);
					this.filledFields++;
				}
				input.setAttribute('data-filled', 'true');
			} catch (error) {
				this.errors.push(`Failed to fill checkbox: ${error}`);
			}
		});
	}

	private fillTextareas(override = false): void {
		const selector = override ? 'textarea' : 'textarea:not([data-filled])';

		const textareas = document.querySelectorAll(selector);

		textareas.forEach((textarea) => {
			try {
				const element = textarea as HTMLTextAreaElement;

				// Skip if already filled and not overriding
				if (!override && element.hasAttribute('data-filled')) {
					return;
				}

				const label = this.getAssociatedLabel(element)?.toLowerCase() || '';
				const identifiers =
					`${element.id} ${element.name} ${element.placeholder} ${label}`.toLowerCase();

				let value = '';
				if (identifiers.includes('address')) {
					value = this.fakeData.address;
				} else if (identifiers.includes('bio')) {
					value = this.fakeData.bio;
				} else if (
					identifiers.includes('comment') ||
					identifiers.includes('message')
				) {
					value = 'This is a sample comment or message for testing purposes.';
				} else if (identifiers.includes('description')) {
					value = 'This is a sample description for testing purposes.';
				} else {
					value = 'This is sample text content for testing purposes.';
				}

				element.value = value;
				this.triggerEvents(element);
				this.filledFields++;
				element.setAttribute('data-filled', 'true');
			} catch (error) {
				this.errors.push(`Failed to fill textarea: ${error}`);
			}
		});
	}

	private getAssociatedLabel(element: HTMLElement): string {
		// Method 1: Label with 'for' attribute
		if (element.id) {
			const label = document.querySelector(`label[for="${element.id}"]`);
			if (label) return label.textContent || '';
		}

		// Method 2: Parent label
		const parentLabel = element.closest('label');
		if (parentLabel) return parentLabel.textContent || '';

		// Method 3: Previous sibling label
		const previousElement = element.previousElementSibling;
		if (previousElement && previousElement.tagName.toLowerCase() === 'label') {
			return previousElement.textContent || '';
		}

		// Method 4: Label in parent container
		const container = element.parentElement;
		if (container) {
			const label = container.querySelector('label');
			if (label) return label.textContent || '';
		}

		return '';
	}

	private triggerEvents(element: HTMLElement): void {
		const events = ['input', 'change', 'blur', 'focus'];

		events.forEach((eventType) => {
			const event = new Event(eventType, {
				bubbles: true,
				cancelable: true,
			});
			element.dispatchEvent(event);
		});

		// Trigger React events
		const reactEvents = ['onChange', 'onInput', 'onBlur'];
		reactEvents.forEach((event) => {
			if ((element as any)[event]) {
				try {
					(element as any)[event]({ target: element, currentTarget: element });
				} catch (e) {
					// Ignore React event errors
				}
			}
		});
	}

	// Message listener
	init(): void {
		this.browser.runtime.onMessage.addListener(
			(message: any, sender: any, sendResponse: any) => {
				let options: FillOptions = { override: false };

				// if (typeof message === 'object' && message.action === 'fill-form') {
				// 	// New format: { action: 'fill-form', override: boolean }
				// 	console.log('checking if object');
				// 	options = {
				// 		override: message.override || false,
				// 	};
				// } else if (message === 'fill-form') {
				// 	console.log('checking if not object');
				// 	// Old string format (maintain backward compatibility)
				// 	options = { override: false };
				// }

				// Log the parsed options
				console.log('[SabiFill] Fill options:', JSON.stringify(options));

				if (message === 'fill-form' || message?.action === 'fill-form') {
					this.fillAllInputs(options)
						.then((response) => {
							// Include the options in the response for debugging
							const fullResponse: FillResponse = {
								...response,
								fillOptions: options,
							};
							sendResponse(fullResponse);
						})
						.catch((error) => {
							sendResponse({
								status: 'error',
								message: error.message,
								fieldsFilled: this.filledFields,
								fillOptions: options,
								errors: [error.message],
							});
						});
					return true; // Keep message channel open
				}
			}
		);
	}
}

// Initialize
const formFiller = new FormFiller();
formFiller.init();
console.log('[SabiFill] Content script loaded');
