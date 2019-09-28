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
import {blue, red, green, magenta, grey, yellow} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';

function Item(item, left = 0) {
    const {author, createdAt, state, body, comments, __typename, id, diffHunk, outdated, path} = item;
    const leftPadding = ' '.repeat(left);
    switch (__typename) {
        case 'PullRequestReview': {
            let color = 'blue';
            if(state === 'APPROVED') color = 'blue';
            if(state === 'CHANGES_REQUESTED') color = 'red';

            return [
                leftPadding + `{${color}-fg}${author.login} ${state} at ${createdAt}{/}`,
                leftPadding + body,
                ...pipeWith(
                    comments.edges,
                    map(get('node')),
                    flatMap(item => Item(item, 0))
                )
            ];
        }

        case 'IssueComment':
            return [
                leftPadding + `${yellow(author.login)} ${grey(createdAt)}`,
                leftPadding + body
            ]

        case 'PullRequestReviewComment': {
            let outdatedText = outdated ? grey('OUTDATED') : ''
            let code = diffHunk.split('\n').slice(1).slice(-3).map(line => {
                if(line[0] === '+') return green(line);
                if(line[0] === '-') return red(line);
                return line;
            }).join('\n' + leftPadding);
            return [
                leftPadding + `${yellow(author.login)} ${grey(createdAt)} ${outdatedText} ${grey(path)}`,
                leftPadding + body,
                //leftPadding + code,
                ' '
            ]
        }

        default:
            return [];
    }
}

export default function TimelineItemArray(timelineItems) {
    return pipeWith(
        timelineItems.edges,
        map(get('node')),
        sortBy(get('createdAt')),
        flatMap((item, index) => Item(item)),
        _ => log(_) || _
    );
}
