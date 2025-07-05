import { StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import NewForm from '@/components/ui/notes/NewForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditForm from '@/components/ui/notes/EditForm';
import { Dimensions } from 'react-native'
const ninetyWidth = Dimensions.get('window').width * 0.85
const tenWidth = Dimensions.get('window').width * 0.13
const hundredWidth = Dimensions.get('window').width

export default function HomeScreen() {  
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

  // this useState stores and updates the notes
  const [dic, setDic] = useState(new Map()) 
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
  }
  // this function shows the View tag, the content of 
  // the current note and the time on the note that 
  // is going to be edited
  const handlePressEdit = (hour: string, note:string) => {
    setEditShow(true)
    setEditHour(hour)
    setNote(note)
  }
  // this function handles the response from a new 
  // note being created 
  const handleResShow = (res:boolean) => {
    setShow(false)
    setNewHour('')
  }
  // this function handles the response from a current
  // note being edited
  const handleEditShow = (res:boolean) => {
    setEditShow(res)
    setEditHour('')
    setNote('')
    dic.clear()
  }

  // this useEffect handles the population of the data 
  // from the local storage
  useEffect(() => {
    setLoading(true)
    const getkeys = async() => {
      const keys: readonly string[] = await AsyncStorage.getAllKeys()

      keys.forEach((k: string) => {
        const value = localStorage.getItem(k)
        setDic(map => new Map(map.set(k, value ?? '')))
        console.log("added " + k, value)
      });
      setLoading(false)
    }
    getkeys()
  }, [Show, EditShow])

  
  
  return (
    <SafeAreaProvider style={{ width:hundredWidth}}>
      <SafeAreaView style={styles.container} >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>My daily plan</ThemedText>
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
                        {dic.get(hour) && <Pressable style={styles.Note} onPress={() => handlePressEdit(hour, dic.get(hour))}><Text style={styles.NoteTxt}>{dic.get(hour)}</Text></Pressable>}
                      </Pressable> 
                    </View>
            })}
          </ThemedView>
        </ScrollView>
      )}
      
      {/* New View for the creation of the note */}
      {Show && (<NewForm hour={NewHour} ShowR={handleResShow} />)}
      {/* Edit View for the edit of the note */}
      {EditShow && (<EditForm hour={EditHour} note={note} ShowR={handleEditShow} />)}
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
  }
});