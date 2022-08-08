import React from 'react'

import { View, Text, Image } from 'react-native'

import { styles } from './styles'

import Logo from '../../assets/Logo.png'

function Login({ children }, ref) {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.imageView}>
          <Image style={styles.image} source={Logo} />
        </View>

        <View style={styles.spanView}>
          <Text style={styles.span}>Bem-vindo de volta, Vendedor!</Text>
        </View>

        <View style={styles.children}>{children}</View>
      </View>
    </View>
  )
}

export default Login
