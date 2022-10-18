import React, { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView
} from 'react-native';

import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';

import store from "../Redux/store";
const { dispatch } = store;

const ChatApp = (props) => {

    const { navigation, route } = props;
    const { thread, currentUserData } = route.params
    // console.log(thread, "threadthreadthreadthread");

    const user = auth().currentUser.toJSON()
    // console.log(allUsers, "allUsersallUsersallUsers");

    const msgListRef = useRef(null)

    console.log(currentUserData, "currentUserDatacurrentUserDatacurrentUserDatacurrentUserData");

    const allUsersData = useSelector((state) => state.alUsersInRed)
    const fullChat = useSelector((state) => state.allChats)
    const currentUserDa = useSelector((state) => state.currentUserData)

    console.log(currentUserDa, "surrentUserStatussurrentUserStatussurrentUserStatus");

    const [surrentUserStatus, setCurrentUserStaus] = useState(currentUserData)
    const [currentMsg, setCurrentMsg] = useState("")
    const [messages, setMessages] = useState([]);
    const [holdCurrentMsgAction, setHoldCurrentMsgAction] = useState(null)

    console.log(surrentUserStatus, "surrentUserStatussurrentUserStatus");

    // console.log(allUsersData, "allUsersDataallUsersData");

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

                    console.log(threads, "dispatchdispatchdispatchdispatch");

                    dispatch({
                        type: "SAVE_ALL_USERS",
                        payload: threads,
                    });
                })
        return () => unsubscribe()
    }, [])

    useLayoutEffect(() => {
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

        const cu = allUsersData.find((val) => val.id == user?.uid ? val : null)
        // setCurrentUserStaus(cu)
        dispatch({
            type: "CURRENT_USER_DATA",
            payload: cu,
        });
    }, [allUsersData])

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
        const unsubscribeListener = firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const _msgs = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const cu = allUsersData.find((val) => val._id == doc?._data?.user?._id ? val : null)
                    console.log(cu, "cucucucucucucucu", allUsersData);
                    let data = {}
                    if (cu) {
                        // console.log(cu, " allmessages 222222");
                        data = {
                            _id: doc?.id,
                            createdAt: new Date().getTime(),
                            // displayName: firebaseData?.displayName,
                            // name: firebaseData?.name,
                            // text: firebaseData?.text,

                            displayName: cu?.displayName,
                            name: cu?.name,
                            text: cu?.text,
                            ...firebaseData,
                            user: {
                                ...cu,
                                name: cu?.displayName
                            },
                            isSelected: false
                        }
                    }

                    console.log(data, " allmessages 444444");

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

    const onSend = useCallback(async () => {

        // const text = currentMsg[0].text

        if (currentMsg.trim() == "") {
            return;
        }

        const text = currentMsg
        console.log(text, "111111111111111111111111111111111111");

        // setMessages(previousMessages =>
        //     GiftedChat.append(previousMessages, messages),
        // );

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
            isSelected: false,
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
        setCurrentMsg("")
    }, [currentMsg])

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

    useEffect(() => {
        console.log(currentMsg, "xxxxxxxx");
    }, [currentMsg])

    useEffect(() => {
        holdCurrentMsgAction ? _openAction() : _closeAction()
    }, [holdCurrentMsgAction])

    const _openAction = () => {
        const msgs = fullChat.map((item) => {
            item.isSelected = false
            return item
        })
        msgs[holdCurrentMsgAction?.index].isSelected = !msgs[holdCurrentMsgAction?.index].isSelected
        setMessages(msgs)
    }

    const _closeAction = () => {
        const msgs = fullChat.map((item) => {
            item.isSelected = false
            return item
        })
        setMessages(msgs)
        setHoldCurrentMsgAction(null)
    }

    const _blockUser = async () => {

        await firestore()
            .collection("USERS")
            .doc(holdCurrentMsgAction?.item?.user?._id)
            .update({
                _id: holdCurrentMsgAction?.item?.user?._id,
                id: holdCurrentMsgAction?.item?.user?.id,
                email: holdCurrentMsgAction?.item?.user?.email,
                username: holdCurrentMsgAction?.item?.user?.name,
                displayName: holdCurrentMsgAction?.item?.user?.displayName,
                isAdmin: false,
                isBlocked: !holdCurrentMsgAction?.item?.user?.isBlocked,
                photoURL: holdCurrentMsgAction?.item?.user?.avatar,
            }).then((res) => {
                _closeAction()
            }).catch((error) => {
                _closeAction()
            })
    }

    const _deleteMsg = async () => {
        // firestore()
        //     .collection('MESSAGE_THREADS')
        //     .doc(thread._id)
        //     .collection('MESSAGES')

        await firestore()
            .collection("MESSAGE_THREADS")
            .doc(thread._id)
            .collection('MESSAGES')
            .doc(holdCurrentMsgAction?.item?._id).delete().then((res) => {
                console.log(res, "resresresres");
                _closeAction()
            }).catch((error) => {
                console.log(error, "resresresres");
                _closeAction()
            })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 30}
            style={{ flex: 1 }}>
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

                <FlatList
                    data={fullChat}
                    extraData={fullChat}
                    ref={msgListRef}
                    inverted
                    renderItem={({ item, index }) => {
                        console.log(item, "itemitem");
                        return (
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    // alignItems: "center",
                                    marginVertical: 12,
                                    marginHorizontal: 16,
                                    zIndex: 1
                                }}
                                activeOpacity={0.8}
                                onPress={() => setHoldCurrentMsgAction(null)}
                            >

                                {item?.isSelected ?
                                    <View style={{
                                        position: 'absolute',
                                        // alignSelf: "flex-end",
                                        end: 24,
                                        padding: 16,
                                        zIndex: 99999,
                                        backgroundColor: "lightgreen",
                                        justifyContent: "space-between",
                                        // height: 80
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                                position: "relative",
                                                flexDirection: "row",
                                                zIndex: 99999
                                            }}
                                            onPress={_deleteMsg}>
                                            <Image
                                                source={{
                                                    uri: "https://cdn-icons-png.flaticon.com/512/1345/1345874.png"
                                                }}
                                                style={{ height: 16, width: 16 }}
                                            />
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "600",
                                                marginStart: 12,
                                                color: "black"
                                            }}>{"Delete Comment"}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{
                                                position: "relative",
                                                flexDirection: "row",
                                                marginTop: 16,
                                                zIndex: 99999
                                            }}
                                            onPress={_blockUser}>
                                            <Image
                                                source={{
                                                    uri: "https://static.thenounproject.com/png/2860551-200.png"
                                                }}
                                                style={{ height: 16, width: 16 }}
                                            />
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "600",
                                                marginStart: 12,
                                                color: "black"
                                            }}>{item?.user?.isBlocked ? "Unblock All Comments From User" : "Block All Comments From User"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : <></>}

                                <View style={{
                                    flexDirection: "row",
                                    width: "96%"
                                }}>
                                    <Image
                                        source={{ uri: item?.user?.avatar }}
                                        style={{
                                            height: 24,
                                            width: 24,
                                            borderRadius: 12
                                        }}
                                    />
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            marginStart: 8,
                                            color: "black",
                                        }}>{item?.user?.displayName}</Text>

                                        <View>
                                            {currentUserDa?.isAdmin ?
                                                <Text style={{
                                                    fontSize: 15,
                                                    fontWeight: "300",

                                                    color: "black",
                                                    backgroundColor: "lightgreen",
                                                }}>{item?.user?.id == currentUserDa?.id ?
                                                    "Admin" : ""}</Text>
                                                :
                                                <Text style={{
                                                    fontSize: 15,
                                                    fontWeight: "300",
                                                    marginStart: 8,
                                                    color: "black",
                                                    backgroundColor: "lightgreen",
                                                }}>{item?.user?.isAdmin ? "Admin" : ""}</Text>
                                            }
                                        </View>

                                        <Text style={{
                                            fontSize: 15,
                                            fontWeight: "300",
                                            marginStart: 8,
                                            color: "black",
                                            width: "68%"
                                        }}>{" " + item?.text}</Text>
                                    </View>
                                </View>

                                {currentUserDa?.isAdmin && item?.user?.id != currentUserDa?.id ?
                                    <TouchableOpacity
                                        hitSlop={{
                                            top: 16, right: 16, left: 16, bottom: 16
                                        }}
                                        onPress={() => {
                                            let obj = {
                                                item: item,
                                                index: index
                                            }
                                            setHoldCurrentMsgAction(obj)
                                        }}
                                    >
                                        <Image
                                            source={{ uri: "https://static.thenounproject.com/png/1126660-200.png" }}
                                            style={{ height: 16, width: 16 }}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <></>}
                            </TouchableOpacity>
                        )
                    }}
                />

                {!currentUserDa?.isBlocked
                    ?
                    <View style={{
                        backgroundColor: "lightgrey",
                        marginHorizontal: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <TextInput
                            style={{
                                minHeight: 40,
                                fontSize: 16,
                                paddingStart: 16,
                                width: "80%",
                                color: "black",
                                maxHeight: 120
                            }}
                            multiline={true}
                            underlineColorAndroid="transparent"
                            placeholder="Type here..."
                            value={currentMsg}
                            onChangeText={(val) => setCurrentMsg(val)}
                        />

                        <TouchableOpacity
                            onPress={onSend}
                        >
                            <Text style={{
                                color: "black",
                                marginEnd: 16
                            }}>{"Send"}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <Text style={{
                        color: "black",
                        textAlign: "center",
                        marginVertical: 10,
                        borderWidth: 0.3
                    }}>{"Blocked!, you can't send message to in this chat."}</Text>
                }

                {/* <GiftedChat
                    messages={fullChat}
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
                /> */}

                {/* <Text style={{ fontSize: 24 }}>{"Is Blocked :- " + surrentUserStatus?.isBlocked}</Text> */}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ChatApp;
