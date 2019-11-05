// @flow

import {ObjectSchema} from 'react-enty';
import {EntitySchema} from 'react-enty';

var issue = new EntitySchema('issue');
issue.shape = new ObjectSchema({});

export default new ObjectSchema<{}>({});
