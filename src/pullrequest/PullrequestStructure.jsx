// @flow
import type {Node} from 'react';
import React from 'react';
import Structure from 'react-goose/lib/util/Layout';

export default class PullrequestStructure extends Structure<{}>{
    static elements = ['list', 'readme'];
    static layout = (props: *) => {
        return <box>
            {props.list()}
            {props.readme()}
        </box>;
    }
    list = (): Node => {
        return <box>
            list
        </box>;
    }
    readme = (): Node => {
        return <box>
            Pullrequests
        </box>;
    }
}
