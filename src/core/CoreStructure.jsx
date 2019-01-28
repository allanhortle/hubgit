// @flow
import type {Node} from 'react';
import React from 'react';
import Structure from 'react-goose/lib/util/Layout';
import {Switch} from 'react-router';
import {Route} from 'react-router';

export default class CoreStructure extends Structure<{}>{
    static elements = ['navigation', 'main'];
    static layout = (props: *) => {
        return <box>
            {props.navigation()}
            <box top={1}>{props.main()}</box>
        </box>;
    }
    navigation = (): Node => {
        return <listbar
            autoCommandKeys
            mouse={true}
            keys={true}
            left={0}
            height={1}
            style={{
                //bg: 'blue',
                selected: {
                    fg: 'blue'
                },
                item: {
                    //fg: 'black',
                    //bg: 'blue'
                }
            }}
            items={{
                ['Repositories']: () => this.props.history.push('/repo'),
                ['Pull Requests']: () => this.props.history.push('/pullrequest')
            }}
        />;
    }
    main = (): Node => {
        return <Switch>
            <Route path="/pullrequest" component={this.props.pullrequestView} />
            <Route component={this.props.repoView}/>
        </Switch>;
    }
}
