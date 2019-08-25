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
import {blue, red} from '../util/tag';


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
                <box
                    mouse
                    scrollable
                    width="60%"
                    border={{type: 'line', left: false, right: true, top: false, bottom: false}}
                >{data.repository.object.text}</box>
                <box
                    top={0}
                    left="60%+1"
                >
                    <box content={description} top={1}/>
                    <box tags content={blue(homepageUrl)} top={2}/>
                    <listtable width="100%" top={4} tags align="left" rows={[
                        ['pull requests:', `${pullRequests.totalCount}`],
                        ['issues:', `${issues.totalCount}`],
                        ['stars:', `${stargazers.totalCount}`],
                        ['watchers:', `${watchers.totalCount}`],
                        ['url:', blue(url)],
                        ['sshUrl:', blue(sshUrl)],
                    ].concat(
                        isArchived ? ['state:', red('ARCHIVED')] : []
                    )}/>
                </box>
            </>
        }}
    </LoadingBoundary>;
}
