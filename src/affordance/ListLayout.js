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
    itemRequest: Function,
    listRequest: Function,
    repo: {owner: string, name: string},
    number: number,
    id: Function,
    list: Function,
    listHead: string[],
    renderListItem: Function,
    itemView: ComponentType<any>,
    initialValue: () => boolean,
    onSelect: Function
};

export default (props: Props) => {
    const {
        itemRequest,
        listRequest,
        repo,
        id,
        list,
        item,
        listHead,
        initialValue = () => true,
        renderListItem,
        itemView: ItemView,
        onSelect
    } = props;

    const [index, setIndex] = useState(null);
    const [number, setNumber] = useState(props.number);
    const listMessage = listRequest();


    useEffect(() => {
        listMessage.onRequest(repo);
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
                    const numberIndex = plainList.findIndex(ii => id(ii) == number);

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
                        onSelectItem={(_, nextIndex) => log('setIndex', index, numberIndex) || setIndex(!index ? numberIndex+1 : nextIndex)}
                        onSelect={(_, index) => setNumber(id(plainList[index -1]))}
                    />;
                }}
            </LoadingBoundary>
        </box>
        <box top={0} left="40%+1" height="100%" width="60%-1">
            {number && <Item
                number={number}
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
    const {number, repo: {owner, name}, ItemView, itemRequest, item} = props;
    const message = itemRequest();

    useEffect(() => {
        message.onRequest({number: parseInt(number), owner, name});
    }, [number]);

    return <LoadingBoundary message={message}>
        {(data) => <ItemView data={item(data)} />}
    </LoadingBoundary>;
}
