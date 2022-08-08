import React from 'react'
import { View } from 'react-native'
import { styles } from './styles'

import { ProgressBar } from 'react-native-paper'

function Progress({ progress, style }) {
  return (
    <View style={[styles.container, style]}>
      <ProgressBar
        style={styles.progressBar}
        progress={progress}
        color="#179634"
      />
    </View>
  )
}

export default Progress
