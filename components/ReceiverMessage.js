import React, { useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, Clipboard } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const ReceiverMessage = ({ message }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // If message or message.photoURL is not defined or message.message is empty, return null
  if (!message || !message.photoURL || !message.message.trim()) {
    return null;
  }

  // Function to copy the message to the clipboard and show feedback
  const copyToClipboard = () => {
    Clipboard.setString(message.message);
    setCopied(true);
    // Hide the "Copied!" message after a short delay
    setTimeout(() => setCopied(false), 1500);
  };

  // Render the ReceiverMessage component
  return (
    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <View style={[tw`bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-4 my-2 ml-14`, { alignSelf: 'flex-start' }]}>
        {/* Text component displaying the message */}
        <TouchableOpacity onLongPress={copyToClipboard}>
          <Text style={tw`text-white`}>{message.message}</Text>
        </TouchableOpacity>
        
        {/* TouchableOpacity to make the image clickable */}
        <TouchableOpacity style={tw`absolute -top-1 -left-14`} onPress={() => setModalVisible(true)}>
          {/* Image component displaying the sender's photo */}
          <Image
            style={tw`h-12 w-12 rounded-full`}
            source={{ uri: message.photoURL }}
          />
        </TouchableOpacity>
      </View>

      {/* "Copied!" message */}
      {copied && (
        <View style={[tw`bg-gray-800 rounded-full px-4 py-2 mx-4 left-10`, { alignSelf: 'flex-start' }]}>
          <Text style={tw`text-white text-sm`}>Copied!</Text>
        </View>
      )}

      {/* Modal for displaying enlarged image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* TouchableOpacity to close the modal when clicked anywhere */}
        <TouchableOpacity
          style={[tw`flex-1 justify-center items-center bg-black bg-opacity-50`, { padding: 20 }]}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          {/* TouchableOpacity to close the modal */}
          <TouchableOpacity style={tw`absolute top-20 right-10`} onPress={() => setModalVisible(false)}>
            <Text style={tw`text-white text-lg`}>Close</Text>
          </TouchableOpacity>
          {/* Image component displaying the enlarged image */}
          <Image
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            source={{ uri: message.photoURL }}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ReceiverMessage;
