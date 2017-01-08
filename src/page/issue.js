import blessed from 'blessed';
import contrib from 'blessed-contrib';

import loremIpsum from 'lorem-ipsum';
import {Range} from 'immutable';

const data = Range(0, 15)
    .map(ii => {
        return {
            title: `#${ii}: ${loremIpsum()}`,
            content: loremIpsum({
                units: 'paragraphs'
            })
        }
    })

export default function(screen) {

    var list = blessed.box({
        height: '100%-1',
        width: 50,
        content: data.map(ii => ii.title).join('\n'),
        // label: 'Issues',
        // border: {
        //     type: "line",
        //     fg: "cyan"
        // }
    });

    var content = blessed.box({
        height: '100%-1',
        width: '100%-50',
        left: 50,
        label: 'issue01',
        content: '@My Box',
        border: {
            type: "line",
            fg: "cyan"
        }
    });

    screen.append(list);
    screen.append(content);

}
