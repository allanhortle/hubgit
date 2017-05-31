#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

import Request from './Request';
import Loader from './Loader';

function query(owner, name) {
    return `{
        repository(owner: "${owner}", name: "${name}") {
            releases(last: 100) {
                edges {
                    node {
                        tag {
                            name
                        }
                        name
                        description
                    }
                }
            }
        }
    }`;
};

export default function modules(program, config) {
    Loader.start();

    const [owner, name] = program.args[1].split('/');
    Request({query: query(owner, name)})
        .then(({data}) => {
            var list = data.repository.releases.edges
                .map(ii => ii.node)
                .map(({tag, name, description}) => {
                    var title = chalk.yellow(`${tag.name} - ${name}`);
                    var body = description ? `\n${description}\n` : '';

                    return `${title}${body}`;
                })
                .join('\n');
            Loader.stop();
            console.log(list);
        });
}
