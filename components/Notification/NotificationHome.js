import React, { useState } from "react";
import styled from "styled-components/native";
import { ScrollView, Text, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  getNotifications,
  resetUnreadCount,
  clearNotifications,
  markAllAsRead,
} from "../../services/notifications/notificationStorage";

export default function NotificationHome() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  //  CLEAR ALL
  const handleClearAll = () => {
    Alert.alert(
      "Clear All",
      "Are you sure you want to delete all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await clearNotifications();
            setNotifications([]);
          },
        },
      ]
    );
  };

  //  MARK ALL AS READ
  const handleMarkAllRead = async () => {
    await markAllAsRead();
    loadNotifications();
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
      resetUnreadCount();
    }, [])
  );

  return (
    <ScrollContent showsVerticalScrollIndicator={false}>

      {/*  BUTTONS */}
      {notifications.length > 0 && (
        <>
          <ActionRow>
            <ReadButton onPress={handleMarkAllRead}>
              <ReadText>Mark All as Read</ReadText>
            </ReadButton>

            <ClearButton onPress={handleClearAll}>
              <ClearText>Clear All</ClearText>
            </ClearButton>
          </ActionRow>
        </>
      )}

      {/*  LIST */}
      {notifications.length === 0 ? (
        <EmptyText>No notifications yet</EmptyText>
      ) : (
        notifications.map((item, index) => (
          <Card key={index}>
            <Title isRead={item.isRead}>{item.title}</Title>
            <Body isRead={item.isRead}>{item.body}</Body>
            <Time>
              {new Date(item.time).toLocaleString()}
            </Time>
          </Card>
        ))
      )}
    </ScrollContent>
  );
}

/* styles */

const ScrollContent = styled(ScrollView)`
  padding: 20px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ReadButton = styled.TouchableOpacity`
  background-color: #888;
  padding: 10px;
  border-radius: 10px;
  flex: 1;
  margin-right: 5px;
  align-items: center;
`;

const ReadText = styled.Text`
  color: white;
  font-weight: bold;
`;

const ClearButton = styled.TouchableOpacity`
  background-color: #0b74e5;
  padding: 10px;
  border-radius: 10px;
  flex: 1;
  margin-left: 5px;
  align-items: center;
`;

const ClearText = styled.Text`
  color: white;
  font-weight: bold;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-width: 1px;
  border-color: #e5e5e5;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 15px;
  elevation: 2;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: ${({ isRead }) => (isRead ? "normal" : "bold")};
  color: ${({ isRead }) => (isRead ? "#999" : "#000")};
  margin-bottom: 5px;
`;

const Body = styled.Text`
  font-size: 14px;
  color: ${({ isRead }) => (isRead ? "#aaa" : "#333")};
  margin-bottom: 5px;
`;

const Time = styled.Text`
  font-size: 12px;
  color: gray;
`;

const EmptyText = styled(Text)`
  text-align: center;
  margin-top: 40px;
  color: gray;
`;