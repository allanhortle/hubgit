// @flow
import type {ComponentType} from 'react';
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {blue, red, green, magenta, grey, yellow, date, cyan} from '../util/tag';
import flatMap from 'unmutable/flatMap';

// views
import PullRequestReview from '../pullrequest/PullRequestReview';


type RowConfig<A> = {
    time?: Array<string>,
    actor?: Array<string>,
    icon?: string,
    message?: string,
    color?: (string) => string,
    view?: ComponentType<A>,
    viewProps?: A
};

function Item(item) {
    const {state, body, __typename} = item;

    const row = <A>({
        actor = ['actor', 'login'],
        color = x => x,
        icon,
        message,
        time = ['createdAt'],
        view,
        viewProps = {}
    }: RowConfig<A>, dd) => {
        const data = dd || item;
        const type = data.__typename;
        const row = [
            pipeWith(data, getIn(time), date),
            pipeWith(data, getIn(actor), yellow),
            color(icon || ''),
            color(message || '') || grey(__typename)
        ];
        const childProps = {
            ...viewProps,
            title: row.join(' '),
            row
        };

        return {
            type,
            viewProps: childProps,
            row,
            view: view || (() => null)
        };
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
                message: `Force-pushed ${item.ref.name} from ${item.beforeCommit.abbreviatedOid} to ${item.afterCommit.abbreviatedOid}`
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
                message = count > 0 ? `Approved (${count} ${p('comment')})` : 'Approved';
            }
            if(state === 'CHANGES_REQUESTED') {
                color = red;
                icon = '✘';
                message = count > 0 ? `${count} ${p('change')} requested` : '';
            }

            return [row({
                actor: ['author', 'login'],
                color,
                icon,
                message,
                view: PullRequestReview,
                viewProps: {id: item.id, title: 'PullRequestReview'}
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
            return [row({
                icon: '"',
                message: body
            })];
        }

        case 'PullRequestCommitCommentThread': {
            return item.comments.nodes.map((node) => row({
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
                time: [],
                actor: [],
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

export default function TimelineItemArray(timelineItems: Array<{}>) {
    return pipeWith(
        timelineItems,
        flatMap((item) => [
            'MentionedEvent',
            'SubscribedEvent',
            'ReferencedEvent'
        ].includes(item.__typename) ? [] : Item(item))
    );
}
