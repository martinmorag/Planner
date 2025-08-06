import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const hundredWidth = Dimensions.get('window').width

export default function TabTwoScreen() {
  const router = useRouter();
    const today = moment();
    const begginingOfCurrentWeek = today.clone().startOf('week');
    const endOfWeek = today.clone().endOf('week');
  
    const date = begginingOfCurrentWeek.format('MM-DD-YYYY')
    const endDate = endOfWeek.format('MM-DD-YYYY')
  
    const defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
      return moment(i, 'e').startOf('week').weekday(i + 1).format('MM-DD-YYYY');
    });
  
    return (
      <SafeAreaProvider style={styles.scrollView}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>My week</ThemedText>
            <TouchableOpacity style={styles.signout} onPress={() => auth.signOut()}>
              <Text style={styles.signouTxt}>Sign Out</Text>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            {defaultWeekdays.map((dayy) => {
              return <Pressable style={styles.Day}
              onPress={() => router.navigate({
                pathname: '/(app)/day',
                params: { dayy }
              })}>
              <Text style={styles.DayTxt}>{dayy}</Text>
              </Pressable>
            })}
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
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '80%',
    width: hundredWidth
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  scrollView: {
    backgroundColor: '#FAFEEC',
    height: hundredWidth,
    width: '100%'
  },
  text: {
    fontSize: 42,
    padding: 12,
  },


  Day: {
    flexBasis: '30%',
    width: 60,
    height: 60,
    display: 'flex',
    backgroundColor: '#9CBFA7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  DayTxt: {
    textAlign: 'center'
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