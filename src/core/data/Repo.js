// @flow
import Ref from '../../ref/data/Ref';

export type RepoShape = {
    protocol: string,
    resource: string,
    owner: string,
    name: string,
    view: string,
    viewIndex: number,
    ref?: Ref
};

