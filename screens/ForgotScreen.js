import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { sendPasswordResetEmail } from 'firebase/auth';


const ForgotScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert('Password Reset Email Sent', 'Check your email for instructions to reset your password.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={tw`p-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF8001" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Reset Password</Text>
        <Text style={{ marginBottom: 8 }}>Enter your email address to receive a password reset link.</Text>
        <TextInput
          style={{
            padding: 16,
            backgroundColor: '#d3d3d3',
            borderRadius: 20,
            marginBottom: 14,
          }}
          placeholder="Enter Email"
          value={email}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(value) => setEmail(value)}
        />
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            handleResetPassword();
          }}
          style={{ padding: 24, backgroundColor: '#FF8001', borderRadius: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black' }}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotScreen;
