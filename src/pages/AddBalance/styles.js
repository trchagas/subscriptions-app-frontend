import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },

  searchBar: {
    marginHorizontal: 20,
  },

  scrollView: {
    marginHorizontal: 20,
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

  btnGroup: {
    display: 'flex',
    flexDirection: 'row',
  },

  addReason: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },

  reasonHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },

  left: {
    width: 60,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  middle: {
    width: 60,
    borderRadius: 0,
  },
  right: {
    width: 60,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },

  reasonInput: {
    borderWidth: 1,
    borderColor: '#afafaf',
    marginTop: 20,
    borderRadius: 15,
    padding: 10,
    width: '100%',
  },

  addBalance: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: '#afafaf',
    backgroundColor: '#fff',
    borderRadius: 15,
    color: '#6f6f6f',
    paddingHorizontal: 10,
    width: 100,
    height: 45,
  },

  plussBalanceTxt: {
    color: '#6f6f6f',
  },

  confirmBtn: {
    padding: 10,
    marginTop: 15,
    borderRadius: 15,
  },

  cancelBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#fff',
  },

  cardSecondaryInfo: {
    width: '100%',
    height: 120,
    padding: 10,
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  secondaryInfoTxt: {
    fontSize: 16,
  },

  cardMainInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  cardProfilePicture: {
    width: 75,
    height: 75,
    borderRadius: 100,
  },

  userCard: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
    marginTop: 15,
  },

  selectedUserCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 15,
    padding: 25,
    marginTop: 15,
  },

  userCardCol2: {
    alignItems: 'center',
  },

  itemReview: {
    display: 'flex',
    flexDirection: 'row',
  },

  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  customerReview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  reviewCounterText: {
    color: '#aaa',
    marginLeft: 10,
    fontSize: 18,
  },

  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
})
