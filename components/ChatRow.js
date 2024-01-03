import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'tailwind-react-native-classnames';
import { onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { query, collection } from 'firebase/firestore';

const ChatRow = ({matchDetails}) => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    useEffect(() => {
        if(user){
            setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
        }
    }, [matchDetails, user]);

    useEffect(() => onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc')
        ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]);

    console.log('Photo URL:', matchedUserInfo?.photoURL);
    console.log('Name:', matchedUserInfo?.firstName);
    console.log(matchedUserInfo);


  return (
    <TouchableOpacity 
        style={[tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`, styles.cardShadow,]}
        onPress={() => navigation.navigate("Messages", {
        matchDetails,
    })}>
      <Image style={tw`rounded-full h-16 w-16 mr-4`} source={{uri:matchedUserInfo?.photoURL}}/>

      <View>
        <Text style={tw`text-lg font-semibold`}>
            {matchedUserInfo?.firstName}
        </Text>
        <Text>{lastMessage || "Say Hi First!"}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});