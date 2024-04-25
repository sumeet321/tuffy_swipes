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
  Alert,
  ScrollView, // Import ScrollView for scrolling content
} from 'react-native';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, reload } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

// Function to send email verification
const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    // Show a message to the user indicating that a verification email has been sent
    Alert.alert('Success', 'A verification email has been sent. Please verify your email address.');
    await user.reload();
  } catch (error) {
    console.log('Error sending email verification:', error.message);
    // Handle error
  }
};


export default function SignUpScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordChecker, setPasswordChecker] = useState('');
  const [passwordCheckerVisible, setPasswordCheckerVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordValid, setPasswordValid] = useState(true);

  // Create refs for each TextInput
  const lastNameRef = useRef(null);
  const firstNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckerRef = useRef(null);

  const validatePassword = (password) => {
    // Regular expressions for checking if the password has at least one number and one special character
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);

    // Check if the password meets each requirement separately
    const isNumberValid = hasNumber;
    const isSpecialCharacterValid = hasSpecialCharacter;

    // Set the password validity based on each individual check
    const isValid = isNumberValid && isSpecialCharacterValid;
    setPasswordValid(isValid);
    return isValid;
  };


  const handleSubmit = async () => {
    /*
    if (!email.endsWith('@csu.fullerton.edu')) {
      setErrorMessage('Please use a valid CSUF email address.');
      return;
    }
    */
  
    if (password !== passwordChecker) {
      setErrorMessage('Passwords do not match.');
      return;
    }
  
    if (email && password) {
      const isPasswordValid = validatePassword(password);
      if (!isPasswordValid) {
        setErrorMessage('Password must contain at least one number and one special character.');
        return;
      }
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Get the user object from userCredential
        console.log('User:', user); // Log the user object
  
        const displayName = `${firstName} ${lastName}`;
        await updateProfile(user, { displayName });
  
        // Send email verification
        await sendVerificationEmail(user);
  
        // Check if the email is verified before navigating
        if (user.emailVerified) {
          // Email is verified, navigate to the welcome screen
          navigation.navigate('Info');
        } else {
          // Email is not verified yet
          setErrorMessage('A verification email has been sent. Please verify your email address.');
        }
      } catch (err) {
        console.log('Got error:', err.message);
  
        if (err.code === 'auth/email-already-in-use') {
          setErrorMessage('Email address is already in use. Please use a different email.');
        } else if (err.code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters.')
        } else {
          setErrorMessage('An error occurred during registration. Please try again.');
        }
      }
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: themeColors.bg }}
        behavior="padding"
        enabled
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={tw`p-2`}>
                  <Ionicons name="chevron-back-outline" size={34} color="#FF8001"/>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -25 }}>
                <Image source={require('../assets/icons/csuf.png')} style={{ width: 175, height: 175}} />
              </View>
            </SafeAreaView>
            <View style={{ backgroundColor: 'white', paddingHorizontal: 8, paddingTop: 8, borderTopLeftRadius: 35, borderTopRightRadius: 35 }}>
              <View style={{ marginBottom: 8 }}>
                <Text style={{ color: 'black', marginLeft: 8 }}>First Name</Text>
                <TextInput
                  ref={firstNameRef}
                  style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                  value={firstName}
                  onChangeText={(value) => setFirstname(value.trim())}
                  placeholder="Enter First Name"
                  onSubmitEditing={() => lastNameRef.current.focus()}
                />
                <Text style={{ color: 'black', marginLeft: 8 }}>Last Name</Text>
                <TextInput
                  ref={lastNameRef}
                  style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                  value={lastName}
                  onChangeText={(value) => setLastname(value.trim())}
                  placeholder="Enter Last Name"
                  onSubmitEditing={() => emailRef.current.focus()}
                />
                <Text style={{ color: 'black', marginLeft: 8 }}>Email Address</Text>
                <TextInput
                  ref={emailRef}
                  style={{ padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                  value={email}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(value) => setEmail(value.trim())}
                  placeholder="email@csu.fullerton.edu"
                  onSubmitEditing={() => passwordRef.current.focus()}
                />
                <Text style={{ color: 'black', marginLeft: 8 }}>Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <TextInput
                    ref={passwordRef}
                    style={{ flex: 1, padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 8 }}
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={(value) => setPassword(value.trim())}
                    placeholder="Enter Password"
                    onSubmitEditing={() => passwordCheckerRef.current.focus()}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={{ marginLeft: 8 }}>
                    <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={{ color: 'black', marginLeft: 8 }}>Confirm Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <TextInput
                    ref={passwordCheckerRef}
                    style={{ flex: 1, padding: 16, backgroundColor: '#d3d3d3', color: 'black', borderRadius: 20, marginBottom: 14 }}
                    secureTextEntry={!passwordCheckerVisible}
                    value={passwordChecker}
                    onChangeText={(value) => setPasswordChecker(value.trim())}
                    placeholder="Confirm Password"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity onPress={() => setPasswordCheckerVisible(!passwordCheckerVisible)} style={{ marginLeft: 8 }}>
                    <Ionicons name={passwordCheckerVisible ? "eye-off" : "eye"} size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {!passwordValid}
                {errorMessage && (
                  <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
                    {errorMessage}
                  </Text>
                )}
                <TouchableOpacity
                  style={{ padding: 24, backgroundColor: '#FF8001', borderRadius: 20, marginBottom: 8 }}
                  onPress={handleSubmit}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
