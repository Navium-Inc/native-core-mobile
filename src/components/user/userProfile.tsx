"use client"
import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import { AuthStoarge } from "@/lib/authStorage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Animated, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserActive } from "./userActive";
import { UserIcon } from "./userIcon";
import { UserStats } from "./userStats";

export const UserProfile = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [followers, setFollowers] = useState<string | null>(null);
    const [following, setFollowing] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const [bioDescripiton, setBioDescripition] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserQuery = async () => {
            const token = await AuthStoarge.getAccessToken();
            console.log(token)

            const graphqlQuery = {
                query: `query {
                        getUser {
                            id
                            username
                            image_url
                            firstname
                            lastname
                            bio
                            banner
                            followingCount
                            followersCount
                        }
                }`
            }
            const userData = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/graphql`, {
                method: "POST",
                body: JSON.stringify(graphqlQuery),
                headers: {
                    "content-type": "application/json",
                    "cookie": token ? `plt_tk=${token}` : "",
                    "authorization": token ? `Bearer ${token}` : ""
                }
            })

            const data = (await userData.json()).result.data;

            console.log(JSON.stringify(data));
            const Username = data["getUser"]["username"];
            const firstname = data["getUser"]["firstname"];
            const lastname = data["getUser"]["lastname"];
            const imageUrl = data["getUser"]["image_url"];
            const followingCount = data["getUser"]["followingCount"];
            const followersCount = data["getUser"]["followersCount"];
            const banner = data["getUser"]["banner"];
            const bio = data["getUser"]["bio"];
            const image_url = data["getUser"]["image_url"];


            if (firstname && lastname) {
                setName(firstname + " " + lastname);
            }
            if (Username) {
                setUsername(Username);
            }
            if (imageUrl) {
                setProfileImage(imageUrl);
            }
            if (followingCount) {
                setFollowing(followingCount);
            }
            if (followersCount) {
                setFollowers(followersCount);
            }
            if (banner) {
                setBanner(banner);
            }
            if (bio) {
                setBioDescripition(bio);
            }
            if (image_url) {
                setImageUrl(imageUrl)
            }
        }

        fetchUserQuery()

    }, []);

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
                        source={{ uri: banner ?? undefined }}
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
                        <UserIcon image_url={imageUrl as string} />
                    </View>
                </View>
                <View style={UserProfileStyles.ProfileDescripiton}>
                    <View style={UserProfileStyles.NameContainer}>
                        <Text style={{ color: currentTheme.textColor, width: "100%", textAlign: "center", fontSize: 20, fontWeight: "bold" }}>{name}</Text>
                    </View>
                    <View>
                        <Text style={{ color: currentTheme.secondaryFontColor, width: "100%", textAlign: "center", fontSize: 15 }}>@{username}</Text>
                    </View>
                    <UserStats bioDescripiton={bioDescripiton} followers={followers} following={following} />
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