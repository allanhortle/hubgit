// @flow

import {ObjectSchema} from 'react-enty';
import {EntitySchema} from 'react-enty';
import {ArraySchema} from 'react-enty';

var repo = EntitySchema('repo');
var repoList = ArraySchema(repo);

repo.set(ObjectSchema({}));

export default ObjectSchema({
    repoList
});
