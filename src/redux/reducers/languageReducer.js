import { SET_LANGUAGE_ACTION } from '../../constants/constants';

const languageReducer = (state='English', action) => {
    
    console.log(action)
    switch (action.type) {
        case SET_LANGUAGE_ACTION:
            return action.text;
        default:
            return state;
    }
}

export default languageReducer