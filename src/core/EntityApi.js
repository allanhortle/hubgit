// @flow
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';
import github from '../service/Github';



const Api = EntityApi({
    repoList: () => github.activity.listReposWatchedByUser({username: 'allanhortle', per_page: 100})
        .then(({data}) => ({repoList: data})),

    repoReadme: ({org, repo}) => github.repos.getReadme({owner: org, repo})
        .then(({data}) => ({readme: data}))
}, ApplicationSchema);

export const EntityProviderHoc = Api.ProviderHoc;

export const RepoList = Api.repoList.requestHoc;
export const RepoReadme = Api.repoReadme.requestHoc;

export default Api;
