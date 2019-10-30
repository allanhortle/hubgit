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


export default function PullItem(props) {
    const {viewIndex} = props;
    const {owner, name} = props.repo;
    const {pushStack} = useCoreContext();

    const [index, setIndex] = useState(null);
    const [itemId, setItemId] = useState(props.itemId);
    const message = Api.repo.pullItem.useRequest();
    const list = getIn(['repository', 'pullRequests']);
    const id = get('number');
    const item = getIn(['repository', 'pullRequest']);
    const listHead = ['#', 'Status', 'Name'];

    useEffect(() => {
        message.onRequest({number: parseInt(viewIndex), owner, name});
    }, []);

    return <LoadingBoundary message={message}>
        {pipe(
            getIn(['repository', 'pullRequest']),
            _ => new PullRequest(_),
            pullRequest => <PullRequestItemStructure pullRequest={pullRequest} />
        )}
    </LoadingBoundary>;
}

PullItem.label = ({repo, viewIndex, title}) => `#${viewIndex}${title ? ` ${title}` : ''}`;

