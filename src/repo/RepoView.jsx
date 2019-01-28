// @flow
import RepoStructure from './RepoStructure';
import composeWith from 'unmutable/lib/util/composeWith';
import {RepoList} from '../core/EntityApi';
import LoadingHoc from '../core/LoadingHoc';
import sortBy from 'unmutable/lib/sortBy';
import get from 'unmutable/lib/get';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default composeWith(
    RepoList({
        name: 'repoListMessage',
        auto: true
    }),
    //LoadingHoc({name: 'repoListMessage'}),
    RepoStructure
);
