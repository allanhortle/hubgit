// @flow
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';
import github from '../service/Github';

const Api = EntityApi(ApplicationSchema, {
    repoList: () => github.activity.listReposWatchedByUser({username: 'allanhortle', per_page: 100})
        .then(({data}) => ({repoList: data})),

    repoReadme: ({owner, repo, path, ref}) => github.repos.getContents({owner, repo, path, ref})
        .then(({data}) => ({content: data}))
});

export const EntityProvider = Api.EntityProvider;

export const RepoList = Api.repoList.request;
export const RepoReadme = Api.repoReadme.request;
