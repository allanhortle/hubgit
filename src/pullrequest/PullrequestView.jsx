// @flow
import React from 'react';
import PullrequestStructure from './PullrequestStructure';
import composeWith from 'unmutable/lib/util/composeWith';

export default composeWith(
    (props) => {
        log(props);
        return <PullrequestStructure />;
    }
);

