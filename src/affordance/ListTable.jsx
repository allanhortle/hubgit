// @flow
import React from 'react';
import map from 'unmutable/map';
import * as t from '../util/tag';

export type ListTableColumn = string|{tag: string, value: mixed};
export type ListTableRow = Array<ListTableColumn>;

type Props = {
    selected?: number,
    rows: Array<ListTableRow>,
    head: string[],
    onSelect?: (ListTableRow, number) => void,
    onSelectItem?: (ListTableRow, number) => void,
    top?: number
};
export default function ListTable(props: Props) {
    const {
        selected = 0,
        rows = [],
        head = [],
        top,
        onSelect,
        onSelectItem
    } = props;

    const selectCallback = (fn) => (_, index) => fn && fn(rows[index - 1], index);

    return <listtable
        align="left"
        mouse={true}
        keys={true}
        focused={true}
        vi={true}
        tags={true}
        scrollable={true}
        pad={0}
        top={top}
        width="100%"
        height={rows.length + 1}
        selected={selected}
        invertSelected={true}
        style={{
            fg: 'white',
            selected: {
                fg: 'black',
                bg: 'yellow'
            }
        }}
        rows={[head.map(t.grey)].concat(rows.map(map(cc => {
            let tag = t[cc.tag];
            let value = cc.value;
            let clip = cc.ellipsis ? x => t.ellipsis(x, cc.ellipsis) : x => x;

            if(typeof cc === 'string') {
                return cc;
            }
            else if (value.length != null && typeof value !== 'string') {
                return clip(value.map(tag).join(', '));
            }
            else {
                return clip(tag(value));
            }
        })))}
        onSelect={selectCallback(onSelect)}
        onSelectItem={selectCallback(onSelectItem)}
    />;
}
