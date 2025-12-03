import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "../constants/colors";
import { useWorkoutStore } from "../state/workoutStore";
import { useLanguageStore } from "../state/languageStore";
import { WorkoutDay, Exercise } from "../types/types";

export default function PlanScreen() {
  const {
    workoutData,
    addWorkoutDay,
    deleteWorkoutDay,
    addExercise,
    deleteExercise,
  } = useWorkoutStore();
  const { t } = useLanguageStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDayId, setEditingDayId] = useState<string | null>(null);

  // Form State
  const [itemName, setItemName] = useState("");
  const [itemReps, setItemReps] = useState("");
  const [itemWeight, setItemWeight] = useState("");
  const [isAddingDay, setIsAddingDay] = useState(true);

  const openAddDayModal = () => {
    setIsAddingDay(true);
    setItemName("");
    setModalVisible(true);
  };

  const openAddExerciseModal = (dayId: string) => {
    setEditingDayId(dayId);
    setIsAddingDay(false);
    setItemName("");
    setItemReps("");
    setItemWeight("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!itemName) return;

    if (isAddingDay) {
      await addWorkoutDay(itemName);
    } else {
      if (editingDayId) {
        await addExercise(editingDayId, {
          exerciseName: itemName,
          reps: itemReps,
          weight: parseFloat(itemWeight),
        });
      }
    }
    setModalVisible(false);
  };

  const handleDeleteDay = (id: string) => {
    Alert.alert(t("deleteWorkoutTitle"), t("deleteWorkoutBody"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => deleteWorkoutDay(id),
      },
    ]);
  };

  const renderWorkoutDay = ({ item }: { item: WorkoutDay }) => (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>{item.workoutName}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => openAddExerciseModal(item.id)}
            style={styles.iconBtn}
          >
            <Ionicons name="add" size={20} color={themeColors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteDay(item.id)}
            style={styles.iconBtn}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={themeColors.ERROR}
            />
          </TouchableOpacity>
        </View>
      </View>

      {item.exercises.length === 0 ? (
        <Text style={styles.emptyText}>{t("emptyExercises")}</Text>
      ) : (
        item.exercises.map((ex) => (
          <View key={ex.id} style={styles.exerciseRow}>
            <View>
              <Text style={styles.exName}>{ex.exerciseName}</Text>
              <Text style={styles.exDetails}>
                {ex.reps} • {ex.weight}kg
              </Text>
            </View>
            <TouchableOpacity onPress={() => deleteExercise(item.id, ex.id)}>
              <Ionicons name="close-circle" size={18} color="#475569" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("planTitle")}</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddDayModal}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={workoutData.fullWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutDay}
        contentContainerStyle={{ padding: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isAddingDay ? t("newWorkoutDay") : t("addExercise")}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={t("namePlaceholder")}
              placeholderTextColor="#64748b"
              value={itemName}
              onChangeText={setItemName}
            />

            {!isAddingDay && (
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  placeholder={t("repsPlaceholder")}
                  placeholderTextColor="#64748b"
                  value={itemReps}
                  onChangeText={setItemReps}
                />
                <TextInput
                  style={[styles.input, { width: 100 }]}
                  placeholder={t("weightPlaceholder")}
                  keyboardType="numeric"
                  placeholderTextColor="#64748b"
                  value={itemWeight}
                  onChangeText={setItemWeight}
                />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveText}>{t("save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  addButton: {
    backgroundColor: themeColors.PRIMARY,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCard: {
    backgroundColor: themeColors.CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  dayTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  emptyText: {
    color: themeColors.TEXT_SECONDARY,
    fontStyle: "italic",
    fontSize: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.02)",
    marginBottom: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  exName: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "600",
  },
  exDetails: {
    color: themeColors.TEXT_SECONDARY,
    fontSize: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: themeColors.CARD_BG,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: themeColors.OUTLINE,
  },
  row: {
    flexDirection: "row",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#334155",
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: themeColors.PRIMARY,
    alignItems: "center",
  },
  cancelText: { color: "#fff", fontWeight: "600" },
  saveText: { color: "#000", fontWeight: "bold" },
});
