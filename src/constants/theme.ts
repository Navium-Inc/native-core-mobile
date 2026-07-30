import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const themeStyles = {
    dark: {
        backgroundColor: "#100f0f",
        textColor: "#ffffff",
        SecondaryBackgroundColor: "#eadde30a",
        borderBottomColor: "#1b1a1c",
        sectionTitleColor: "#8f8f8f",
        secondaryFontColor: "grey",
        optionArrowColor: "#8f8f8f",
        switchThumbColor: "#ffffff",
        borderColor: "#eadde317",
        switchTrackColor: {
            false: "#767577",
            true: "#81b0ff",
        },
        logoutButtonBackground: "#8B0000",
        logoutButtonTextColor: "#ffffff",
    },
    light: {
        backgroundColor: "#f5f5f5",
        textColor: "#111111",
        borderColor: "#b2b5bb42",
        borderBottomColor: "#e6e6e6",
        sectionTitleColor: "#6b7280",
        SecondaryBackgroundColor: "#e3e3e3be",
        optionArrowColor: "#666666",
        secondaryFontColor: "grey",
        switchThumbColor: "#f4f3f4",
        switchTrackColor: {
            false: "#767577",
            true: "#81b0ff",
        },
        logoutButtonBackground: "#b91c1c",
        logoutButtonTextColor: "#ffffff",
    },
} as const;

// Central state for the currently selected theme mode and resolved theme object.
type ThemeStoreState = {
    mode: ThemeMode;
    resolvedTheme: ResolvedTheme;
    currentTheme: (typeof themeStyles)[ResolvedTheme];
};

// Holds the latest theme state that all components can read from.
let themeStoreState: ThemeStoreState = {
    mode: "system",
    resolvedTheme: "light",
    currentTheme: themeStyles.light,
};

// Subscribers that need to re-render when the theme changes.
const listeners = new Set<() => void>();

// Notify every subscribed consumer that the theme state has changed.
const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

// Resolve the actual theme value based on the selected mode and the device preference.
export const resolveTheme = (mode: ThemeMode, systemTheme: ResolvedTheme): ResolvedTheme =>
    mode === "system" ? systemTheme : mode;

// Update the shared theme store and persist the mode to storage.
export const setThemeMode = async (mode: ThemeMode, systemTheme: ResolvedTheme = "light") => {
    const resolvedTheme = resolveTheme(mode, systemTheme);

    themeStoreState = {
        mode,
        resolvedTheme,
        currentTheme: themeStyles[resolvedTheme],
    };

    await AsyncStorage.setItem("theme", mode);
    notifyListeners();
};

// Load the saved theme preference from storage and initialize the shared store.
export const initializeTheme = async (systemTheme: ResolvedTheme = "light") => {
    const savedTheme = await AsyncStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        await setThemeMode(savedTheme as ThemeMode, systemTheme);
        return savedTheme as ThemeMode;
    }

    await setThemeMode("system", systemTheme);
    return "system" as ThemeMode;
};

// Read the currently resolved theme style object.
export const getCurrentThemeObject = () => themeStoreState.currentTheme;
// Read the current resolved theme name such as light or dark.
export const getCurrentThemeName = () => themeStoreState.resolvedTheme;
// Read the raw selected theme mode such as system, light, or dark.
export const getCurrentThemeMode = () => themeStoreState.mode;
// Register a component listener for theme updates.
export const subscribeToTheme = (listener: () => void) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
};