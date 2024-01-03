import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import {Ionicons, Foundation} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({title, callEnabled}) => {
        const navigation = useNavigation();
    return (
    <View style={tw`p-2 flex-row items-center justify-between`}>
        <View style={tw`flex flex-row items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
                <Ionicons name="chevron-back-outline" size={34} color="#FF8001"/>
            </TouchableOpacity>
        <Text style={tw`text-2xl font-bold pl-2`}>{title}</Text>
        </View>
    </View>
  )
}

export default Header