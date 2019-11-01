// @flow
import type {Message} from 'react-enty';
import React from 'react';
import {LoadingBoundary} from 'react-enty';
import getIn from 'unmutable/getIn';

type Props = {
    message: Message<{}>,
    children: mixed
};
export default function(props: Props) {
    const {message, children} = props;
    return <LoadingBoundary
        fallback={() => <box>Loading...</box>}
        error={() => <box
            height="100%"
            width="100%"
            border={{type: 'line'}}
            style={{border: {fg: 'red'}}}
            tags={true}
            label="{red-fg} Error {/red-fg}"
            content={getIn(['requestError', 'stack'])(message)}
        />}
        message={message}
        children={children}
    />;
}
