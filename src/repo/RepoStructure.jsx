// @flow
import type {Node} from 'react';
import React, {useEffect, useState} from 'react';
import {Switch, Route} from 'react-router';
import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import blessed from 'neo-blessed';
import CoreScreen from '../core/CoreScreen';
import Api from '../core/EntityApi';
import LoadingBoundary from '../core/LoadingBoundary';


export default function RepoStructure(props) {
    const readme = Api.repo.readme.useRequest();
    useEffect(() => {
        readme.onRequest(props.match.params)
    }, []);

    return <LoadingBoundary message={readme}>
        {(data, meta) => {
            const decoded = new Buffer(data.repo.readme.content || '', 'base64');
            return <box mouse scrollable>{decoded.toString('ascii')}</box>;
        }}
    </LoadingBoundary>;
}
