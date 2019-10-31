// @flow
import React from 'react';
import get from 'unmutable/lib/get';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {blue, red, green, yellow, date, state as colorState} from '../util/tag';
import Markdown from '../affordance/Markdown';
import TimelineItemArray from '../affordance/TimelineItemArray';
import {useCoreContext} from '../core/CoreContext';
import PullRequest from './data/PullRequest';

type Props = {
    pullRequest: PullRequest
};

export default function PullItem(props: Props) {
    const {
        additions,
        author,
        baseRefName,
        body,
        createdAt,
        deletions,
        headRefName,
        timelineItems,
        state,
        url
    } = props.pullRequest;

    const description = body ? 'Description: ' + body.replace(/\n|\r/g, ' ') : 'No Description';
    const {pushStack} = useCoreContext();

    const timeline = pipeWith(
        timelineItems.nodes,
        sortBy(get('createdAt')),
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
                const {view, viewProps} = timeline[index - 1];
                pushStack(view, viewProps);
            }}
        />
    </box>;
}

