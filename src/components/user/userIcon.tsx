import { Image, StyleSheet, View } from "react-native"

export const UserIcon = () => {
    return (
        <View style={UserIconStyles.IconView}>
            <View>
                <Image
                style={UserIconStyles.IconImage}
                source={require("../../../assets/images/profile.png")}
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
        borderRadius: "100%",
        backgroundColor: "black",
        overflow: "hidden"
    },
    IconImage: {
        height: "100%",
        width: "100%"
    }
})