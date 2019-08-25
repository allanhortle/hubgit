// @flow
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';
import github from '../service/Github';

const repo = ({owner, repo}, key, value) => ({repo: {
    id: `${owner}/${repo}`,
    [key]: value
}});


const Api = EntityApi({
    repo: {
        pulls: async (params) => github(params, `
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    pullRequests(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      edges {
        node {
          id
          number
          title
          body
          state
          baseRefName
          headRefName
          createdAt
          updatedAt
          url
          author {login}
          comments(first:100) {
            edges {
              node {
                id
                author {login}
                body
                createdAt
              }
            }
          }
        }
      }
    }
  }
}
        `, params),
        readme: async (params) => {
            const request = await github.repos.getReadme(params);
            return repo(params, 'readme', request.data);
        }
    }
}, ApplicationSchema);

export default Api;
