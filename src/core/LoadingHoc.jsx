// @flow
import React from 'react';

type Config = {
    name: string
};

export default (config: Config) => (Component: *) => (props: *) => {
    return props[config.name]
        .requestState
        .fetchingMap(() => <box>Loading...</box>)
        .refetchingMap(() => <box>Loading...</box>)
        .successMap(() => <Component {...props} />)
        .errorMap(() => <box>Error!</box>)
        .value();
};

