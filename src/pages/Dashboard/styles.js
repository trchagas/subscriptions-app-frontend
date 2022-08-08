import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  },
  emptyGoal: {
    padding: 10,
    fontSize: 14,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  marginLeft: {
    marginLeft: 15,
  },
  foodwalkerName: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  flexWrap: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  italic: {
    fontStyle: 'italic',
  },
  fontGray: {
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  fontScore: {
    fontSize: 16,
  },

  rank: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
  },

  header: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
  },
  goalHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
  },

  revenue: {
    backgroundColor: '#28a745',
    marginHorizontal: 30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  text: {
    color: '#fff',
    fontSize: 16,
  },

  marginVertical: {
    marginVertical: 10,
  },

  goal: {
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  marginBottom: {
    marginBottom: 10,
  },

  marginTop: {
    marginTop: 10,
  },
})

export const buttonGroupStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 15,
    height: 30,
  },
  btnGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#28a745',
  },
  btn: { flex: 1, height: '100%' },
  btnText: {
    color: '#fff',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 14,
  },
  middle: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  left: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  right: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
})
