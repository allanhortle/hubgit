// @flow
import type {Node} from 'react';
import React, {useState, useRef, useEffect, useMemo} from 'react';
import {useCoreContext} from './CoreContext';
import {Route, Redirect, Switch} from 'react-router';
import BlockLayout from '../affordance/BlockLayout';
import screen from './CoreScreen';


export default function CoreStructure(props) {
    const nav = useRef();
    const {view, viewIndex, repo, setContext, stack} = useCoreContext();
    const {full_name} = repo;


    return stack._data.map((item, index) => {
        const View = item.component;
        const childProps = {repo, ...item.props};
        const label = ` ${(View.label && View.label(childProps)) || '?'} `;
        if(index === stack.length - 1) {
            return <box key={index} label={label} top={index} height={`100%-${index}`} border={{type: 'line' }}>
                <View {...childProps} />
            </box>;
        }
        return <box key={index} label={label} top={index} height={1} border={{type: 'line' }}/>;
    });

}


