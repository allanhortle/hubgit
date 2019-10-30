import React from 'react';
import {LoadingBoundary} from 'react-enty';

export default function(props) {
    const {message, children} = props;
    return <LoadingBoundary
        fallback={() => <box>Loading...</box>}
        error={() => <box
            height="100%"
            width="100%"
            border={{
                type: 'line',
            }}
            class={{
                style: {
                    border: {
                        fg: 'red'
                    }
                }
            }}
            tags={true}
            label="{red-fg} Error {/red-fg}"
            content={message.requestError.stack.toString()}
        />}
        message={message}
        children={children}
    />;
}
