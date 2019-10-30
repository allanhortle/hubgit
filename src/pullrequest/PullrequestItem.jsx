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
                title,
                reviewThreads
            } = new PullRequest(data.repository.pullRequest);
            const description = body ? 'Description: ' + body.replace(/\n|\r/g, ' ') : 'No Description'
            const descriptionLines = description.split('\r').length;
            const rowPadding = {top: 1, bottom: 1, left: 0, right: 0};
            const bottomPadding = {top: 0, bottom: 1, left: 0, right: 0};


            const timeline = pipeWith(
                timelineItems.nodes,
                sortBy(get('createdAt')),
                //reverse(),
                TimelineItemArray,
                _ => [
                    {
                        row: [date(createdAt), yellow(author.login), '#', description],
                        view: Markdown,
                        viewProps: {title: 'Description', markdown: body}
                    }
                ].concat(_)
            );


            return <box bottom={0} top={0}>
                <box tags top={1} height={1} content={`  ${colorState(state)}  ${blue(headRefName)} into ${blue(baseRefName)}  ${green('+'+additions)} ${red('-'+deletions)}  ${url}`} />
                <listtable
                    mouse={true}
                    keys={true}
                    focused={true}
                    vi={true}
                    tags={true}
                    align="left"
                    top={2}
                    pad={0}
                    height={timeline.length + 1}
                    rows={[['','','','']].concat(timeline.map(get('row')))}
                    style={{
                        selected: {
                            fg: 'black',
                            bg: 'yellow'
                        },
                        scrollbar: {
                            bg: 'blue'
                        }
                    }}
                onSelect={(_, index) =>  {
                    const {type, view, viewProps} = timeline[index - 1];
                    pushStack(view, viewProps);
                }}
                />
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

