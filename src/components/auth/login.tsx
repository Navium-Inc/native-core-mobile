
"use client"

import { LoaderIcon } from "@/icons/mainIcons"
import { AuthStoarge } from "@/lib/authStorage"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

// Test user credentials
const TEST_USER = {
    email: "test@navium.com",
    password: "test123",
    token: "test_token_demo_12345"
}

export const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
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
            <View style={styles.container}>
                <LoaderIcon color="#FFFFFF" size={40} />
            </View>
        )
    }

    const handleUserLogin = async () => {
        try {
            setIsLoading(true)
            
            // Check if it's a test user
            if (email === TEST_USER.email && password === TEST_USER.password) {
                console.log("Test user login detected, using demo token")
                await AuthStoarge.setAccessToken(TEST_USER.token)
                setIsLoading(false)
                router.replace("/accounts/(tabs)/profile")
                return
            }

            // Regular API call
            const response = await fetch("http://localhost:3001/api/v1/checkin_plt", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'accept' : "application/json"
                },
            })
        
            if (!response.ok) {
                console.error(`API error: ${response.status} ${response.statusText}`)
                setIsLoading(false)
                return
            }
        
            const data = await response.json()
            const user_authentication_token = data.token ?? data.accessToken ?? data.refreshToken ?? data.crsf;

            if (!user_authentication_token) {
                console.error("No token found in API response")
                setIsLoading(false)
                return
            }

            // save the token to the store
            await AuthStoarge.setAccessToken(user_authentication_token)
            setIsLoading(false)
            // Replace the current route to prevent back navigation
            router.replace("/accounts/(tabs)/profile")
        } catch (error) {
            console.error("Login error:", error)
            setIsLoading(false)
        }
    }

    const fillTestCredentials = () => {
        setEmail(TEST_USER.email)
        setPassword(TEST_USER.password)
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#03217A", "#0460FF", "#FFFFFF"]}
                style={styles.background}
                locations={[0, 0.3, 0.85]}
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>Welcome back</Text>
                    <Text style={styles.title}>Login to your account</Text>
                    <Text style={styles.subtitle}>Use your email and password to continue.</Text>
                </View>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email address"
                        placeholderTextColor="#7B8AAE"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!isLoading}
                    />

                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#7B8AAE"
                        secureTextEntry
                        editable={!isLoading}
                    />

                    <Pressable 
                        style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
                        onPress={handleUserLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoaderIcon color="#FFFFFF" size={20} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Log in</Text>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.back()} disabled={isLoading}>
                        <Text style={[styles.secondaryLink, isLoading && styles.secondaryLinkDisabled]}>Back to home</Text>
                    </Pressable>

                    <Pressable onPress={fillTestCredentials} disabled={isLoading}>
                        <Text style={[styles.testLink, isLoading && styles.testLinkDisabled]}>Use Test User</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#07142b",
    },
    background: {
        height: "100%",
        width: "100%",
        position: "absolute"
    },
    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    header: {
        marginBottom: 24,
        gap: 8,
    },
    eyebrow: {
        color: "#EAF2FF",
        fontSize: 14,
        fontWeight: "600",
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "700",
    },
    subtitle: {
        color: "#EAF2FF",
        fontSize: 15,
        lineHeight: 22,
        maxWidth: 320,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderRadius: 24,
        gap: 14,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
            },
            android: {
                elevation: 0,
            },
        }),
    },
    input: {
        borderWidth: 1,
        borderColor: "#D7E2F5",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#07142B",
        backgroundColor: "#F8FAFF",
    },
    primaryButton: {
        marginTop: 8,
        backgroundColor: "#000000",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    secondaryLink: {
        textAlign: "center",
        color: "#1E4FD2",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 4,
    },
    primaryButtonDisabled: {
        opacity: 0.7,
    },
    secondaryLinkDisabled: {
        opacity: 0.5,
    },
    testLink: {
        textAlign: "center",
        color: "#4CAF50",
        fontSize: 12,
        fontWeight: "500",
        marginTop: 8,
        fontStyle: "italic",
    },
    testLinkDisabled: {
        opacity: 0.5,
    },
})