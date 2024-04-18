// Header.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, major, age }) => {
    const navigation = useNavigation();

    return (
        <View style={tw`p-2 flex-row items-center justify-between`}>
            <View style={tw`flex flex-row items-center`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
                    <Ionicons name="chevron-back-outline" size={34} color="#FF8001" />
                </TouchableOpacity>
                <View style={tw`pl-2`}>
                    <Text style={tw`text-2xl font-bold`}>{title}</Text>
                    {major && age && (
                        <Text style={tw`text-gray-500 text-sm`}>
                            {major}, {age}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default Header;
