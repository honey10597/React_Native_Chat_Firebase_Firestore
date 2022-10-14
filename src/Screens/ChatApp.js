import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';

import store from "../Redux/store";
const { dispatch } = store;

const ChatApp = (props) => {

    const { navigation, route } = props;
    const { thread } = route.params
    // console.log(thread, "threadthreadthreadthread");

    const user = auth().currentUser.toJSON()
    // console.log(allUsers, "allUsersallUsersallUsers");

    const allUsersData = useSelector((state) => state.alUsersInRed)
    const fullChat = useSelector((state) => state.allChats)

    const [surrentUserStatus, setCurrentUserStaus] = useState({})

    useEffect(() => {
        console.log(fullChat, "fullChatfullChat");
    }, [fullChat])

    // console.log(allUsersData, "allUsersDataallUsersData");

    const [messages, setMessages] = useState([]);

    // const [allUsers, setAllUsers] = useState([])

    // useLayoutEffect(() => {
    //     const unsubscribe = firestore()
    //         .collection('USERS').onSnapshot((querySnapshot) => {
    //             const threads = querySnapshot.docs.map(item => {
    //                 let obj = {
    //                     displayName: item?._data?.displayName,
    //                     email: item?._data?.email,
    //                     isAdmin: item?._data?.isAdmin,
    //                     isBlocked: item?._data?.isBlocked,
    //                     avatar: item?._data?.photoURL,
    //                     username: item?._data?.username,
    //                     _id: item?._data?._id,
    //                 }
    //                 return obj
    //             })

    //             console.log(threads, "threadsthreadsthreadsthreadsthreads");

    //             // setAllUsers(threads)
    //         })
    //     return () => unsubscribe()
    // }, [messages])

    useEffect(() => {
        const _clone = fullChat.map((item, index) => {
            const cu = allUsersData.find((val) => val.id == item?.user?.id ? val : null)
            console.log(cu, "messagesmessagesmessagesmessages", allUsersData);
            if (cu) {
                item.user = cu
                item.user.name = item.name
            }
            return item
        })
        // // setMessages(_clone)

        dispatch({
            type: "ALL_MESSAGES",
            payload: _clone,
        });

        // const cu = allUsersData.find((val) => val.id == user?.uid ? val : null)
        // setCurrentUserStaus(cu) 
    }, [allUsersData])

    useEffect(() => {
        const unsubscribeListener = firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const _msgs = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    // console.log(firebaseData, " allmessages 111111");

                    const cu = allUsersData.find((val) => val._id == doc?._data?.user?._id ? val : null)


                    // console.log(doc?._data?.user?._id, " allmessages 33333");
                    let data = {}
                    if (cu) {
                        // console.log(cu, " allmessages 222222");
                        data = {
                            _id: doc?.id,
                            createdAt: new Date().getTime(),
                            displayName: firebaseData?.displayName,
                            name: firebaseData?.name,
                            text: firebaseData?.text,
                            ...firebaseData,
                            user: {
                                ...cu,
                                name: cu?.displayName
                            }
                        }
                    }

                    // console.log(data, " allmessages 444444");

                    return data;
                })
                console.log(_msgs, "allmessages 5555555");

                dispatch({
                    type: "ALL_MESSAGES",
                    payload: _msgs,
                });


                // setMessages(messages)
            })
        return () => unsubscribeListener()
    }, [])

    const onSend = useCallback(async (messages = []) => {


        const text = messages[0].text
        console.log(text, "111111111111111111111111111111111111");

        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );

        const cu = allUsersData.find((val) => val.id == user?.uid ? val : null)
        console.log(cu, 'cucucucu', allUsersData);
        // firestore()
        //     .collection('USERS')
        //     .doc(user.uid)
        //     .onSnapshot(async (res) => {

        // const userDa = res?._data
        const userDa = cu

        const obj = {
            text,
            createdAt: new Date().getTime(),
            name: userDa?.displayName || userDa?.email,
            displayName: userDa?.displayName || userDa?.email,
            user: {
                _id: userDa._id,
                displayName: userDa?.displayName || userDa?.email,
                name: userDa?.displayName || userDa?.email,
                // avatar: userDa?.photoURL,
                avatar: userDa?.avatar,
            }
        }

        console.log(obj, "objobjobjobjobjobj");

        await firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add(obj).then((res) => console.log(res, "rrrrrrrrrrrr =>", text))
            .catch((err) => console.log(err, "errorerror"))
    }, [])
    // }, []);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                // renderMessageImage={}
                wrapperStyle={{
                    left: {
                        backgroundColor: "#008080",
                    },
                }}
                position={"left"}
            />
        );
    }

    const _signout = async () => {
        await auth()
            .signOut()
            .then(() => {
                props.navigation.popToTop()
            }).catch((error) => console.log(error))
    }

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>

                <TouchableOpacity style={{
                    backgroundColor: "lightblue",
                    padding: 8,
                    alignItems: "center"
                }}
                    activeOpacity={0.7}
                    onPress={_signout}
                >
                    <Text style={{ fontSize: 16, fontWeight: "300", color: "black" }}>{"Signout"}</Text>
                </TouchableOpacity>


                <GiftedChat
                    messages={fullChat}
                    extraData={fullChat}
                    onSend={messages => onSend(messages)}
                    user={{ _id: 1 }}
                    renderBubble={renderBubble}
                    // renderAvatar={() => null}
                    renderTime={() => null}
                    renderUsernameOnMessage={true}
                    textInputStyle={{
                        color: "black"
                    }}
                // disableComposer={surrentUserStatus?.isBlocked}
                />

                <Text style={{ fontSize: 24 }}>{"Is Blocked :- " + surrentUserStatus?.isBlocked}</Text>
            </SafeAreaView>
        </View>
    );
};

export default ChatApp;
