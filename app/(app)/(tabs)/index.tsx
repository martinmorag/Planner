import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAuth } from 'firebase/auth';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { db } from '../../../firebaseConfig';
const hundredWidth = Dimensions.get('window').width


export default function HomeScreen() {
  const [sum, setSum] = useState(0)
  const [sumToday, setSumToday] = useState(0)

  const notesCollection = collection(db, 'notes')
  const auth = getAuth()
  const user = auth.currentUser

  const defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
    return moment(i, 'e').startOf('week').weekday(i + 1).format('MM-DD-YYYY');
  });

  const today = moment().format('MM-DD-YYYY');

  useEffect(() => {
      //setLoading(true)
      const fetchNotes = async() => {
        if (user) {
          const qry = query(notesCollection, and(where("userId", "==", user.uid), and(where("day", "in", defaultWeekdays))));
          const data = await getDocs(qry)
          data.forEach(note => {  
            console.log(note.data().day)
            setSum(prevCount => prevCount + 1)
          }) 

          const secondQuery = query(notesCollection, and(where("userId", "==", user.uid), and(where("day", "==", today))));
          const dataToday = await getDocs(secondQuery)
          dataToday.forEach(note => {  
            setSumToday(prevCount => prevCount + 1)
          }) 
          //setLoading(false)
        }
      }
      fetchNotes()
    }, [])

    
  return (
    <SafeAreaProvider style={styles.scrollView}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>My Planner</ThemedText>
          <TouchableOpacity style={styles.signout} onPress={() => auth.signOut()}>
            <Text style={styles.signouTxt}>Sign Out</Text>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
         <ThemedText style={styles.subTitle}>Total activites for this week</ThemedText>
         <ThemedText style={styles.info}>{sum}</ThemedText>
         <ThemedText style={styles.subTitle}>Total activites for today</ThemedText>
         <ThemedText style={styles.info}>{sumToday}</ThemedText>
        </ThemedView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    gap: 8,
    width: hundredWidth,
    height: '20%'
  },
  title: {
    textAlign: 'center'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '80%',
    width: hundredWidth
  },
  scrollView: {
    backgroundColor: '#FAFEEC',
    height: hundredWidth,
    width: '100%'
  },


  subTitle: {
    fontSize: 20,
    marginTop: 30,
  },
  info: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10
  },


  signout: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#400406',
    borderRadius: 5,
  },
  signouTxt: {
    color: '#FAFEEC',
    fontWeight: 'bold'
  }
});
