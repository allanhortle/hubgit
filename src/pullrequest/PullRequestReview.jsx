// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/get';
import getIn from 'unmutable/getIn';
import map from 'unmutable/map';
import sortBy from 'unmutable/sortBy';
import pipeWith from 'unmutable/pipeWith';
import pipe from 'unmutable/pipe';
import toArray from 'unmutable/toArray';
import groupBy from 'unmutable/groupBy';
import {blue, red, green, magenta, grey, yellow, black, title, split, left, right, center, date} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';
import TimelineItemArray from '../affordance/TimelineItemArray';
import PullRequest from './data/PullRequest';


export default function PullRequestReview(props) {
    const {id} = props;
    const message = Api.repo.pullRequestReview.useRequest();

    useEffect(() => {
        message.onRequest({id});
    }, []);


    return <LoadingBoundary message={message}>
        {(data) => {
            const pr = new PullRequest(data.pullRequestReview.pullRequest);


            return <box tags keys mouse vi focused
            scrollable
            style={{
                scrollbar: {bg: 'white'}
            }}
            scrollbar={{ch: " "}}
            content={pipeWith(
                pr.pullRequestReviewThreadMap[id],
                groupBy(get('path')),
                map((comments, path) => {
                    const {outdated, diffHunk, originalPosition} = comments[0];
                    let code = comments[0].diffHunk
                        .replace(/(@@.*?@@)\s/, `${magenta('$1')}\n`)
                        .split('\n')
                        .slice(1)
                        .slice(-8)
                        .map((line, index) => {
                            if(index === originalPosition) return line;
                            if(line[0] === '+') return green(line);
                            if(line[0] === '-') return red(line);
                            return line;
                        })
                        .join('\n');

                    let outdatedText = outdated ? red(' [OUTDATED]') : '';

                    return [
                        grey(`//`),
                        grey(`// ${path}`) + outdatedText,
                        grey(`//`),
                        code,
                        ''
                    ]
                    .concat(comments.map(cc => [
                        `${date(cc.createdAt)} ${yellow(cc.author.login)}`,
                        cc.body,
                        ''
                    ].join('\n')))
                    .join('\n');
                }),
                toArray(),
                _ => _.join('\n\n')
            )} />;
        }}
    </LoadingBoundary>;
}

PullRequestReview.label = ({repo, viewIndex, title}) => title || 'Pull Request Reivew';
