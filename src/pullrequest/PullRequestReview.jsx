// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import {blue, red, green, magenta, grey, yellow, black, title, split, left, right, center, whiteBg} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';
import TimelineItemArray from '../affordance/TimelineItemArray';


export default function PullRequestReview(props) {
    const {id} = props;
    const message = Api.repo.pullRequestReview.useRequest();

    useEffect(() => {
        message.onRequest({id});
    }, []);


    return <LoadingBoundary message={message}>
        {(data) => {
            return <box tags keys mouse vi focused scrollable content={data.pullRequestReview.comments.edges.map(({node}) => {
                const {path, diffHunk, body, outdated, author} = node;
                let outdatedText = outdated ? grey('[OUTDATED]') : '';
                let code = diffHunk
                    .replace(/(@@.*?@@)\s/, `${magenta('$1')}\n`)
                    .split('\n')
                    .slice(1)
                    .slice(-5)
                    .map((line) => {
                        const indent = '  ';
                        if(line[0] === '+') return green(indent + line);
                        if(line[0] === '-') return red(indent + line);
                        return indent + line;
                    })
                .join('\n');
                return [
                    yellow(author.login) + ' ' + outdatedText,
                    body,
                    grey(path),
                    '',
                    code,
                    '',
                ].join('\n')

            }).join('\n\n')}/ >;
        }}
    </LoadingBoundary>;
}

PullRequestReview.label = ({repo, viewIndex, title}) => title || 'Pull Request Reivew';

