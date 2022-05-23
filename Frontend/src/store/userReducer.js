function addUserData (id, token, nome, foto, tipo) {

    if (id === undefined)
        return {
            type: "ADICIONA DADOS",
            payload: {}
        }

    let dados = {id, token, nome, foto, tipo};

    return {
        type: "ADICIONA DADOS",
        payload: { dados }
    }
}

function userDataReducer (state = {}, action) {
    switch (action.type) {
        case "ADICIONA DADOS":
            return action.payload;
        default:
            return state;
    }
}

module.exports = {
    addUserData,
    userDataReducer
}