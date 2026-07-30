import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme"
import { useState, useSyncExternalStore } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

const tabItems = ["Posts", "Bookmarks", "Reposts"] as const

type TabItem = (typeof tabItems)[number]

type ContentItem = {
    title: string
    description: string
    timestamp: string
    likes?: number
    reposts?: number
    bookmarks?: number
}

const tabContent: Record<TabItem, ContentItem[]> = {
    Posts: [
        {
            title: "Just finished a run in the park.",
            description: "Feeling great after a 5k with fresh air and good music.",
            timestamp: "2h ago",
            likes: 42,
            reposts: 8,
            bookmarks: 12,
        },
        {
            title: "New app update is live!",
            description: "Added dark mode improvements and faster profile loading.",
            timestamp: "5h ago",
            likes: 86,
            reposts: 14,
            bookmarks: 19,
        },
        {
            title: "Coffee and code all day.",
            description: "Building features with a strong espresso by my side.",
            timestamp: "1d ago",
            likes: 66,
            reposts: 11,
            bookmarks: 9,
        },
        {
            title: "Late night UI polish.",
            description: "Spent time fine-tuning spacing and shadows for the profile card.",
            timestamp: "1d ago",
            likes: 81,
            reposts: 22,
            bookmarks: 15,
        },
        {
            title: "Weekend hiking plan.",
            description: "Looking forward to a trail run with friends at sunrise.",
            timestamp: "2d ago",
            likes: 38,
            reposts: 6,
            bookmarks: 7,
        },
        {
            title: "Design review notes.",
            description: "Shared updates on the new onboarding flow with the team.",
            timestamp: "3d ago",
            likes: 55,
            reposts: 10,
            bookmarks: 20,
        },
    ],
    Bookmarks: [
        {
            title: "React Native tips for list performance.",
            description: "A quick reference for optimizing FlatList and ScrollView.",
            timestamp: "3d ago",
            bookmarks: 34,
            likes: 20,
        },
        {
            title: "Design system patterns.",
            description: "Reusable UI components that scale across products.",
            timestamp: "6d ago",
            bookmarks: 22,
            likes: 11,
        },
        {
            title: "Expo router guide.",
            description: "Navigation best practices for Expo and React Native.",
            timestamp: "1w ago",
            bookmarks: 18,
            likes: 7,
        },
        {
            title: "Accessibility checklist.",
            description: "A bookmark for screen reader and color contrast best practices.",
            timestamp: "8d ago",
            bookmarks: 12,
            likes: 5,
        },
    ],
    Reposts: [
        {
            title: "Team wins hackathon!",
            description: "Celebrating our project going from idea to prototype in 24 hours.",
            timestamp: "12h ago",
            reposts: 52,
            likes: 110,
        },
        {
            title: "Open source release notes.",
            description: "New version includes bug fixes, docs updates, and performance gains.",
            timestamp: "1d ago",
            reposts: 29,
            likes: 74,
        },
        {
            title: "UI inspiration board.",
            description: "A curated set of landing pages and mobile screens worth bookmarking.",
            timestamp: "2d ago",
            reposts: 18,
            likes: 38,
        },
        {
            title: "Design sprint highlights.",
            description: "Reposting a summary of the week’s top product decisions.",
            timestamp: "3d ago",
            reposts: 14,
            likes: 28,
        },
    ],
}

const formatMeta = (item: ContentItem) => {
    const parts = [item.timestamp]
    if (item.likes !== undefined) {
        parts.push(`${item.likes} likes`)
    }
    if (item.reposts !== undefined) {
        parts.push(`${item.reposts} reposts`)
    }
    if (item.bookmarks !== undefined) {
        parts.push(`${item.bookmarks} bookmarks`)
    }
    return parts.join(" · ")
}

const parseTimestamp = (timestamp: string) => {
    const [value, unit] = timestamp.split(" ")[0].match(/(\d+)([hdw])/)?.slice(1) ?? []
    const amount = Number(value)
    if (unit === "h") return amount * 60
    if (unit === "d") return amount * 60 * 24
    if (unit === "w") return amount * 60 * 24 * 7
    return Number.MAX_SAFE_INTEGER
}

const sortByNewest = (items: ContentItem[]) =>
    [...items].sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp))

export const UserActive = () => {
        const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);
    
    const [activeTab, setActiveTab] = useState<TabItem>("Posts")
    const selectedContent = sortByNewest(tabContent[activeTab] ?? tabContent.Posts)

    return (
        <View style={[UserActiveStyles.UserActiveContainer, { backgroundColor: currentTheme.backgroundColor }]}>
            <View style={UserActiveStyles.tabRow}>
                {tabItems.map((tab) => {
                    const isActive = tab === activeTab
                    return (
                        <Pressable
                            key={tab}
                            style={[UserActiveStyles.tabButton, isActive && [UserActiveStyles.tabButtonActive, {backgroundColor: currentTheme.SecondaryBackgroundColor}]]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[UserActiveStyles.tabText, {color: currentTheme.textColor} , isActive && UserActiveStyles.tabTextActive, {color: currentTheme.textColor}]}>
                                {tab}
                            </Text>
                            {isActive && <View style={UserActiveStyles.activeIndicator} />}
                        </Pressable>
                    )
                })}
            </View>
            <View style={[UserActiveStyles.contentContainer, ]}>
                {selectedContent.map((item, index) => (
                    <View key={`${activeTab}-${index}`} style={[UserActiveStyles.card, {backgroundColor: currentTheme.SecondaryBackgroundColor, borderColor: currentTheme.borderColor}]}>
                        <Text style={[UserActiveStyles.cardTitle, {color: currentTheme.textColor}]}>{item.title}</Text>
                        <Text style={[UserActiveStyles.cardDescription, {color: currentTheme.secondaryFontColor}]}>{item.description}</Text>
                        <Text style={UserActiveStyles.cardMeta}>{formatMeta(item)}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const UserActiveStyles = StyleSheet.create({
    UserActiveContainer: {
        width: "100%",
        minHeight: 280,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#2a2a2d",
        backgroundColor: "#100f0f",
    },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    tabButton: {
        alignItems: "center",
        paddingVertical: 10,
        minWidth: 80,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    tabButtonActive: {
        backgroundColor: "#161517",
    },
    tabText: {
        color: "#f5f5f5",
        fontSize: 14,
        fontWeight: "500",
    },
    tabTextActive: {
        color: "#ffffff",
        fontWeight: "700",
    },
    activeIndicator: {
        width: 24,
        height: 3,
        borderRadius: 2,
        marginTop: 6,
        backgroundColor: "#007aff",
    },
    contentContainer: {
        marginTop: 12,
        paddingBottom: 96,
    },
    card: {
        backgroundColor: "#1b1a1c",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    cardTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },
    cardDescription: {
        color: "#d0d0d0",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    cardMeta: {
        color: "#8f8f8f",
        fontSize: 12,
    },
})