import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import { useSyncExternalStore } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { chats } from "../../data/data";
import { Container } from "../screen/container";
import { ChatCard } from "./chatCard";

export const ChatListView = () => {
        const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);


    return <Container style={{paddingTop: 80}}>
        <View style={[ChatListViewStyles.ChatListViewHeader]}>
            <Text style={[ChatListViewStyles.TextStyles, {color: currentTheme.textColor}]}>Messages </Text>
        </View>
        <ScrollView>
            {chats.map((chat) => (
                <ChatCard
                    key={chat.id}
                    image={chat.image ?? ""}
                    name={chat.title ?? ""}
                    lastMessage={chat.lastMessage ?? ""}
                    lastMessageAt={chat.lastMessageAt ?? chat.date ?? ""}
                    chatId={chat.id}
                />
            ))}
        </ScrollView>
    </Container> 
}

const ChatListViewStyles = StyleSheet.create({
    ChatListViewHeader: {
        width: "100%"
    },
    TextStyles: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        paddingLeft: 30,
        paddingBottom: 10,
    }
})