import React, { useRef, useEffect } from "react";
import {
  SectionList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useContactContext } from "../../context/ContactContext";
import { Swipeable } from "react-native-gesture-handler";

export default function ContactList() {
  const navigation = useNavigation();
  const { filteredContacts, loading, searchLoading } = useContactContext();
  const sectionListRef = useRef();

  // GROUP CONTACTS
  const groupContacts = (contacts) => {
    const grouped = {};
    contacts.forEach((contact) => {
      const letter = contact.name[0].toUpperCase();
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push(contact);
    });

    return Object.keys(grouped).map((key) => ({
      title: key,
      data: grouped[key],
    }));
  };

  const sections = groupContacts(filteredContacts);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToLetter = (letter) => {
    const index = sections.findIndex((s) => s.title === letter);
    if (index !== -1) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
      });
    }
  };

  useEffect(() => {
    if (filteredContacts.length > 0) {
      const firstLetter = filteredContacts[0].name[0].toUpperCase();
      const index = sections.findIndex((s) => s.title === firstLetter);
      if (index !== -1) {
        sectionListRef.current.scrollToLocation({
          sectionIndex: index,
          itemIndex: 0,
        });
      }
    }
  }, [filteredContacts]);

  // Swipe UI Actions
  const renderLeftActions = () => (
    <ActionLeft>
      <ActionText>Chat</ActionText>
    </ActionLeft>
  );

  const renderRightActions = () => (
    <ActionRight>
      <ActionText>Call</ActionText>
    </ActionRight>
  );

  return (
    <Container>
      {(loading || searchLoading) && (
        <LoaderContainer>
          <ActivityIndicator size="large" color="#0b74e5" />
        </LoaderContainer>
      )}

      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          // Local ref for this specific row
          let rowRef = null;

          const closeAndNavigate = (screen, params) => {
            if (rowRef) rowRef.close(); // Close the swipe before navigating
            navigation.navigate(screen, params);
          };

          return (
            <Swipeable
              ref={(ref) => (rowRef = ref)}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  closeAndNavigate("Chat", { contact: item });
                }
                if (direction === "right") {
                  closeAndNavigate("VideoCall", { contact: item });
                }
              }}
            >
              <Card
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("ContactDetails", {
                    name: item.name,
                    role: item.role,
                    phone: item.phone,
                    image: item.image,
                  })
                }
              >
                {item.image && <ProfileImage source={{ uri: item.image }} />}
                <TextContainer>
                  <Name>{item.name}</Name>
                  <Role>{item.role}</Role>
                </TextContainer>
              </Card>
            </Swipeable>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <HeaderContainer>
            <HeaderText>{title}</HeaderText>
          </HeaderContainer>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      {/* A-Z SIDEBAR */}
      <Sidebar>
        {alphabet.map((letter) => (
          <TouchableOpacity
            key={letter}
            onPress={() => scrollToLetter(letter)}
          >
            <Letter>{letter}</Letter>
          </TouchableOpacity>
        ))}
      </Sidebar>
    </Container>
  );
}

/* -------- STYLES -------- */

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const LoaderContainer = styled.View`
  margin: 15px 0;
  align-items: center;
`;

const Card = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 10px;
`;

const ProfileImage = styled(Image)`
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  margin-right: 12px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const Role = styled.Text`
  font-size: 13px;
  color: #777;
  margin-top: 2px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #e5e5e5;
  margin-left: 73px;
`;

const HeaderContainer = styled.View`
  background-color: #e6f2ff;
  padding: 3px 15px;
`;

const HeaderText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #0b74e5;
`;

const Sidebar = styled.View`
  position: absolute;
  right: 2px;
  top: 100px;
  bottom: 100px;
  justify-content: center;
`;

const Letter = styled.Text`
  font-size: 10px;
  padding: 2px;
  color: #0b74e5;
`;

const ActionLeft = styled.View`
  width: 100px;
  justify-content: center;
  background-color: #4caf50;
  padding-left: 20px;
`;

const ActionRight = styled.View`
  width: 100px;
  justify-content: center;
  align-items: flex-end;
  background-color: #2196f3;
  padding-right: 20px;
`;

const ActionText = styled.Text`
  color: white;
  font-weight: bold;
`;