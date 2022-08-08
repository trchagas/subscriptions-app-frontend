import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '80%',
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    height: 30,
    color: '#999',
    borderColor: '#999',
    fontSize: 16,
    paddingLeft: 15,
    marginVertical: 5,
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: '10%',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  profilePicture: {
    width: 125,
    height: 125,
    borderRadius: 100,
  },
  nameInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },

  marginLeft: {
    marginLeft: 15,
  },
  foodwalkerName: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  foodwalkerNameInput: {
    fontWeight: 'bold',
    color: '#000',
    borderRadius: 10,
    borderWidth: 1,
    color: '#999',
    borderColor: '#999',
    fontSize: 18,
    height: 30,
    paddingLeft: 15,
    width: '75%',
  },
  flexWrap: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  italic: {
    fontStyle: 'italic',
  },
  fontBlack: {
    color: '#000',
  },
  fontGray: {
    color: '#888',
  },
  bold: {
    fontWeight: 'bold',
  },
  fontSizeText: {
    fontSize: 16,
  },

  header: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'left',
  },

  marginTop: {
    marginTop: 10,
  },

  changeProfilePictureIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderRadius: 50,
    padding: 8,
    backgroundColor: '#999',
  },
  profileData: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
})

export const buttonStyles = StyleSheet.create({
  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  editButton: {
    borderColor: '#22BB33',
    borderWidth: 2,
    backgroundColor: '#fff',
    width: 70,
    height: 35,
    borderRadius: 10,
    margin: 15,
  },
  editBtnText: {
    color: '#22BB33',
    fontSize: 14,
  },
  cancelBtn: {
    borderColor: '#bb2124',
    borderWidth: 2,
    backgroundColor: '#fff',
    width: 70,
    height: 35,
    borderRadius: 10,
    margin: 15,
  },
  cancelBtnText: {
    color: '#bb2124',
    fontSize: 14,
  },
  left: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  right: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
})
