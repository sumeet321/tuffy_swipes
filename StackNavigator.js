import { View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ChatScreen from './screens/ChatScreen';
import useAuth from './hooks/useAuth';
import ProfilePicture from './screens/ProfilePicture';
import InformationScreen from './screens/InformationScreen';
import MatchScreen from './screens/MatchScreen';
import MessagesScreen from './screens/MessagesScreen';
import ForgotScreen from './screens/ForgotScreen';


const Stack = createNativeStackNavigator();


export default function StackNavigator() {
  const { user } = useAuth();
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName='Home'
        >
          <Stack.Screen name="Info" options={{ headerShown: false }} component={InformationScreen} />
          <Stack.Screen name="Home" options={{ headerShown: false, gestureEnabled: false }} component={HomeScreen} />
          <Stack.Screen name="Picture" options={{ headerShown: false }} component={ProfilePicture} />
          <Stack.Screen name="Chat" options={{ headerShown: false }} component={ChatScreen} />
          <Stack.Screen name="Messages" options={{ headerShown: false }} component={MessagesScreen} />
          <Stack.Screen name="Match" screenOptions={{ presentation: "transparentModal" }} options={{ headerShown: false }} component={MatchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
          <Stack.Screen name="Forgot" options={{ headerShown: false }} component={ForgotScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
