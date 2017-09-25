#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {ListTable, Text, Box} from 'blessed';

// import Request from './Request';
// import Loader from './Loader';

export default function HelpScreen({program, screen}) {
    screen.clear();

    screen.append(Text({
        style: {fg: 'blue'},
        content: 'Commands'
    }));

    screen.append(ListTable({
        top: '0%+1',
        height: '100%',
        parent: screen,
        data: [
            ['h',  '{yellow-fg}help{/}',              'Show a list of possible commands'],
            ['p',  '{yellow-fg}pull-requests{/}',     'Current notifications'],
            ['n',  '{yellow-fg}notifications{/}',     'Current notifications'],
        ],
        pad: 10,
        interactive: false,
        tags: true,
        align: 'left'
    }));

    screen.render();
}
