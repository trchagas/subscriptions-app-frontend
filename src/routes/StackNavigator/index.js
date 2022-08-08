import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator
} from "@react-navigation/stack";

import Header from "../../components/Header";

import Form from "../../pages/Form";
import Edit from "../../pages/Edit";
import List from "../../pages/List";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={props => ({
        headerLeft: null,
        headerStyle: { backgroundColor: "#28a745" },
        headerTitleContainerStyle: {
          width: "100%",
          height: "100%"
        },
        headerTitle: () => <Header {...props} />,
        headerMode: "float",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      })}
    >
      <Stack.Screen
        name="Inscrições"
        component={List}
        options={props => ({
          headerTitle: () => <Header title="Inscrições" {...props} />
        })}
      />
      <Stack.Screen name="Novo" component={Form} />
      <Stack.Screen name="Editar" component={Edit} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
