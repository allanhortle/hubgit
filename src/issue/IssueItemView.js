// @flow
import type {RepoShape as Repo} from '../core/data/Repo';

import React, {useEffect} from 'react';
import pipe from 'unmutable/pipe';
import getIn from 'unmutable/getIn';
import Issue from './data/Issue';
import IssueItemStructure from './IssueItemStructure';

import Api from '../core/EntityApi';
import LoadingBoundary from '../core/LoadingBoundary';

type Props = {
    number: number,
    repo: Repo
};
export default (props: Props) => {
    const {number} = props;
    const {owner, name} = props.repo;

    const issueItem = Api.issue.item.useRequest();

    useEffect(() => {
        issueItem.onRequest({number, owner, name});
    }, []);

    return <LoadingBoundary message={issueItem}>
        {pipe(
            getIn(['repository', 'issue']),
            data => <IssueItemStructure issueItem={new Issue(data)} />
        )}
    </LoadingBoundary>;
};

