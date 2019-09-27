// @flow
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';
import github from '../service/Github';
import PullQuery from './data/PullQuery';
import PullListQuery from './data/PullListQuery';

const takeFirst = (request) => {
    let current;
    return async (...args) => {
        if(current) {
            return current.then(
                response => {
                    current = null;
                    return response;
                },
                err => {
                    current = null;
                    throw err
                }
            );
        }
        current = request(...args);
        return current;
    }
};

const Api = EntityApi({
    repo: {
        pull: takeFirst((params) => github('pull', params, PullQuery)),
        pullList: takeFirst((params) => github('pullList', params, PullListQuery)),

        issues: takeFirst((params) => github('issueList', params, `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
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
          timelineItems(last: 50, itemTypes: [ISSUE_COMMENT]) {
            edges {
              node {
                __typename
                ... on IssueComment {
                  id
                  body
                  createdAt
                  author {
                    login
                  }
                }
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
        `)),

        releases: takeFirst((params) => github('releaseList', params, `
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
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
        `)),

        readme: takeFirst((params) => github('readme', params, `
query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
        object(expression: "master:README.md") {
            ... on Blob {
            text
            }
        }
    }
}
        `))

    }
}, ApplicationSchema);

export default Api;
