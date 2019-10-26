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
import {blue, red, green, magenta, grey, yellow, right} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';

function Item(item, left = 0) {
    const {state, body, comments, __typename, id, diffHunk, outdated, path} = item;
    const leftPadding = ' '.repeat(left);
    const author = pipeWith(item, getIn(['author', 'login']), yellow);
    const actor = pipeWith(item, getIn(['actor', 'login']), yellow);
    const createdAt = pipeWith(item, getIn(['createdAt']), blue);

    const date = (path) => pipeWith(item, getIn(path), blue);
    const greenPath = (path) => pipeWith(item, getIn(path), green);
    const name = (path) => pipeWith(item, getIn(path), yellow);
    const text = (pp) => pipeWith(item, getIn(pp));
    switch (__typename) {
        case 'PullRequestCommit': {
            return [[
                date(['commit', 'authoredDate']),
                name(['commit', 'author', 'user', 'login']),
                grey('*'),
                grey(item.commit.message)
            ]];
        }

        case 'HeadRefForcePushedEvent': {
            return [[
                createdAt,
                name(['actor', 'login']),
                red('⤒'),
                `Force-pushed ${item.ref} from ${item.beforeCommit.abbreviatedOid} to ${item.afterCommit.abbreviatedOid}`
            ]];
        }

        case 'PullRequestReview': {
            let color = blue;
            let icon = '~';
            let text = 'left a review comment';
            if(state === 'APPROVED') {
                color = green;
                icon = '✔';
            }
            if(state === 'CHANGES_REQUESTED') {
                color = red;
                icon = '✘';
            }

            return [[
                createdAt,
                author,
                color(icon),
                color(state + ' ' + item.comments.totalCount)

            ]];
            //.concat(pipeWith(
                //comments.edges,
                //map(get('node')),
                //flatMap(item => Item(item, 0))
            //));
        }

        case 'IssueComment':
            return [[
                createdAt,
                author,
                '?',
                body
            ]];

        case 'MergedEvent': {
            return [[
                createdAt,
                actor,
                magenta('<'),
                `merged ${item.commit.abbreviatedOid} into ${item.mergeRefName}`
            ]];
        }
        case 'ClosedEvent': {
            return [[
                createdAt,
                actor,
                red('×'),
                `closed the pullRequest`
            ]];
        }
        case 'HeadRefDeletedEvent': {
            return [[
                createdAt,
                actor,
                red('×'),
                `deleted ${item.headRefName}`
            ]];
        }

        //case 'ReferencedEvent': {
            //return [[
                //createdAt,
                //actor,
                //'*',
                //item.commit.message
            //]];
        //}

        case 'CrossReferencedEvent': {
            return [[
                createdAt,
                actor,
                '~',
                `Referenced this in: ${item.source.title} (${item.source.url})`
            ]];
        }

        case 'RenamedTitleEvent': {
            return [[
                createdAt,
                actor,
                '~',
                `changed the title from ${item.previousTitle} to ${item.currentTitle}`
            ]];
        }

        case 'ReviewRequestedEvent': {
            return [[
                createdAt,
                actor,
                '~',
                `Requested a review from ${item.requestedReviewer.login}`
            ]];
        }

        case 'LabeledEvent': {
            return [[
                createdAt,
                actor,
                '#',
                `Added label: {#${item.label.color}-bg}{black-fg}${item.label.name}{/}`
            ]];
        }

        case 'PullRequestReviewComment': {
            let outdatedText = outdated ? grey('OUTDATED') : ''
            let code = diffHunk.split('\n').slice(1).slice(-3).map(line => {
                if(line[0] === '+') return green(line);
                if(line[0] === '-') return red(line);
                return line;
            }).join('\n' + leftPadding);
            return [[
                createdAt,
                author,
                '?',
                body
            ]];
        }

        default:
            return [[
                createdAt,
                author,
                '',
                grey(__typename)
            ]];
    }
}

export default function TimelineItemArray(timelineItems) {
    return pipeWith(
        timelineItems.edges,
        map(get('node')),
        sortBy(get('createdAt')),
        flatMap((item, index) => {
            return [
                'MentionedEvent',
                'SubscribedEvent',
                'ReferencedEvent'
            ].includes(item.__typename) ? [] : Item(item)
        }),
        _ => log(_) || _
    );
}
