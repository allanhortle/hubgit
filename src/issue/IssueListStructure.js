// @flow
import React from 'react';
import Issue from './data/Issue';
import ListTable from '../affordance/ListTable';
import {ellipsis} from '../util/tag';

type Props = {
    issueList: Array<Issue>,
    onSelect: (Array<string|{tag: string, value: mixed}>, number) => void
};
export default (props: Props) => {
    const {issueList, onSelect} = props;
    return <box>
        <ListTable
            onSelect={onSelect}
            head={['#', 'State', 'Labels', 'Title', 'Last Updated']}
            rows={issueList.map(ii => [
                `${ii.number}`,
                {tag: 'state', value: ii.state},
                ellipsis(ii.title, 50),
                {tag: 'label', value: ii.labels.nodes},
                {tag: 'date', value: ii.updatedAt}
            ])}
        />
    </box>;
};

