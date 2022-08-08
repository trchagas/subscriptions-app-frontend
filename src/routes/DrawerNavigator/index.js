import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import StackNavigator from "../StackNavigator";

import DrawerContent from "../../components/Drawer";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false
      }}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={StackNavigator}
        options={{ swipeEdgeWidth: 0 }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
