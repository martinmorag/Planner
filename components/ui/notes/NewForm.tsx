import { getAuth } from 'firebase/auth';
import { addDoc, collection, getDoc } from 'firebase/firestore';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../firebaseConfig';


type Note = {
  id: string,
  hour: string,
  note: string,
}

type Response = {
  res: boolean,
  new: any
}

// this function takes the hour for parameter to know which 
// hour to work on and the ShowR which is the response to 
// the parent component that closes the View tag when the 
// user presses cancel or creates a new note
function NewForm(props: { hour:string, ShowR: any}) {
  // imports to use React Hook Form
  const { handleSubmit, control, formState: { errors } } = useForm();
  const auth = getAuth()
  const user = auth.currentUser
  const notesCollection = collection(db, 'notes')

  const onSubmit = async (data:any) => {
    if (user) {
      const newDoc = await addDoc(notesCollection, { hour: props.hour, note: data.note, userId: user.uid })
      
      const newDocR = await getDoc(newDoc)
      let thisss : Note = {
       id: newDoc.id,
       hour: props.hour,
       note: newDocR.data()?.note
      }
      const resss : Response = {
        res: false,
        new: thisss
      }
      props.ShowR(resss)
      
      console.log('success')
    } else {
      console.log('no user found')
    }
  }

  const defaultt : Response = {
    res: false,
    new: null
  }
  
  return (
  <View style={styles.NewFormVisible}>
        <View style={styles.Title}>
          <Text style={styles.hour}>Hour: {props.hour}</Text>
          <Text style={styles.label}>Add new note</Text>
        </View>

        <Controller
          control={control}
          render={({field: { onChange, onBlur, value }}) => (
            <textarea
              style={styles.input}
              onBlur={onBlur}
              rows={5}
              onChange={value => onChange(value)}
              value={value ?? ''}
            />
          )}
          name="note"
          rules={{ required: true }}
        />

        <Pressable 
          onPress={handleSubmit(onSubmit)}
          style={styles.executeBtn}
        ><Text style={styles.buttontxt}>Add</Text>  
        </Pressable>
        

        <Pressable style={styles.Btn} onPress={() => props.ShowR(defaultt)}><Text style={styles.BtnText}>Cancel</Text></Pressable>
  </View>
  )
}

// these are the styles of the component
const styles = StyleSheet.create({
  NewFormVisible: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 200,
    height: 300,
    backgroundColor: '#1C2826',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5
  },
  Title: {
    display: 'flex',
    alignItems: 'center',
  },
  hour: {
    color: 'white',
    marginTop: 5,
  },

  executeBtn: {
    backgroundColor: '#18020C',
    marginHorizontal: 'auto',
    width: '100%',
    
    borderRadius: 3,
    paddingVertical: 5,
  },


  Btn: {
    marginHorizontal: 'auto',
    backgroundColor: '#FAFEEC',
    width: '100%',
    
    borderRadius: 3,
    paddingVertical: 5,
  },
  BtnText: {
    textAlign: 'center',
    color: '#2D2327',
  },




  label: {
    color: 'white',
    marginTop: 5,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    padding: 10,
    borderRadius: 4,
  },
  button: {
    marginTop: 40,
    height: 40,
    borderRadius: 4,
  },
  buttontxt: {
    color: 'white',
    textAlign: 'center',
  },
});

export default NewForm