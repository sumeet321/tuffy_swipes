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
} from 'react-native';
import { signOut, updateProfile, getAuth } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage} from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import useAuth from '../hooks/useAuth';
import * as Permissions from 'expo-permissions';
import { doc, setDoc, serverTimestamp, getFirestore, getDoc } from 'firebase/firestore';
import {Ionicons, Foundation} from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const calculateAge = (birthday) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function InformationScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [image, setImage] = useState(user?.photoURL || null);
  const [major, setMajor] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore
  const storage = getStorage();
  const storageRef = ref(storage, 'path/to/file');
  const [birthday, setBirthday] = useState(() => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return eighteenYearsAgo;
  });

  
  const updateUserProfile = () => {
    const userAge = calculateAge(birthday);
    if (userAge < 18) {
      alert('You must be 18 years old or older to create an account.');
      return;
    }

    // Check if email is verified
    if (!user.emailVerified) {
      alert('Please verify your email before creating a profile.');
      return;
    }
    
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      photoURL: image,
      major: major,
      birthday: birthday,
      age: userAge,
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

      // Set initial value for birthday
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            if (userData) {
              setBirthday(userData.birthday ? userData.birthday.toDate() : new Date());
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user, image, db]);

  // Function to refresh user data every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user) {
        user.reload();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user]);

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

  return (
    <SafeAreaView style={tw`flex-1`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {user ? (
            <>
              <Text style={tw`text-2xl font-bold p-1 font-bold text-center`}>
                Welcome {firstName} {lastName}
              </Text>
              <Text style={tw`text-center p-4 font-bold text-red-400`}>
                Step 1: The Profile Picture
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

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Step 2: Major</Text>
              <TextInput
                value={major}
                onChangeText={(text) => setMajor(text)}
                style={tw`text-center text-xl pb-2`}
                placeholder='What is your major?'
              />

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Step 3: Birth Year</Text>
              <DateTimePicker
                value={birthday}
                mode="date"
                display="spinner"
                maximumDate={new Date()} // Limit to current date
                minimumDate={new Date(birthday.getFullYear() - 18, birthday.getMonth(), birthday.getDate())} // Limit to 18 years ago from current date
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || birthday;
                  setBirthday(currentDate);
                }}
              />
              <Text style={tw`text-center font-bold text-red-400`}>
                Age: {calculateAge(birthday)}
              </Text>

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Step 4: Gender</Text>
              <View style={tw`flex-row items-center justify-center`}>
                <TouchableOpacity
                  onPress={() => setGender('male')}
                  style={tw`p-2 bg-blue-500 rounded-md mx-2 ${
                    gender === 'male' ? 'bg-opacity-70' : 'bg-opacity-20'
                  }`}>
                  <Text style={tw`text-white`}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('female')}
                  style={tw`p-2 bg-pink-500 rounded-md mx-2 ${
                    gender === 'female' ? 'bg-opacity-70' : 'bg-opacity-20'
                  }`}>
                  <Text style={tw`text-white`}>Female</Text>
                </TouchableOpacity>
              </View>

              <Text style={tw`text-center p-4 font-bold text-red-400`}>Step 5: Preferences</Text>
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

              <View style={tw`flex-row items-center justify-center`}>
              <TouchableOpacity
                onPress={updateUserProfile}
                style={{
                  width: 150, // Adjusted width
                  padding: 12, // Adjusted padding
                  borderRadius: 20,
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: '#FF8001',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  top: 10,
                }}>
                <Text style={tw`text-center text-white text-xl`}>Create Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  width: 150, // Adjusted width
                  padding: 12, // Adjusted padding
                  borderRadius: 20,
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: '#FF8001',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  top: 10,
                }}>
                <Text style={tw`text-center text-white text-xl`}>Logout</Text>
              </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
