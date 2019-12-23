// @flow
import React from 'react';

import {changes} from '../util/tag';
import {date} from '../util/tag';
import {yellow, grey, blue, diff as diffTag} from '../util/tag';
import Commit from './data/Commit';
import pipeWith from 'unmutable/pipeWith';

type Props = {
    commit: Commit
};
export default function CommitItemStructure(props: Props) {
    const {
        additions,
        author,
        changedFiles,
        committer,
        deletions,
        url,
        messageBody,
        messageHeadline,
        oid,
        diff
    } = props.commit;

    const rows = [
        ['sha', oid],
        ['changes', `${changedFiles} files, ${changes({additions, deletions})}`],
        ['author', `${yellow(`${author.name} (${author.email})`)} ${date(author.date)}`],
        ['committer', `${yellow(`${committer.name} (${committer.email})`)} ${date(committer.date)}`],
        ['url', blue(url)]
    ];

    const scrollProps = {
        mouse: true,
        keys: true,
        focused: true,
        vi: true,
        scrollable: true
    };

    const diffText = pipeWith(
        diff,
        (_) => '\n'.repeat(rows.length + 1)
            .concat(`${messageHeadline}\n`)
            .concat(messageBody ? `\n${messageBody}\n` : '')
            .concat(_),
        (_) => _.replace(/^(diff[\s\S]*?)(@@)/gm, `\n\n${grey('$1')}\n\n$2`),
        diffTag
    );

    return <box {...scrollProps} tags content={diffText}>
        <listtable
            tags={true}
            align="left"
            pad={0}
            rows={rows}
            invertSelected={false}
            height={rows.length + 1}
        />
    </box>;
}
