// @flow
import React from 'react';

import {changes} from '../util/tag';
import {date} from '../util/tag';
import {yellow} from '../util/tag';
import Commit from './data/Commit';

type Props = {
    commit: Commit
};
export default function CommitItemStructure(props: Props) {
    log(Object.keys(props.commit));
    const {
        oid,
        additions,
        deletions,
        authoredDate,
        author,
        changedFiles,
        committedDate,
        message,
        messageBody,
        messageHeadline
    } = props.commit;


    const rows = [
        ['', ''],
        ['sha', oid],
        ['changes', changes({additions, deletions})],
        ['changed files', changedFiles.toString()],
        ['authored date', date(authoredDate)],
        ['committed date', date(committedDate)],
        ['author', yellow(author.user.login)],
        ['message', message],
        ['headline', messageHeadline],
        ['body', messageBody],
    ];
    return <listtable
        mouse={true}
        keys={true}
        focused={true}
        vi={true}
        tags={true}
        align="left"
        pad={0}
        rows={rows}
        style={{
            selected: {
                fg: 'black',
                bg: 'yellow'
            },
            scrollbar: {
                bg: 'blue'
            }
        }}
        height={rows.length + 1}
    />;
}
