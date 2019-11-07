// @flow
import type {RepoShape as Repo} from '../core/data/Repo';

import React, {useEffect} from 'react';
import map from 'unmutable/map';
import pipe from 'unmutable/pipe';
import getIn from 'unmutable/getIn';
import Issue from './data/Issue';
import IssueListStructure from './IssueListStructure';
import IssueItemView from './IssueItemView';
import IssueCreate from './IssueCreate';

import Api from '../core/EntityApi';
import LoadingBoundary from '../core/LoadingBoundary';
import {useCoreContext} from '../core/CoreContext';
import useCommandList from '../util/useCommandList';

type Props = {
    repo: Repo,
    listIndex: number
};
export default (props: Props) => {
    const {owner, name} = props.repo;
    const {pushStack} = useCoreContext();

    const issueList = Api.issue.list.useRequest();

    const onSelect = (row: Array<string|{tag: string, value: mixed}>) => {
        const number = parseInt(row[0]);
        pushStack(IssueItemView, {number, title: `#${number}`});
    };

    useCommandList([
        {row: ['c', 'Create Issue'], view: IssueCreate, props: {title: 'Create Issue'}}
    ]);

    useEffect(() => {
        issueList.onRequest({owner, name});
    }, []);

    return <LoadingBoundary message={issueList}>
        {pipe(
            getIn(['repository', 'issues', 'nodes']),
            map(_ => new Issue(_)),
            data => <IssueListStructure issueList={data} onSelect={onSelect} />
        )}
    </LoadingBoundary>;
};

