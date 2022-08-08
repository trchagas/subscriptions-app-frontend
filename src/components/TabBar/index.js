import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'

import { Ionicons } from '@expo/vector-icons'

const buttonsOptions = [
  {
    label: 'Pedidos',
    route: 'Pedidos',
    icon: 'fast-food',
  },
  {
    route: 'Venda',
    title: 'Venda',
    icon: 'cart',
  },
  {
    route: 'Estoque',
    title: 'Estoque',
    icon: 'briefcase',
  },
]

function BarIcon({ title, icon }) {
  return (
    <View style={styles.view}>
      <Ionicons name={icon} color="#fff" size={30} />
      <Text style={styles.text}>{title}</Text>
    </View>
  )
}

// { state, descriptors, navigation, style }
function TabBar({ navigation }) {
  return (
    <View style={[styles.tab, styles.shadow]}>
      {buttonsOptions.map((options, index) => {
        const label = options.label || options.route

        const onPress = () => {
          navigation.navigate(options.route)
        }

        const icon = options.icon

        return (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onPress}
            style={{ flex: 1 }}
            key={index}
          >
            {<BarIcon title={label} icon={icon} />}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TabBar
