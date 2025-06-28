// content.ts
interface FillResponse {
	status: 'success' | 'error';
	message: string;
	fieldsFilled: number;
	errors?: string[];
}

class FormFiller {
	private browser: any;
	private filledFields: number = 0;
	private errors: string[] = [];

	// Consolidated fake data
	private fakeData = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		workEmail: 'john.doe@company.com',
		phone: '08012345678',
		emergencyPhone: '08087654321',
		company: 'Tech Solutions Inc',
		jobTitle: 'Software Developer',
		street: '123 Main Street',
		apartment: 'Apt 4B',
		city: 'Lagos',
		zipCode: '100001',
		username: 'johndoe123',
		password: 'SecurePass123!',
		ccNumber: '4532 1234 5678 9012',
		ccName: 'John Doe',
		ccExpiry: '12/26',
		ccCvv: '123',
		age: '30',
		salary: '75000',
		website: 'https://johndoe.dev',
		linkedin: 'https://linkedin.com/in/johndoe',
		bio: 'Experienced software developer with a passion for creating innovative solutions.',
		gender: 'male',
		country: 'Nigeria',
		state: 'Lagos',
		dateOfBirth: '1990-01-01',
	};

	constructor() {
		this.browser = (globalThis as any).browser || (globalThis as any).chrome;
	}

	async fillAllInputs(): Promise<FillResponse> {
		console.log('[SharpFilla] Starting form fill process...');
		this.filledFields = 0;
		this.errors = [];

		try {
			this.fillTextInputs();
			this.fillSelects();
			this.fillRadioButtons();
			this.fillCheckboxes();
			this.fillTextareas();

			console.log(`[SharpFilla] Filled ${this.filledFields} fields`);
			return {
				status: 'success',
				message: `Filled ${this.filledFields} fields successfully`,
				fieldsFilled: this.filledFields,
				errors: this.errors.length > 0 ? this.errors : undefined,
			};
		} catch (error) {
			console.error('[SharpFilla] Error:', error);
			return {
				status: 'error',
				message: 'Failed to fill form',
				fieldsFilled: this.filledFields,
				errors: [
					...this.errors,
					error instanceof Error ? error.message : 'Unknown error',
				],
			};
		}
	}

	private fillTextInputs(): void {
		const inputs = document.querySelectorAll(
			'input:not([type="radio"]):not([type="checkbox"]):not([type="file"])'
		);

		inputs.forEach((input) => {
			try {
				const inputElement = input as HTMLInputElement;
				this.fillInput(inputElement);
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
		const identifiers = `${id} ${name} ${placeholder}`;

		let value = '';

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
			case 'phone':
				value = identifiers.includes('emergency')
					? this.fakeData.emergencyPhone
					: this.fakeData.phone;
				break;
			case 'number':
				value = this.getNumberInputValue(identifiers);
				break;
			case 'url':
				value = identifiers.includes('linkedin')
					? this.fakeData.linkedin
					: this.fakeData.website;
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
				value = `${this.fakeData.firstName} ${this.fakeData.lastName}`;
		}

		input.value = value;
		this.triggerEvents(input);
		this.filledFields++;
	}

	private getTextInputValue(identifiers: string): string {
		if (identifiers.includes('first')) return this.fakeData.firstName;
		if (identifiers.includes('last')) return this.fakeData.lastName;
		if (identifiers.includes('company')) return this.fakeData.company;
		if (identifiers.includes('job')) return this.fakeData.jobTitle;
		if (identifiers.includes('street')) return this.fakeData.street;
		if (identifiers.includes('apt')) return this.fakeData.apartment;
		if (identifiers.includes('city')) return this.fakeData.city;
		if (identifiers.includes('zip')) return this.fakeData.zipCode;
		if (identifiers.includes('user')) return this.fakeData.username;
		if (identifiers.includes('card') && identifiers.includes('name'))
			return this.fakeData.ccName;
		if (identifiers.includes('card')) return this.fakeData.ccNumber;
		if (identifiers.includes('exp')) return this.fakeData.ccExpiry;
		if (identifiers.includes('cvv')) return this.fakeData.ccCvv;
		return `${this.fakeData.firstName} ${this.fakeData.lastName}`;
	}

	private getNumberInputValue(identifiers: string): string {
		if (identifiers.includes('age')) return this.fakeData.age;
		if (identifiers.includes('salary')) return this.fakeData.salary;
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

	private fillSelects(): void {
		const selects = document.querySelectorAll('select');

		selects.forEach((select) => {
			try {
				if (select.options.length > 1) {
					const identifiers = `${select.id} ${select.name}`.toLowerCase();

					if (identifiers.includes('country')) {
						this.selectOption(select, 'Nigeria') ||
							this.selectOption(select, 'NG') ||
							(select.selectedIndex = 1);
					} else if (identifiers.includes('state')) {
						this.selectOption(select, 'Lagos') || (select.selectedIndex = 1);
					} else if (identifiers.includes('gender')) {
						this.selectOption(select, 'male') ||
							this.selectOption(select, 'm') ||
							(select.selectedIndex = 1);
					} else {
						select.selectedIndex = 1;
					}

					this.triggerEvents(select);
					this.filledFields++;
				}
			} catch (error) {
				this.errors.push(`Failed to fill select: ${error}`);
			}
		});
	}

	private selectOption(select: HTMLSelectElement, value: string): boolean {
		const option = Array.from(select.options).find(
			(opt) =>
				opt.value.toLowerCase().includes(value.toLowerCase()) ||
				opt.text.toLowerCase().includes(value.toLowerCase())
		);
		if (option) {
			option.selected = true;
			return true;
		}
		return false;
	}

	private fillRadioButtons(): void {
		const radioGroups = new Map<string, HTMLInputElement[]>();

		document.querySelectorAll('input[type="radio"]').forEach((radio) => {
			const input = radio as HTMLInputElement;
			if (!radioGroups.has(input.name)) {
				radioGroups.set(input.name, []);
			}
			radioGroups.get(input.name)!.push(input);
		});

		radioGroups.forEach((radios) => {
			try {
				if (radios.length > 0) {
					const groupName = radios[0].name.toLowerCase();
					const isGender =
						groupName.includes('gender') || groupName.includes('sex');

					const radioToSelect = isGender
						? radios.find((r) => r.value.toLowerCase().includes('male')) ||
						  radios[0]
						: radios[0];

					radioToSelect.checked = true;
					this.triggerEvents(radioToSelect);
					this.filledFields++;
				}
			} catch (error) {
				this.errors.push(`Failed to fill radio group: ${error}`);
			}
		});
	}

	private fillCheckboxes(): void {
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');

		checkboxes.forEach((checkbox) => {
			try {
				const input = checkbox as HTMLInputElement;
				const identifiers =
					`${input.id} ${input.name} ${input.value}`.toLowerCase();

				if (
					identifiers.includes('terms') ||
					identifiers.includes('agree') ||
					input.required
				) {
					input.checked = true;
					this.triggerEvents(input);
					this.filledFields++;
				} else if (identifiers.includes('newsletter')) {
					input.checked = true;
					this.triggerEvents(input);
					this.filledFields++;
				}
			} catch (error) {
				this.errors.push(`Failed to fill checkbox: ${error}`);
			}
		});
	}

	private fillTextareas(): void {
		const textareas = document.querySelectorAll('textarea');

		textareas.forEach((textarea) => {
			try {
				const identifiers = `${textarea.id} ${textarea.name}`.toLowerCase();
				textarea.value = identifiers.includes('bio')
					? this.fakeData.bio
					: 'This is sample text content for testing purposes.';
				this.triggerEvents(textarea);
				this.filledFields++;
			} catch (error) {
				this.errors.push(`Failed to fill textarea: ${error}`);
			}
		});
	}

	private triggerEvents(element: HTMLElement): void {
		['input', 'change', 'blur'].forEach((event) => {
			element.dispatchEvent(new Event(event, { bubbles: true }));
		});
	}

	// Message listener
	init(): void {
		this.browser.runtime.onMessage.addListener(
			(message: any, sender: any, sendResponse: any) => {
				if (message === 'fill-form') {
					this.fillAllInputs()
						.then(sendResponse)
						.catch((error) => {
							sendResponse({
								status: 'error',
								message: error.message,
								fieldsFilled: this.filledFields,
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
console.log('[SharpFilla] Content script loaded');
