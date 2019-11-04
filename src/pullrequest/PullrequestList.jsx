// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import pipeWith from 'unmutable/pipeWith';
import map from 'unmutable/map';
import PullrequestItem from './PullrequestItem';
import {yellow, date, ellipsis, state as colorState} from '../util/tag';
import {useCoreContext} from '../core/CoreContext';

export default function PullList() {
    const message = Api.repo.pullList.useRequest();
    const {pushStack, repo:{owner, name}} = useCoreContext();
    const [selected, setSelected] = useState(1);

    useEffect(() => {
        message.onRequest({owner, name});
    }, []);


    return <LoadingBoundary message={message}>
        {(data) => {
            const pulls = data.repository.pullRequests.nodes;

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
                rows={[
                    ['', 'Last Updated', 'Author', 'Branch', 'Status', 'Name', '?', '*'],
                    ...pipeWith(
                        pulls,
                        map(ii => [
                            String(ii.number),
                            date(ii.updatedAt),
                            yellow(ii.author.login),
                            ellipsis(ii.headRefName, 30),
                            colorState(ii.state),
                            ellipsis(ii.title, 40),
                            `${ii.comments.totalCount + ii.reviewThreads.nodes.reduce((rr, item) => rr + item.comments.totalCount, 0)}`,
                            ii.timelineItems.totalCount.toString()
                        ])
                    )
                ]}
                onSelect={(_, index) =>  {
                    setSelected(index);
                    const {number, title} = pulls[index - 1] || {};
                    pushStack(PullrequestItem, {viewIndex: number, title});
                }}
            />;
        }}
    </LoadingBoundary>;
}

