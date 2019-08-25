// @flow
import {graphql} from '@octokit/graphql';

export default async (vars, query) => {
    log(process.env.GITHUB_TOKEN);
    return graphql(query, {
        ...vars,
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });
};

