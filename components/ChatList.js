import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { onSnapshot, collection, query, where, orderBy, limit, getDocs, doc, get } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import ChatRow from './ChatRow';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchMatches = async () => {
                setLoading(true); // Set loading to true when fetching matches
                const matchesQuerySnapshot = await getDocs(collection(db, 'matches'));
                const matchesData = [];

                for (const matchDoc of matchesQuerySnapshot.docs) {
                    const matchData = matchDoc.data();
                    const messagesQuerySnapshot = await getDocs(
                        query(
                            collection(matchDoc.ref, 'messages'),
                            orderBy('timestamp', 'desc'), // Order messages by timestamp in descending order
                            limit(1) // Limit to the latest message
                        )
                    );
                    const latestMessage = messagesQuerySnapshot.docs.length > 0 ? messagesQuerySnapshot.docs[0].data() : null;

                    matchesData.push({
                        id: matchDoc.id,
                        ...matchData,
                        latestMessageTimestamp: latestMessage ? latestMessage.timestamp : null
                    });
                }

                // Order matches based on latest message timestamp
                const orderedMatches = matchesData
                    .filter(match => match.usersMatched.includes(user.uid)) // Filter only matches where the user is involved
                    .sort((a, b) => {
                        if (!a.latestMessageTimestamp && !b.latestMessageTimestamp) return 0;
                        if (!a.latestMessageTimestamp) return 1;
                        if (!b.latestMessageTimestamp) return -1;
                        return b.latestMessageTimestamp - a.latestMessageTimestamp;
                    });

                setMatches(orderedMatches);
                setLoading(false); // Set loading to false after fetching matches
            };

            const unsubscribe = onSnapshot(collection(db, 'matches'), () => {
                fetchMatches(); // Fetch matches again when there are changes in the matches collection
            });

            fetchMatches(); // Initial fetch of matches

            return () => unsubscribe();
        }
    }, [user, db]);


    return (
        <>
            {loading ? ( // Render loading indicator if loading is true
                <View style={[tw`flex-1 justify-center items-center top-10`]}>
                    <ActivityIndicator size="large" color="#FF8001" />
                </View>
            ) : matches.length > 0 ? ( // Render FlatList if matches are available
                <FlatList
                    style={tw`h-full`}
                    data={matches}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <ChatRow matchDetails={item} />}
                />
            ) : (
                <View style={[tw`flex-1 justify-center items-center`]}>
                    <Text>No matches found</Text>
                </View>
            )}
        </>
    );
};

export default ChatList;