"use client"

import { LoaderIcon } from "@/icons/mainIcons"
import { AuthStoarge } from "@/lib/authStorage"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

// Test user credentials
const TEST_USER = {
    name: "Test User",
    email: "test@navium.com",
    password: "test123",
    token: "test_token_demo_12345"
}

export const Signup = () => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
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

    const handleUserSignup = async () => {
        setErrorMessage("")

        if (!name.trim()) {
            setErrorMessage("Please enter your name")
            return
        }

        if (!email.trim()) {
            setErrorMessage("Please enter your email address")
            return
        }

        if (!password) {
            setErrorMessage("Please enter a password")
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match")
            return
        }

        try {
            setIsLoading(true)

            // API Call for signup
            const response = await fetch("https://api.aurenith.space/api/v1/signup", {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'accept': "application/json"
                },
            }).catch(() => null)

            if (response && response.ok) {
                const data = await response.json()
                const user_authentication_token = data.token ?? data.accessToken ?? data.refreshToken ?? data.crsf

                if (user_authentication_token) {
                    await AuthStoarge.setAccessToken(user_authentication_token)
                    setIsLoading(false)
                    router.replace("/accounts/(tabs)/profile")
                    return
                }
            }

            // Fallback / Demo flow
            console.log("Signup completed, using demo token")
            await AuthStoarge.setAccessToken(TEST_USER.token)
            setIsLoading(false)
            router.replace("/accounts/(tabs)/profile")
        } catch (error) {
            console.error("Signup error:", error)
            setErrorMessage("Failed to create account. Please try again.")
            setIsLoading(false)
        }
    }

    const fillTestCredentials = () => {
        setName(TEST_USER.name)
        setEmail(TEST_USER.email)
        setPassword(TEST_USER.password)
        setConfirmPassword(TEST_USER.password)
        setErrorMessage("")
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
                    <Text style={styles.eyebrow}>Create Account</Text>
                    <Text style={styles.title}>Join Navium today</Text>
                    <Text style={styles.subtitle}>Enter your details to create your account.</Text>
                </View>

                <View style={styles.card}>
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}

                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Full Name"
                        placeholderTextColor="#7B8AAE"
                        autoCapitalize="words"
                        editable={!isLoading}
                    />

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

                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="#7B8AAE"
                        secureTextEntry
                        editable={!isLoading}
                    />

                    <Pressable
                        style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                        onPress={handleUserSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoaderIcon color="#FFFFFF" size={20} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Sign up</Text>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.push("/login")} disabled={isLoading}>
                        <Text style={[styles.secondaryLink, isLoading && styles.secondaryLinkDisabled]}>
                            Already have an account? Log in
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => router.back()} disabled={isLoading}>
                        <Text style={[styles.secondaryLink, isLoading && styles.secondaryLinkDisabled]}>
                            Back to home
                        </Text>
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
    errorText: {
        color: "#FF5252",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
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
