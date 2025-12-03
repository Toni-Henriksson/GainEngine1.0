import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, TranslationKey } from '../i18n/translations';

type Language = 'en' | 'fi';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loadLanguage: () => Promise<void>;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY = '@user_language';

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en', // Default
  
  loadLanguage: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'fi') {
        set({ language: stored });
      }
    } catch (e) {
      console.warn("Failed to load language", e);
    }
  },

  setLanguage: async (lang) => {
    set({ language: lang });
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  },

  t: (key) => {
    const lang = get().language;
    return translations[lang][key] || translations['en'][key] || key;
  }
}));
