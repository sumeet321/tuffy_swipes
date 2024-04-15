import { View, Text } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'

const SenderMessage = ({ message }) => {
  // Check if the message content is empty
  if (!message || !message.message.trim()) {
    return null; // Don't render anything if the message content is empty
  }

  return (
    <View
        style={[tw`bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-4 my-2`, {alignSelf: 'flex-start', marginLeft: 'auto'},]}>
      <Text
        style={tw`text-white`}>{message.message}</Text>
    </View>
  )
}

export default SenderMessage