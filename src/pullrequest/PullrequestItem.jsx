// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import {blue, red, green, magenta, grey, yellow, black, title, split, left, right, center, whiteBg} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';
import TimelineItemArray from '../affordance/TimelineItemArray';


export default function PullItem(props) {
    const {viewIndex} = props;
    const {owner, name} = props.repo;

    const [index, setIndex] = useState(null);
    const [itemId, setItemId] = useState(props.itemId);
    const message = Api.repo.pullItem.useRequest();
    const list = getIn(['repository', 'pullRequests']);
    const id = get('number');
    const item = getIn(['repository', 'pullRequest']);
    const listHead = ['#', 'Status', 'Name'];
    const renderListItem = ii => [`${ii.number}`, colorState(ii.state), ii.title];

    useEffect(() => {
        message.onRequest({number: parseInt(viewIndex), owner, name});
    }, []);

    return <LoadingBoundary message={message}>
        {(data) => {
            const {
                additions,
                author,
                baseRefName,
                body,
                comments,
                createdAt,
                deletions,
                headRefName,
                number,
                timelineItems,
                state,
                updatedAt,
                url,
                title
            } = data.repository.pullRequest;
            const description = body || 'No Description';
            const descriptionLines = description.split('\r').length;
            const rowPadding = {top: 1, bottom: 1, left: 0, right: 0};
            const bottomPadding = {top: 0, bottom: 1, left: 0, right: 0};

            log(timelineItems);

            const timeline = TimelineItemArray(timelineItems);


            return <box scrollable mouse height="100%" bottom={0} top={0}>
                <listtable tags invertSelected={false} align="left" height={7} top={0} rows={[
                    ['changes:', `${green('+' + additions)} ${red('-' + deletions)}`],
                    ['state:', colorState(state)],
                    ['opened by:', yellow(author.login)],
                    ['merge:', `${blue(headRefName)} into ${blue(baseRefName)}`],
                    ['url:', `${url}`],
                    ['created:', `${createdAt}`],
                    ['updated:', `${updatedAt}`],
                ]}/ >
                <listtable tags invertSelected={false} align="left" width="100%" height={timeline.length} top={8} rows={timeline}/ >
            </box>
        }}
    </LoadingBoundary>;
}

PullItem.label = ({repo, viewIndex, title}) => `#${viewIndex}${title ? ` ${title}` : ''}`;

function colorState(val) {
    switch(val) {
        case 'MERGED':
            return magenta(val);
        case 'CLOSED':
            return red(val);
        case 'OPEN':
            return green(val);
        default:
            return val;
    }
}

