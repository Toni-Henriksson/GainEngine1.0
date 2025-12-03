
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  overloadFrequency: number; // Default 6 sessions
  overloadIncrement: number; // Default 2.5 kg
  
  setFrequency: (val: number) => Promise<void>;
  setIncrement: (val: number) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const SETTINGS_KEY = '@gainengine_settings';

export const useSettingsStore = create<SettingsState>((set) => ({
  overloadFrequency: 6,
  overloadIncrement: 2.5,

  loadSettings: async () => {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        set({
          overloadFrequency: parsed.overloadFrequency ?? 6,
          overloadIncrement: parsed.overloadIncrement ?? 2.5
        });
      }
    } catch (e) {
      console.warn("Failed to load settings", e);
    }
  },

  setFrequency: async (val) => {
    set({ overloadFrequency: val });
    await saveSettings({ overloadFrequency: val });
  },

  setIncrement: async (val) => {
    set({ overloadIncrement: val });
    await saveSettings({ overloadIncrement: val });
  }
}));

// Helper to save partial state
async function saveSettings(update: Partial<{ overloadFrequency: number; overloadIncrement: number }>) {
  try {
    const currentJson = await AsyncStorage.getItem(SETTINGS_KEY);
    const current = currentJson ? JSON.parse(currentJson) : {};
    const merged = { ...current, ...update };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error(e);
  }
}
