#!/usr/bin/env node
import pkg from '../package.json';
import program from 'commander';
import CoreView from './core/CoreView';


program
    .version(pkg.version)
    .option('-l, --last <n>', 'limit lists by last ammount')
    .option('-v, --verbose', 'be verbose')
    .option('-r, --repo <repo>', 'org/repo');




program.parse(process.argv);
CoreView(program);
