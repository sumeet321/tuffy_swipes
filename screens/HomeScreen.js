import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db, storage } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import useAuth from '../hooks/useAuth';
import {AntDesign, Entypo, Ionicons} from "@expo/vector-icons";
import Swiper from 'react-native-deck-swiper';
import { doc, onSnapshot, collection, snapshotEqual, setDoc, getDocs, query, where, getDoc, documentSnapshot, serverTimestamp } from '@firebase/firestore';
import generateId from '../lib/generateId';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';


export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  console.log(user);
  const swipeRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [countdownFinished, setCountdownFinished] = useState(null);
  const [countdownKey, setCountdownKey] = useState(0); // Initialize countdownKey state variable


  // Define fetchCards function
  const fetchCards = async () => {
    try {
      if (user && user.uid) {
        const passesSnapshot = await getDocs(collection(db, "users", user.uid, "passes"));
        const passes = passesSnapshot.docs.map((doc) => doc.id);

        const swipesSnapshot = await getDocs(collection(db, "users", user.uid, "swipes"));
        const swipes = swipesSnapshot.docs.map((doc) => doc.id);

        const passedUserIds = passes.length > 0 ? passes : ['test'];
        const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

        // Get user's gender preference
        const userDocSnapshot = await getDoc(doc(db, 'users', user.uid));
        const userData = userDocSnapshot.data();
        const userGenderPreference = userData.preferences;

        let queryRef;
        if (userGenderPreference === 'male') {
          queryRef = query(collection(db, 'users'), where('gender', '==', 'male'));
        } else if (userGenderPreference === 'female') {
          queryRef = query(collection(db, 'users'), where('gender', '==', 'female'));
        } else {
          queryRef = collection(db, 'users');
        }

        const querySnapshot = await getDocs(queryRef);
        const profiles = querySnapshot.docs
          .filter((doc) => doc.id !== user.uid)
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        // Filter out passed and swiped profiles
        const filteredProfiles = profiles.filter(profile => !passedUserIds.includes(profile.id) && !swipedUserIds.includes(profile.id));

        console.log("Fetched profiles: ", filteredProfiles);
        setProfiles(filteredProfiles);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // useEffect hook to fetch cards initially
  useEffect(() => {
    let unsub;
    if (user && user.uid) {
      fetchCards();
    }
    return unsub;
  }, [user, db]);

  // useFocusEffect hook to refetch cards when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user && user.uid) {
        fetchCards();
      }
    }, [user])
  );


  useEffect(() => {
    if (countdownFinished) {
      swipeRef.current.swipeLeft();
    }
    if (profiles.length === 0) {
      setIsPlaying(false);
    }
  }, [countdownFinished, profiles]);



    // Pause the countdown timer when the user navigates away from the screen
    useFocusEffect(
      React.useCallback(() => {
        setIsPlaying(true);
        return () => {
          setIsPlaying(false);
        };
      }, [])
    );


  const swipeLeft = (cardIndex) => {
    setCountdownFinished(false); // Turn from true to false
    setIsPlaying(true); // Restart the timer
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.firstName}`);

    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);

    setCountdownKey((prevKey) => prevKey + 1);
  };


  const swipeRight = async(cardIndex) => {
    setCountdownFinished(false); 
    setIsPlaying(true); // Restart the timer
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await(await getDoc(doc(db, 'users', user.uid))).data();

    // Check if the user swiped on you
    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then((documentSnapshot) => {
      if (documentSnapshot.exists())
      {
        // user has swiped on your before you swiped on them
        // Create a match
        setCountdownFinished(true);
        setIsPlaying(false); // Restart the timer
        console.log(`You MATCHED with ${userSwiped.firstName}`);
        setDoc(
          doc(db, "users", user.uid, "swipes", userSwiped.id),
          userSwiped
        );

        // Match creation
        setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
          users: {
            [user.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped
          },
          usersMatched: [user.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });

        navigation.navigate('Match', {
          loggedInProfile,
          userSwiped,
        });
      }
      else
      {
        console.log(`You SWIPED on ${userSwiped.firstName} (${userSwiped.job})`);

      setDoc(
        doc(db, "users", user.uid, "swipes", userSwiped.id),
        userSwiped
      );
      }
    }
    );

    setCountdownKey((prevKey) => prevKey + 1);
  };


  return (
    <SafeAreaView style={tw`flex-1`}>
      {/*Beginning of Header*/}
        <View style={tw`items-center relative`}>
          <TouchableOpacity onPress={() => navigation.navigate('Picture')}
          style={tw`absolute left-5 top-3`}>
            {user?.photoURL ? (
              <Image 
              style={tw`h-10 w-10 rounded-full`}
              source={{uri: user?.photoURL}} 
              />
            ): (
              <Image
                style={tw`h-10 w-10 rounded-full`}
                // Default profile picture
                source={require('../assets/icons/tuffy.png')}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity>
          <Image style={tw`h-14 w-10`} source={require('../assets/icons/tuffy.png')}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chat')}
        style={tw`absolute right-5 top-4`}>
          <Ionicons name='chatbubbles-sharp' size={30} color='#FF8001'/>
        </TouchableOpacity>
        </View>
      {/*End of Header*/}

      {/*Cards*/}
      <View style={tw`flex-1 -mt-6`}>
        <Swiper 
        ref={swipeRef}
        containerStyle={{backgroundColor: "transparent"}}
        cards={profiles}
        stackSize={5}
        cardIndex={0}
        animateCardOpacity
        verticalSwipe={false}
        onSwipedLeft={(cardIndex) => {
          console.log("Swipe PASS")
          swipeLeft(cardIndex);
        }}
        onSwipedRight={(cardIndex) =>{
          console.log("Swipe MATCH")
          swipeRight(cardIndex);
        }}
        backgroundColor={'#4fd0e9'}
        overlayLabels={{
          left: {
            title: "PASS",
            style: {
              label: {
                textAlign: "right",
                color: "red",
              },
            },
          },
          right: {
            title: "MATCH",
            style: {
              label: {
                textAlign: "left",
                color: "green",
              },
            },
          },
        }}
          renderCard={(card) => card ? (
            <View key={card.id} style={tw`relative bg-white h-3/4 rounded-xl`}>
              <Image 
                style={tw`absolute top-0 h-full w-full rounded-xl `}
                source={{uri: card.photoURL}}
              />

            <View style={[tw`absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl`, styles.cardShadow]}>
              <View>
                <Text style={tw`text-xl font-bold`}>
                  {card.firstName} {card.lastName}
                </Text>
                <Text>{card.job}</Text>
              </View>
              <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
            </View>
            </View>
          ) : (
            <View
            style={[
              tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
              styles.cardShadow,
            ]}
          >
          <Text style={tw`font-bold pb-5`}>No more profiles. Check back later.</Text>

          <Image
            style={tw`h-20 w-full`}
            height = {100}
            width = {100}
            //source = {{uri: ""}}
          />
        </View>
        )}
      />
      
    </View>
    
    
    {/*Countdown*/}
    <View style={{flex:0.001 ,justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf0f1'}}>
      <CountdownCircleTimer
        key={countdownKey}
        size={150}
        isPlaying={isPlaying}
        duration={10}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[10, 6, 3, 0]}
        onComplete={() => {
          setCountdownFinished(true);
          setIsPlaying(false);
          return { shouldRepeat: true, duration: .1};
        }}
        updateInterval={1}
    >
      {({ remainingTime, color }) => (
        <Text style={{ color, fontSize: 40 }}>
          {remainingTime}
        </Text>
      )}
    </CountdownCircleTimer>
  </View>


      <View style={tw`flex flex-row justify-between`}>
        <TouchableOpacity onPress={() => swipeRef.current.swipeLeft()}
          style={[tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`, {marginLeft: 40}]}>
            <Entypo name='cross' size={24} color='red'/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => swipeRef.current.swipeRight()}
          style={[tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`, {marginRight: 40}]}>
            <AntDesign name='heart' size={24} color='green'/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardShadow:{
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height:1,
    },
  shadowOpacity: 0.2,
  shadowRadius: 1.41,

  elevation: 2,
},
});