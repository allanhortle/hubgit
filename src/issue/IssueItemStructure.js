// @flow
import React from 'react';
import Issue from './data/Issue';
import ListTable from '../affordance/ListTable';
import TimelineItemArray from '../affordance/TimelineItemArray';
import * as t from '../util/tag';
import sortBy from 'unmutable/sortBy';
import pipeWith from 'unmutable/pipeWith';
import {useCoreContext} from '../core/CoreContext';

type Props = {
    issueItem: Issue
};
export default (props: Props) => {
    const {issueItem} = props;
    const {pushStack} = useCoreContext();
    const {
        state,
        timelineItems,
        title,
        number,
        body,
        createdAt,
        author
    } = issueItem;

    //const description = body ? 'Description: ' + body.replace(/\n|\r/g, ' ') : 'No Description';

    const timeline = pipeWith(
        timelineItems.nodes,
        TimelineItemArray,
        //_ => [
            //{
                //row: [date(createdAt), yellow(author.login), '#', description],
                //view: Markdown,
                //viewProps: {title: 'Description', markdown: body}
            //}
        //].concat(_),
        sortBy(ii => ii.row[0])
    );

    return <box>
        <box tags top={1} height={1} left={2} content={`${t.state(state)}  #${number} ${title}`} />
        <box tags top={2} height={1} left={2} content={issueItem.labels.nodes.map(t.label).join(', ')} />
        <ListTable
            top={3}
            head={['', '', '', '']}
            rows={timeline.map(_ => _.row)}
            onSelect={(_, index) =>  {
                const {view, viewProps} = timeline[index - 1];
                pushStack(view, viewProps);
            }}
        />
    </box>;
};

