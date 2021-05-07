import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import Auth from "./src/components/Auth"
import firebase from './src/utils/firebase';
import "firebase/auth/";
import Cotizador from './src/components/Cotizador';

export default function App() {

  const [user,setUser] = useState(undefined);

  useEffect(()=>{
    firebase.auth().onAuthStateChanged((response)=>{
      setUser(response);
    })
  },[]);

  if(user === undefined) return null;

  return (
    <>
    <StatusBar barStyle = "light-content"/>
      <SafeAreaView style={styles.background}>
        {user ? <Cotizador user={user}/>:<Auth/>}
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  background:{
    backgroundColor: "#15212b",
    height:"100%",
  }
});