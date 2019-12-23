// @flow
import React  from 'react';
import Issue from './data/Issue';
import IssueForm from './IssueForm';
import ListTable from '../affordance/ListTable';
import Markdown from '../affordance/Markdown';
import TimelineItemArray from '../affordance/TimelineItemArray';
import * as t from '../util/tag';
import useCommandList from '../util/useCommandList';
import sortBy from 'unmutable/sortBy';
import pipeWith from 'unmutable/pipeWith';
import {useCoreContext} from '../core/CoreContext';
import Api from '../core/EntityApi';

type Props = {
    issueItem: Issue
};
export default (props: Props) => {
    const {issueItem} = props;
    const {pushStack} = useCoreContext();
    const {
        id,
        state,
        timelineItems,
        title,
        number,
        author,
        createdAt,
        body
    } = issueItem;

    const close = Api.issue.close.useRequest();
    const reopen = Api.issue.reopen.useRequest();

    useCommandList([
        state === 'OPEN'
            ? {row: ['x', 'Close'], message: close, payload: {id}}
            : {row: ['o', 'Re-open'], message: reopen, payload: {id}},
        {row: ['e', 'Edit'], view: IssueForm, props: {issue: issueItem}}
    ]);

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
            rows={timeline.map(_ => ({value: _.row}))}
            onSelect={(_, index) =>  {
                const {view, viewProps} = timeline[index - 1];
                pushStack(view, viewProps);
            }}
        />
    </box>;
};

