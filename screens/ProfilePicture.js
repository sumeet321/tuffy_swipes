import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Alert,
} from 'react-native';
import { signOut, updateProfile, getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import useAuth from '../hooks/useAuth';
import * as Permissions from 'expo-permissions';
import {
  doc,
  setDoc,
  serverTimestamp,
  getFirestore,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function ProfilePicture() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [image, setImage] = useState(user?.photoURL || null);
  const [major, setMajor] = useState(null);
  const [age, setAge] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore
  const storage = getStorage();
  const storageRef = ref(storage, 'path/to/file');

  const updateUserProfile = () => {
    const userDocRef = doc(db, 'users', user.uid);

    setDoc(userDocRef, {
      id: user.uid,
      firstName: firstName,
      lastName: lastName,
      photoURL: image,
      major: major,
      age: age,
      gender: gender,
      preferences: preferences,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    if (user) {
      updateProfile(user, { photoURL: image });
      if (user.displayName && typeof user.displayName === 'string') {
        setFirstName(user.displayName.split(' ')[0]);
        setLastName(user.displayName.split(' ')[1]);
      } else {
        setFirstName('');
        setLastName('');
      }

      // Set initial values for major, age, and preferences
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            if (userData) {
              // Only set the image state if it's not set
              if (image === null) {
                setImage(userData.photoURL || null);
              }
              setMajor(userData.major || '');
              setAge(userData.age || '');
              setGender(userData.gender || null);
              setPreferences(userData.preferences || null);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user, image, db]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const pickImage = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });
    
        if (!result.cancelled) {
          const response = await fetch(result.uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `images/${user.uid}/${result.uri}`);
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          setImage(downloadURL);
        }
      } else {
        console.error('Camera roll permission not granted');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });

        if (!result.cancelled) {
          const response = await fetch(result.uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `images/${user.uid}/${result.uri}`);
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          setImage(downloadURL);
        }
      } else {
        console.error('Camera permission not granted');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const promptForUserPassword = async () => {
    setPasswordModalVisible(true);
  };

  const reauthenticateUser = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('User email:', user.email);
      
      const credential = EmailAuthProvider.credential(user.email, passwordInput);
      console.log('Credential:', credential);
      
      await reauthenticateWithCredential(user, credential);
      
      console.log('Reauthentication successful');
      
      return user;
    } catch (error) {
      console.error('Reauthentication error:', error);
      throw error;
    }
  };

  const deleteUserProfile = async () => {
    try {
      await promptForUserPassword();
    } catch (error) {
      console.error('Error prompting for user password:', error);
      Alert.alert('Failed to delete profile.');
    }
  };

  const confirmDeleteProfile = async () => {
    try {
      const userCredential = await reauthenticateUser();
      if (userCredential) {
        const userDocRef = doc(db, 'users', user.uid);
        await deleteDoc(userDocRef);
        await deleteUser(userCredential);
        navigation.navigate('Login');
      } else {
        throw new Error('User authentication failed');
      }
    } catch (error) {
      console.error('Error deleting user profile:', error);
      Alert.alert('Failed to delete profile.');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
            <Ionicons name="chevron-back-outline" size={34} color="#FF8001"/>
          </TouchableOpacity>

          {user ? (
            <>
              <Text style={tw`text-2xl font-bold p-1 font-bold text-center`}>
                {firstName} {lastName} Settings
              </Text>
              <Text style={tw`text-center p-4 font-bold text-red-400`}>
                The Profile Picture
              </Text>
              <View style={tw`items-center`}>
                <TouchableOpacity>
                  <Button title='Choose Picture' onPress={pickImage} />
                </TouchableOpacity>
              </View>
              <View style={tw`items-center`}>
                <TouchableOpacity>
                  <Button title='Take Picture' onPress={takePicture} />
                </TouchableOpacity>
              </View>

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Major</Text>
              <TextInput
                value={major}
                onChangeText={(text) => setMajor(text)}
                style={tw`text-center text-xl pb-2`}
                placeholder='What do you major in?'
              />

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Age</Text>
              <TextInput
                value={age ? age.toString() : ''} // Convert age to string and provide a default empty string if age is null
                onChangeText={(text) => setAge(text)}
                style={tw`text-center text-xl pb-2`}
                placeholder='Enter your age'
                keyboardType='numeric'
                maxLength={2}
              />

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Preferences</Text>
              <View style={tw`flex-row items-center justify-center`}>
                <TouchableOpacity
                  onPress={() => setPreferences('male')}
                  style={tw`p-2 bg-blue-500 rounded-md mx-2 ${
                    preferences === 'male' ? 'bg-opacity-70' : 'bg-opacity-20'
                  }`}>
                  <Text style={tw`text-white`}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPreferences('female')}
                  style={tw`p-2 bg-pink-500 rounded-md mx-2 ${
                    preferences === 'female' ? 'bg-opacity-70' : 'bg-opacity-20'
                  }`}>
                  <Text style={tw`text-white`}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPreferences('both')}
                  style={tw`p-2 bg-purple-500 rounded-md mx-2 ${
                    preferences === 'both' ? 'bg-opacity-70' : 'bg-opacity-20'
                  }`}>
                  <Text style={tw`text-white`}>Both</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-row justify-between p-4 top-20`}>
                <TouchableOpacity
                  onPress={updateUserProfile}
                  style={{
                    width: '30%',
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#FF8001',
                  }}>
                  <Text style={tw`text-center text-white text-xl`}>Update Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  style={{
                    width: '30%',
                    padding: 23,
                    borderRadius: 20,
                    backgroundColor: '#FF8001',
                  }}>
                  <Text style={tw`text-center text-white text-xl`}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={deleteUserProfile}
                  style={{
                    width: '30%',
                    padding: 16,
                    borderRadius: 20,
                    backgroundColor: '#FF0000',
                  }}>
                  <Text style={tw`text-center text-white text-xl`}>Delete Profile</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text>Loading...</Text>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={passwordModalVisible}
            onRequestClose={() => setPasswordModalVisible(false)}
          >
            <View style={tw`flex-1 justify-center items-center`}>
              <View style={tw`bg-white p-4 rounded-lg shadow-lg w-80`}>
                <Text style={tw`text-center text-lg font-bold mb-4`}>Enter Password to Confirm</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-md p-2`}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(text) => setPasswordInput(text)}
                />
                <TouchableOpacity
                style={tw`bg-red-500 rounded-md p-2 mt-4`}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={tw`text-white text-center font-bold`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`bg-blue-500 rounded-md p-2 mt-4`}
                onPress={() => {
                  setPasswordModalVisible(false);
                  confirmDeleteProfile();
                }}
              >
                <Text style={tw`text-white text-center font-bold`}>Delete Profile</Text>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
