import { View, Text, TouchableOpacity, Clipboard, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import tw from 'tailwind-react-native-classnames';

const SenderMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);

  // Check if the message content is empty
  if (!message || !message.message.trim()) {
    return null; // Don't render anything if the message content is empty
  }

  // Function to copy the message to the clipboard and show feedback
  const copyToClipboard = () => {
    Clipboard.setString(message.message);
    setCopied(true);
    // Hide the mini message after a short delay
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <TouchableOpacity onLongPress={copyToClipboard}>
      <View
        style={[tw`bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-4 my-2`, { alignSelf: 'flex-start', marginLeft: 'auto' }]}>
        <Text style={tw`text-white`}>{message.message}</Text>
      </View>
      {copied && (
        <View style={[tw`bg-gray-800 rounded-full px-4 py-2 mx-4 my-1`, { alignSelf: 'flex-start', marginLeft: 'auto' }]}>
          <Text style={tw`text-white text-sm`}>Copied!</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SenderMessage;
