class FieldDetector {
	private static readonly FIELD_PATTERNS = {
		firstName: ['first', 'fname', 'given', 'forename'],
		lastName: ['last', 'lname', 'surname', 'family'],
		email: ['email', 'mail', 'e-mail'],
		workEmail: ['work', 'business', 'company', 'corporate'],
		phone: ['phone', 'tel', 'mobile', 'cell'],
		emergencyPhone: ['emergency'],
		company: ['company', 'employer', 'organization', 'org'],
		jobTitle: ['job', 'title', 'position', 'role'],
		street: ['street', 'address', 'addr1', 'line1'],
		apartment: ['apt', 'apartment', 'unit', 'suite', 'addr2', 'line2'],
		city: ['city', 'town'],
		zipCode: ['zip', 'postal', 'postcode'],
		username: ['user', 'login', 'handle'],
		password: ['pass', 'pwd'],
		ccNumber: ['card', 'credit', 'cc', 'number'],
		ccName: ['cardholder', 'name_on_card', 'card_name'],
		ccExpiry: ['exp', 'expir', 'valid'],
		ccCvv: ['cvv', 'cvc', 'security', 'code'],
		age: ['age', 'years', 'old'],
		salary: ['salary', 'income', 'wage', 'pay'],
		dateOfBirth: ['birth', 'dob', 'born'],
		gender: ['gender', 'sex'],
		bio: ['bio', 'about', 'description', 'summary'],
	};

	static detectFieldType(
		element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
	): string {
		const identifiers = this.getElementIdentifiers(element);

		// Check for explicit type first
		if (element instanceof HTMLInputElement && element.type) {
			const type = element.type.toLowerCase();
			if (
				['email', 'password', 'tel', 'url', 'date', 'number'].includes(type)
			) {
				return this.refineTypeByIdentifiers(type, identifiers);
			}
		}

		// Pattern matching
		for (const [fieldType, patterns] of Object.entries(this.FIELD_PATTERNS)) {
			if (patterns.some((pattern) => identifiers.includes(pattern))) {
				return fieldType;
			}
		}

		return 'unknown';
	}

	private static getElementIdentifiers(element: HTMLElement): string {
		const id = element.id?.toLowerCase() || '';
		const name = (element as any).name?.toLowerCase() || '';
		const placeholder =
			(element as HTMLInputElement).placeholder?.toLowerCase() || '';
		const className = element.className?.toLowerCase() || '';

		// Get label text
		let labelText = '';
		if (element.id) {
			const label = document.querySelector(`label[for="${element.id}"]`);
			labelText = label?.textContent?.toLowerCase() || '';
		}

		return `${id} ${name} ${placeholder} ${className} ${labelText}`.toLowerCase();
	}

	private static refineTypeByIdentifiers(
		baseType: string,
		identifiers: string
	): string {
		switch (baseType) {
			case 'email':
				return identifiers.includes('work') || identifiers.includes('business')
					? 'workEmail'
					: 'email';
			case 'tel':
				return identifiers.includes('emergency') ? 'emergencyPhone' : 'phone';
			case 'date':
				return identifiers.includes('birth') || identifiers.includes('dob')
					? 'dateOfBirth'
					: 'date';
			case 'number':
				if (identifiers.includes('salary') || identifiers.includes('income'))
					return 'salary';
				if (identifiers.includes('age')) return 'age';
				return 'number';
			default:
				return baseType;
		}
	}
}
