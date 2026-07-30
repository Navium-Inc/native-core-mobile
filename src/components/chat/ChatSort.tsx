import { useEffect, useState } from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ChatItem = {
  id: string;
  title?: string;
  image?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  date?: string;
  [key: string]: any;
};

export type SortMode = "all" | "unread";

export const ChatSort = ({
  chats,
  onSorted,
  initial = "all",
}: {
  chats: ChatItem[];
  onSorted: (sorted: ChatItem[]) => void;
  initial?: SortMode;
}) => {
  const [mode, setMode] = useState<SortMode>(initial);

  useEffect(() => {
    applySort(mode, chats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, chats]);

  const applySort = (m: SortMode, list: ChatItem[]) => {
    const copy = [...list];
    const byDateDesc = (a: ChatItem, b: ChatItem) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    };

    if (m === "unread") {
      const filtered = copy.filter((c) => (c.unreadCount || 0) > 0).sort(byDateDesc);
      onSorted(filtered);
    } else {
      const sorted = copy.sort(byDateDesc);
      onSorted(sorted);
    }
  };

  const handlePress = (m: SortMode) => (e: GestureResponderEvent) => {
    setMode(m);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, mode === "all" && styles.buttonActive]}
        onPress={handlePress("all")}
      >
        <Text style={[styles.buttonText, mode === "all" && styles.buttonTextActive]}>All</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, mode === "unread" && styles.buttonActive]}
        onPress={handlePress("unread")}
      >
        <Text style={[styles.buttonText, mode === "unread" && styles.buttonTextActive]}>Unread</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  buttonActive: {
    backgroundColor: "#0460FF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  buttonTextActive: {
    fontWeight: "700",
  },
});

export default ChatSort;
