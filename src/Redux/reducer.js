const initial_state = {
    alUsersInRed: [],
    allChats: []
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
        default: {
            return { ...state }
        }
    }
}