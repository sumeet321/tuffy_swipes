import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './screens/HomeScreen';
// import GameStore from './screens/gameStore';

// const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <StackNavigator/>
  );
}