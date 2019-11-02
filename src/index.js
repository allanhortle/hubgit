#!/usr/bin/env node
// @flow
import pkg from '../package.json';
import program from 'commander';
import CoreView from './core/CoreView';
import {Repository, Remote} from 'nodegit';
import path from 'path';
import gitUrlParse from 'git-url-parse';
import {red, gray} from 'chalk';
import Ref from './ref/data/Ref';


program
    .version(pkg.version)
    .arguments('[view] [viewIndex]')
    .option('-v, --verbose', 'be verbose')
    .option('-r, --repo <repo>', 'any repo like url or path. E.g: facebook/react, https://github.com/facebook/react')
    .action(async (view, viewIndex, program) => {
        let repoData;
        if(program.repo) {
            repoData = gitUrlParse(program.repo);
        } else {
            try {
                const repo = await Repository.open(path.join(process.cwd(), ".git"));
                const branch = await repo.getCurrentBranch();
                const remotes = await Remote.list(repo);
                const firstRemote = await Remote.lookup(repo, remotes[0]);
                repoData = gitUrlParse(firstRemote.url());
                repoData.ref = Ref.fromQualifiedName(branch.name());
            } catch (e) {
                // eslint-disable-next-line
                console.log(`${red('error')} No repo was found.`);
                // eslint-disable-next-line
                console.log(gray('Either run `hub` in a git repository or pass `owner/repo` to the -r flag'));
                process.exit(1);
            }
        }

        CoreView({
            view,
            viewIndex,
            repoData,
            program
        });
    });


program.parse(process.argv);



