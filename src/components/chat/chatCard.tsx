import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import { FormatDate } from "@/lib/formatDate";
import { useRouter } from "expo-router";
import { useState, useSyncExternalStore } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export const ChatCard = ({
    name,
    image,
    lastMessage,
    lastMessageAt,
    chatId,
}: {
    name: string;
    image?: string;
    lastMessage: string;
    lastMessageAt?: string;
    chatId?: string;
}) => {
    const router = useRouter();
    const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);
    const [pressed, setPressed] = useState(false);
    const source = image
        ? { uri: image }
        : require("../../../assets/images/profile.png");

    const formattedDate = FormatDate(lastMessageAt ?? "");
    const displayDate = formattedDate || lastMessageAt || "—";

    return (
        <Pressable
            style={[ChatCardStyles.ChatCardContainer, pressed && ChatCardStyles.ChatCardPressed, { borderColor: currentTheme.borderColor }]}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={() => {
                setPressed(false);
                if (chatId) {
                    router.push({ pathname: "/chat/[id]", params: { id: chatId } });
                }
            }}
        >
            <View>
                <Image source={source} style={ChatCardStyles.ProfileImage} />
            </View>
            <View style={ChatCardStyles.ChatContent}>
                <Text style={[ChatCardStyles.ChatNameTitle, { color: currentTheme.textColor }]}>{name}</Text>
                <Text style={[ChatCardStyles.ChatMessageText, { color: currentTheme.secondaryFontColor }]} numberOfLines={1}>
                    {lastMessage}
                </Text>
            </View>
            <View style={ChatCardStyles.ChatRecentTime}>
                <Text style={[ChatCardStyles.ChatRecentTimeText, { color: currentTheme.secondaryFontColor ?? "#9ca3af" }]}>{displayDate}</Text>
            </View>
        </Pressable>
    );
}



const ChatCardStyles = StyleSheet.create({
    //  ChatCardContainer: {
    //     width: "100%",
    //     flexDirection: "row",
    //     borderWidth: 0.2,
    //     gap: 19,
    //     paddingHorizontal: 10,
    //     paddingVertical: 10,
    //     borderColor: "rgba(32, 31, 31, 0.22)",
    //     height: 80,
    //     alignItems: "center"
    // },
   ChatCardContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        backgroundColor: "rgba(255,255,255,0.02)",
    },
    ChatCardPressed: {
        backgroundColor: "rgba(2, 17, 44, 0.14)",
        borderColor: "rgba(4, 96, 255, 0.09)",
    },
    ProfileImage: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    ChatNameTitle: {
        fontSize: 20,
        fontFamily: "HankenGrotesk-Variable",
        fontWeight: "400",
    },
    ChatMessageText: {
        fontSize: 14,
        marginTop: 4,
    },
    ChatContent: {
        flex: 1,
        justifyContent: "center",
    },
    ChatRecentTime: {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    ChatRecentTimeText: {
        color: "white",
        fontSize: 12,
    },
})