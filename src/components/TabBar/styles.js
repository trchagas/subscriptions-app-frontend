import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  text: {
    fontSize: 12,
    color: '#fff',
  },
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 1,
  },
  tab: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#28a745',
    borderRadius: 15,
    height: 70,
  },
})
