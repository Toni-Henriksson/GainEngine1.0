import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../constants/colors";
import { useWorkoutStore } from "../state/workoutStore";
import { useLanguageStore } from "../state/languageStore";

export default function ProgressScreen() {
  const workoutData = useWorkoutStore((state) => state.workoutData);
  const { t } = useLanguageStore();
  const [selectedExId, setSelectedExId] = useState<string | null>(null);

  // Flatten exercises to list them
  const allExercises = workoutData.fullWorkouts.flatMap((d) => d.exercises);

  // Default selection
  if (!selectedExId && allExercises.length > 0) {
    const withHistory = allExercises.find((e) => e.history.length > 0);
    if (withHistory) setSelectedExId(withHistory.id);
    else setSelectedExId(allExercises[0].id);
  }

  const currentExercise = allExercises.find((e) => e.id === selectedExId);

  // Prepare Chart Data
  const history = currentExercise?.history || [];

  // Need at least one point to render chart without crash
  const labels = history.map((_, i) => (i + 1).toString());
  const dataPoints = history.map((h) => h.weight);

  // If empty, mock data for visual
  const chartData = {
    labels: labels.length > 0 ? labels : ["0"],
    datasets: [
      {
        data: dataPoints.length > 0 ? dataPoints : [0],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("progressTitle")}</Text>
      </View>

      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {allExercises.map((ex) => (
            <TouchableOpacity
              key={ex.id}
              onPress={() => setSelectedExId(ex.id)}
              style={[styles.chip, selectedExId === ex.id && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedExId === ex.id && styles.chipTextActive,
                ]}
              >
                {ex.exerciseName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {currentExercise ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              {currentExercise.exerciseName}
            </Text>
            <Text style={styles.chartSubtitle}>{t("chartSubtitle")}</Text>

            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundColor: themeColors.CARD_BG,
                backgroundGradientFrom: themeColors.CARD_BG,
                backgroundGradientTo: themeColors.CARD_BG,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: themeColors.PRIMARY,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                paddingRight: 40, // Fix clipping on right
              }}
            />

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t("current")}</Text>
                <Text style={styles.statValue}>{currentExercise.weight}kg</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t("start")}</Text>
                <Text style={styles.statValue}>
                  {history.length > 0
                    ? history[0].weight
                    : currentExercise.weight}
                  kg
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{t("gain")}</Text>
                <Text
                  style={[styles.statValue, { color: themeColors.PRIMARY }]}
                >
                  +
                  {currentExercise.weight -
                    (history.length > 0
                      ? history[0].weight
                      : currentExercise.weight)}
                  kg
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.noData}>{t("noData")}</Text>
        )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: themeColors.CARD_BG,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
    display: "flex",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: themeColors.PRIMARY,
    borderColor: themeColors.PRIMARY,
  },
  chipText: {
    color: "#94a3b8",
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#000",
  },
  chartCard: {
    margin: 20,
    padding: 20,
    backgroundColor: themeColors.CARD_BG,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: themeColors.TEXT_SECONDARY,
    marginBottom: 20,
  },
  noData: {
    textAlign: "center",
    color: themeColors.TEXT_SECONDARY,
    marginTop: 50,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: themeColors.TEXT_SECONDARY,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
