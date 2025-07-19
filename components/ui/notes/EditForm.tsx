import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
  action: any,
  item: any,
}

// this function takes the hour for parameter to know which 
// hour to work on, the ShowR which is the response to 
// the parent component that closes the View tag when the 
// user presses cancel or creates a new note, and the note 
// to populate the current note with the content
function EditForm(props: { hour:string, note:string, ShowR: any, noteId: string }) {
  // imports to use React Hook Form
  const { handleSubmit, control, formState: { errors } } = useForm();
  console.log(props.hour)
  const auth = getAuth()
  const user = auth.currentUser
  const notesCollection = collection(db, 'notes')

  // this function makes sure to save the note on the 
  // right hour, using the hour as a key and the data 
  // entered by the user as the content
  const onSubmit = async (data:any) => {
    const note = doc(db, 'notes', props.noteId)
    await updateDoc(note, {
      note: data.note
    })
    const theNote : Note = {
      id: props.noteId,
      hour: props.hour,
      note: data.note
    }
    const resss : Response = {
      res: false,
      action: 'edit',
      item: theNote
    }

    props.ShowR(resss)
  }
  // this function deletes the item taking the hour 
  // received as the key
  const deleteNote = async (id:string) => {
    const note = doc(db, 'notes', id)
    console.log(id)
    await deleteDoc(note)
    const resss : Response = {
      res: false,
      action: 'delete',
      item: note.id
    }

    props.ShowR(resss)
  }

  const defaultt : Response = {
      res: false,
      action: null,
      item: null
  }
  
  return (
  <View style={styles.NewFormVisible}>
        <View style={styles.Title}>
          <Text style={styles.hour}>Hour: {props.hour}</Text>
          <Text style={styles.label}>Edit note</Text>
        </View>
        <Controller
          control={control}
          render={({field: { onChange, onBlur, value }}) => (
            <textarea
              style={styles.input}
              onBlur={onBlur}
              rows={5}
              onChange={value => onChange(value)}
              defaultValue={props.note}
              value={value}
            />
          )}
          name="note"
          rules={{ required: true }}
        />

        <View style={styles.Btns}>
          <Pressable 
            onPress={handleSubmit(onSubmit)}
            style={styles.executeBtn}
          ><Text style={styles.buttontxt}>Edit</Text>  
          </Pressable>
          <Pressable 
            onPress={() => deleteNote(props.noteId)}
            style={styles.deleteBtn}
          ><Text style={styles.buttontxt}>Delete</Text>  
          </Pressable>
        </View>

        <Pressable style={styles.Btn} onPress={() => props.ShowR(defaultt)}><Text style={styles.BtnText}>Cancel</Text></Pressable>
  </View>
  )
}

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
  deleteBtn: {
    backgroundColor: '#7B0828',
    marginHorizontal: 'auto',
    width: '100%',
    
    borderRadius: 3,
    paddingVertical: 5,
    marginTop: 5,
  },


  Btns: {
    width: '100%',
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

export default EditForm