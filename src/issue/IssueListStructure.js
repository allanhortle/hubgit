// @flow
import type {ListTableRow} from '../affordance/ListTable';

import React from 'react';
import Issue from './data/Issue';
import ListTable from '../affordance/ListTable';

type Props = {
    issueList: Array<Issue>,
    onSelect: (ListTableRow, number) => void
};
export default (props: Props) => {
    const {issueList, onSelect} = props;
    return <box>
        <ListTable
            onSelect={onSelect}
            head={['#', 'State', 'Titles', 'Labels', 'Last Updated']}
            rows={issueList.map(ii => [
                {value: `${ii.number}`},
                {tag: 'state', value: ii.state},
                {value: ii.title, ellipsis: 50},
                {tag: 'label', value: ii.labels.nodes},
                {tag: 'date', value: ii.updatedAt}
            ])}
        />
    </box>;
};

