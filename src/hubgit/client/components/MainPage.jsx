import React from 'react';
import {connect} from 'react-redux';
import {requestIssues} from 'hubgit/client/actions';

var MainPage = React.createClass({
    componentWillMount() {
        this.props.dispatch(requestIssues());
    },
    render() {
        return (
            <element>
                <box>{this.renderIssues()}</box>

            </element>
        );
    },
    renderIssues() {
        if(this.props.issues) {
            return <list items={this.props.issues.map(ii => ii.get('title')).toJS()}/>
        }
    }

});

export default connect(state => ({
    issues: state.issues.get('current')
}))(MainPage);

