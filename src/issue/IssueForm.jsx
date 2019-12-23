// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import pipe from 'unmutable/lib/util/pipe';
import IssueListView from './IssueListView';
import {useCoreContext} from '../core/CoreContext';
import {label} from '../util/tag';
import Form from '../affordance/Form';
import Issue from './data/Issue';

type Props = {
    issue?: Issue
};
export default function IssueForm(props: Props) {
    const {replaceStack, repo: {owner, name}} = useCoreContext();
    const {issue} = props;
    const mutation = issue ? 'update' : 'create';
    const buttonText = issue ? 'Save Issue' : 'Create Issue';


    const repository = Api.repo.item.useRequest();
    const message = Api.issue[mutation].useRequest();

    useEffect(() => {
        repository.onRequest({owner, name});
    }, []);

    return <LoadingBoundary message={repository}>
        {pipe(
            getIn(['repository']),
            (repository) => {
                const onSubmit = (data) => {
                    const input = {
                        ...data,
                        repositoryId: repository.id
                    };
                    message
                        .onRequest({input})
                        .then(() => {
                            if(message.requestState.isSuccess) {
                                replaceStack(IssueListView);
                            }
                        });
                };

                return message.requestState
                    .emptyMap(() => <Form
                        submit={buttonText}
                        onSubmit={onSubmit}
                        items={{
                            title: {
                                type: 'textbox',
                                label: 'Title'
                            },
                            body: {
                                type: 'textarea',
                                label: 'Description'
                            },
                            labelIds: {
                                type: 'checkbox',
                                label: 'Labels',
                                options: repository.labels.nodes.map(ii => ({label: label(ii), value: ii.id}))
                            },
                            assigneeIds: {
                                type: 'checkbox',
                                label: 'Users',
                                options: repository.assignableUsers.nodes.map(({login, id}) => ({label: login, value: id}))
                            }
                        }}
                    />)
                    .fetchingMap(() => 'Loading...')
                    .refetchingMap(() => 'Loading...')
                    .errorMap(() => message.requestError.message)
                    .value();
            }
        )}
    </LoadingBoundary>;
}

