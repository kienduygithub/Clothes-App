import { combineReducers } from 'redux';
import { CounterReducer } from './counter/counter.reducer';

const rootReducer = combineReducers({
    counter: CounterReducer
})

export default rootReducer;