# Overview

Hi! This is my Planner developed in Expo React Native

This is a mobile app and uses firebase as the cloud database, it has authentication by email and password and database storage implemeted for storing the notes that will go in the planner, it allows the user to see the notes for each hour of the day, insert notes, edit notes and delete notes. Everything reflected in the firebase database as it happens.

This mobile app is made to help people store their activities for every hour of the day, and allow the users change their plan for the day as well.

[Software Demo Video](https://youtu.be/A2sOObArT7s)

# Cloud Database

I used firebase for authentication and storage.

Firebase's authentication uses email and password to allow users log in, and the notes for the planner are stored in a notes table in the firebase database, every note has an id, the hour of the day, the content of the note and the userId.

# Development Environment

For the development of this mobile app I used a previous project of a planner that I had but was using localstorage only, I implemented firebase with the firebase SDK.

I used typescript for the development and firebase is the only library that I used for this app.

# Useful Websites

- [How to use Firebase in Expo](https://docs.expo.dev/guides/using-firebase/)
- [Firebase documentation](https://firebase.google.com/docs?hl=es-419)

# Future Work

- The style can be improved for a more modern one in the future
- The notes structure can be changed so the user can choose how much time one activity will take
- A registration can be implemented in the future