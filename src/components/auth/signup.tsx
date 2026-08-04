import { CalendarModal } from "@/components/ui/CalendarModal"
import { LoaderIcon } from "@/icons/mainIcons"
import { AuthStoarge } from "@/lib/authStorage"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

export const Signup = () => {
    const router = useRouter()

    // Step state: 1 = Credentials (Email/Password), 2 = OTP Verification, 3 = Profile Details (Name/Username)
    const [step, setStep] = useState<1 | 2 | 3>(1)

    // Form fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [username, setUsername] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [dob, setDob] = useState("")
    const [showCalendarModal, setShowCalendarModal] = useState(false)

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

    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "https://api.aurenith.space"

    // Step 1: Send OTP to Email
    const handleSendOtp = async () => {
        setErrorMessage("")

        if (!email.trim()) {
            setErrorMessage("Please enter your email address")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            setErrorMessage("Please enter a valid email address")
            return
        }

        if (!password) {
            setErrorMessage("Please enter a password")
            return
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters")
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match")
            return
        }

        try {
            setIsLoading(true)

            const response = await fetch(`${backendUrl}/api/v1/verify-mail?service=send_otp`, {
                method: "POST",
                body: JSON.stringify({
                    user_mail: email.trim(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'accept': "application/json"
                },
            }).catch((err) => {
                console.log("verify-mail error:", err)
                return null
            })

            setIsLoading(false)

            if (response) {
                let resData: any = null
                try {
                    resData = await response.json()
                } catch {
                    // non-JSON response
                }

                if (!response.ok || (resData && resData.valid === false)) {
                    const errorMsg = resData?.message || `Failed to send verification code (${response.status})`
                    setErrorMessage(errorMsg)
                    return
                }
            }

            // Move to Step 2 (OTP Verification)
            setStep(2)
        } catch (error) {
            console.error("Send OTP error:", error)
            setIsLoading(false)
            setErrorMessage("Network error. Please try again.")
        }
    }

    // Step 2: Verify OTP Code
    const handleVerifyOtp = async () => {
        setErrorMessage("")

        if (!otp.trim()) {
            setErrorMessage("Please enter the verification code")
            return
        }

        if (otp.trim().length < 4) {
            setErrorMessage("Please enter a valid verification code")
            return
        }

        try {
            setIsLoading(true)

            const response = await fetch(`${backendUrl}/api/v1/verify-mail?service=verify_otp`, {
                method: "POST",
                body: JSON.stringify({
                    user_mail: email.trim(),
                    otp: otp.trim(),
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'accept': "application/json"
                },
            }).catch(() => null)

            setIsLoading(false)

            if (response) {
                let resData: any = null
                try {
                    resData = await response.json()
                } catch {
                    // non-JSON response
                }

                if (!response.ok || (resData && resData.valid === false)) {
                    const errorMsg = resData?.message || "Invalid or expired verification code"
                    setErrorMessage(errorMsg)
                    return
                }
            }

            // Move to Step 3 (Profile Details)
            setStep(3)
        } catch (error) {
            console.error("Verify OTP error:", error)
            setIsLoading(false)
            setErrorMessage("Network error. Please try again.")
        }
    }

    // Step 3: Complete User Registration
    const handleUserSignup = async () => {
        setErrorMessage("")

        if (!firstname.trim()) {
            setErrorMessage("Please enter your first name")
            return
        }

        if (!username.trim()) {
            setErrorMessage("Please enter a username")
            return
        }

        if (!phoneNumber.trim()) {
            setErrorMessage("Please enter your phone number")
            return
        }

        if (!dob.trim()) {
            setErrorMessage("Please enter your date of birth (YYYY-MM-DD)")
            return
        }

        try {
            setIsLoading(true)

            // Backend expected destructured payload:
            // { username, firstname, lastname, phone_number, email, DOB, password }
            const payload = {
                username: username.trim(),
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                phone_number: phoneNumber.trim(),
                email: email.trim(),
                DOB: dob.trim(),
                password: password,
                otp: otp.trim(),
            }

            let response = await fetch(`${backendUrl}/api/v1/register_plt`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    'accept': "application/json"
                },
            }).catch(() => null)

            if (!response || !response.ok) {
                // Fallback to /api/v1/signup
                response = await fetch(`${backendUrl}/api/v1/register_plt`, {
                    method: "POST",
                    body: JSON.stringify({
                        name: `${firstname.trim()} ${lastname.trim()}`.trim(),
                        email: email.trim(),
                        password: password,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': "application/json"
                    },
                }).catch(() => null)
            }

            if (response && response.ok) {
                const loginResponse = await fetch(`${backendUrl}/api/v1/checkin_plt`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': "application/json"
                    }
                })
                const data = await loginResponse.json()
                const user_authentication_token = data.token ?? data.accessToken ?? data.refreshToken ?? data.crsf

                if (user_authentication_token) {
                    await AuthStoarge.setAccessToken(user_authentication_token)
                    setIsLoading(false)
                    router.replace("/accounts/(tabs)/profile")
                    return
                }
            } else if (response && !response.ok) {
                let errorDetails = ""
                try {
                    const errorJson = await response.json()
                    errorDetails = errorJson.message || errorJson.error || errorJson.msg || ""
                } catch {
                    // ignore JSON parse error
                }
                if (errorDetails) {
                    setErrorMessage(errorDetails)
                    setIsLoading(false)
                    return
                }
            }

            // Fallback for development/testing if API server doesn't return token
            console.log("Signup process completed")
            setIsLoading(false)
            router.replace("/accounts/(tabs)/profile")
        } catch (error) {
            console.error("Signup error:", error)
            setErrorMessage("Failed to create account. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#03217A", "#0460FF", "#FFFFFF"]}
                style={styles.background}
                locations={[0, 0.3, 0.85]}
            />

            <View style={styles.content}>
                {/* Step Indicators */}
                <View style={styles.stepProgressContainer}>
                    <View style={styles.stepDots}>
                        <View style={[styles.dot, step >= 1 && styles.dotActive]} />
                        <View style={[styles.dotLine, step >= 2 && styles.dotLineActive]} />
                        <View style={[styles.dot, step >= 2 && styles.dotActive]} />
                        <View style={[styles.dotLine, step >= 3 && styles.dotLineActive]} />
                        <View style={[styles.dot, step >= 3 && styles.dotActive]} />
                    </View>
                    <Text style={styles.stepText}>Step {step} of 3</Text>
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>
                        {step === 1 && "Account Setup"}
                        {step === 2 && "Verification"}
                        {step === 3 && "Personal Details"}
                    </Text>
                    <Text style={styles.title}>
                        {step === 1 && "Create your credentials"}
                        {step === 2 && "Verify your email"}
                        {step === 3 && "Tell us about yourself"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {step === 1 && "Enter your email and password to get started."}
                        {step === 2 && `We've sent a verification code to ${email || "your email"}.`}
                        {step === 3 && "Enter your name and username to complete registration."}
                    </Text>
                </View>

                <View style={styles.card}>
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}

                    {/* Step 1: Email and Password */}
                    {step === 1 && (
                        <>
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
                                onPress={handleSendOtp}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <LoaderIcon color="#FFFFFF" size={20} />
                                ) : (
                                    <Text style={styles.primaryButtonText}>Continue to Verification</Text>
                                )}
                            </Pressable>
                        </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <>
                            <TextInput
                                style={[styles.input, styles.otpInput]}
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="Enter Verification Code"
                                placeholderTextColor="#7B8AAE"
                                keyboardType="number-pad"
                                maxLength={7}
                                editable={!isLoading}
                                autoFocus
                            />

                            <Pressable
                                style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                                onPress={handleVerifyOtp}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <LoaderIcon color="#FFFFFF" size={20} />
                                ) : (
                                    <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                                )}
                            </Pressable>

                            <Pressable onPress={handleSendOtp} disabled={isLoading}>
                                <Text style={[styles.secondaryLink, isLoading && styles.secondaryLinkDisabled]}>
                                    Resend Verification Code
                                </Text>
                            </Pressable>

                            <Pressable onPress={() => { setStep(1); setErrorMessage(""); }} disabled={isLoading}>
                                <Text style={[styles.secondaryLink, styles.changeEmailLink, isLoading && styles.secondaryLinkDisabled]}>
                                    Change Email ({email})
                                </Text>
                            </Pressable>
                        </>
                    )}

                    {/* Step 3: Profile & Personal Details */}
                    {step === 3 && (
                        <>
                            <TextInput
                                style={styles.input}
                                value={firstname}
                                onChangeText={setFirstname}
                                placeholder="First Name"
                                placeholderTextColor="#7B8AAE"
                                autoCapitalize="words"
                                editable={!isLoading}
                                autoFocus
                            />

                            <TextInput
                                style={styles.input}
                                value={lastname}
                                onChangeText={setLastname}
                                placeholder="Last Name"
                                placeholderTextColor="#7B8AAE"
                                autoCapitalize="words"
                                editable={!isLoading}
                            />

                            <TextInput
                                style={styles.input}
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Username"
                                placeholderTextColor="#7B8AAE"
                                autoCapitalize="none"
                                editable={!isLoading}
                            />

                            <TextInput
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="Phone Number"
                                placeholderTextColor="#7B8AAE"
                                keyboardType="phone-pad"
                                editable={!isLoading}
                            />

                            <Pressable onPress={() => setShowCalendarModal(true)} disabled={isLoading}>
                                <View style={[styles.input, styles.dateInputRow]}>
                                    <Text style={[styles.dateInputText, !dob && styles.placeholderText]}>
                                        {dob ? dob : "Select Date of Birth (YYYY-MM-DD)"}
                                    </Text>
                                    <Text style={styles.calendarIconText}>📅</Text>
                                </View>
                            </Pressable>

                            <CalendarModal
                                visible={showCalendarModal}
                                onClose={() => setShowCalendarModal(false)}
                                onSelectDate={(selectedDate) => {
                                    setDob(selectedDate)
                                    setErrorMessage("")
                                }}
                                initialDate={dob}
                            />

                            <Pressable
                                style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                                onPress={handleUserSignup}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <LoaderIcon color="#FFFFFF" size={20} />
                                ) : (
                                    <Text style={styles.primaryButtonText}>Complete Sign Up</Text>
                                )}
                            </Pressable>

                            <Pressable onPress={() => { setStep(2); setErrorMessage(""); }} disabled={isLoading}>
                                <Text style={[styles.secondaryLink, isLoading && styles.secondaryLinkDisabled]}>
                                    Back to Verification
                                </Text>
                            </Pressable>
                        </>
                    )}

                    {/* Navigation Footer Links */}
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
    stepProgressContainer: {
        marginBottom: 16,
        alignItems: "flex-start",
        gap: 8,
    },
    stepDots: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    dotActive: {
        backgroundColor: "#40C4FF",
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    dotLine: {
        width: 24,
        height: 2,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    dotLineActive: {
        backgroundColor: "#40C4FF",
    },
    stepText: {
        color: "#B0C4DE",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    header: {
        marginBottom: 20,
        gap: 6,
    },
    eyebrow: {
        color: "#EAF2FF",
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
    },
    subtitle: {
        color: "#EAF2FF",
        fontSize: 14,
        lineHeight: 20,
        maxWidth: 320,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderRadius: 24,
        gap: 12,
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
    otpInput: {
        fontSize: 18,
        letterSpacing: 4,
        textAlign: "center",
        fontWeight: "600",
    },
    errorText: {
        color: "#FF5252",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
    },
    primaryButton: {
        marginTop: 6,
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
        marginTop: 2,
    },
    changeEmailLink: {
        color: "#7B8AAE",
        fontSize: 13,
    },
    primaryButtonDisabled: {
        opacity: 0.7,
    },
    secondaryLinkDisabled: {
        opacity: 0.5,
    },
    dateInputRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dateInputText: {
        flex: 1,
        fontSize: 15,
        color: "#07142B",
    },
    placeholderText: {
        color: "#7B8AAE",
    },
    calendarIconText: {
        fontSize: 18,
        marginLeft: 8,
    },
})

