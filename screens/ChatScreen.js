import React, { useState } from 'react';
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


  return (
    <SafeAreaView>
      <Header title='Chat' callEnabled/>
      <ChatList/>
    </SafeAreaView>
    );
};

export default ChatScreen;
