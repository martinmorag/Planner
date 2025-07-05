import { StyleSheet, View, Pressable, TextInput,Text } from 'react-native';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

// this function takes the hour for parameter to know which 
// hour to work on, the ShowR which is the response to 
// the parent component that closes the View tag when the 
// user presses cancel or creates a new note, and the note 
// to populate the current note with the content
function EditForm(props: { hour:string, note:string, ShowR: any }) {
  // imports to use React Hook Form
  const { handleSubmit, control, formState: { errors } } = useForm();
  // this function makes sure to save the note on the 
  // right hour, using the hour as a key and the data 
  // entered by the user as the content
  const onSubmit = async (data:any) => {
    try {
      await AsyncStorage.setItem(
        props.hour,
        data.note
      ) 
      props.ShowR(false)
    } catch (error) {
      console.log(error)
    }
  }
  // this function deletes the item taking the hour 
  // received as the key
  const deleteNote = async () => {
    try {
      await AsyncStorage.removeItem(
        props.hour,
      ) 
      props.ShowR(false)
    } catch (error) {
      console.log(error)
    }
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
            onPress={deleteNote}
            style={styles.deleteBtn}
          ><Text style={styles.buttontxt}>Delete</Text>  
          </Pressable>
        </View>

        <Pressable style={styles.Btn} onPress={() => props.ShowR(false)}><Text style={styles.BtnText}>Cancel</Text></Pressable>
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