import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import { useSyncExternalStore } from "react";
import { StyleSheet, Text, View } from "react-native";

export const UserStats = () => {
        const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);
    

    const stats = [
        { value: "120", label: "Post" },
        { value: "1.2k", label: "Followers" },
        { value: "872", label: "Following" },
    ]

    return (
        <View style={UserStatsStyles.UserStatsContainer}>
            <View>
                <Text style={[UserStatsStyles.BioText, {color: currentTheme.secondaryFontColor}]}>
                    Ex @amazon
                    @samsung R&D • @jpmorganCFG{'\n'}
                    2025 Winner • @amazon hackon • code with{'\n'}
                    @cisco finalist
                </Text>
            </View>

            <View style={[UserStatsStyles.UserStatsCountContainer, {borderColor: currentTheme.borderColor, backgroundColor: currentTheme.SecondaryBackgroundColor}]}>
                {stats.map((item) => (
                    <View style={UserStatsStyles.StatItem} key={item.label}>
                        <Text style={[UserStatsStyles.StatValue, {color: currentTheme.textColor}]}>{item.value}</Text>
                        <Text style={UserStatsStyles.StatLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const UserStatsStyles = StyleSheet.create({
    UserStatsContainer: {
        padding: 20,
        width: "100%",
    },
    BioText: {
        textAlign: "center",
        color: "white",
    },
    UserStatsCountContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#eadde317",
        backgroundColor: "#eadde30a"
    },
    StatItem: {
        flex: 1,
        alignItems: "center",
        minWidth: 0,
        paddingHorizontal: 4,
    },
    StatValue: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },
    StatLabel: {
        color: "grey",
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
        includeFontPadding: false,
    },
})