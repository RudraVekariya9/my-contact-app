import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  // Entry animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(120)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Exit animation (card)
  const exitScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  // Border animation (circle effect)
  const borderAnim = useRef(new Animated.Value(25)).current;

  // Background dark effect
  const bgDark = useRef(new Animated.Value(0)).current;

  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchUserData();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUsername(snap.data().username || "User");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 🔁 MORE ROTATION (4 spins)
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1440deg"],
  });

  const handlePress = () => {
    // 🌑 Background dark
    Animated.timing(bgDark, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // 🌀 Card animation (FAST)
    Animated.parallel([
      Animated.timing(exitScale, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 450, // faster spin
        useNativeDriver: true,
      }),
    ]).start();

    // 🔵 Circle morph
    Animated.timing(borderAnim, {
      toValue: 200,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace("App");
    });
  };

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  const backgroundColor = bgDark.interpolate({
    inputRange: [0, 1],
    outputRange: ["#4facfe", "#000000"],
  });

  return (
    <AnimatedContainer style={{ backgroundColor }}>
      <AnimatedWrapper
        style={{
          opacity: Animated.multiply(fadeAnim, exitOpacity),
          transform: [
            { translateY: slideAnim },
            { scale: Animated.multiply(scaleAnim, exitScale) },
            { rotate },
          ],
        }}
      >
        <AnimatedCard style={{ borderRadius: borderAnim }}>
          <Avatar>
            <AvatarText>{initial}</AvatarText>
          </Avatar>

          <WelcomeText>Welcome back</WelcomeText>

          <Name>{username}</Name>

          <Tagline>Tap below to enter 🚀</Tagline>

          <Button onPress={handlePress}>
            <ButtonText>Tap Me</ButtonText>
          </Button>
        </AnimatedCard>
      </AnimatedWrapper>
    </AnimatedContainer>
  );
}

/* styles */

/* styles */

const AnimatedContainer = styled(Animated.View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const AnimatedWrapper = styled(Animated.View)`
  width: 80%; /* 🔥 reduced */
`;

const AnimatedCard = styled(Animated.View)`
  background-color: #ffffff;
  padding: 28px 20px; /* 🔥 less side padding */
  align-items: center;
  elevation: 10;
`;

const Avatar = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #00c6ff;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const AvatarText = styled.Text`
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
`;

const WelcomeText = styled.Text`
  font-size: 15px;
  color: #6b7280;
  text-align: center;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #0b74e5;
  margin-top: 4px;
  text-align: center;
`;

const Tagline = styled.Text`
  font-size: 13px;
  color: #9ca3af;
  margin-top: 8px;
  text-align: center;
  max-width: 220px; /* 🔥 key fix */
`;

const Button = styled.TouchableOpacity`
  margin-top: 22px;
  background-color: #0b74e5;
  padding: 12px 26px;
  border-radius: 12px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
`;