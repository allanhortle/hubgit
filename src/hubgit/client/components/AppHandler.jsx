import React from 'react';
import {Link} from 'react-router';
var ClassName = React.createClass({
    render: function() {
        return <element>
            <listbar items={{rad: 'cool', winnder: 'sick'}}></listbar>
            {this.props.children}
        </element>;
    }
});

module.exports = ClassName;
