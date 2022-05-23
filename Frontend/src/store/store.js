import { combineReducers, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { userDataReducer } from './userReducer';


const reducersCombined = combineReducers ({
    dadosUsuario: userDataReducer
});

const store = createStore (reducersCombined, applyMiddleware (reduxThunk));

export default store;