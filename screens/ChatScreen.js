import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Button, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';
import ChatList from '../components/ChatList';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0); // State variable to trigger refresh

  // Function to refresh the ChatList
  const refreshChatList = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  // Call refreshChatList when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshChatList();
    });

    return unsubscribe;
  }, [navigation, refreshChatList]);

  return (
    <SafeAreaView>
      <Header title='Chat' callEnabled/>
      <ChatList key={refreshKey} refreshChatList={refreshChatList} />
    </SafeAreaView>
  );
};

export default ChatScreen;
