interface FakeDataProfile {
	name: string;
	data: {
		firstName: string;
		lastName: string;
		email: string;
		workEmail: string;
		phone: string;
		age: string;
		company: string;
		jobTitle: string;
		salary: string;
		username: string;
		password: string;
		street: string;
		apartment: string;
		city: string;
		zipCode: string;
		emergencyName: string;
		emergencyPhone: string;
		website: string;
		linkedin: string;
		ccNumber: string;
		ccName: string;
		ccExpiry: string;
		ccCvv: string;
		bio: string;
		dateOfBirth: string;
		gender: string;
		country: string;
		state: string;
	};
}

interface FillResponse {
	status: 'success' | 'error';
	message: string;
	fieldsFilled?: number;
	errors?: string[];
}

interface ExtensionConfig {
	animationSpeed: 'slow' | 'medium' | 'fast' | 'instant';
	visualFeedback: boolean;
	skipHiddenFields: boolean;
	respectRequiredOnly: boolean;
	currentProfile: string;
}
