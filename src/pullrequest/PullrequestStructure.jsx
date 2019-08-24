// @flow
import type {Node} from 'react';
import React from 'react';

type Props = {
};

export default class PullrequestStructure extends React.Component<Props> {
    render() {
        return <box>
            {this.list()}
            {this.readme()}
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
