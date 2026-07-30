"use client"

import { LoaderIcon } from "@/icons/mainIcons"
import { AuthStoarge } from "@/lib/authStorage"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"


export const AuthPage = () => {
    const router = useRouter()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuth = async () => {
            try {
                const token = await AuthStoarge.getAccessToken()
                if (token) {
                    // User is already logged in, redirect to profile
                    router.replace("/accounts/(tabs)/profile")
                } else {
                    setIsCheckingAuth(false)
                }
            } catch (error) {
                console.error("Auth check error:", error)
                setIsCheckingAuth(false)
            }
        }

        checkAuth()
    }, [router])

    if (isCheckingAuth) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#100f0f" }}>
                <LoaderIcon color="#FFFFFF" size={40} />
            </View>
        )
    }

    return (
        <Animated.View style={AuthPageStyles.Container}>
            <LinearGradient
                colors={["#03217A", "#0460FF", "#FFFFFF"]}
                style={AuthPageStyles.LinearGradientBg}
                locations={[0, 0.27, 0.75]}
            />

            <View style={AuthPageStyles.SecondContainer}>
                <View style={AuthPageStyles.Header}>
                    <Image
                        source={require("@/assets/images/icon.png")}
                        style={AuthPageStyles.Icon}
                        resizeMode="contain"
                    />
                    <Animated.Text style={AuthPageStyles.Title}>NAVIUM</Animated.Text>
                </View>

                <View style={AuthPageStyles.BottomContainer}>
                    <View style={AuthPageStyles.Hero}>
                        <Text style={AuthPageStyles.Text}>Keep it simple. Less typing, more talking.</Text>
                    </View>

                    <View style={AuthPageStyles.ButtonsView}>
                        <Pressable style={AuthPageStyles.GetStartedButton} onPress={() => router.push("/login")}>
                            <Text style={AuthPageStyles.GetStartedButtonText}>Get Started</Text>
                        </Pressable>
                        <Pressable style={AuthPageStyles.AlternateButton} onPress={() => router.push("/login")}>
                            <Text style={AuthPageStyles.AlternateButtonText}>I already have an account</Text>
                        </Pressable>
                    </View>

                    <View style={AuthPageStyles.footer}>
                        <Text style={AuthPageStyles.FooterText}>By continuing you agree to our Terms & Services and Privacy Policy.</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}

const AuthPageStyles = StyleSheet.create({
    SecondContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "space-between",
        alignItems: "stretch",
        flexDirection: "column",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20
    },
    footer: {
        width: "80%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    FooterText: {
        fontSize: 10,
        textAlign: "center",
        width: "100%",
        color: "#666"
    },
    LinearGradientBg: {
        height: "100%",
        width: "100%",
        position: "absolute"
    },
    Header: {
        minHeight: 70,
        paddingTop: "20%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    Container: {
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "stretch",
        flexDirection: "column",
    },
    Hero: {
        zIndex: 999,
    },
    Icon: {
        width: 30,
        height: 40,
        marginBottom: 16,
    },
    Title: {
        fontFamily: "IosevkaCharon-Bold",
        color: "#ffffff",
        fontSize: 30,
        textAlign: "center"
    },
    Text: {
        fontFamily: "IosevkaCharon-Bold",
        color: "black",
        fontSize: 35,
    },
    BottomContainer: {
        width: "100%",
        gap: 20,
    },
    ButtonsView: {
        zIndex: 999,
        gap: 12,
    },
    GetStartedButton: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderRadius: 20
    },
    GetStartedButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold"
    },
    AlternateButton: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#63626227",
        borderRadius: 20
    },
    AlternateButtonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold"
    }
})