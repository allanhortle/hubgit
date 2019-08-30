// @flow
import type {Node} from 'react';
import React, {useEffect, useState} from 'react';
import {Switch, Route} from 'react-router';
import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import CoreScreen from '../core/CoreScreen';
import Api from '../core/EntityApi';
import LoadingBoundary from '../core/LoadingBoundary';
import {blue, red} from '../util/tag';
import {Markdown} from 'react-blessed-contrib';


export default function RepoStructure(props) {
    const readme = Api.repo.readme.useRequest();
    useEffect(() => {
        readme.onRequest(props.match.params)
    }, []);

    return <LoadingBoundary message={readme}>
        {(data) => {
            log(data);
            const {homepageUrl, pullRequests, issues, stargazers, watchers, url, sshUrl, description, isArchived} = data.repository;;
            return <>
                <Markdown mouse scrollable width={70} left="center">
                    {data.repository.object.text}
                </Markdown>
            </>
        }}
    </LoadingBoundary>;
}
