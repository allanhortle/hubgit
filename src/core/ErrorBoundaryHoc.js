// @flow
import type {ComponentType} from 'react';
import React from 'react';

const style = {
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: 'red'
        }
    }
};
type Props = {};
type State = {
    hasError: boolean,
    error: ?{stack: string}
};
export default () => (Component: ComponentType<{}>) => class ErrorBoundaryHoc extends React.Component<Props, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error: {}) {
        return {error};
    }
    render() {
        const {error} = this.state;
        if(error) {
            return <box {...style} tags={true} label="{red-fg} Error! {/red-fg}">{error.stack}</box>;
        }
        return <Component {...this.props} />;
    }
};
