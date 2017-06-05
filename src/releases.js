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
            refs(last:100, refPrefix: "refs/tags/") {
                edges {
                    node {
                        name
                    }
                }
            }
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
            var releases = data.repository.releases.edges
                .reduce((rr, ii) => {
                    rr[ii.node.tag.name] = ii.node;
                    return rr;
                }, {})


            console.log(data.repository);

            var list = data.repository.refs.edges
                .map(ii => ii.node)
                .map(node => {
                    var {tag, name, description} = releases[node.name] || {};
                    if(!releases[node.name]) {
                        return chalk.grey(node.name);
                    }
                    var title = chalk.yellow(`${tag.name} - ${name}`);
                    var body = description ? `\n${description}` : '';

                    return `${title}${body}`;
                })
                .join('\n');
            Loader.stop();
            console.log(list);
        });
}
