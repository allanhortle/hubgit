// @flow
import React, {useEffect} from 'react';
import Issue from './data/Issue';
import ListTable from '../affordance/ListTable';
import Markdown from '../affordance/Markdown';
import TimelineItemArray from '../affordance/TimelineItemArray';
import * as t from '../util/tag';
import sortBy from 'unmutable/sortBy';
import pipeWith from 'unmutable/pipeWith';
import {useCoreContext} from '../core/CoreContext';
import IssueCommandView from './IssueCommandView';

type Props = {
    issueItem: Issue
};
export default (props: Props) => {
    const {issueItem} = props;
    const {pushStack, screen} = useCoreContext();
    const {
        state,
        timelineItems,
        title,
        number,
        author,
        createdAt,
        body
    } = issueItem;

    useEffect(() => {
        screen.onceKey([':'], () => pushStack(IssueCommandView, {title: 'Commands', issue: issueItem}));
        return () => screen.unkey([':']);
    }, []);

    const timeline = pipeWith(
        timelineItems.nodes,
        TimelineItemArray,
        sortBy(ii => ii.row[0]),
        _ => [
            {
                row: [t.date(createdAt), t.yellow(author.login), '#', body],
                view: Markdown,
                viewProps: {title: 'Description', markdown: body}
            }
        ].concat(_)
    );

    const labels = issueItem.labels.nodes.map(t.label).join(', ');

    return <box>
        <box tags top={1} height={1} left={2} content={`${t.state(state)}  #${number} ${title}`} />
        <box tags top={2} height={1} left={2} content={labels} />
        <ListTable
            top={labels ? 3 : 2}
            head={['', '', '', '']}
            rows={timeline.map(_ => _.row)}
            onSelect={(_, index) =>  {
                const {view, viewProps} = timeline[index - 1];
                pushStack(view, viewProps);
            }}
        />
    </box>;
};

