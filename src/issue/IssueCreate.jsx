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

export default function PullRequestCreate() {
    const {replaceStack, repo: {owner, name}} = useCoreContext();

    const repository = Api.repo.item.useRequest();
    const create = Api.issue.create.useRequest();

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
                    create
                        .onRequest({input})
                        .then(() => {
                            if(create.requestState.isSuccess) {
                                replaceStack(IssueListView);
                            }
                        });
                };

                return create.requestState
                    .emptyMap(() => <Form
                        submit="Create Issue"
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
                                items: repository.labels.nodes.map(ii => ({label: label(ii), value: ii.id}))
                            },
                            assigneeIds: {
                                type: 'checkbox',
                                label: 'Users',
                                items: repository.assignableUsers.nodes.map(({login, id}) => ({label: login, value: id}))
                            }
                        }}
                    />)
                    .fetchingMap(() => 'Loading...')
                    .refetchingMap(() => 'Loading...')
                    .errorMap(() => create.requestError.message)
                    .value();
            }
        )}
    </LoadingBoundary>;
}

