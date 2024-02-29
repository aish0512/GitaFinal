import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet,Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GiftedChat } from 'react-native-gifted-chat'; // Corrected import
import { CurrentRenderContext } from '@react-navigation/native';

export default function App() {
  const [messages, setMessage] = useState([]); // Renamed for clarity and correctness
  const [inputMessage, setInputMessage] = useState(''); 
  const [outputMessage, setOutputMessage] = useState('');
  const botAvatar = require("./assets/logo.png"); 
  const sendMessage = async () => {
    const message = {
      _id:Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user:{_id: 1},
    }
    setMessage((previousMessages)=>
      GiftedChat.append(previousMessages, [message])
    )
    setInputMessage('');
    fetch('https://gita-chat-beta2.azurewebsites.net/api/gita_assistant_v1?Content-Type=application/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "prompt": inputMessage }),
    })
    .then((response) => response.json()).then((data) => {
      setOutputMessage(data.trim())
      const message = {
        _id:Math.random().toString(36).substring(7),
        text: data,
        createdAt: new Date(),
        user:{_id: 2, avatar: botAvatar}
      }
      setMessage((previousMessages)=>
        GiftedChat.append(previousMessages, [message])
      )
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  };
  

  const handleTextInput = (text) => {
    setInputMessage(text);
  };

  return (
    <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={messages => setMessage(previousMessages => GiftedChat.append(previousMessages, messages))}
          user={{ _id: 1 }}
          renderInputToolbar={() => null}
          style={styles.messagesContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={handleTextInput}
            placeholder="Type a message"
          />

          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <MaterialIcons name="send" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    justifyContent: "center"
  },
  
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F7D6D0',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  botMessage: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  
  botImage: {
    width: 40, // Adjust the size as needed
    height: 40, // Adjust the size as needed
    marginRight: 10, // Add some spacing between the image and the text
  },  
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'green',
    borderRadius: 9999,
    padding: 12,
    marginRight: 5,
    marginBottom: 5,
    width: 50,
    height: 50,
    justifyContent: "center"
  },
  sendButtonText: {
    color: '#fff',
  },
});

