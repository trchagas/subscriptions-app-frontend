import React from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'

import Header from '../../components/Header'

import MainMap from '../../pages/MainMap'
import Sell from '../../pages/Sell'
import Storage from '../../pages/Storage'

import Orders from '../../pages/Orders'
import OrderDetails from '../../pages/OrderDetails'

import AddBalance from '../../pages/AddBalance'
import Profile from '../../pages/Profile'
import Dashboard from '../../pages/Dashboard'
import Rankings from '../../pages/Rankings'

import OrderCompleted from '../../pages/OrderCompleted'
import RateCustomer from '../../pages/RateCustomer'
import LinkCustomer from '../../pages/LinkCustomer'
import OrderReview from '../../pages/OrderReview'
import EditOrder from '../../pages/EditOrder'

const Stack = createStackNavigator()

function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={(props) => ({
        headerLeft: null,
        headerStyle: { backgroundColor: '#28a745' },
        headerTitleContainerStyle: {
          width: '100%',
          height: '100%',
        },
        headerTitle: () => <Header {...props} />,
        headerMode: 'float',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      })}
    >
      <Stack.Screen
        name="Inicio"
        component={MainMap}
        options={(props) => ({
          headerTitle: () => <Header title="Mapa" {...props} />,
        })}
      />
      <Stack.Screen name="Perfil" component={Profile} />
      <Stack.Screen name="Área do Vendedor" component={Dashboard} />
      <Stack.Screen name="Rankings" component={Rankings} />
      <Stack.Screen name="Estoque" component={Storage} />
      <Stack.Screen name="Pedidos" component={Orders} />
      <Stack.Screen name="Venda" component={Sell} />
      <Stack.Screen name="Detalhes do Pedido" component={OrderDetails} />
      <Stack.Screen name="Cadastro e Pagamento" component={LinkCustomer} />
      <Stack.Screen name="Revisão do Pedido" component={OrderReview} />
      <Stack.Screen name="Pedido Concluído" component={OrderCompleted} />
      <Stack.Screen name="Avaliar Cliente" component={RateCustomer} />
      <Stack.Screen name="Editar Pedido" component={EditOrder} />
      <Stack.Screen name="Adicionar Saldo" component={AddBalance} />

      {/* <Stack.Screen name="Metas" component={Goals} /> */}
    </Stack.Navigator>
  )
}

export default StackNavigator
