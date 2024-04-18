import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'tailwind-react-native-classnames';
import { onSnapshot, orderBy, query, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    const fetchLatestImage = useCallback(() => {
        if (user) {
            setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
        }
    }, [matchDetails, user]);

    useEffect(() => {
        fetchLatestImage();
    }, [fetchLatestImage]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, 'matches', matchDetails.id, 'messages'),
                orderBy('timestamp', 'desc')
            ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
        );

        return () => unsubscribe();
    }, [matchDetails, db]);

    return (
        <TouchableOpacity
            style={[tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`, styles.cardShadow]}
            onPress={() => navigation.navigate("Messages", { matchDetails })}>
            <Image
              style={tw`rounded-full h-16 w-16 mr-2`}
              source={{ uri: matchedUserInfo?.photoURL}}
            />

            <View style={styles.messageContainer}>
                <Text style={tw`text-lg font-semibold`}>
                    {matchedUserInfo?.firstName}
                </Text>
                <Text numberOfLines={2} ellipsizeMode="tail">{lastMessage || "Say hi first!"}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRow;

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
    messageContainer: {
        flex: 1,
        marginLeft: 8,
    },
});
