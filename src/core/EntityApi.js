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
query ($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    pullRequests(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
          author {
            login
          }
          additions
          deletions
          reviewThreads(first: 10) {
            edges {
              node {
                id
                isResolved
                comments(first: 10) {
                  edges {
                    node {
                      path
                      diffHunk
                      body
                      author {
                        login
                      }
                      createdAt
                    }
                  }
                }
              }
            }
          }
          comments(first: 25) {
            totalCount
            edges {
              node {
                id
                author {
                  login
                }
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
        `),

        issues: async (params) => github(params, `
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    issues(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        node {
          id
          number
          title
          body
          state
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
          labels(first: 10) {
            edges {
              node {
                color
                name
              }
            }
          }
        }
      }
    }
  }
}
        `),

        releases: async (params) => github(params, `
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    releases(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
      edges {
        node {
          id
          createdAt
          updatedAt
          isDraft
        isPrerelease
          url
          author {login}
          tagName
          tag {
            id
          }
          name
          description
          publishedAt
        }
      }
    }
  }
}
        `),

        readme: async (params) => github(params, `
query($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    pullRequests(states:OPEN) {
      totalCount
    }
    issues(states: OPEN) {
      totalCount
    }
    stargazers {
      totalCount
    }
    watchers {
      totalCount
    }
    url
    sshUrl
    description
    homepageUrl
    isArchived
   object(expression: "master:README.md") {
      ... on Blob {
        text
      }
    }
  }
}
        `),

    }
}, ApplicationSchema);

export default Api;
