#!/usr/bin/env node

// import fs from 'fs';
// import chalk from 'chalk';
import pkg from '../package.json';
import program from 'commander';
import releases from './releases';

program
    .version(pkg.version)
    // .option('-l, --lurkles <items>', 'A list of config files to merge', val => val.split(','))
    // .option('-d, --dry', 'show commands without running them')
    // .option('-c, --concurrent', 'run commands concurrently')

program
    .command('releases')
    .description('list a repos releases');

program.parse(process.argv);

switch (program.args[0]) {
    case 'releases':
        releases(program, {});
        break;

    default:
        console.log('hubgit');
        break;
}
