import { initializeTheme, setThemeMode, type ResolvedTheme, type ThemeMode } from "@/constants/theme";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
    theme: ResolvedTheme;
    themeMode: ThemeMode;
    setMode: (mode: ThemeMode) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const systemTheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>("system");
    const [theme, setThemeState] = useState<ResolvedTheme>("light");

    useEffect(() => {
        const loadThemeFromAsyncStorage = async () => {
            const resolvedSystemTheme: ResolvedTheme = systemTheme === "dark" ? "dark" : "light";
            const savedTheme = await initializeTheme(resolvedSystemTheme);
            setModeState(savedTheme);
            setThemeState(savedTheme === "system" ? resolvedSystemTheme : savedTheme);
        };

        loadThemeFromAsyncStorage();
    }, [systemTheme]);

    useEffect(() => {
        const resolvedSystemTheme: ResolvedTheme = systemTheme === "dark" ? "dark" : "light";
        const resolvedTheme = mode === "system" ? resolvedSystemTheme : mode;

        setThemeState(resolvedTheme);
        void setThemeMode(mode, resolvedSystemTheme);
    }, [mode, systemTheme]);

    const setMode = async (newMode: ThemeMode) => {
        const resolvedSystemTheme: ResolvedTheme = systemTheme === "dark" ? "dark" : "light";
        setModeState(newMode);
        setThemeState(newMode === "system" ? resolvedSystemTheme : newMode);
        await setThemeMode(newMode, resolvedSystemTheme);
    };

    const value = useMemo(() => ({ theme, themeMode: mode, setMode }), [theme, mode]);

    return React.createElement(
        ThemeContext.Provider,
        { value },
        children
    );
};