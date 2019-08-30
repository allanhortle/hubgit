import React from 'react';
import {LoadingBoundary} from 'react-enty';

export default function(props) {
    const {message, children} = props;
    return <LoadingBoundary
        fallbackOnRefetch={true}
        fallback={() => "Loading..."}
        error={() => <box
            border={{
                type: 'line',
            }}
            class={{
                width: '100%',
                height: '100%',
                style: {
                    border: {
                        fg: 'red'
                    }
                }
            }}
            tags={true}
            label="{red-fg} Error {/red-fg}"
            children={message.requestError.stack}
        />}
        message={message}
        children={children}
    />;
}
