import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const eightyWidth = Dimensions.get('window').width * 0.8
const tirthWidth = Dimensions.get('window').width * 0.3
const hundredWidth = Dimensions.get('window').width

export default function HomeScreen() {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isActiveE, setIsActiveE] = useState(false)
  const [isActiveP, setIsActiveP] = useState(false)

  const signIn = async() => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
    } catch (err:any) {
      console.log(err)
      alert('Sign in failed: ' + err.message)
    }
  }

  return (
    <SafeAreaProvider style={{ width:hundredWidth}}>
      <SafeAreaView style={styles.container} >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>Log In</ThemedText>
        <Text style={styles.subtitle}>Please log in to view your notes</Text>
      </ThemedView>
      <ThemedView style={styles.form}>
        <View style={styles.formView}>
          <Text style={styles.label}>Email:</Text>
          <TextInput style={[styles.email, isActiveE && styles.isActiveE]} 
          placeholder='email' 
          value={email} 
          onChangeText={setEmail} 
          onFocus={() =>  setIsActiveE(true)}
          onBlur={() => setIsActiveE(false)}
          />
        </View>
        <View style={styles.formView}>
          <Text style={styles.label}>Password:</Text>
          <TextInput style={[styles.password, isActiveP && styles.isActiveP]} 
          placeholder='password' 
          value={password} 
          secureTextEntry={true}
          onChangeText={setPassword} 
          onFocus={() =>  setIsActiveP(true)}
          onBlur={() => setIsActiveP(false)}
          />
        </View>
        <TouchableOpacity onPress={signIn} style={styles.signinBtn}>
          <Text style={styles.signin}>Sign In</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

// these are the styles of the component
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 'auto',
    gap: 8,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: '#FAFEEC'
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
    backgroundColor: 'rgb(21, 23, 24)',
    width: hundredWidth
  },
  email: {
    color: 'rgb(21, 23, 24)',
    backgroundColor: '#FAFEEC',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5
  },
  isActiveE: {
    shadowColor: "purple",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 11.95,
    elevation: 18,
  },
  password: {
    color: 'rgb(21, 23, 24)',
    backgroundColor: '#FAFEEC',
    padding: 5,
    borderRadius: 5,
  },
  isActiveP: {
    shadowColor: "purple",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 11.95,
    elevation: 18,
  },


  signinBtn: {
    width: tirthWidth,
    backgroundColor: '#FAFEEC',
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 'auto'
  },
  signin: {
    color: 'rgb(21, 23, 24)',
    paddingVertical: 10,
    paddingHorizontal: 7,
    textAlign: 'center',
  },


  form: {
    marginVertical: 20
  },
  formView: {
    width: eightyWidth,
    marginHorizontal: 'auto'
  },
  label: {
    color: '#FAFEEC',
    marginBottom: 3
  }
});