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
import keyBy from 'unmutable/keyBy';
import {blue, red, green, magenta, grey, yellow} from '../util/tag';
import BlockLayout from '../affordance/BlockLayout';

type Props = {
    id: Function,
    item: Function,
    itemId: number|string,
    itemPayload: Function,
    itemRequest: Function,
    itemView: ComponentType<any>,
    list: Function,
    listHead: string[],
    listPayload: mixed,
    listRequest: Function,
    renderListItem: Function
};

export default (props: Props) => {
    const {
        item,
        itemRequest,
        itemPayload,
        itemView: ItemView,
        list,
        listPayload,
        listRequest,
        repo,
        id,
        listHead,
        renderListItem,
        onSelect
    } = props;

    const [index, setIndex] = useState(null);
    const [itemId, setItemId] = useState(props.itemId);
    const listMessage = listRequest();


    useEffect(() => {
        listMessage.onRequest(listPayload);
    }, []);

    return <box>
        <box
            top={0}
            width="40%"
            height="100%"
        >
            <LoadingBoundary message={listMessage}>
                {(data) => {
                    const plainList = list(data).edges.map(ii => ii.node);
                    const itemIdIndex = plainList.findIndex(ii => id(ii) == itemId);

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
                        selected={index}
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
                        onSelectItem={(_, nextIndex) => setIndex(!index ? itemIdIndex+1 : nextIndex)}
                        onSelect={(_, index) => setItemId(id(plainList[index -1]))}
                    />;
                }}
            </LoadingBoundary>
        </box>
        <box top={0} left="40%+1" height="100%" width="60%-1">
            {itemId && <Item
                itemId={itemId}
                itemPayload={itemPayload}
                repo={repo}
                itemRequest={itemRequest}
                ItemView={ItemView}
                item={item}
            />}
        </box>
        <line height="100%" orientation="vertical" left="40%" />
    </box>;
}

function Item(props) {
    const {itemId, itemPayload, ItemView, itemRequest, item} = props;
    const message = itemRequest();

    useEffect(() => {
        message.onRequest(itemPayload(itemId));
    }, [itemId]);

    return <LoadingBoundary message={message}>
        {(data) => <ItemView data={item(data)} />}
    </LoadingBoundary>;
}
