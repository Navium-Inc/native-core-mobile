import {
    getCurrentThemeMode,
    getCurrentThemeName,
    getCurrentThemeObject,
    setThemeMode,
    subscribeToTheme,
} from "@/constants/theme";
import { useSyncExternalStore } from "react";

export const useTheme = () => {
    const state = useSyncExternalStore(
        subscribeToTheme,
        () => ({
            theme: getCurrentThemeName(),
            themeMode: getCurrentThemeMode(),
            currentTheme: getCurrentThemeObject(),
        }),
        () => ({
            theme: getCurrentThemeName(),
            themeMode: getCurrentThemeMode(),
            currentTheme: getCurrentThemeObject(),
        })
    );

    return {
        theme: state.theme,
        themeMode: state.themeMode,
        currentTheme: state.currentTheme,
        setMode: setThemeMode,
    };
};