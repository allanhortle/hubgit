import {List, Map, fromJS} from 'immutable';

const initialState = Map();

export default function IssuesReducer(state = initialState, action) {
    switch (action.type) {
        case 'REQUEST_ISSUES_SUCCESS':
            return state.set('current', fromJS(action.payload));

        default: 
            return state;
    }
}

