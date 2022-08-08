import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: '#aaa',
    borderRadius: 15,
    width: '50%',
  },
  drawerContent: {
    flex: 1,
  },
  name: {
    marginLeft: 15,
    flexDirection: 'column',
  },
  userInfoSection: {
    paddingLeft: 20,
    marginTop: -10,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    paddingTop: 7,
    paddingRight: 50,
    fontWeight: 'bold',
  },
  caption: {
    paddingTop: 2,
    color: '#444',
    fontSize: 16,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 10,
  },
})
