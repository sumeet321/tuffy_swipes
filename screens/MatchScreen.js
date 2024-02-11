import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const MatchScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  console.log("*******",loggedInProfile);

  return (
    <View style={[tw`h-full pt-20`, { opacity: 0.89, backgroundColor: '#00274C' }]}>
      <View style={tw`justify-center px-10 pt-20`}>
        <Image style={tw`h-20 w-full`} source={require('../assets/icons/match.png')} />
      </View>

      <Text style={[tw`text-white text-center mt-5 text-4xl`, {color: '#FF8001'}]}>
        You and {userSwiped.firstName} have matched with each other!
      </Text>

      <View style={tw`top-5 flex-row justify-evenly mt-5`}>
        <Image style={tw`h-32 w-32 rounded-full`} source={{ uri: loggedInProfile.photoURL }} />
        <Image style={tw`h-32 w-32 rounded-full`} source={{ uri: userSwiped.photoURL }} />
      </View>

      <TouchableOpacity
        style={[tw`m-20 px-10 py-8 rounded-full mt-20`, {padding: 24, backgroundColor: '#FF8001', borderRadius: 20, marginBottom: 8}]}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('Chat');
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchScreen;
