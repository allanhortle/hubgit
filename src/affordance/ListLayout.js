// @flow
import type {ComponentType} from 'react';
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import {blue, red, green, magenta, grey, yellow} from '../util/tag';

type Props = {
    request: Function,
    payload: Object,
    id: Function,
    list: Function,
    listHead: string[],
    renderListItem: Function,
    itemView: ComponentType<any>,
    onSelect: Function
};

export default (props: Props) => {
    const {
        request,
        payload,
        id,
        list,
        listHead,
        renderListItem,
        itemView: ItemView,
        onSelect
    } = props;

    const [item, setItem] = useState();
    const message = request();
    const safeList = (data) => list(data) || {edges: []};

    useEffect(() => {
        message
            .onRequest(payload)
            .then(data => {
                const safe = safeList(data);
                if(safe.edges.length) {
                    setItem(id(safeList(data).edges[0].node))
                }
            });
    }, []);

    return <LoadingBoundary message={message}>
        {(data, meta) => {
            const plainList = safeList(data).edges.map(ii => ii.node);
            const currentItem = plainList.find(ii => id(ii) === item);
            return <>
                <box
                    top={0}
                    width="40%"
                    border={{type: 'line', left: false, right: true, top: false, bottom: false}}
                >
                <listtable
                    align="left"
                    mouse={true}
                    keys={true}
                    focused={true}
                    vi={true}
                    tags={true}
                    pad={0}
                    style={{
                        selected: {
                            fg: 'black',
                            bg: 'yellow'
                        },
                        scrollbar: {
                            bg: 'blue'
                        }
                    }}
                    rows={pipeWith(
                        plainList,
                        map(renderListItem),
                        _ => [listHead].concat(_)
                    )}
                    onSelect={data => setItem(onSelect(data.content, data))}
                />
                </box>
                <box left="40%">
                    {currentItem && <ItemView data={currentItem} />}
                </box>
             </>;
        }}
    </LoadingBoundary>;
}

