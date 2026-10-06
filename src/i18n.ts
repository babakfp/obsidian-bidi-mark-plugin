import i18next from 'i18next'
import { moment } from 'obsidian'
import ar from './locales/ar/translation.json'
import en from './locales/en/translation.json'
import fa from './locales/fa/translation.json'
import he from './locales/he/translation.json'

export const loadI18n = async () => {
	await i18next.init({
		lng: moment.locale(),
		fallbackLng: 'en',
		resources: {
			en: {
				translation: en,
			},
			fa: {
				translation: fa,
			},
			ar: {
				translation: ar,
			},
			he: {
				translation: he,
			},
		},
		keySeparator: false,
		nsSeparator: false,
	})
}
