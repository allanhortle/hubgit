#!/usr/bin/env node
import pkg from '../package.json';
import program from 'commander';
import CoreView from './core/CoreView';
import {Repository, Remote} from 'nodegit';
import path from 'path';
import gitUrlParse from 'git-url-parse';
import {red, gray} from 'chalk';


program
    .version(pkg.version)
    .arguments('[cmd]')
    .option('-v, --verbose', 'be verbose')
    .option('-r, --repo <repo>', 'any repo like url or path. E.g: facebook/react, https://github.com/facebook/react')
    .action(async (command, program) => {
        let repoData;
        if(program.repo) {
            repoData = gitUrlParse(program.repo);
        } else {
            try {
                const repo = await Repository.open(path.join(process.cwd(), ".git"));
                const remotes = await Remote.list(repo);
                const firstRemote = await Remote.lookup(repo, remotes[0]);
                repoData = gitUrlParse(firstRemote.url());
            } catch (e) {
                console.log(`${red('error')} No repo was found.`);
                console.log(gray('Either run `hub` in a git repository or pass `owner/repo` to the -r flag'));
                process.exit(1);
            }
        }

        CoreView(repoData, program);
    });


program.parse(process.argv);



