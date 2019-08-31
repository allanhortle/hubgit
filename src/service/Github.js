// @flow
import {graphql} from '@octokit/graphql';

export default async (vars, query) => {
    return graphql(query, {
        ...vars,
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    })
        .catch(log);
};

