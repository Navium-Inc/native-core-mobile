"use client"

import { AuthStoarge } from "@/lib/authStorage";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export const InitialPage = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    useEffect(() => {
        const checkAuthAndNavigate = async () => {
            try {
                const token = await AuthStoarge.getAccessToken();
                if (token) {
                    // User is authenticated, go to profile
                    router.replace('/accounts/(tabs)/profile');
                } else {
                    // User is not authenticated, go to auth page
                    router.replace('/home');
                }
            } catch (error) {
                console.error("Auth check error:", error);
                // On error, go to home (safe default)
                router.replace('/home');
            }
        };

        const timer = setTimeout(() => {
            checkAuthAndNavigate();
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Animated.View style={[InitialPageStyles.Container, { opacity: fadeAnim }]}>

            <View style={InitialPageStyles.Logo}>
                <Image
                    source={require("@/assets/images/icon.png")}
                    style={[InitialPageStyles.Icon,]}
                    resizeMode="contain"
                />
                <Animated.Text style={[InitialPageStyles.Text]}>NAVIUM</Animated.Text>
            </View>
        </Animated.View>
    )
}


const InitialPageStyles = StyleSheet.create({
    Container: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    LinearGradientBg: {
        height: "100%",
        width: "100%"
    },
    Logo: {
        marginTop: 50,
        width: "100%",
        height: 150,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    Icon: {
        width: 30,
        height: 40,
        marginBottom: 16,
    },
    Text: {
        fontFamily: "IosevkaCharon-Bold",
        zIndex: 999,
        color: "#ffffff",
        fontSize: 30
    }
})
