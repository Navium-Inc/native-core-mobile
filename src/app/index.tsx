"use client"
import { InitialPage } from '@/components/auth/ViewPage';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.aurenith.space/api/v1/graphql', // Replace with your API URL
  }),
  cache: new InMemoryCache(),
});


const App = () => {
  const [fontsLoaded] = useFonts({
    'HankenGrotesk-Italic': require('../../assets/fonts/HankenGrotesk-Italic-VariableFont_wght.ttf'),
    'HankenGrotesk-Variable': require('../../assets/fonts/HankenGrotesk-VariableFont_wght.ttf'),
    'IosevkaCharon-Bold': require('../../assets/fonts/IosevkaCharon-Bold.ttf')
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <View style={styles.screen}>
        <LinearGradient
          colors={["#03217A", "#0460FF", "#FFFFFF"]}
          style={styles.LinearGradientBg}
          locations={[0, 0.27, 0.75]}
        />
        <InitialPage />
      </View>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  LinearGradientBg: {
    height: "100%",
    width: "100%",
    position: "absolute"
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#100f0f",
  }
})

export default App;
