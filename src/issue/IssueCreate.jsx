// @flow
import React, {useEffect, useRef} from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/get';
import flatMap from 'unmutable/flatMap';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/pipeWith';
import IssueListView from './IssueListView';
import {useCoreContext} from '../core/CoreContext';
import {blue, label} from '../util/tag';
import Ref from '../ref/data/Ref';
import Form from '../affordance/Form';

type Props = {
    reference: Ref,
    id: string
};
export default function PullRequestCreate(props: Props) {
    const {replaceStack, repo: {owner, name}} = useCoreContext();
    const {reference, id} = props;

    const [parcel] = useParcelState({
        value: {
            assigneeIds: [],
            body: undefined,
            labelIds: [],
            repositoryId: id,
            title: undefined

        }
    });

    const form = useRef({
        submit: () => {},
        submission: {}
    });
    const repository = Api.repo.item.useRequest();
    const create = Api.issue.create.useRequest();

    useEffect(() => {
        repository.onRequest({owner, name});
    }, []);



    return <LoadingBoundary message={repository}>
        {pipe(
            getIn(['repository']),
            (repository) => {

                const labels = repository.labels.nodes;
                const users = repository.assignableUsers.nodes;

                const onSubmit = async () => {
                    form.current.submit();
                    const {submission} = form.current;
                    log(submission);
                    const input = {
                        assigneeIds: flatMap((_, i) => _ ? [users[i].id] : [])([].concat(submission.assignee)),
                        body: submission.body,
                        labelIds: flatMap((_, i) => _ ? [labels[i].id] : [])([].concat(submission.label)),
                        repositoryId: repository.id,
                        title: submission.title
                    }
                    return false;
                    create
                        .onRequest({input})
                        .then(() => {
                            log(create.requestState);
                            if(create.requestState.isSuccess) {
                                replaceStack(IssueListView);
                            }
                        });
                };

                const baseFormValue = {
                    title: 'foo',
                    body: '',
                    label: [],
                    users: []
                };

                return create.requestState
                    .emptyMap(() => {
                        const labelHeight = labels.length + 2;
                        return <Form
                            submit="Create Issue"
                            onSubmit={log}
                            items={{
                                title: {
                                    type: 'textbox',
                                    label: 'Title'
                                },
                                body: {
                                    type: 'textarea',
                                    label: 'Description'
                                },
                                labels: {
                                    type: 'checkbox',
                                    label: 'Labels',
                                    items: labels.map(ii => ({label: label(ii), value: ii.id}))
                                },
                                assignees: {
                                    type: 'checkbox',
                                    label: 'Users',
                                    items: users.map(({login}) => ({label: login, value: login}))
                                }
                            }}
                        />;
                        return <box>
                            {/* $FlowFixMe */}
                            <form keys vi ref={form} left={1} top={1} width="100%-2" value={baseFormValue}>
                                <textbox name="title" focused inputOnFocus keys mouse top={0} left={1}  border="line" height={3} label="Title"  />
                                <textarea name="body" inputOnFocus keys mouse top={3} height={7} left={1}  border="line" label="Description"  />
                                <box top={10} height={labelHeight} left={1} label="Labels" border="line">
                                    {labels.map((ii, index) => <checkbox
                                        tags
                                        name="label"
                                        key={index}
                                        top={index}
                                        onCheck={x => log('check', x)}
                                        onUncheck={x => log('uncheck', x)}
                                        content={label(ii)}
                                    />)}
                                </box>
                                <box top={10 + labelHeight} bottom={3} left={1} label="Assignees" border="line">
                                    {users.map((ii, index) => <checkbox
                                        tags
                                        name="assignee"
                                        key={index}
                                        top={index}
                                        content={ii.login}
                                    />)}
                                </box>
                                <button keys vi mouse
                                    style={{fg: 'blue', focus: {underline: true}}}
                                    height={1} bottom={1}
                                    shrink
                                    right={1}
                                    content="Create Issue"
                                    onPress={() => onSubmit()}
                                />
                            </form>
                        </box>;
                    })
                    .fetchingMap(() => 'Loading...')
                    .refetchingMap(() => 'Loading...')
                    .errorMap(() => create.requestError.message)
                    .value();
            }
        )}
    </LoadingBoundary>;
}

