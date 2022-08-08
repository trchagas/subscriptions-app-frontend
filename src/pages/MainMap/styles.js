import { StyleSheet } from 'react-native'
import { alignItems, justifyContent } from 'styled-system'

export const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },

  button: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },

  resetPosition: {
    position: 'absolute',
    bottom: 125,
    right: 30,
  },
  setRoute: {
    position: 'absolute',
    bottom: 125,
    left: 30,
  },

  close: {
    position: 'absolute',
    bottom: 185,
    right: 30,
  },

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

  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  status: {
    position: 'absolute',
    top: 10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    color: '#000',
    fontSize: 16,
  },

  callout: {
    // minHeight: 100,
  },

  bold: {
    fontWeight: 'bold',
  },

  distance: {
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    marginLeft: -75,
    marginTop: 10,
    left: '50%',
    width: 150,
  },

  displayText: {
    fontSize: 20,
    paddingLeft: 5,
    color: '#000',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  marginTop: {
    marginTop: 10,
  },
})

export const orderCardStyles = StyleSheet.create({
  card: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
  },

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

  col1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  col2: {
    paddingLeft: 10,
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  col3: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  items: {
    color: '#999',
  },

  bold: {
    fontWeight: 'bold',
  },
})
