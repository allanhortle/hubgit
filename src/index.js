#!/usr/bin/env node
// @flow
import pkg from '../package.json';
import program from 'commander';
import CoreView from './core/CoreView';
import {Repository, Remote} from 'nodegit';
import path from 'path';
import {red, gray} from 'chalk';
import Ref from './ref/data/Ref';
import parseGitUrl from './util/parseGitUrl';


global.exitLog = (...val) => {
    // eslint-disable-next-line
    console.log(...val);
    process.exit(0);
}


program
    .version(pkg.version)
    .arguments('[command]')
    .option('-v, --verbose', 'be verbose')
    .option('-r, --repo <repo>', 'any repo like url or path. E.g: facebook/react, https://github.com/facebook/react')
    .action(async (command, program) => {
        let repo;
        if(program.repo) {
            repo = parseGitUrl(program.repo);
        } else {
            try {
                const repository = await Repository.open(path.join(process.cwd(), ".git"));
                const branch = await repository.getCurrentBranch();
                const remotes = await Remote.list(repository);
                const firstRemote = await Remote.lookup(repository, remotes[0]);
                repo = parseGitUrl(firstRemote.url());
                repo.ref = Ref.fromQualifiedName(branch.name());
            } catch (e) {
                // eslint-disable-next-line
                console.log(`${red('error')} No repo was found.`);
                // eslint-disable-next-line
                console.log(gray('Either run `hub` in a git repository or pass `owner/repo` to the -r flag'));
                process.exit(1);
            }
        }

        CoreView({
            repo,
            command,
            program
        });
    });


program.parse(process.argv);



