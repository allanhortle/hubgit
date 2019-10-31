// @flow
/* eslint no-undef: 0 */
import {graphql} from '@octokit/graphql';
import Rest from '@octokit/rest';

export const rest = new Rest({
    auth: process.env.GITHUB_TOKEN
});

export default async (name: string, vars: {}, query: string): Promise<mixed> => {
    const start = +new Date();

    //
    // $FlowFixMe - Safe logging
    log(name, 'start');
    return graphql(query, {
        ...vars,
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN || ''}`
        }
    })
        .then(data => {
            const end = +new Date();
            log(name, 'end', (end - start) / 1000);
            return data;
        })
        .catch(log);
};

