import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'tailwind-react-native-classnames'
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import ChatRow from './ChatRow';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        if (user) {
            onSnapshot(
                query(
                    collection(db, 'matches'),
                    where('usersMatched', 'array-contains', user.uid)), 
                (snapshot) =>
                 setMatches(
                    snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            )
        );
        }
    }, [user]);
    

  return (
    matches.length > 0 ? (
        <FlatList
        style={tw`h-full`}
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ChatRow matchDetails={item}/>}

        />
    ) : (
        <View>
            <Text style={tw`text-center text-lg`}>You have not matched with anyone</Text>
        </View>
    )
  );
};

export default ChatList