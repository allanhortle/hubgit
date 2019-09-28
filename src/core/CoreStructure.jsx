// @flow
import type {Node} from 'react';
import React, {useState, useRef, useEffect} from 'react';
import {useCoreContext} from './CoreContext';
import {Route, Redirect, Switch} from 'react-router';
import PullrequestView from '../pullrequest/PullrequestView';
import IssuesView from '../repo/IssuesView';
import RepoView from '../repo/RepoView';
import ReleasesView from '../repo/ReleasesView';
import BlockLayout from '../affordance/BlockLayout';

function content(view) {
    if(view === 'readme') return RepoView;
    if(view === 'releases') return ReleasesView;
    if(view === 'issues') return IssuesView;
    return PullrequestView;
}

export default function CoreStructure(props) {
    const nav = useRef();
    const {view, viewIndex, repo, setContext} = useCoreContext();
    const items = [
        'pulls',
        'issues',
        'readme',
        'releases',
    ];
    const Content = content(view);
    const {full_name} = repo;
    const currentIndex = items.findIndex(ii => ii === view);

    return <box>
        <box top={1} left={0} width="100%" height="100%-1">
            <Content repo={repo} view={view} viewIndex={viewIndex} />
        </box>
        <listbar
            ref={nav}
            autoCommandKeys
            keys={true}
            mouse={true}
            height={1}
            selected={2}
            onSelectItem={(_, index) => {
                // @hack: work around for blessed reselecting the first item
                // on mouse events
                if(index !== currentIndex && nav.current) {
                    nav.current.select(currentIndex);
                }
            }}
            items={items.map((text, index) => ({
                prefix: index + 1,
                text,
                callback: () => setContext({view: text})
            }))}
            style={{
                bg: 'white',
                fg: 'black',
                item: {
                    fg: 'black',
                    bg: 'white'
                },
                selected: {
                    fg: 'black',
                    bg: 'yellow'
                }
            }}
        />
        <element top={0} right={1} width={full_name.length} height={1} style={{bg: 'white', fg: 'black'}} content={full_name} />
    </box>;
}


