import { Text, StyleSheet, View, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { Component, useState } from 'react'

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

const Register = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = () => {
        if (name == "" || email == "" || password == "") {
            return alert("Input field should not empty.")
        }
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (result) => {

                await firestore().collection("USERS").add({
                    email: email,
                    username: name,
                    password: password,
                    displayName: name,
                    photoURL: "https://statinfer.com/wp-content/uploads/dummy-user.png",
                });

                await auth().currentUser.updateProfile({
                    displayName: name,
                    photoURL: "https://statinfer.com/wp-content/uploads/dummy-user.png",
                });

                // await firestore().collection('USERS').doc(result.user.uid).set({
                //     name: name,
                //     displayName: "name",
                //     email: result.user.email,
                //     uid: result.user.uid,
                //     pic: "https://statinfer.com/wp-content/uploads/dummy-user.png",
                //     photoURL: "https://statinfer.com/wp-content/uploads/dummy-user.png",
                //     status: "online"
                // })
                console.log(result, "resresresresresres");

                alert('User account created & signed in!');
                props.navigation.goBack()
            })
            .catch(error => {

                if (error.code === 'auth/email-already-in-use') {
                    alert('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    alert('That email address is invalid!');
                }
                console.error(error);
            });
    }

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
            }}>{"Register"}</Text>
            <TextInput
                onChangeText={(val) => setName(val)}
                placeholder={"Name"}
                style={{
                    borderWidth: 1,
                    padding: 8,
                    marginTop: 32,
                    color: "black"
                }}
                value={name}
            />
            <TextInput
                onChangeText={(val) => setEmail(val)}
                placeholder={"Email"}
                style={{
                    borderWidth: 1,
                    padding: 8,
                    marginTop: 32,
                    color: "black"
                }}
                value={email}
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
                value={password}
            />

            <TouchableOpacity style={{
                marginTop: 48,
                backgroundColor: "lightblue",
                padding: 8,
                alignItems: "center"
            }}
                activeOpacity={0.7}
                onPress={register}
            >
                <Text style={{ fontSize: 16, fontWeight: "300", color: "black" }}>{"Signup"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Register;