import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { themeColors } from "../constants/colors";
import { useWorkoutStore } from "../state/workoutStore";
import { useLanguageStore } from "../state/languageStore";
import { analyzeWorkout } from "../services/aiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Exercise } from "../types/types";

export default function Dashboard() {
  const {
    workoutData,
    completeCurrentWorkout,
    setManualWorkoutIndex,
    isLoading,
  } = useWorkoutStore();
  const { t, setLanguage, language } = useLanguageStore();

  const [aiTip, setAiTip] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);

  // Calculate today's workout based on index
  const nextIndex =
    (workoutData.lastWorkoutIndex + 1) % workoutData.fullWorkouts.length;
  const todayWorkout = workoutData.fullWorkouts[nextIndex];

  const handleFinish = () => {
    Alert.alert(t("finishAlertTitle"), t("finishAlertBody"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("complete"),
        onPress: async () => {
          await completeCurrentWorkout();
          Alert.alert(t("goodJobTitle"), t("goodJobBody"));
        },
      },
    ]);
  };

  const handleSwitchWorkout = async (index: number) => {
    await setManualWorkoutIndex(index);
    setSwitchModalVisible(false);
    setAiTip(null);
  };

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const tip = await analyzeWorkout(todayWorkout, language);
    setAiTip(tip);
    setAnalyzing(false);
  };

  const getOverloadString = (ex: Exercise) => {
    const start =
      ex.startingWeight ??
      (ex.history.length > 0 ? ex.history[0].weight : ex.weight);
    const diff = ex.weight - start;

    if (diff > 0) {
      return `${ex.weight}kg (${start}kg + ${diff}kg ${t("overload")})`;
    }
    return `${ex.weight}kg (${t("startingWeight")})`;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={themeColors.PRIMARY} />
        <Text style={styles.subText}>{t("loading")}</Text>
      </View>
    );
  }

  if (!todayWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={themeColors.TEXT_SECONDARY}
          />
          <Text style={styles.emptyText}>{t("noPlanTitle")}</Text>
          <Text style={styles.subText}>{t("noPlanSubtitle")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Language Switcher */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t("greeting")}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString(
                language === "fi" ? "fi-FI" : "en-US",
                { weekday: "long", month: "long", day: "numeric" }
              )}
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Language Flags */}
            <View style={styles.langContainer}>
              <TouchableOpacity
                onPress={() => setLanguage("en")}
                style={[
                  styles.flagBtn,
                  language === "en" && styles.flagBtnActive,
                ]}
              >
                <Text style={styles.flag}>🇬🇧</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguage("fi")}
                style={[
                  styles.flagBtn,
                  language === "fi" && styles.flagBtnActive,
                ]}
              >
                <Text style={styles.flag}>🇫🇮</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={18} color="#fff" />
              <Text style={styles.streakText}>
                {Math.min(
                  workoutData.fullWorkouts
                    .flatMap((w) => w.exercises)
                    .reduce((acc, ex) => acc + ex.history.length, 0),
                  99
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* WORKOUT SWITCHER */}
        <TouchableOpacity
          style={styles.mainSelector}
          onPress={() => setSwitchModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.selectorIcon}>
            <Ionicons
              name="swap-horizontal"
              size={24}
              color={themeColors.PRIMARY}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.selectorLabel}>{t("changeWorkout")}</Text>
            <Text style={styles.selectorValue} numberOfLines={1}>
              {todayWorkout.workoutName}
            </Text>
          </View>
          <View style={styles.dropdownIcon}>
            <Ionicons
              name="chevron-down"
              size={20}
              color={themeColors.BACKGROUND}
            />
          </View>
        </TouchableOpacity>

        {/* Workout Card */}
        <LinearGradient
          colors={[themeColors.CARD_BG, "#28324a"]}
          style={styles.card}
        >
          {/* Card Actions */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t("sessionOverview")}</Text>
            <TouchableOpacity
              onPress={handleAIAnalysis}
              style={styles.aiButton}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="sparkles" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {aiTip && (
            <View style={styles.aiBox}>
              <Text style={styles.aiTitle}>{t("aiAnalysis")}</Text>
              <Text style={styles.aiText}>{aiTip}</Text>
            </View>
          )}

          <View style={styles.exerciseList}>
            {todayWorkout.exercises.map((ex, index) => (
              <View key={ex.id || index} style={styles.exerciseRow}>
                <View style={styles.exerciseIcon}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={24}
                    color={themeColors.PRIMARY}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseName}>{ex.exerciseName}</Text>

                  {/* Combined Info Row */}
                  <View style={styles.metaRow}>
                    <Text style={styles.exerciseReps}>{ex.reps}</Text>
                    <View style={styles.dotSeparator} />
                    <Text style={styles.overloadText}>
                      {getOverloadString(ex)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        <TouchableOpacity onPress={handleFinish} activeOpacity={0.8}>
          <LinearGradient
            colors={[themeColors.PRIMARY, "#059669"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishButton}
          >
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <Text style={styles.finishText}>{t("completeWorkout")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Switch Workout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={switchModalVisible}
        onRequestClose={() => setSwitchModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSwitchModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("selectWorkout")}</Text>
              <TouchableOpacity onPress={() => setSwitchModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>{t("tapToSwitch")}</Text>

            <FlatList
              data={workoutData.fullWorkouts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    index === nextIndex && styles.modalItemActive,
                  ]}
                  onPress={() => handleSwitchWorkout(index)}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      index === nextIndex && styles.modalItemTextActive,
                    ]}
                  >
                    {item.workoutName}
                  </Text>
                  {index === nextIndex && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={themeColors.BACKGROUND}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.BACKGROUND,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  subText: {
    color: themeColors.TEXT_SECONDARY,
    marginTop: 8,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },
  langContainer: {
    flexDirection: "row",
    gap: 8,
  },
  flagBtn: {
    opacity: 0.5,
    padding: 2,
  },
  flagBtnActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  flag: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  date: {
    color: themeColors.TEXT_SECONDARY,
    marginTop: 4,
    fontSize: 14,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeColors.ACCENT,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  // New Main Selector Styles
  mainSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)", // slightly lighter than background
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: themeColors.PRIMARY,
  },
  selectorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dropdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: themeColors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  selectorLabel: {
    fontSize: 11,
    color: themeColors.PRIMARY,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  selectorValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  aiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeColors.SECONDARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: themeColors.SECONDARY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aiBox: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: themeColors.SECONDARY,
  },
  aiTitle: {
    color: themeColors.SECONDARY,
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  aiText: {
    color: "#e0e7ff",
    fontSize: 13,
    lineHeight: 18,
  },
  exerciseList: {
    gap: 16,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: themeColors.TEXT_SECONDARY,
    marginHorizontal: 8,
  },
  exerciseReps: {
    color: themeColors.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: "500",
  },
  overloadText: {
    color: themeColors.PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },
  finishButton: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
    shadowColor: themeColors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  finishText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: themeColors.CARD_BG,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalSubtitle: {
    fontSize: 14,
    color: themeColors.TEXT_SECONDARY,
    marginBottom: 16,
  },
  modalItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalItemActive: {
    backgroundColor: themeColors.PRIMARY,
    borderColor: themeColors.PRIMARY,
  },
  modalItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalItemTextActive: {
    color: themeColors.BACKGROUND,
  },
});
