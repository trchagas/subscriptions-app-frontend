import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  headerButton: {
    backgroundColor: '#28a745',
    borderRadius: 45,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '90%',
    height: 120,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
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

  filterHeader: {
    backgroundColor: '#fff',
    height: 35,
    width: '100%',
  },

  row: {
    flexDirection: 'row',
  },

  checkItemGroup: {
    paddingBottom: 20,
  },

  checkItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  checkItemText: {
    fontSize: 18,
  },

  vstack: {
    flex: 1,
    flexDirection: 'column',
  },

  view: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },

  scrollView: {
    marginVertical: 10,
  },

  hstack: {
    flex: 1,
    flexDirection: 'row',
  },

  status: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  address: {
    fontWeight: 'bold',
  },

  items: {
    color: '#999',
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

  total: {
    fontWeight: 'bold',
  },

  col3: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
