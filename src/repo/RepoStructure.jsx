// @flow
import type {Node} from 'react';
import React from 'react';
import Structure from 'react-goose/lib/util/Layout';
import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import {Route} from 'react-router';
import blessed from 'neo-blessed';
import CoreScreen from '../core/CoreScreen';

var prompt = blessed.prompt({
  parent: CoreScreen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: 'shrink',
  keys: true,
  vi: true,
  mouse: true,
  tags: true,
  border: {
      type: 'line',
  },
  hidden: true
});

export default class RepoStructure extends Structure<{}>{
    static elements = ['list', 'readme'];
    static layout = (props: *) => {
        return <box>
            <box width={"30%"} border={{type: 'line'}} >{props.list()}</box>
            <box width="70%" left={"30%"}>{props.readme()}</box>
        </box>;
    }
    list = (): Node => {
        const {repoListMessage} = this.props;
        const {requestState} = repoListMessage;
        const list = repoListMessage.get('repoList') || [];
        return requestState
            .fetchingMap(() => 'Loading...')
            .refetchingMap(() => 'Loading...')
            .errorMap(() => 'Error!')
            .successMap(() => <list
                mouse={true}
                keys={true}
                vi={true}
                onSelect={(item) => this.props.history.push(`/repo/${item.content}`)}
                search={cb => prompt.input('Search:', '', (err, value) => {
                    if(err) return;
                    return cb(null, value);
                })}
                style={{
                    selected: {
                        fg: 'green'
                    },
                    scrollbar: {
                        bg: 'blue'
                    }
                }}
                items={pipeWith(
                    list,
                    sortBy(pipe(get('full_name'), _ => _.toLowerCase())),
                    map(get('full_name'))
                )}
            />)
            .value();

    }
    readme = (): Node => {
        const list = this.props.repoListMessage.get('repoList') || [];
        log(this.props.location.pathname);
        return <Route
            path="/repo/:org/:repo"
            render={(props) => {
                return <box border={{type: 'line'}}>{props.match.params.org} :: {props.match.params.repo}</box>;
            }}
        />;
    }
}
