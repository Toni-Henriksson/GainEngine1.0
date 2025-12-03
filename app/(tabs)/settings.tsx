import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "../constants/colors";
import { useLanguageStore } from "../state/languageStore";
import { useSettingsStore } from "../state/settingsStore";

export default function SettingsScreen() {
  const { t, language, setLanguage } = useLanguageStore();
  const {
    overloadFrequency,
    overloadIncrement,
    setFrequency,
    setIncrement,
    loadSettings,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const incrementOptions = [1.25, 2.5, 5];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("settingsTitle")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("language")}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === "en" && styles.langButtonActive,
              ]}
              onPress={() => setLanguage("en")}
            >
              <Text style={styles.flag}>🇬🇧</Text>
              <Text
                style={[
                  styles.langText,
                  language === "en" && styles.langTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === "fi" && styles.langButtonActive,
              ]}
              onPress={() => setLanguage("fi")}
            >
              <Text style={styles.flag}>🇫🇮</Text>
              <Text
                style={[
                  styles.langText,
                  language === "fi" && styles.langTextActive,
                ]}
              >
                Suomi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Progression Logic Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("progressionSettings")}</Text>

          {/* Frequency Control */}
          <View style={styles.controlGroup}>
            <View>
              <Text style={styles.label}>{t("frequencyLabel")}</Text>
              <Text style={styles.description}>{t("frequencyDesc")}</Text>
            </View>

            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => setFrequency(Math.max(1, overloadFrequency - 1))}
                style={styles.stepBtn}
              >
                <Ionicons name="remove" size={24} color={themeColors.PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{overloadFrequency}</Text>
              <TouchableOpacity
                onPress={() => setFrequency(overloadFrequency + 1)}
                style={styles.stepBtn}
              >
                <Ionicons name="add" size={24} color={themeColors.PRIMARY} />
              </TouchableOpacity>
            </View>
            <Text style={styles.valueLabel}>
              {overloadFrequency} {t("sessions")}
            </Text>
          </View>

          {/* Intensity Control */}
          <View style={[styles.controlGroup, { marginTop: 24 }]}>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{t("intensityLabel")}</Text>
              <Text style={styles.description}>{t("intensityDesc")}</Text>
            </View>

            <View style={styles.chipRow}>
              {incrementOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.chip,
                    overloadIncrement === opt && styles.chipActive,
                  ]}
                  onPress={() => setIncrement(opt)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      overloadIncrement === opt && styles.chipTextActive,
                    ]}
                  >
                    {opt} kg
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.BACKGROUND,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: themeColors.PRIMARY,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.OUTLINE,
    marginVertical: 24,
  },
  // Language Buttons
  langButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: themeColors.CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
    gap: 10,
  },
  langButtonActive: {
    borderColor: themeColors.PRIMARY,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  flag: {
    fontSize: 24,
  },
  langText: {
    color: themeColors.TEXT_SECONDARY,
    fontWeight: "600",
    fontSize: 16,
  },
  langTextActive: {
    color: "#fff",
  },
  // Controls
  controlGroup: {
    backgroundColor: themeColors.CARD_BG,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    color: themeColors.TEXT_SECONDARY,
    fontSize: 13,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 20,
    backgroundColor: "#0f172a",
    padding: 8,
    borderRadius: 12,
  },
  stepBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  stepperValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
  },
  valueLabel: {
    textAlign: "center",
    color: themeColors.PRIMARY,
    marginTop: 8,
    fontWeight: "600",
  },
  // Chips
  chipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
  },
  chipActive: {
    borderColor: themeColors.PRIMARY,
    backgroundColor: themeColors.PRIMARY,
  },
  chipText: {
    color: themeColors.TEXT_SECONDARY,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#000",
  },
});
