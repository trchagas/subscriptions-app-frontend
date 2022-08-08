import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: 470,
    width: '90%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageView: {
    display: 'flex',
    paddingTop: 25,
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  spanView: {
    marginTop: 25,
    borderBottomWidth: 5,
    width: '80%',
    borderColor: '#28a745',
    borderStyle: 'solid',
  },
  span: {
    color: '#888',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 25,
  },
  children: {
    width: '80%',
    paddingTop: 15,
    paddingBottom: 30,
  },
})
