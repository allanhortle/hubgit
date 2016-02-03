import {createAction} from 'redux-actions';
import Github from 'hubgit/client/api/github';

export const requestIssues = (query={}) => (dispatch, getState) => {
    dispatch(createAction('LOADING')());
    Github.issues.getAll(query, (error, data) => {
        if(error) {
            dispatch(createAction('ERROR')(error))
        }
        dispatch(createAction('REQUEST_ISSUES_SUCCESS')(data))
    })
}
