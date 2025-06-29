// fakeDataGenerator.ts

export interface FakeDataSet {
	firstName: string;
	lastName: string;
	email: string;
	workEmail: string;
	phone: string;
	emergencyPhone: string;
	company: string;
	jobTitle: string;
	street: string;
	apartment: string;
	city: string;
	zipCode: string;
	username: string;
	password: string;
	ccNumber: string;
	ccNumberFormatted: string;
	ccName: string;
	ccExpiry: string;
	ccExpiryMonth: string;
	ccExpiryYear: string;
	ccExpiryYear4: string;
	ccCvv: string;
	age: string;
	salary: string;
	website: string;
	linkedin: string;
	bio: string;
	gender: string;
	country: string;
	state: string;
	dateOfBirth: string;
	licenseNumber: string;
	address: string;
}

class FakeDataGenerator {
	private static readonly DATA_POOLS = {
		firstNames: {
			male: [
				'James',
				'John',
				'Robert',
				'Michael',
				'William',
				'David',
				'Richard',
				'Joseph',
				'Thomas',
				'Christopher',
				'Daniel',
				'Matthew',
				'Anthony',
				'Mark',
				'Donald',
				'Steven',
				'Paul',
				'Andrew',
				'Joshua',
				'Kenneth',
				'Kevin',
				'Brian',
				'George',
				'Timothy',
				'Ronald',
				'Jason',
				'Edward',
				'Jeffrey',
				'Ryan',
				'Jacob',
				'Gary',
				'Nicholas',
				'Eric',
				'Jonathan',
				'Stephen',
				'Larry',
				'Justin',
				'Scott',
				'Brandon',
				'Benjamin',
			],
			female: [
				'Mary',
				'Patricia',
				'Jennifer',
				'Linda',
				'Elizabeth',
				'Barbara',
				'Susan',
				'Jessica',
				'Sarah',
				'Karen',
				'Lisa',
				'Nancy',
				'Betty',
				'Helen',
				'Sandra',
				'Donna',
				'Carol',
				'Ruth',
				'Sharon',
				'Michelle',
				'Laura',
				'Sarah',
				'Kimberly',
				'Deborah',
				'Dorothy',
				'Lisa',
				'Nancy',
				'Karen',
				'Betty',
				'Helen',
				'Sandra',
				'Donna',
				'Carol',
				'Ruth',
				'Sharon',
				'Michelle',
				'Laura',
				'Sarah',
				'Kimberly',
				'Amy',
			],
		},
		lastNames: [
			'Smith',
			'Johnson',
			'Williams',
			'Brown',
			'Jones',
			'Garcia',
			'Miller',
			'Davis',
			'Rodriguez',
			'Martinez',
			'Hernandez',
			'Lopez',
			'Gonzalez',
			'Wilson',
			'Anderson',
			'Thomas',
			'Taylor',
			'Moore',
			'Jackson',
			'Martin',
			'Lee',
			'Perez',
			'Thompson',
			'White',
			'Harris',
			'Sanchez',
			'Clark',
			'Ramirez',
			'Lewis',
			'Robinson',
			'Walker',
			'Young',
			'Allen',
			'King',
			'Wright',
			'Scott',
			'Torres',
			'Nguyen',
			'Hill',
			'Flores',
			'Green',
		],
		companies: [
			'Tech Solutions Inc',
			'Digital Innovations LLC',
			'Global Systems Corp',
			'Advanced Technologies Ltd',
			'Future Dynamics Inc',
			'Smart Solutions Group',
			'Innovative Systems LLC',
			'NextGen Technologies',
			'Digital Enterprises Inc',
			'Modern Solutions Ltd',
			'Quantum Dynamics',
			'Strategic Consulting Group',
			'Premier Business Solutions',
			'Elite Technologies',
			'Pinnacle Systems',
			'Dynamic Enterprises',
			'Integrated Solutions Inc',
			'Apex Technologies',
			'Visionary Systems LLC',
			'Excellence Corporation',
		],
		jobTitles: [
			'Software Developer',
			'Project Manager',
			'Data Analyst',
			'Marketing Specialist',
			'Sales Representative',
			'Business Analyst',
			'Quality Assurance Engineer',
			'Product Manager',
			'Operations Manager',
			'Customer Success Manager',
			'Frontend Developer',
			'Backend Developer',
			'DevOps Engineer',
			'UX Designer',
			'Content Marketing Manager',
			'Account Executive',
			'Financial Analyst',
			'HR Specialist',
			'Technical Writer',
			'System Administrator',
		],
		streetNames: [
			'Main',
			'Oak',
			'Park',
			'First',
			'Second',
			'Third',
			'Elm',
			'Washington',
			'Maple',
			'Cedar',
			'Pine',
			'Broadway',
			'Church',
			'Market',
			'Franklin',
			'Lincoln',
			'Madison',
			'Jefferson',
			'Adams',
			'Jackson',
			'Wilson',
			'Spring',
			'Highland',
			'Hill',
			'Valley',
			'River',
			'Lake',
			'Forest',
		],
		streetTypes: [
			'Street',
			'Avenue',
			'Road',
			'Lane',
			'Drive',
			'Way',
			'Court',
			'Place',
		],
		cities: {
			Nigeria: [
				'Lagos',
				'Abuja',
				'Kano',
				'Ibadan',
				'Port Harcourt',
				'Benin City',
				'Kaduna',
				'Warri',
				'Jos',
				'Ilorin',
			],
			US: [
				'New York',
				'Los Angeles',
				'Chicago',
				'Houston',
				'Phoenix',
				'Philadelphia',
				'San Antonio',
				'San Diego',
				'Dallas',
				'San Jose',
			],
			UK: [
				'London',
				'Manchester',
				'Birmingham',
				'Leeds',
				'Glasgow',
				'Liverpool',
				'Newcastle',
				'Sheffield',
				'Bristol',
				'Cardiff',
			],
		},
		domains: [
			'gmail.com',
			'yahoo.com',
			'hotmail.com',
			'outlook.com',
			'icloud.com',
			'protonmail.com',
		],
		workDomains: [
			'company.com',
			'business.org',
			'enterprise.net',
			'corp.com',
			'solutions.io',
			'tech.co',
		],
		phonePatterns: {
			Nigeria: ['080########', '081########', '070########', '090########'],
			US: ['###-###-####', '(###) ###-####'],
			default: ['###-###-####'],
		},
		apartmentTypes: ['Apt', 'Unit', 'Suite', '#'],
		bios: [
			'Experienced professional with a passion for innovation and excellence.',
			'Results-driven individual focused on delivering high-quality solutions.',
			'Creative problem solver with strong analytical and communication skills.',
			'Dedicated team player committed to continuous learning and growth.',
			'Strategic thinker with expertise in driving business success.',
			'Detail-oriented professional with a track record of exceeding expectations.',
			'Collaborative leader skilled in project management and team coordination.',
			'Innovative specialist with deep knowledge in cutting-edge technologies.',
		],
	};

