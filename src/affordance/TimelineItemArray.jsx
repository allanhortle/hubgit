// @flow
import type {ComponentType} from 'react';
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {maybePipe} from 'unfunctional';
import {check, blue, label, red, green, magenta, grey, yellow, date, cyan} from '../util/tag';
import flatMap from 'unmutable/flatMap';
import Markdown from './Markdown';

// views
import PullRequestReview from '../pullrequest/PullRequestReview';
import CommitItemView from '../commit/CommitItemView';


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
            title: row.slice(0, 3).join(' '),
            ...viewProps,
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
            const {id, message, abbreviatedOid, oid, checkSuites} = item.commit;
            return [row({
                time: ['commit', 'authoredDate'],
                actor: ['commit', 'author', 'user', 'login'],
                icon: maybePipe(getIn(['nodes', 0]), check)(checkSuites) || grey('*'),
                message: grey(message),
                view: CommitItemView,
                viewProps: {id, title: `Commit: ${abbreviatedOid}`, oid}
            })];
        }
        case 'HeadRefForcePushedEvent': {
            const {pullRequest} = item;
            const prefix = pullRequest.headRepositoryOwner ? `${pullRequest.headRepositoryOwner.login}:` : '';
            return [row({
                color: cyan,
                icon: '⤒',
                message: `Force-pushed ${prefix}${pullRequest.headRefName} from ${item.beforeCommit.abbreviatedOid} to ${item.afterCommit.abbreviatedOid}`
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
                message: body,
                view: Markdown,
                viewProps: {markdown: body}
            })];
        }

        case 'PullRequestCommitCommentThread': {
            return item.comments.nodes.map((node) => row({
                icon: '"',
                message: node.body,
                view: Markdown,
                viewProps: {markdown: node.body}
            }, node));
        }

        case 'IssueComment': {
            return [row({
                actor: ['author', 'login'],
                icon: '"',
                message: item.body,
                view: Markdown,
                viewProps: {markdown: item.body}
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
                message: `Added label: ${label(item.label)}`
            })];
        }
        case 'MergedEvent': {
            return [row({
                icon: magenta('☇'),
                message: magenta(`merged ${item.commit.abbreviatedOid} into ${item.mergeRefName}`)
            })];
        }
        case 'ClosedEvent': {
            return [row({
                color: red,
                icon: '☇',
                message: `Closed`
            })];
        }
        case 'ReopenedEvent': {
            return [row({
                color: green,
                icon: '☇',
                message: `Reopened`
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
