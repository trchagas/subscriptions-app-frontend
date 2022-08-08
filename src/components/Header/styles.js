import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 1
  },
  leftIcon: {
    color: '#fff',
    position: 'absolute',
    left: 0
  },
  rightIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    right: 0
  }
})
