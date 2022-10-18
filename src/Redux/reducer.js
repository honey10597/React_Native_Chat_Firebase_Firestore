const initial_state = {
    alUsersInRed: [],
    allChats: [],
    currentUserData: {}
}

export default function (state = initial_state, action) {

    switch (action.type) {
        case "SAVE_ALL_USERS": {
            const data = action.payload;
            console.log(action, "<= datadatadatadatadata");
            return { ...state, alUsersInRed: data };
        }
        case "ALL_MESSAGES": {
            const data = action.payload;
            console.log(action, "ALL_MESSAGESALL_MESSAGES");
            return { ...state, allChats: data };
        }
        case "CURRENT_USER_DATA": {
            const data = action.payload;
            return { ...state, currentUserData: data };
        }
        default: {
            return { ...state }
        }
    }
}