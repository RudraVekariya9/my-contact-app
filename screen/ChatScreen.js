import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
} from "react-native";
import styled from "styled-components/native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { contact } = route.params;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const flatListRef = useRef();
  const STORAGE_KEY = `@chat_history_${contact.name.replace(/\s+/g, "_")}`;

  // LOAD MESSAGES
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    loadData();
  }, []);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    setMessage("");

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#0b74e5" />

        {/* HEADER */}
        <Header>
          <HeaderContent>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {contact.image ? (
              <Avatar source={{ uri: contact.image }} />
            ) : (
              <DefaultAvatar>
                <Ionicons name="person" size={20} color="white" />
              </DefaultAvatar>
            )}

            <HeaderInfo>
              <HeaderName>{contact.name}</HeaderName>
            </HeaderInfo>
          </HeaderContent>
        </Header>

        {/* MESSAGES */}
        <Body>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 15, flexGrow: 1 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            renderItem={({ item }) => (
              <MessageBubble>
                <MessageText>{item.text}</MessageText>
                <TimeText>{item.timestamp}</TimeText>
              </MessageBubble>
            )}
            ListEmptyComponent={() =>
              isHistoryLoading && (
                <LoaderContainer>
                  <ActivityIndicator color="#0b74e5" />
                </LoaderContainer>
              )
            }
          />

          {/* INPUT */}
          <InputContainer>
            <Input
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#888"
              multiline
            />

            <SendButton
              active={message.length > 0}
              onPress={sendMessage}
              disabled={message.length === 0}
            >
              <Ionicons name="send" size={20} color="white" />
            </SendButton>
          </InputContainer>
        </Body>
      </Container>
    </KeyboardAvoidingView>
  );
}

/* -------- STYLES -------- */

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  background-color: #0b74e5;
  elevation: 4;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: ${Platform.OS === "ios" ? "60px" : "45px"};
  padding-bottom: 15px;
  padding-horizontal: 15px;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-left: 10px;
`;

const DefaultAvatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #ccc;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
`;

const HeaderInfo = styled.View`
  margin-left: 12px;
`;

const HeaderName = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const Body = styled.View`
  flex: 1;
`;

const LoaderContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

const MessageBubble = styled.View`
  align-self: flex-end;
  background-color: #0b74e5;
  padding: 10px 15px;
  border-radius: 18px;
  border-bottom-right-radius: 2px;
  margin-vertical: 4px;
  max-width: 80%;
`;

const MessageText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

const TimeText = styled.Text`
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  align-self: flex-end;
  margin-top: 4px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  padding: 10px 15px;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #eee;
  align-items: center;
`;

const Input = styled.TextInput`
  flex: 1;
  background-color: #eeeeee;
  border-radius: 25px;
  padding-horizontal: 18px;
  padding-vertical: 10px;
  font-size: 16px;
  margin-right: 10px;
  color: #333333;
  border-width: 1px;
  border-color: #ddd;
`;

const SendButton = styled(TouchableOpacity)`
  background-color: ${(props) => (props.active ? "#0b74e5" : "#ccc")};
  width: 46px;
  height: 46px;
  border-radius: 23px;
  justify-content: center;
  align-items: center;
`;