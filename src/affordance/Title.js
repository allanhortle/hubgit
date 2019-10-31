// @flow
import React from 'react';

type Props = {
    margin: {},
    children: string,
    top?: number
};

export default ({margin = {}, children, top}: Props) => {
    return <box padding={margin}><box
        tags
        top={top}
        style={{
            fg: 'black',
            bg: 'white'
        }}
        height={1}
        content={`{center}${children}{/center}`}
    /></box>;
};

