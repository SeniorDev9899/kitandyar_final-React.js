import { combineReducers } from 'redux';
import languageReducer from './languageReducer'
import currencyReducer from './currencyReducer'

export default combineReducers({
    languageReducer,
    currencyReducer
});