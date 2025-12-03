
export const translations = {
  en: {
    // Auth
    loginTitle: "GainEngine",
    loginSubtitle: "Automated Progressive Overload",
    continueApple: "Continue with Apple",
    continueGuest: "Continue as Guest",
    
    // Dashboard
    greeting: "Ready to lift?",
    streak: "Streak",
    changeWorkout: "CHANGE WORKOUT DAY",
    sessionOverview: "Session Overview",
    aiAnalysis: "AI Coach Analysis:",
    completeWorkout: "Complete Workout",
    loading: "Loading Gains...",
    noPlanTitle: "No workout plan found.",
    noPlanSubtitle: "Go to the Plan tab to create your routine.",
    
    // Alerts
    finishAlertTitle: "Finish Workout?",
    finishAlertBody: "Session will be logged and progressive overload calculated.",
    goodJobTitle: "Good job!",
    goodJobBody: "Workout saved & weights updated.",
    
    // Plan
    planTitle: "Your Split",
    newWorkoutDay: "New Workout Day",
    addExercise: "Add Exercise",
    deleteWorkoutTitle: "Delete Workout?",
    deleteWorkoutBody: "This cannot be undone.",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    complete: "Complete",
    namePlaceholder: "Name (e.g. Chest Press)",
    repsPlaceholder: "Reps (3x10)",
    weightPlaceholder: "Kg",
    emptyExercises: "No exercises added.",
    
    // Progress
    progressTitle: "Progress",
    chartSubtitle: "Weight Progression (kg)",
    current: "Current",
    start: "Start",
    gain: "Gain",
    noData: "Select an exercise to view stats.",
    
    // Settings
    settingsTitle: "Settings",
    language: "Language",
    progressionSettings: "Progression Logic",
    frequencyLabel: "Overload Frequency",
    frequencyDesc: "Sessions required before increasing weight",
    intensityLabel: "Overload Intensity",
    intensityDesc: "Amount of weight added when leveling up",
    sessions: "sessions",
    
    // Tabs
    tabWorkout: "Workout",
    tabPlan: "Plan",
    tabProgress: "Progress",
    tabSettings: "Settings",

    // Misc
    overload: "overload",
    startingWeight: "Starting weight",
    selectWorkout: "Select Workout",
    tapToSwitch: "Tap a routine to switch today's plan"
  },
  fi: {
    // Auth
    loginTitle: "GainEngine",
    loginSubtitle: "Automaattinen progressiivinen ylikuormitus",
    continueApple: "Jatka Applella",
    continueGuest: "Jatka vieraana",
    
    // Dashboard
    greeting: "Valmis treeniin?",
    streak: "Putki",
    changeWorkout: "VAIHDA TREENIPÄIVÄÄ",
    sessionOverview: "Treenin yhteenveto",
    aiAnalysis: "AI-valmentajan analyysi ohjelmastasi:",
    completeWorkout: "Merkitse valmiiksi",
    loading: "Ladataan tietoja...",
    noPlanTitle: "Ei treenisuunnitelmaa.",
    noPlanSubtitle: "Mene Suunnitelma-välilehdelle luodaksesi ohjelman.",
    
    // Alerts
    finishAlertTitle: "Lopeta treeni?",
    finishAlertBody: "Treeni tallennetaan ja painot päivitetään progressiivisesti.",
    goodJobTitle: "Hyvää työtä!",
    goodJobBody: "Treeni tallennettu & painot päivitetty.",
    
    // Plan
    planTitle: "Treenijako",
    newWorkoutDay: "Uusi treenipäivä",
    addExercise: "Lisää liike",
    deleteWorkoutTitle: "Poista treeni?",
    deleteWorkoutBody: "Tätä toimintoa ei voi peruuttaa.",
    delete: "Poista",
    save: "Tallenna",
    cancel: "Peruuta",
    complete: "Suorita",
    namePlaceholder: "Nimi (esim. Penkkipunnerrus)",
    repsPlaceholder: "Toistot (3x10)",
    weightPlaceholder: "Kg",
    emptyExercises: "Ei lisättyjä liikkeitä.",
    
    // Progress
    progressTitle: "Kehitys",
    chartSubtitle: "Painojen kehitys (kg)",
    current: "Nykyinen",
    start: "Aloitus",
    gain: "Lisäys",
    noData: "Valitse liike nähdäksesi tilastot.",
    
    // Settings
    settingsTitle: "Asetukset",
    language: "Kieli",
    progressionSettings: "Progressiologiikka",
    frequencyLabel: "Ylikuormituksen intensiteetti",
    frequencyDesc: "Vaaditut treenikerrat ennen painon nostoa",
    intensityLabel: "Ylikuormituksen määrä",
    intensityDesc: "Lisättävä painomäärä tason noustessa",
    sessions: "treeniä",
    
    // Tabs
    tabWorkout: "Treeni",
    tabPlan: "Ohjelma",
    tabProgress: "Kehitys",
    tabSettings: "Asetukset",

    // Misc
    overload: "ylikuormitus",
    startingWeight: "Aloituspaino",
    selectWorkout: "Valitse treeni",
    tapToSwitch: "Paina rutiinia vaihtaaksesi päivän treenin"
  }
};

export type TranslationKey = keyof typeof translations.en;
