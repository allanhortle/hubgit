// @flow
import React from 'react';
import PullRequest from './data/PullRequest';

type Props = {
    pullRequest: PullRequest,
    commands: Array<{row: string[], action: () => void}>
};
export default function PullRequestCommandStructure(props: Props) {
    const {commands} = props;

    return <box>
        <listtable
            mouse={true}
            keys={true}
            focused={true}
            vi={true}
            tags={true}
            align="left"
            pad={0}
            width="100%"
            rows={[
                ['Shortcut', 'Command'],
                ...commands.map(_ => _.row)
            ]}
            onSelect={(item, index) => {
                commands[index - 1].action();
            }}
            style={{
                selected: {
                    fg: 'black',
                    bg: 'yellow'
                }
            }}
        />
    </box>;
}

