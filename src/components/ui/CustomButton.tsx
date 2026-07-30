import { Alert, Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

export const CustomButton = ({
    text,
    style,
    textStyle,
}: {
    text: string
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}) => (
  <Pressable
    style={({ pressed }) => [
      defaultStyles.button,
      style,
      pressed && defaultStyles.buttonPressed,
    ]}
    onPress={() => Alert.alert('Pressed!')}
  >
    <Text style={[defaultStyles.text, textStyle]}>{text}</Text>
  </Pressable>
);

const defaultStyles = StyleSheet.create({
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
