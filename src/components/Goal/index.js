import React from 'react'
import { View, Text } from 'react-native'

import { styles } from './styles'

import ProgressBar from '../ProgressBar'

function Goal({ label = 'Progresso', progress, style, textStyle, barStyle }) {
  return (
    <View style={[styles.goal, style]}>
      <Text style={[styles.text, textStyle]}>{label}</Text>
      <ProgressBar progress={progress} style={barStyle} />
    </View>
  )
}

export default Goal
