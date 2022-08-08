import { StyleSheet } from 'react-native'

export const buttonStyles = {
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
}

export const styles = StyleSheet.create({
  emptyGoal: {
    padding: 10,
    fontSize: 14,
  },
  view: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },

  info: {
    width: '100%',
  },

  h1: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 30,
  },

  label: {
    color: '#fff',
    fontSize: 15,
    textTransform: 'uppercase',
  },

  top: {
    alignItems: 'center',
    flex: 1,
  },

  middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottom: { alignItems: 'center', justifyContent: 'flex-end', flex: 1 },

  orderValue: {
    fontSize: 20,
  },

  text: {
    color: '#fff',
    fontSize: 16,
  },

  goalTitle: { fontSize: 15 },

  bold: {
    fontWeight: 'bold',
  },

  marginBottom: {
    marginBottom: 40,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 15,
  },

  valueText: {
    fontSize: 16,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    marginHorizontal: 50,
  },

  next: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: 80,
    paddingHorizontal: 15,
    display: 'flex',
  },

  h2: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  nextText: {
    fontSize: 20,
  },

  marginLeft: {
    marginLeft: 5,
  },

  checkmarkContainer: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  checkmark: { width: 125, height: 125 },

  goal: {
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  goalText: {
    color: '#fff',
    fontSize: 16,
  },
})
