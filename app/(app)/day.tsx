import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EditForm from '@/components/ui/notes/EditForm';
import NewForm from '@/components/ui/notes/NewForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig';
const ninetyWidth = Dimensions.get('window').width * 0.85
const tenWidth = Dimensions.get('window').width * 0.13
const hundredWidth = Dimensions.get('window').width

type Note = {
  id: string,
  day: string,
  hour: string,
  note: string,
}



export default function Day() {  
  const { dayy } = useLocalSearchParams();

  const [day, setDay] = useState('')

  // useState for showing the new note form
  const [Show, setShow] = useState(false)
  // useState for showing the edit note form
  const [EditShow, setEditShow] = useState(false)
  // initial loading for the notes to populate
  const [loading, setLoading] = useState(true)

  // this useState is in charge of sending the 
  // correct hour to the new note that is going
  // to be added
  const [NewHour, setNewHour] = useState('')
  // this useState is in charge of sending the 
  // correct hour to the note that is going
  // to be edited
  const [EditHour, setEditHour] = useState('')

  // this useState sends the current content
  // of the note that is going to be edited
  const [note, setNote] = useState('')

  const[noteId, setNoteId] = useState('')

  // this useState stores and updates the notes
  const [dic, setDic] = useState<Note[]>([]) 
  // these are the hours of the day
  const hours = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];
  
  // this function shows the View tag and the time 
  // on the note that is going to be created
  const handlePress = (hour: string) => {
    setShow(true)
    setNewHour(hour)
    setDay(dayy[0])
  }
  // this function shows the View tag, the content of 
  // the current note and the time on the note that 
  // is going to be edited
  const handlePressEdit = (hour: string, note:string, theId:string) => {
    setEditShow(true)
    setEditHour(hour)
    setNote(note)
    setNoteId(theId)
  }
  // this function handles the response from a new 
  // note being created 
  const handleResShow = (showR:any) => {
    setShow(false)
    if (showR.new != null)
    {
    setDic(dictionary =>
            [  ...dictionary,
              {
                id: showR.new.id, 
                day: showR.new.day,
                hour: showR.new.hour, 
                note: showR.new.note 
              }
            ]
          )
    }
    setNewHour('')
    setDay('')
  }
  // this function handles the response from a current
  // note being edited
  const handleEditShow = (res:any) => {
    if (res.action != null)
    {
      if (res.action == 'delete')
      {
        const findDeletion = dic.findIndex(d => d.id == res.item)
        delete dic[findDeletion]
      }  
      if (res.action == 'edit')
      {
        const findEdit = dic.findIndex(d => d.id == res.item.id)
        dic[findEdit].note = res.item.note
      }
    }
    setEditShow(false)
    setEditHour('')
    setNote('')
    setNoteId('')
  }

  const notesCollection = collection(db, 'notes')
  const auth = getAuth()
  const user = auth.currentUser
  // this useEffect handles the population of the data 
  // from the local storage
  useEffect(() => {
    setLoading(true)
    const fetchNotes = async() => {
      if (user) {
        const qry = query(notesCollection, where("userId", "==", user.uid));
        const data = await getDocs(qry)
        data.forEach(note => {  
          setDic(
            dictionary =>
            [  ...dictionary,
              {id: note.id, day: note.data().day, hour: note.data().hour, note: note.data().note  }
            ]
          )
        }) 
         
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const router = useRouter();
  
  return (
    <SafeAreaProvider style={{ width:hundredWidth}}>
      <SafeAreaView style={styles.container} >
      <ThemedView style={styles.titleContainer}>
        <View style={{ width: hundredWidth }}>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)')} style={styles.backBtn}>
            <Text style={styles.backBtnTxt}>Go back to my week</Text>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>My plan for today | {dayy[0]}</ThemedText>
          <TouchableOpacity style={styles.signout} onPress={() => auth.signOut()}>
            <Text style={styles.signouTxt}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text>organize your activities throughout the day!</Text>
      </ThemedView>
      {loading ? (
        <Text>Loading...</Text>
       ) : (
        <ScrollView style={styles.scrollView} >
          <ThemedView style={styles.stepContainer}>
            {/* here each hour receives a Text tag showing the 
            content of the tag is there is any and if there 
            isn't, it's empty*/}
            {hours.map((hour) => {
              return <View key={hour} style={styles.hour}>
                      <ThemedText style={styles.hourTime}>{hour} </ThemedText>
                      <Pressable
                        style={styles.hourBtn}
                        onPress={() => handlePress(hour)}
                      >
                        {dic.filter(x => x.hour == hour && x.day == dayy[0]).map(y => <Pressable style={styles.Note} onPress={() => handlePressEdit(y.hour, y.note, y.id)}><Text style={styles.NoteTxt}>{y.note}</Text></Pressable>)}
                      </Pressable> 
                    </View>
            })}
          </ThemedView>
        </ScrollView>
      )}
      
      {/* New View for the creation of the note */}
      {Show && (<NewForm day={day} hour={NewHour} ShowR={handleResShow} />)}
      {/* Edit View for the edit of the note */}
      {EditShow && (<EditForm hour={EditHour} note={note} noteId={noteId} ShowR={handleEditShow} />)}
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

// these are the styles of the component
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 'auto',
    gap: 8,
    backgroundColor: '#FAFEEC',
  },
  title: {
    color: '#2D2327',
    textAlign: 'center',
  },
  stepContainer: {
    gap: 0,
    marginBottom: 0,
    backgroundColor: '#FAFEEC',
    width: hundredWidth,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#FAFEEC',
    width: hundredWidth
  },
  scrollView: {
    backgroundColor: '#FAFEEC',
  },
  text: {
    fontSize: 42,
    padding: 12,
  },


  backBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: '#9CBFA7',
    borderRadius: 5,
  },
  backBtnTxt: {
    color: '#000000ff',
  },


  hour: {
    backgroundColor: '#FAFEEC',
    display: 'flex',
    flexDirection: 'row',
    height: 45
  },
  hourTime: {
    color: '#2D2327',
    textAlign: 'center',
    width: tenWidth
  },
  hourBtn: {
    backgroundColor: '#2D2327',
    width: ninetyWidth,
    borderRadius: '5px',
    marginVertical: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflowX: 'scroll',
  },



  Note: {
    backgroundColor: '#E6DBD0',
    height: '75%',
    display: 'flex',
    justifyContent: 'center',
    //maxWidth: 90,
    borderBottomColor: 'black',
    borderTopColor: 'black',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 6,
  },
  NoteTxt: {
    color: 'black',
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
    backgroundColor: '#400406',
    borderRadius: 5,
  },
  signouTxt: {
    color: '#FAFEEC',
    fontWeight: 'bold'
  }
});