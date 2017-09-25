#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import blessed, {Box} from 'blessed';

import Request from './Request';
import Loader from './Loader';
import NotificationScreen from './screen/NotificationScreen';
import PullRequestScreen from './screen/PullRequestScreen';
import HelpScreen from './screen/HelpScreen';


export default function Gui(program, config) {
    var screen = blessed.screen({
        smartCSR: true
    });

    screen.clear = () => screen.append(Box({width: '100%', height: '100%'}));

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    screen.key(['n'], () => NotificationScreen({program, screen}));
    screen.key(['p'], () => PullRequestScreen({program, screen}));
    screen.key(['h'], () => HelpScreen({program, screen}));

    HelpScreen({program, screen});
}
