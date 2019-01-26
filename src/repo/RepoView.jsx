// @flow
import RepoStructure from './RepoStructure';
import composeWith from 'unmutable/lib/util/composeWith';
import {RepoList} from '../core/EntityApi';
import LoadingHoc from '../core/LoadingHoc';

export default composeWith(
    RepoList({
        name: 'repoListMessage',
        auto: true
    }),
    //LoadingHoc({name: 'repoListMessage'}),
    RepoStructure
);
