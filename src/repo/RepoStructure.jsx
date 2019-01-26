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

export default class RepoStructure extends Structure<{}>{
    static elements = ['list', 'readme'];
    static layout = (props: *) => {
        return <box>
            <box width={"30%"}>{props.list()}</box>
            <box width="70%" left={"30%"}>{props.readme()}</box>
        </box>;
    }
    list = (): Node => {
        const list = this.props.repoListMessage.get('repoList') || [];
        return <list
            mouse={true}
            keys={true}
            vi={true}
            onSelect={(item) => this.props.history.push(`/repo/${item.content}`)}
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
                sortBy(pipe(get('name'), _ => _.toLowerCase())),
                map(get('name'))
            )}
        />
    }
    readme = (): Node => {
        const list = this.props.repoListMessage.get('repoList') || [];
        return <Route
            path="/repo/:id?"
            render={(props) => {
                return <box>{props.match.params.id}</box>;
            }}
        />;
    }
}
