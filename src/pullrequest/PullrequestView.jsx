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


export default (props) => {
    const {viewIndex} = props;
    const {owner, name} = props.repo;

    return <ListLayout
        itemRequest={Api.repo.pull.useRequest}
        listRequest={Api.repo.pullList.useRequest}
        listPayload={{owner, name}}
        itemPayload={number => ({number: parseInt(number), owner, name})}
        itemId={viewIndex}
        id={get('number')}
        list={getIn(['repository', 'pullRequests'])}
        item={getIn(['repository', 'pullRequest'])}
        listHead={['#', 'Status', 'Name']}
        renderListItem={ii => [
            `${ii.number}`,
            colorState(ii.state),
            ii.title
        ]}
        itemView={PullDescription}
    />;
}


function PullDescription({data}) {
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
    } = data;
    const description = body || 'No Description';
    const descriptionLines = description.split('\r').length;
    const rowPadding = {top: 1, bottom: 1, left: 0, right: 0};
    const bottomPadding = {top: 0, bottom: 1, left: 0, right: 0};


    return <box border scrollable mouse height="100%" bottom={0} top={0}>
        <box height={1} content={`#${number} ${title}`}/>
        <listtable tags align="left" height={8} top={2} rows={[
            ['changes:', `${green('+' + additions)} ${red('-' + deletions)}`],
            ['state:', colorState(state)],
            ['opened by:', yellow(author.login)],
            ['merge:', `${blue(headRefName)} into ${blue(baseRefName)}`],
            ['url:', `${url}`],
            ['created:', `${createdAt}`],
            ['updated:', `${updatedAt}`],
        ]}/>
        <box tags top={10} shrink content={[
            description,
            ...TimelineItemArray(timelineItems)
        ].join('\n')}/>
    </box>
    return <BlockLayout mouse scrollable scrollbar border="bg">
        <Title margin={rowPadding}>Description</Title>
        <box>{description}</box>
        <Title margin={rowPadding}>Comments</Title>
        {TimelineItemArray(timelineItems)}
    </BlockLayout>;
}



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

