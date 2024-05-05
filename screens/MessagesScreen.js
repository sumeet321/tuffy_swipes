// MessagesScreen.js

import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import { useRoute, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import tw from 'tailwind-react-native-classnames';
import { Keyboard } from 'react-native';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query } from 'firebase/firestore';
import { db } from '../config/firebase';

const MessagesScreen = ({ refresh }) => { // Pass refresh prop
    const { user } = useAuth();
    const { params } = useRoute();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const { matchDetails } = params;

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')),
            snapshot => setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        );

        return () => unsubscribe();
    }, [matchDetails, db]);

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input,
        });
        setInput("");
    };

    const matchedUserInfo = getMatchedUserInfo(matchDetails.users, user?.uid);
    const fullName = matchedUserInfo ? `${matchedUserInfo.firstName} ${matchedUserInfo.lastName}` : '';
    const major = matchedUserInfo ? matchedUserInfo.major : '';
    const age = matchedUserInfo ? matchedUserInfo.age : '';

    useFocusEffect(React.useCallback(() => {
        if (refresh) {
            refresh(); // Trigger refresh when screen gains focus
        }
    }, [refresh]));

    return (
        <SafeAreaView style={tw`flex-1`}>
            <Header title={fullName} major={major} age={age}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                style={tw`flex-1`}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        inverted={true}
                        style={tw`pl-4`}
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) =>
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} message={message}/>
                            ) : (
                                <ReceiverMessage key={message.id} message={message}/>
                            )
                        }
                    />
                </TouchableWithoutFeedback>
                <View style={tw`flex-row bg-white border-t border-gray-200 px-5 py-2`}>
                    <TextInput
                        style={tw`flex-1 h-8 text-lg`}
                        placeholder='Send Message...'
                        onChangeText={setInput}
                        value={input}
                    />
                    <Button onPress={sendMessage} title="Send" color="#FF8001"/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default MessagesScreen;
