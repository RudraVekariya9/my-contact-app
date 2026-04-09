import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import AboutScreen from "../screen/AboutScreen";
import HelpScreen from "../screen/HelpScreen";
import TodoScreen from "../screen/TodoScreen";
import SettingScreen from "../screen/SettingScreen";
import ScanScreen from "../screen/ScanScreen";
import PaginationScreen from "../screen/PaginationScreen";
import FloatingButton from "../components/FloatingButton/FloatingButtonHome";


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <>  
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="Home"
        component={BottomTabs}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
      />
      <Drawer.Screen
      name="To-Do"
      component={TodoScreen}
    />
    <Drawer.Screen
        name="Settings"
        component={SettingScreen}
      />
      <Drawer.Screen name="Scan" component={ScanScreen} />

      <Drawer.Screen 
        name="Pagination" 
        component={PaginationScreen} // Added Drawer Screen
      />
    </Drawer.Navigator>
    <FloatingButton />
        </>

  );
}