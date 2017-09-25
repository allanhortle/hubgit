#!/usr/bin/env node

// import fs from 'fs';
// import chalk from 'chalk';
import pkg from '../package.json';
import program from 'commander';
import releases from './releases';
import gui from './gui';
import PullRequestCalendar from './PullRequestCalendar';

program
    .version(pkg.version)
    .option('-l, --last <n>', 'limit lists by last ammount')
    .option('-v, --verbose', 'be verbose')
    // .option('-c, --concurrent', 'run commands concurrently')

program
    .command('releases')
    .description('list a repos releases');

program.parse(process.argv);

switch (program.args[0]) {
    case 'releases':
        releases(program, {});
        break;

    case 'prs':
        PullRequestCalendar(program, {});
        break;

    default:
        gui(program, {})
        break;
}
