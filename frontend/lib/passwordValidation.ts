export const passwordRequirements = [
    { label: "At least 10 characters", test: (value: string) => Array.from(value).length >= 10 },
    { label: "At least one uppercase letter (A-Z)", test: (value: string) => /[A-Z]/.test(value) },
    { label: "At least one lowercase letter (a-z)", test: (value: string) => /[a-z]/.test(value) },
    { label: "At least one symbol (e.g. !, @, #)", test: (value: string) => /[\p{P}\p{S}]/u.test(value) },
];