	private static randomChoice<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	private static randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private static generateCreditCardNumber(): string {
		// Generate a valid-looking Visa number (starts with 4)
		const prefix = '4532';
		let number = prefix;

		// Add 12 more digits
		for (let i = 0; i < 12; i++) {
			number += Math.floor(Math.random() * 10).toString();
		}

		return number;
	}

	private static formatCreditCardNumber(number: string): string {
		return number.replace(/(.{4})/g, '$1 ').trim();
	}

	private static generatePhone(pattern: string): string {
		return pattern.replace(/#/g, () =>
			Math.floor(Math.random() * 10).toString()
		);
	}

	private static generateZipCode(country: string = 'US'): string {
		switch (country) {
			case 'Nigeria':
				return this.randomInt(100001, 999999).toString();
			case 'UK':
				const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				const nums = this.randomInt(10, 99).toString();
				const letter1 = letters[Math.floor(Math.random() * letters.length)];
				const letter2 = letters[Math.floor(Math.random() * letters.length)];
				return `${letter1}${nums} ${this.randomInt(1, 9)}${letter2}${letter2}`;
			default: // US
				return this.randomInt(10000, 99999).toString();
		}
	}

	private static generateLicenseNumber(): string {
		const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const numbers = this.randomInt(100000000, 999999999).toString();
		const letter1 = letters[Math.floor(Math.random() * letters.length)];
		const letter2 = letters[Math.floor(Math.random() * letters.length)];
		return `${letter1}${letter2}${numbers}`;
	}

	private static generateDateOfBirth(): string {
		const currentYear = new Date().getFullYear();
		const birthYear = this.randomInt(currentYear - 65, currentYear - 18);
		const month = this.randomInt(1, 12).toString().padStart(2, '0');
		const day = this.randomInt(1, 28).toString().padStart(2, '0');
		return `${birthYear}-${month}-${day}`;
	}

