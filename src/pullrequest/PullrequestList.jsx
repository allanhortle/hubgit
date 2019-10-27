// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/get';
import pipeWith from 'unmutable/pipeWith';
import map from 'unmutable/map';
import PullrequestItem from './PullrequestItem';
import {blue, red, green, magenta, grey, yellow, black, title, split, left, right, center, whiteBg} from '../util/tag';
import {useCoreContext} from '../core/CoreContext';

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


export default function PullList(props) {
    const {owner, name} = props.repo;
    const message = Api.repo.pullList.useRequest();
    const {pushStack} = useCoreContext();
    const [selected, setSelected] = useState(1);

    const list = getIn(['repository', 'pullRequests']);
    const id = get('number');
    const item = getIn(['repository', 'pullRequest']);

    useEffect(() => {
        message.onRequest({owner, name});
    }, []);


    return <LoadingBoundary message={message}>
        {(data) => {
            const plainList = list(data).edges.map(ii => ii.node);

            return <listtable
                align="left"
                mouse={true}
                keys={true}
                focused={true}
                vi={true}
                tags={true}
                pad={0}
                height="100%"
                width="100%"
                onSelect
                selected={selected}
                style={{
                    selected: {
                        fg: 'black',
                        bg: 'yellow'
                    },
                    scrollbar: {
                        bg: 'blue'
                    }
                }}
                rows={
                    [['#', 'Author', 'Branch', 'Status', 'Name', 'Comments', 'Activty']].concat(plainList.map(ii => [
                        `${ii.number}`,
                        yellow(ii.author.login),
                        `${ii.headRefName}`,
                        colorState(ii.state),
                        ii.title,
                        `${ii.comments.totalCount + ii.reviewThreads.edges.reduce((rr, item) => rr + item.node.comments.totalCount, 0)}`,
                        ii.timelineItems.totalCount.toString()
                    ]))
                }
                onSelect={(_, index) =>  {
                    setSelected(index);
                    const {number, title} = plainList[index - 1] || {};
                    pushStack(PullrequestItem, {viewIndex: number, title});
                }}
            />;
        }}
    </LoadingBoundary>;
}

PullList.label = () => "Pull Requests";
