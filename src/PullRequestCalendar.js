#!/usr/bin/env node
import chalk from 'chalk';

import Request from './Request';
import PromiseErrorHandler from './PromiseErrorHandler';
import Loader from './Loader';
import Table from './Table';

function query() {
    return `{
        viewer {
            contributedRepositories(first: 20, orderBy: {field: PUSHED_AT, direction:DESC}, affiliations: ORGANIZATION_MEMBER) {
                nodes {
                    name
                    pullRequests(last: 100) {
                        nodes {
                            title
                            author {
                                login
                            }
                            createdAt
                        }
                    }
                }
            }
        }
    }`;
}

export default function PullRequestCalendar(program, config) {
    Loader.start();

    const [, username, date] = program.args;

    Request({query: query()})
        .then(({data}) => {
            var prs = data
                .viewer
                .contributedRepositories
                .nodes
                .map(repo => repo
                    .pullRequests
                    .nodes
                    .map(pr => {
                        pr.repo = repo.name;
                        return pr;
                    })
                )
                .reduce((all, ii) => all.concat(ii), [])
                .filter(pr => pr.author && pr.author.login == username)
                .filter(pr => pr.createdAt.indexOf(date) != -1)
                .map(pr => {
                    pr.createdAt = new Date(pr.createdAt);
                    return pr;
                })
                .sort((a, b) => {
                    var x = a.createdAt;
                    var y = b.createdAt;
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                })

            var table = Table({
                head: ['Date', 'Repo', 'PR']
            });

            prs.forEach(({title, createdAt, repo}) => table.push([createdAt.toISOString().split('T')[0], repo, title]));

            Loader.stop();
            console.log(table.toString());
        })
        .catch(PromiseErrorHandler);
}
