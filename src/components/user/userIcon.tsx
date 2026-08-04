import { Image, ImageSourcePropType, StyleSheet, View } from "react-native"

const DEFAULT_PROFILE = require("@/assets/images/icon.png")

export const UserIcon = ({
    image_url
}: {
    image_url?: string | null
}) => {
    const imageSource: ImageSourcePropType = image_url && image_url.trim() !== ""
        ? { uri: image_url }
        : DEFAULT_PROFILE

    return (
        <View style={UserIconStyles.IconView}>
            <View style={{ height: "100%", width: "100%" }}>
                <Image
                    style={UserIconStyles.IconImage}
                    source={imageSource}
                />
            </View>
        </View>
    )
}

const UserIconStyles = StyleSheet.create({
    IconView: {
        height: 150,
        width: 150,
        borderWidth: 2,
        borderRadius: 75,
        backgroundColor: "black",
        overflow: "hidden"
    },
    IconImage: {
        height: "100%",
        width: "100%"
    }
})