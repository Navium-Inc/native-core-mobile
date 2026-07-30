
import { getCurrentThemeName, getCurrentThemeObject, setThemeMode, subscribeToTheme } from "@/constants/theme";
import { SecureStorage } from "@/services/secureStore";
import { useRouter } from "expo-router";
import { useSyncExternalStore } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function Settings() {
    const router = useRouter();
    const themeStyle = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);
    const isDarkTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeName, getCurrentThemeName) === "dark";

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            // Clear the access token
                            await SecureStorage.clear();
                            // Navigate back to home (auth page)
                            router.replace("/home");
                        } catch (error) {
                            console.error("Logout error:", error);
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: themeStyle.backgroundColor }]}> 
            <View style={[styles.header, { borderBottomColor: themeStyle.borderBottomColor }]}> 
                <Text style={[styles.title, { color: themeStyle.textColor }]}>Settings</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeStyle.sectionTitleColor }]}>Appearance</Text>

                    <View style={[styles.optionButton, { borderBottomColor: themeStyle.borderBottomColor }]}> 
                        <Text style={[styles.optionText, { color: themeStyle.textColor }]}>Dark mode</Text>
                        <Switch
                            value={isDarkTheme}
                            onValueChange={async (value) => {
                                await setThemeMode(value ? "dark" : "light");
                            }}
                            thumbColor={themeStyle.switchThumbColor}
                            trackColor={themeStyle.switchTrackColor}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeStyle.sectionTitleColor }]}>Account</Text>

                    <Pressable style={[styles.optionButton, { borderBottomColor: themeStyle.borderBottomColor }]} onPress={handleLogout}>
                        <Text style={[styles.optionText, { color: themeStyle.textColor }]}>Preferences</Text>
                        <Text style={[styles.optionArrow, { color: themeStyle.optionArrowColor }]}>›</Text>
                    </Pressable>

                    <Pressable style={[styles.optionButton, { borderBottomColor: themeStyle.borderBottomColor }]}> 
                        <Text style={[styles.optionText, { color: themeStyle.textColor }]}>Notifications</Text>
                        <Text style={[styles.optionArrow, { color: themeStyle.optionArrowColor }]}>›</Text>
                    </Pressable>

                    <Pressable style={[styles.optionButton, { borderBottomColor: themeStyle.borderBottomColor }]}> 
                        <Text style={[styles.optionText, { color: themeStyle.textColor }]}>Privacy</Text>
                        <Text style={[styles.optionArrow, { color: themeStyle.optionArrowColor }]}>›</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeStyle.sectionTitleColor }]}>Support</Text>

                    <Pressable style={[styles.optionButton, { borderBottomColor: themeStyle.borderBottomColor }]}> 
                        <Text style={[styles.optionText, { color: themeStyle.textColor }]}>Help Center</Text>
                        <Text style={[styles.optionArrow, { color: themeStyle.optionArrowColor }]}>›</Text>
                    </Pressable>

                    <Pressable style={[styles.optionButton, { borderBottomColor: themeStyle.borderBottomColor }]}> 
                        <Text style={[styles.optionText, { color: themeStyle.textColor }]}>About</Text>
                        <Text style={[styles.optionArrow, { color: themeStyle.optionArrowColor }]}>›</Text>
                    </Pressable>
                </View>

                <Pressable style={[styles.logoutButton, { backgroundColor: themeStyle.logoutButtonBackground }]} onPress={handleLogout}>
                    <Text style={[styles.logoutButtonText, { color: themeStyle.logoutButtonTextColor }]}>Logout</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        backgroundColor: "#100f0f",
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a2d",
    },
    title: {
        color: "#ffffff",
        fontSize: 28,
        fontWeight: "700",
    },
    content: {
        flex: 1,
        paddingVertical: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: "#8f8f8f",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 16,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    optionButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1b1a1c",
    },
    optionText: {
        color: "#f5f5f5",
        fontSize: 16,
        fontWeight: "500",
    },
    optionArrow: {
        color: "#8f8f8f",
        fontSize: 18,
    },
    logoutButton: {
        marginHorizontal: 16,
        marginTop: 32,
        backgroundColor: "#8B0000",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
});
