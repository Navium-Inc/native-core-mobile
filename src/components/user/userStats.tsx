import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import { useSyncExternalStore } from "react";
import { StyleSheet, Text, View } from "react-native";

export const UserStats = ({
    bioDescripiton,
    followers,
    following,
    posts
}: {
    bioDescripiton: string | null;
    followers: string | null;
    following: string | null;
    posts?: string | null;
}) => {
    const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);


    const stats = [
        { value: posts ?? 0, label: "Post" },
        { value: followers ?? 0, label: "Followers" },
        { value: following ?? 0, label: "Following" },
    ]

    return (
        <View style={UserStatsStyles.UserStatsContainer}>
            <View>
                <Text style={[UserStatsStyles.BioText, { color: currentTheme.secondaryFontColor }]}>
                    {bioDescripiton}
                </Text>
            </View>

            <View style={[UserStatsStyles.UserStatsCountContainer, { borderColor: currentTheme.borderColor, backgroundColor: currentTheme.SecondaryBackgroundColor }]}>
                {stats.map((item) => (
                    <View style={UserStatsStyles.StatItem} key={item.label}>
                        <Text style={[UserStatsStyles.StatValue, { color: currentTheme.textColor }]}>{item.value}</Text>
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