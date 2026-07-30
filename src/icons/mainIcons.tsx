import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { ColorValue, Animated } from 'react-native';
import { useEffect, useRef } from 'react';


interface defaultIconProps {
    color?: ColorValue;
    size?: number;
}


export const SettingsIcon = ({
    color,
    size
}: defaultIconProps) => {
    return <FontAwesome6 name="gear" size={size} color={color} />
}



export const UserIcon = ({
    color,
    size
}: defaultIconProps) => {
    return <FontAwesome6 name="user-large" size={size} color={color} />
}

export const ChatIcon = ({
    color,
    size
}: defaultIconProps) => {
    return <Ionicons name="chatbubbles" size={size} color={color} />
}


export const HomeIcon = ({
    color,
    size
}: defaultIconProps) => {
    return <Octicons name="home-fill" size={size} color={color} />
}

export const LoaderIcon = ({
    color = "#FFFFFF",
    size = 24
}: defaultIconProps) => {
    const spinAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start()
    }, [spinAnim])

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="reload" size={size} color={color} />
        </Animated.View>
    )
}
