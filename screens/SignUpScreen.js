import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import {Ionicons, Foundation} from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');

  // Create refs for each TextInput
  const lastNameRef = useRef(null);
  const firstNameRef = useRef(null);
  const emailRef = useRef(null);
  const numberRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async () => {
    if (email && password) {
      try {
        // Register the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const displayName = `${firstName} ${lastName}`;

        // Update the user's profile with the first name
        await updateProfile(userCredential.user, { displayName });
        // If registration is successful, navigate to the 'Home' screen or any other screen
        navigation.navigate('Info');
        // If registration is successful, navigate to the 'Info' screen
      } catch (err) {
        console.log('Got error:', err.message);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: themeColors.bg }}
        behavior="padding" // Adjust behavior based on your needs
        enabled
      >
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
                <Ionicons name="chevron-back-outline" size={34} color="#FF8001"/>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image source={require('../assets/icons/csuf.png')} style={{ width: 200, height: 200 }} />
            </View>
          </SafeAreaView>
          <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingTop: 8, borderTopLeftRadius: 35, borderTopRightRadius: 35 }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: 'black', marginLeft: 8 }}>First Name</Text>
              <TextInput
                ref={firstNameRef}
                style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                value={firstName}
                onChangeText={(value) => setFirstname(value)}
                placeholder="Enter First Name"
                onSubmitEditing={() => lastNameRef.current.focus()} // Move to next input
              />
              <Text style={{ color: 'black', marginLeft: 8 }}>Last Name</Text>
              <TextInput
                ref={lastNameRef}
                style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                value={lastName}
                onChangeText={(value) => setLastname(value)}
                placeholder="Enter Last Name"
                onSubmitEditing={() => emailRef.current.focus()} // Move to next input
              />
              <Text style={{ color: 'black', marginLeft: 8 }}>Email Address</Text>
              <TextInput
                ref={emailRef}
                style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                value={email}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => setEmail(value)}
                placeholder="Enter Email"
                onSubmitEditing={() => numberRef.current.focus()} // Move to next input
              />
              <Text style={{ color: 'black', marginLeft: 8 }}>Phone Number</Text>
              <TextInput
                ref={numberRef}
                style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                value={number}
                onChangeText={(value) => setNumber(value)}
                keyboardType="numeric"
                placeholder="Enter Phone Number"
                maxLength={10}
                onSubmitEditing={() => passwordRef.current.focus()} // Move to next input
              />
              <Text style={{ color: 'black', marginLeft: 8 }}>Password</Text>
              <TextInput
                ref={passwordRef}
                style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 14 }}
                secureTextEntry
                value={password}
                onChangeText={(value) => setPassword(value)}
                placeholder="Enter Password"
              />
              <TouchableOpacity
                style={{ padding: 24, backgroundColor: '#FF8001', borderRadius: 20, marginBottom: 8 }}
                onPress={handleSubmit}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, marginBottom: 20 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ fontWeight: 'bold', color: '#FF8001', marginLeft: 5 }}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
