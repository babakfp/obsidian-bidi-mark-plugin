import { defineConfig } from 'i18next-cli'

export default defineConfig({
	locales: ['en', 'fa', 'ar', 'he'],

	// Key extraction settings
	extract: {
		input: 'src/**/*.ts',
		output: 'src/locales/{{language}}/{{namespace}}.json',

		// Namespace and key configuration
		keySeparator: false,
		nsSeparator: false,

		// Output formatting
		indentation: 4,
	},
})
