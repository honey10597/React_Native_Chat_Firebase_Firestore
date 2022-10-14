import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    SafeAreaView
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import store from "../Redux/store";
const { dispatch } = store;

const ChatRoom = (props) => {

    const [threads, setThreads] = useState([])
    const [roomName, setRoomName] = useState('');
    const [allUsers, setAllUsers] = useState([])

    useLayoutEffect(() => {
        const unsubscribe =
            firestore()
                .collection('USERS')
                .onSnapshot((querySnapshot) => {
                    const threads = querySnapshot.docs.map(item => {
                        console.log(item?._data, 'item?._dataitem?._data');
                        let obj = {
                            displayName: item?._data?.displayName,
                            email: item?._data?.email,
                            isAdmin: item?._data?.isAdmin,
                            isBlocked: item?._data?.isBlocked,
                            avatar: item?._data?.photoURL,
                            username: item?._data?.username,
                            id: item?._data?.id,
                            _id: item?._data?._id,
                        }
                        return obj;
                    })

                    console.log(threads, "threadsthreadsthreadsthreadsthreads");

                    dispatch({
                        type: "SAVE_ALL_USERS",
                        payload: threads,
                    });

                    // setAllUsers(threads)
                })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const unsubscribe =
            firestore()
                .collection('MESSAGE_THREADS')
                .orderBy('latestMessage.createdAt', 'desc')
                .onSnapshot(querySnapshot => {
                    const threads = querySnapshot.docs.map(documentSnapshot => {
                        return {
                            _id: documentSnapshot.id,
                            name: '',
                            latestMessage: { text: '' },
                            ...documentSnapshot.data()
                        }
                    })

                    setThreads(threads)
                    console.log(threads, "threadsthreads")
                })
        return () => unsubscribe()
    }, [])

    const _createRoom = () => {

        if (roomName == "") {
            return alert("enter something")
        }

        firestore()
            .collection('MESSAGE_THREADS')
            .add({
                name: roomName,
                latestMessage: {
                    text: `${roomName} created. Welcome!`,
                    createdAt: new Date().getTime()
                }
            })
            .then(docRef => {
                console.log(docRef, "docRef");
                docRef.collection('MESSAGES').add({
                    text: `${roomName} created. Welcome!`,
                    createdAt: new Date().getTime(),
                    system: true
                })
                setRoomName("")
            }).catch((error) => {
                console.log(error, "errorerror");
            })
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 16
        }}>
            <SafeAreaView />

            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('ChatApp', {
                            thread: item,
                        })}>
                        <View style={styles.row}>
                            <View style={styles.content}>
                                <View style={styles.header}>
                                    <Text style={styles.nameText}>{item.name}</Text>
                                </View>
                                <Text style={styles.contentText}>
                                    {item.latestMessage.text.slice(0, 90)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Text style={{
                textAlign: "center",
                marginTop: 32,
                color: "black"
            }}>{"Create Room"}</Text>

            <TextInput
                onChangeText={(val) => setRoomName(val)}
                placeholder={"Room Name"}
                style={{
                    borderWidth: 1,
                    padding: 8,
                    marginTop: 32,
                    color: "black"
                }}
                value={roomName}
            />

            <TouchableOpacity style={{
                marginTop: 48,
                backgroundColor: "lightblue",
                padding: 8,
                alignItems: "center"
            }}
                activeOpacity={0.7}
                onPress={_createRoom}
            >
                <Text style={{ fontSize: 16, fontWeight: "300", color: "black" }}>{"Create Room"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dee2eb'
    },
    title: {
        marginTop: 20,
        marginBottom: 30,
        fontSize: 28,
        fontWeight: '500',
        color: "black"
    },
    row: {
        paddingRight: 10,
        paddingLeft: 5,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    content: {
        flexShrink: 1
    },
    header: {
        flexDirection: 'row'
    },
    nameText: {
        fontWeight: '600',
        fontSize: 18,
        color: '#000',
        color: "black"
    },
    dateText: {},
    contentText: {
        color: '#949494',
        fontSize: 16,
        marginTop: 2,
        color: "black"
    }
})

export default ChatRoom;
