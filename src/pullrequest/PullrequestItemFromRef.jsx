// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import groupBy from 'unmutable/groupBy';
import pipe from 'unmutable/lib/util/pipe';
import {blue, red, green, magenta, grey, yellow, black, title, split, left, right, center, whiteBg, date} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Markdown from '../affordance/Markdown';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';
import TimelineItemArray from '../affordance/TimelineItemArray';
import {useCoreContext} from '../core/CoreContext';
import PullRequest from './data/PullRequest';
import PullRequestItemStructure from './PullRequestItemStructure';


export default function PullrequestItemFromRef(props) {
    const {repo} = props;
    const {owner, name, ref} = repo;

    const message = Api.repo.pullRequestFromRef.useRequest();

    useEffect(() => {
        message.onRequest({owner, name, ref});
    }, []);


    return <LoadingBoundary message={message}>
        {pipe(
            getIn(['repository', 'ref', 'associatedPullRequests', 'nodes', 0]),
            _ => new PullRequest(_),
            pullRequest => <PullRequestItemStructure pullRequest={pullRequest} />
        )}
    </LoadingBoundary>;
}

