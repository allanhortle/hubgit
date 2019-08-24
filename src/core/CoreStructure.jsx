// @flow
import type {Node} from 'react';
import React, {useState} from 'react';
import {Route, Redirect, Switch} from 'react-router';
import PullrequestView from '../pullrequest/PullrequestView';
import RepoView from '../repo/RepoView';

export default function CoreStructure(props) {
    const {history} = props;
    const [repo, setRepo] = useState('blueflag/enty');
    const navigate = (path) => history.push(`/${repo}/${path}`);
    return <box>
        <listbar
            autoCommandKeys
            mouse={true}
            keys={true}
            left={0}
            height={1}
            top={0}
            style={{
                bg: '#ccc',
                fg: 'black',
                item: {
                    fg: 'black',
                    bg: '#ccc'
                },
                selected: {
                    bg: 'green',
                    fg: 'black'
                }
            }}
            items={{
                ['repo']: () => navigate(''),
                ['pulls']: () => navigate('pulls'),
                ['issues']: () => navigate('issues'),
                ['releases']: () => navigate('releases')
            }}
        />
        <box top={2} left={1} width="100%-2" height="100%-3">
            <Switch>
                <Route exact path="/:org/:repo/issues" render={() => 'issues'} />
                <Route exact path="/:org/:repo/releases" render={() => 'releases'} />
                <Route exact path="/:org/:repo/pulls" component={PullrequestView} />
                <Route path="/:org/:repo" component={RepoView} />
                <Redirect to={`/${repo}`} />
            </Switch>
        </box>
        <element top={0} right={1} width={repo.length} height={1} style={{bg: '#ccc', fg: 'black'}} content={repo} />
    </box>;
}
