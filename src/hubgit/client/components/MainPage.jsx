import React from 'react';
import {connect} from 'react-redux';
import {requestIssues} from 'hubgit/client/actions';

function Issue(props) {
    return <element>issue</element>
}
var MainPage = React.createClass({
    componentWillMount() {
        this.props.dispatch(requestIssues());
    },
    render() {
        var style = {
            width: '50%',
            height: '100%',
            border: {
                type: 'line'
            },
            style: {border: {fg: 'blue'}},
            dockBorders: true
        }
        return (
            <element>
                <box {...style}>{this.renderIssues()}</box>
                <box {...style} left="50%">
                    <Issue />
                </box>
            </element>
        );
    },
    renderIssues() {
        if(this.props.issues) {
            const data = this.props.issues.map(ii => {
                var {title, assignee} = ii.toJS();
                return [title, assignee.login];
            }).toJS();
            var style = {
                cell: {
                    align: 'left'
                },
                item: {
                    align: 'left'
                }
            }
            return <listtable style={style} data={data} align="left" width="shrink"/>
        }
    }

});

export default connect(state => ({
    issues: state.issues.get('current')
}))(MainPage);

