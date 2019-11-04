// @flow

import {ObjectSchema} from 'react-enty';
import {EntitySchema} from 'react-enty';
import {ArraySchema} from 'react-enty';

var issue = new EntitySchema('issue');
var issues = new ArraySchema(issue);
issue.shape = new ObjectSchema({});

export default new ObjectSchema<{}>({});
