import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
            <View style={{ flex: 1, justifyContent: 'around', marginVertical: 4 }}>
                <Text style={{ color: '#FF8001', fontWeight: 'bold', fontSize: 35, textAlign: 'center' }}>
                    Tuffy Swipes
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image
                        source={require('../assets/icons/tuffy.png')}
                        style={{width: 400, height: 550}}
                    />
                </View>
                <View style={{ marginVertical: 16 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        style={{ paddingVertical: 12, backgroundColor: '#FF8001', marginHorizontal: 7, borderRadius: 8 }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ fontWeight: 'bold', color: '#FF8001' }}> Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
