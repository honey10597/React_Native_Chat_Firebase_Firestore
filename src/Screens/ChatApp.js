import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';

const ChatApp = (props) => {

    const { navigation, route } = props;
    const { thread } = route.params
    console.log(thread, "threadthreadthreadthread");

    const user = auth().currentUser.toJSON()
    console.log(user, "currentUsercurrentUser");

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribeListener = firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    console.log(doc?._data?.user, "<= dddddddddd");

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        user: doc?._data?.user,
                        ...firebaseData
                    }

                    // if (!firebaseData.system) {
                    //     data.user = {
                    //         ...firebaseData.user,
                    //         name: firebaseData.user.email,
                    //         displayName: firebaseData.user.email,
                    //     }
                    // }

                    return data
                })
                console.log(messages, "querySnapshotquerySnapshot");
                setMessages(messages)
            })
        return () => unsubscribeListener()
    }, [])

    const onSend = useCallback(async (messages = []) => {
        const text = messages[0].text
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );

        console.log(user, "user on send");

        await firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                name: user?.displayName || user?.email,
                displayName: user?.displayName || user?.email,
                user: {
                    _id: user.uid,
                    displayName: user?.displayName || user?.email,
                    name: user?.displayName || user?.email,
                    avatar: user?.photoURL,
                }
            }).then((res) => console.log(res, "rrrrrrrrrrrr"))
            .catch((err) => console.log(err, "errorerror"))
    }, []);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                // renderMessageImage={}
                wrapperStyle={{
                    left: {
                        backgroundColor: "lightblue",
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
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{ _id: 1 }}
                    renderBubble={renderBubble}
                    // renderAvatar={() => null}
                    renderTime={() => null}
                    renderUsernameOnMessage={true}
                    textInputStyle={{
                        color: "black"
                    }}
                />
            </SafeAreaView>
        </View>
    );
};

export default ChatApp;
