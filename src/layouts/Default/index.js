import React from 'react'
import { View } from 'react-native'

import styles from './styles'

function Layout({ children }) {
  return <View style={styles.main}>{children}</View>
}

export default Layout
