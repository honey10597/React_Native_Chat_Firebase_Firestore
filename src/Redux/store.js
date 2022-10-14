import reducer from "./reducer"
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

const middlewares = [thunk]

export default createStore(reducer, applyMiddleware(...middlewares, logger))