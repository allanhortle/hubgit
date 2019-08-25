// @flow
import type {Node} from 'react';
import React, {useState} from 'react';
import {Route, Redirect, Switch} from 'react-router';
import PullrequestView from '../pullrequest/PullrequestView';
import RepoView from '../repo/RepoView';

export default function CoreStructure(props) {
    const {history} = props;
    const [repo, setRepo] = useState(props.program.repo);
    const navigate = (path) => history.push(`/${repo}/${path}`);
    return <box>
        <box top={1} left={0} width="100%" height="100%-1">
            <Switch>
                <Route exact path="/:owner/:repo/issues" render={() => 'issues'} />
                <Route exact path="/:owner/:repo/releases" render={() => 'releases'} />
                <Route path="/:owner/:repo/pulls" component={PullrequestView} />
                <Route path="/:owner/:repo" component={RepoView} />
                <Redirect to={`/${repo}/pulls`} />
            </Switch>
        </box>
        <listbar
            autoCommandKeys
            mouse={true}
            keys={true}
            left={0}
            height={1}
            top={0}
            style={{
                bg: 'white',
                fg: 'black',
                item: {
                    fg: 'black',
                    bg: 'white'
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
        <element top={0} right={1} width={repo.length} height={1} style={{bg: 'white', fg: 'black'}} content={repo} />
    </box>;
}
