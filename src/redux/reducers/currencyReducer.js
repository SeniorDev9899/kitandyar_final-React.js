import { SET_CURRENCY_ACTION } from '../../constants/constants';

const currencyReducer = (state='USD$', action) => {
    
    console.log(action)
    switch (action.type) {
        case SET_CURRENCY_ACTION:
            return action.text;
        default:
            return state;
    }
}

export default currencyReducer