import React, { useRef } from 'react'
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native'

import { styles } from './styles'

function Button({
  children,
  style,
  onPress,
  longPress = false,
  isLoading = false,
  disabled = false,
  spinnerColor,
  activeOpacity,
}) {
  const timer = useRef(null)

  const repeat = (delay) => {
    onPress()
    timer.current = setTimeout(() => repeat(Math.max(delay - 50, 10)), delay)
  }

  const stopTimer = () => {
    clearTimeout(timer.current)
  }

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      style={[styles.button, style]}
      onPress={onPress}
      onLongPress={() => longPress && repeat(200)}
      onPressOut={() => longPress && stopTimer()}
    >
      {isLoading && (
        <ActivityIndicator
          style={{ marginRight: 5 }}
          size="small"
          color={spinnerColor || '#fff'}
        />
      )}
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  )
}

export default Button
