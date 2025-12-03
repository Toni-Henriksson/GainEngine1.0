import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "./constants/colors";
import { useWorkoutStore } from "./state/workoutStore";

export default function LoginScreen() {
  const loadData = useWorkoutStore((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = () => {
    // Mock login logic
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[themeColors.BACKGROUND, "#1e1b4b"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness" size={64} color={themeColors.PRIMARY} />
        </View>

        <Text style={styles.title}>GainEngine</Text>
        <Text style={styles.subtitle}>Automated Progressive Overload</Text>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.appleButton} onPress={handleLogin}>
          <Ionicons name="logo-apple" size={24} color="#000" />
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.guestButton}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: themeColors.TEXT_SECONDARY,
    marginTop: 8,
  },
  spacer: {
    height: 100,
  },
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },
  appleButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  guestButton: {
    padding: 12,
  },
  guestText: {
    color: themeColors.TEXT_SECONDARY,
    fontSize: 16,
  },
});