	private static generateAge(dateOfBirth: string): string {
		const birthDate = new Date(dateOfBirth);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}

		return age.toString();
	}

	private static generateSalary(): string {
		// Generate salary between 30k and 150k
		const salary = this.randomInt(30000, 150000);
		// Round to nearest 5000
		return (Math.round(salary / 5000) * 5000).toString();
	}

	private static generatePassword(): string {
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
		let password = '';

		// Ensure at least one of each type
		password += this.randomChoice('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
		password += this.randomChoice('abcdefghijklmnopqrstuvwxyz'.split(''));
		password += this.randomChoice('0123456789'.split(''));
		password += this.randomChoice('!@#$%^&*'.split(''));

		// Fill the rest
		for (let i = 4; i < 12; i++) {
			password += chars[Math.floor(Math.random() * chars.length)];
		}

		// Shuffle the password
		return password
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('');
	}

	public static generate(): FakeDataSet {
		// Choose gender first
		const gender = this.randomChoice(['male', 'female']);
		const firstName = this.randomChoice(this.DATA_POOLS.firstNames[gender]);
		const lastName = this.randomChoice(this.DATA_POOLS.lastNames);

		// Generate consistent data based on names
		const emailDomain = this.randomChoice(this.DATA_POOLS.domains);
		const workDomain = this.randomChoice(this.DATA_POOLS.workDomains);
		const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
		const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${this.randomInt(
			10,
			999
		)}`;

		// Generate address
		const country = 'Nigeria'; // Default to Nigeria as per original
		const streetNumber = this.randomInt(1, 9999);
		const streetName = this.randomChoice(this.DATA_POOLS.streetNames);
		const streetType = this.randomChoice(this.DATA_POOLS.streetTypes);
		const street = `${streetNumber} ${streetName} ${streetType}`;
		const city = this.randomChoice(this.DATA_POOLS.cities[country]);
		const zipCode = this.generateZipCode(country);

		// Generate apartment
		const apartmentType = this.randomChoice(this.DATA_POOLS.apartmentTypes);
		const apartmentNumber = `${apartmentType} ${this.randomInt(
			1,
			999
		)}${this.randomChoice(['', 'A', 'B', 'C'])}`;

		// Generate phone numbers
		const phonePattern = this.randomChoice(
			this.DATA_POOLS.phonePatterns.Nigeria
		);
		const phone = this.generatePhone(phonePattern);
		const emergencyPhone = this.generatePhone(phonePattern);

		// Generate credit card info
		const ccNumber = this.generateCreditCardNumber();
		const ccNumberFormatted = this.formatCreditCardNumber(ccNumber);
		const ccName = `${firstName} ${lastName}`;
		const ccExpiryMonth = this.randomInt(1, 12).toString().padStart(2, '0');
		const ccExpiryYear = this.randomInt(25, 30).toString();
		const ccExpiryYear4 = `20${ccExpiryYear}`;
		const ccExpiry = `${ccExpiryMonth}/${ccExpiryYear}`;
		const ccCvv = this.randomInt(100, 999).toString();

		// Generate other data
		const company = this.randomChoice(this.DATA_POOLS.companies);
		const jobTitle = this.randomChoice(this.DATA_POOLS.jobTitles);
		const dateOfBirth = this.generateDateOfBirth();
		const age = this.generateAge(dateOfBirth);
		const salary = this.generateSalary();
		const bio = this.randomChoice(this.DATA_POOLS.bios);
		const licenseNumber = this.generateLicenseNumber();
		const password = this.generatePassword();

		// Generate URLs
		const website = `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev`;
		const linkedin = `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${this.randomInt(
			100,
			999
		)}`;

		const fullAddress = `${street}, ${apartmentNumber}, ${city}, ${country}`;

		return {
			firstName,
			lastName,
			email: `${emailPrefix}@${emailDomain}`,
			workEmail: `${emailPrefix}@${workDomain}`,
			phone,
			emergencyPhone,
			company,
			jobTitle,
			street,
			apartment: apartmentNumber,
			city,
			zipCode,
			username,
			password,
			ccNumber,
			ccNumberFormatted,
			ccName,
			ccExpiry,
			ccExpiryMonth,
			ccExpiryYear,
			ccExpiryYear4,
			ccCvv,
			age,
			salary,
			website,
			linkedin,
			bio,
			gender,
			country,
			state: city, // Using city as state for Nigeria
			dateOfBirth,
			licenseNumber,
			address: fullAddress,
		};
	}
}

export default FakeDataGenerator;
