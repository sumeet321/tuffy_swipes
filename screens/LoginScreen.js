import {
    View,
    Text,
    Keyboard,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView, TouchableWithoutFeedback
  } from 'react-native';
  import React, { useState, useRef } from 'react';
  import { themeColors } from '../theme';
  import { useNavigation } from '@react-navigation/native';
  import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { auth } from '../config/firebase';
  import {Ionicons, Foundation} from '@expo/vector-icons';
  import tw from 'tailwind-react-native-classnames';

  
  export default function LoginScreen() {
    const navigation = useNavigation();
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const passwordRef = useRef(null);
  
    const handleSubmit = async () => {
      if (email && password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
  
          if (user && user.photoURL) {
            updateProfile(user, { photoURL: user.photoURL });
          }
          navigation.navigate('Home');
        } catch (err) {
          console.log('got error: ', err.message);
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
          <View
            style={{
              borderTopLeftRadius: 35,
              borderTopRightRadius: 35,
              flex: 1,
              backgroundColor: 'white',
              paddingHorizontal: 8,
              paddingTop: 8,
            }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: 'black', marginLeft: 8 }}>Email Address</Text>
              <TextInput
                style={{
                  padding: 16,
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  borderRadius: 20,
                  marginBottom: 8,
                }}
                placeholder="Enter Email"
                value={email}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => setEmail(value)}
                onSubmitEditing={() => passwordRef.current.focus()} // Move to next input
              />
              <Text style={{ color: 'black', marginLeft: 8 }}>Password</Text>
              <TextInput
                ref={passwordRef}
                style={{
                  padding: 16,
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  borderRadius: 20,
                  marginBottom: 14,
                }}
                secureTextEntry
                placeholder="Enter Password"
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
              <TouchableOpacity
                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                onPress={() => console.log('Forgot Password?')}>
                <Text style={{ color: 'gray', marginBottom: 5 }}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={{ padding: 24, backgroundColor: '#FF8001', borderRadius: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>Login</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, color: 'gray', fontWeight: 'bold', textAlign: 'center', paddingTop: 5 }}>Or</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 7 }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ fontWeight: 'bold', color: '#FF8001' }}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
  