import { Text, StyleSheet, View, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';

const Login = (props) => {
    const [email, setEmail] = useState('Admin@yopmail.com');
    const [password, setPassword] = useState('123456');

    const signin = () => {

        if (email == "") {
            return alert("enter email")
        } else if (password == "") {
            return alert("enter password")
        }

        auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                console.log(res, "signInWithEmailAndPassword");
                props.navigation.navigate("ChatRoom")
                alert('Login Success');
            })
            .catch(error => {
                alert(error.code)
                console.error(error);
            });
    };

    useEffect(() => {

        // const unregister = auth().onAuthStateChanged(userExist => {

        //     console.log(userExist, "userExistuserExist");
        //     // if (userExist) {
        //     //     firestore().collection('users')
        //     //         .doc(userExist.uid)
        //     //         .update({ status: "online" })
        //     //     setuser(userExist)
        //     // }
        //     // else setuser("")
        // })
        // return () => {
        //     unregister()
        // }
    }, [])

    return (
        <View style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 16
        }}>
            <Text style={{
                textAlign: "center",
                marginTop: 32,
                color: "black"
            }}>{"LOGIN"}</Text>
            <TextInput
                onChangeText={(val) => setEmail(val)}
                placeholder={"Email"}
                style={{
                    borderWidth: 1,
                    padding: 8,
                    marginTop: 32,
                    color: "black"
                }}
            />

            <TextInput
                onChangeText={(val) => setPassword(val)}
                placeholder={"Password"}
                style={{
                    borderWidth: 1,
                    padding: 8,
                    marginTop: 32,
                    color: "black"
                }}
            />

            <TouchableOpacity style={{
                marginTop: 48,
                backgroundColor: "lightblue",
                padding: 8,
                alignItems: "center"
            }}
                activeOpacity={0.7}
                onPress={signin}
            >
                <Text style={{ fontSize: 16, fontWeight: "300", color: "black" }}>{"Login"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login;