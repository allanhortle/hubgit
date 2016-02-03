import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import {Map, List} from 'immutable';
import IssuesReducer from 'hubgit/client/issues/IssuesReducer';


export default combineReducers({
    issues: IssuesReducer
});
