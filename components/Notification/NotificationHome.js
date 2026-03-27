import React, { useState } from "react";
import styled from "styled-components/native";
import { ScrollView, Text, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  getNotifications,
  resetUnreadCount,
  clearNotifications,
} from "../../services/notifications/notificationStorage";

export default function NotificationHome() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

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

  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
      resetUnreadCount();
    }, [])
  );

  return (
    <ScrollContent showsVerticalScrollIndicator={false}>
      
      {/* Show button only if notifications exist */}
      {notifications.length > 0 && (
        <ClearButton onPress={handleClearAll}>
          <ClearText>Clear All</ClearText>
        </ClearButton>
      )}

      {notifications.length === 0 ? (
        <EmptyText>No notifications yet</EmptyText>
      ) : (
        notifications.map((item, index) => (
          <Card key={index}>
            <Title>{item.title}</Title>
            <Body>{item.body}</Body>
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

const ClearButton = styled.TouchableOpacity`
  background-color: #0b74e5;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
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
  font-weight: bold;
  margin-bottom: 5px;
`;

const Body = styled.Text`
  font-size: 14px;
  color: #333;
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