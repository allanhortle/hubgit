// @flow
import React from 'react';
import Issue from './data/Issue';

type Props = {
    issue: Issue,
    commands: Array<{row: string[], action: () => void}>
};
export default function IssueCommandStructure(props: Props) {
    const {commands} = props;

    return <box>
        <listtable
            mouse={true}
            keys={true}
            focused={true}
            vi={true}
            tags={true}
            align="left"
            width={60}
            pad={0}
            height={commands.length + 1}
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

