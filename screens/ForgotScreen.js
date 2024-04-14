import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import sendPasswordResetEmail for resetting password
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [emailSent, setEmailSent] = useState(false); // State to track if email has been sent

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email); // Send reset password email
      setEmailSent(true); // Set emailSent state to true
    } catch (error) {
      console.error('Error sending email:', error.message);
      setErrorMessage('Error sending reset email. Please try again.'); // Set error message
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
              />
              {!emailSent ? (
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  style={{ padding: 24, backgroundColor: '#FF8001', borderRadius: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Reset Password</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 18, color: 'green', textAlign: 'center', marginTop: 20 }}>
                  Reset password email has been sent. Please check your email inbox.
                </Text>
              )}
              {errorMessage && (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
                  {errorMessage}
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
