import React from 'react'

import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native'

const StartPage = (props) => {

    return (
        <View style={{
            flex: 1,
            backgroundColor: "white",
            paddingHorizontal: 16
        }}>
            <TouchableOpacity
                style={{
                    marginTop: 48,
                    backgroundColor: "lightblue",
                    padding: 8,
                    alignItems: "center"
                }}
                activeOpacity={0.7}
                onPress={() => props.navigation.navigate("Login")}
            >
                <Text style={{ fontSize: 16, fontWeight: "300" }}>{"Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                marginTop: 48,
                backgroundColor: "lightblue",
                padding: 8,
                alignItems: "center"
            }}
                activeOpacity={0.7}
                onPress={() => props.navigation.navigate("Register")}
            >
                <Text style={{ fontSize: 16, fontWeight: "300" }}>{"Signup"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StartPage;