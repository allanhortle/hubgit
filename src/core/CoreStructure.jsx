// @flow
import type {Node} from 'react';
import React, {useState} from 'react';
import {Route, Redirect, Switch} from 'react-router';
import PullrequestView from '../pullrequest/PullrequestView';
import IssuesView from '../repo/IssuesView';
import RepoView from '../repo/RepoView';

export default function CoreStructure(props) {
    const {history} = props;
    const [repo, setRepo] = useState(props.program.repo);
    const navigate = (path) => history.push(`/${repo}/${path}`);
    return <box>
        <box top={1} left={0} width="100%" height="100%-1">
            <Switch>
                <Route exact path="/:owner/:repo/issues" component={IssuesView} />
                <Route exact path="/:owner/:repo/releases" render={() => 'releases'} />
                <Route exact path="/:owner/:repo/pulls" component={PullrequestView} />
                <Route exact path="/:owner/:repo/readme" component={RepoView} />
                <Redirect to={`/${repo}/issues`} />
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
                    bg: 'yellow',
                    fg: 'black'
                }
            }}
            items={{
                ['pulls']: () => navigate('pulls'),
                ['issues']: () => navigate('issues'),
                ['readme']: () => navigate('readme'),
                ['releases']: () => navigate('releases')
            }}
        />
        <element top={0} right={1} width={repo.length} height={1} style={{bg: 'white', fg: 'black'}} content={repo} />
    </box>;
}
