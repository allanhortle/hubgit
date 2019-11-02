// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import PullrequestItem from './PullrequestItem';
import {yellow, state as colorState} from '../util/tag';
import {useCoreContext} from '../core/CoreContext';

export default function PullList() {
    const message = Api.repo.pullList.useRequest();
    const {pushStack, repo:{owner, name}} = useCoreContext();
    const [selected, setSelected] = useState(1);

    const list = getIn(['repository', 'pullRequests']);

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
