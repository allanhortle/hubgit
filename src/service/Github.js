// @flow
/* eslint no-undef: 0 */
import {graphql as githubGraphql} from '@octokit/graphql';
import Rest from '@octokit/rest';
import {default as nodeFetch} from 'node-fetch';

const authorization = `token ${process.env.GITHUB_TOKEN || ''}`;

export const rest = new Rest({
    auth: process.env.GITHUB_TOKEN
});

export const diff = (url: string) => {
    return nodeFetch(`https://api.github.com/${url}`, {
        method: 'get',
        headers: {
            authorization,
            accept: 'application/vnd.github.v3.diff'
        }
    })
        .then(res => res.text());
};

export const graphql = async (name: string, vars: {}, query: string): Promise<mixed> => {
    const start = +new Date();

    //
    // $FlowFixMe - Safe logging
    log(name, 'start');
    return githubGraphql(query, {
        ...vars,
        headers: {authorization}
    })
        .then(data => {
            const end = +new Date();
            log(name, 'end', (end - start) / 1000);
            return data;
        })
        .catch(error => {
            log(error);
            if(error.errors) {
                return Promise.reject(error.errors[0]);
            }
            return Promise.reject(error);
        });
};

