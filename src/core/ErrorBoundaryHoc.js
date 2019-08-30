// @flow
import React from 'react';
import {MemoryRouter} from 'react-router';
import {Route} from 'react-router';


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

export default () => (Component: *) => class ErrorBoundary extends React.Component<*, *> {
    constructor(props: {}) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error: *) {
        return {error};
    }
    render() {
        const {error} = this.state;
        if(error) {
            return <box class={style} tags={true} label="{red-fg} Error! {/red-fg}">{error.stack}</box>;
        }
        return <Component {...this.props} />;
    }
}
