// @flow
import type {Node} from 'react';
import React from 'react';
import {useCoreContext} from './CoreContext';

export default function CoreStructure() {
    const {repo, stack} = useCoreContext();

    return stack.toArray<Node>((item, index) => {
        const View = item.component;
        const childProps = {repo, ...item.props};
        const label = ` ${childProps.title || '?'} `;
        const height = '100%-' + index;
        const boxProps = {
            border: {type: 'line'},
            height,
            key: index,
            label,
            tags: true,
            top: index
        };
        if(index === stack.length - 1) {
            return <box {...boxProps}>
                <View {...childProps} />
            </box>;
        }
        return <box {...boxProps} />;
    });
}


