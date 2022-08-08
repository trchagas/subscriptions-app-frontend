import React, { useEffect } from 'react'
import { Image, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { styles } from './styles'

import Profile from '../../assets/Logo.png'
import {
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler'

function Header({ navigation, title, route }) {
  const label = title || route.name

  return (
    <View style={styles.header}>
      {navigation.canGoBack() ? (
        <MaterialIcons
          name="arrow-back"
          size={30}
          style={styles.leftIcon}
          onPress={() => {
            navigation.goBack()
          }}
        />
      ) : (
        <MaterialIcons
          name="menu"
          size={30}
          style={styles.leftIcon}
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      )}

      <View>
        <Text style={styles.headerText}>{label}</Text>
      </View>
      <Image source={Profile} style={styles.rightIcon} />
    </View>
  )
}

export default Header
