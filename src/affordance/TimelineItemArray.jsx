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
import {blue, red, green, magenta, grey, yellow, right, date, cyan} from '../util/tag';
import {mapNodes} from '../util/edgeList';
import ListLayout from '../affordance/ListLayout';
import BlockLayout from '../affordance/BlockLayout';
import Title from '../affordance/Title';
import flatMap from 'unmutable/flatMap';
import reverse from 'unmutable/reverse';

type RowConfig = {
    time?: Array<string>,
    actor?: Array<string>,
    icon?: string,
    message?: string,
    color?: (?string) => string
};

function Item(item, left = 0) {
    const {state, body, comments, __typename, id, diffHunk, outdated, path} = item;
    const leftPadding = ' '.repeat(left);
    const author = pipeWith(item, getIn(['author', 'login']), yellow);
    const actor = pipeWith(item, getIn(['actor', 'login']), yellow);
    const createdAt = pipeWith(item, getIn(['createdAt']), blue);

    const greenPath = (path) => pipeWith(item, getIn(path), green);
    const name = (path) => pipeWith(item, getIn(path), yellow);
    const text = (pp) => pipeWith(item, getIn(pp));

    const row = ({
        time = ['createdAt'],
        actor = ['actor', 'login'],
        icon,
        message,
        color = x => x
    }: RowConfig, dd) => {
        const data = dd || item;

        return [
            pipeWith(data, getIn(time), date),
            pipeWith(data, getIn(actor), yellow),
            color(icon),
            color(message) || grey(__typename)
        ];
    };

    switch (__typename) {

        //
        // Git
        //
        case 'PullRequestCommit': {
            return [row({
                time: ['commit', 'authoredDate'],
                actor: ['commit', 'author', 'user', 'login'],
                icon: grey('*'),
                message: grey(item.commit.message)
            })];
        }
        case 'HeadRefForcePushedEvent': {
            return [row({
                color: cyan,
                icon: '⤒',
                message: `Force-pushed ${item.ref} from ${item.beforeCommit.abbreviatedOid} to ${item.afterCommit.abbreviatedOid}`
            })];
        }
        case 'HeadRefDeletedEvent': {
            return [row({
                icon: red('×'),
                message: red(`deleted ${item.headRefName}`)
            })];
        }



        //
        // Reivews
        //
        case 'PullRequestReview': {
            let color = blue;
            let icon = '~';
            let count = item.comments.totalCount;
            let p = (text) => text + (count === 1 ? '' : 's');
            let message = `Reviewed (${count} ${p('comment')})`;
            if(state === 'APPROVED') {
                color = green;
                icon = '✔';
                message = `Approved (${count} ${p('comment')})`;
            }
            if(state === 'CHANGES_REQUESTED') {
                color = red;
                icon = '✘';
                message = `${count} ${p('change')} requested`;
            }

            return [row({
                actor: ['author', 'login'],
                color,
                icon,
                message
            })];
        }

        case 'ReviewRequestedEvent': {
            return [row({
                icon: `~`,
                message: `Requested a review from ${item.requestedReviewer.login}`
            })];
        }

        case 'ReadyForReviewEvent': {
            return [row({
                icon: '~',
                message: `Marked as 'ready for review'`
            })];
        }


        //
        //  Comments
        //
        case 'PullRequestReviewComment': {
            let outdatedText = outdated ? grey('OUTDATED') : ''
            let code = diffHunk.split('\n').slice(1).slice(-3).map(line => {
                if(line[0] === '+') return green(line);
                if(line[0] === '-') return red(line);
                return line;
            }).join('\n' + leftPadding);
            return [row({
                icon: '"',
                message: body
            })];
        }

        case 'PullRequestCommitCommentThread': {
            return item.comments.edges.map(({node}) => row({
                icon: '"',
                message: node.body
            }, node));
        }

        case 'IssueComment': {
            return [row({
                actor: ['author', 'login'],
                icon: '"',
                message: item.body
            })];
        }


        //
        // Github Meta
        //
        case 'RenamedTitleEvent': {
            return [row({
                color: cyan,
                icon: `#`,
                message: `changed the title from ${item.previousTitle} to ${item.currentTitle}`
            })];
        }
        case 'LabeledEvent': {
            return [row({
                icon: '#',
                message: `Added label: {#${item.label.color}-bg}{black-fg}${item.label.name}{/}`
            })];
        }
        case 'MergedEvent': {
            return [row({
                icon: magenta('<'),
                message: magenta(`merged ${item.commit.abbreviatedOid} into ${item.mergeRefName}`)
            })];
        }
        case 'ClosedEvent': {
            return [row({
                color: red,
                icon: '×',
                message: `Closed the pull request`
            })];
        }
        case 'ReopenedEvent': {
            return [row({
                color: green,
                icon: '•',
                message: `Reopened the pull request`
            })];
        }
        case 'CrossReferencedEvent': {
            return [row({
                color: cyan,
                icon: `#`,
                message: `Referenced this in: ${item.source.title} (${item.source.url})`
            })];
        }


        //
        // Misc
        //
        case 'PullRequestRevisionMarker': {
            return [row({
                time: '',
                actro: '',
                icon: '',
                icon: red('⤒'),
                message: magenta('↓ New Commits ↓')
            })];
        }

        default: {
            return [row({
                icon: '',
                message: grey(__typename)
            })];
        }
    }
}

export default function TimelineItemArray(timelineItems) {
    return pipeWith(
        timelineItems.edges,
        map(get('node')),
        sortBy(get('createdAt')),
        //reverse(),
        flatMap((item, index) => {
            return [
                'MentionedEvent',
                'SubscribedEvent',
                'ReferencedEvent'
            ].includes(item.__typename) ? [] : Item(item)
        })
    );
}
