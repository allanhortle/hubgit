#!/usr/bin/env node

// import fs from 'fs';
// import chalk from 'chalk';
import pkg from '../package.json';
import program from 'commander';
import releases from './releases';
import gui from './gui';
import PullRequestCalendar from './PullRequestCalendar';

import OldPropTypes from './analytics/OldPropTypes';

program
    .version(pkg.version)
    .option('-l, --last <n>', 'limit lists by last ammount')
    .option('-v, --verbose', 'be verbose')
    // .option('-c, --concurrent', 'run commands concurrently')


program
    .command('releases [repo]')
    .description('list a repos releases')
    .action(() => console.log('releases', program.args) || releases(program, {}));

program
    .command('prs [username] [date]')
    .description('pullrequest calendar')
    .action(() => console.log('prs', program.args) || PullRequestCalendar(program, {}));

program
    .command('data')
    .arguments('[arg]')
    .action((arg: string): ?Promise<> => {
        switch (arg) {
            case 'OldPropTypes':
                return OldPropTypes(program);

            default:
                return console.log('No data file found.');
        }
    });


program.parse(process.argv);

if(!program.args.length) {
    gui(program, {})
}
