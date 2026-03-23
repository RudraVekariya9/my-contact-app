import React from "react";
import Header from "../components/shared/Header";
import ProfileDetail from "../components/profile/ProfileDetail";


export default function ProfileScreen({navigation}) {
  return (
    <>
      <Header  title= "Profile"/>
      <ProfileDetail navigation={navigation} />
    </>
  );
}