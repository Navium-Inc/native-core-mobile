import { getCurrentThemeObject, subscribeToTheme } from "@/constants/theme";
import React, { useSyncExternalStore } from "react";
import { StyleSheet, View } from "react-native";


export const Container = ({
    children,
    style
}: {
    children: React.ReactNode
    style?: any
}) => {
    const currentTheme = useSyncExternalStore(subscribeToTheme, getCurrentThemeObject, getCurrentThemeObject);

    return <View style={[ContainerStyles.Container, { backgroundColor: currentTheme.backgroundColor }, {...style}]}>
        {children}
    </View>
}

const ContainerStyles = StyleSheet.create({
    Container: {
        paddingTop: 50,
        flex: 1,
        width: "100%"
    }
});