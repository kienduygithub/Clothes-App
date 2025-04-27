import { combineReducers } from 'redux';
import CounterReducer from './counter/counter.reducer';
import { UserReducer } from './user/user.reducer';

const rootReducer = combineReducers({
    counter: CounterReducer,
    userLogged: UserReducer
})

export default rootReducer;