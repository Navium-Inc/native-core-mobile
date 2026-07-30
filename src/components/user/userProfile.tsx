"use client"
import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useSyncExternalStore } from "react";
import { Animated, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserActive } from "./userActive";
import { UserIcon } from "./userIcon";
import { UserStats } from "./userStats";

export const UserProfile = () => {
    const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);
    const gradientColors: readonly [string, string, string, string, string] = currentTheme.backgroundColor === "#100f0f"
        ? [
            "transparent",
            "rgba(74, 74, 74, 0.4)",
            "rgba(0,0,0,0.24)",
            "rgba(17, 14, 14, 0.66)",
            currentTheme.backgroundColor,
        ]
        : [
            "transparent",
            "rgba(255,255,255,0.15)",
            "rgba(255,255,255,0.45)",
            "rgba(255,255,255,0.75)",
            currentTheme.backgroundColor,
        ];

    return (
        <Animated.View style={[UserProfileStyles.Container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView style={UserProfileStyles.scrollView} contentContainerStyle={UserProfileStyles.scrollContent}>
                <View style={UserProfileStyles.BannerContainer}>
                    <Image
                        source={require("../../../assets/images/banner.jpeg")}
                        style={UserProfileStyles.BannerImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0.5, y: 0.2 }}
                        end={{ x: 0.5, y: 1 }}
                        style={UserProfileStyles.gradient}
                    />
                    <View style={[UserProfileStyles.IconWrapper]}>
                        <UserIcon />
                    </View>
                </View>
                <View style={UserProfileStyles.ProfileDescripiton}>
                    <View style={UserProfileStyles.NameContainer}>
                        <Text style={{ color: currentTheme.textColor, width: "100%", textAlign: "center", fontSize: 20, fontWeight: "bold" }}>Nishidh Singh</Text>
                    </View>
                    <View>
                        <Text style={{ color: currentTheme.secondaryFontColor, width: "100%", textAlign: "center", fontSize: 15 }}>@xnishidh</Text>
                    </View>
                    <UserStats />
                    <UserActive />
                </View>
            </ScrollView>
        </Animated.View>
    )
}

const UserProfileStyles = StyleSheet.create({
    gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
    Container: {
        backgroundColor: "#100f0f",
        flex: 1,
        width: "100%",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    BannerContainer: {
        position: "relative",
        width: "100%",
        height: 200,
    },
    BannerImage: {
        width: "100%",
        height: "100%",
        
    },
    IconWrapper: {
        position: "absolute",
        bottom: -50,
        alignSelf: "center"
    },
    ProfileDescripiton: {
        padding: 10,
        marginTop: 50,
    },
    NameContainer: {
        width: "100%",
        maxHeight: 40,
    }
})