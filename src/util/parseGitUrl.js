// @flow
import gitUp from 'git-up';
import Ref from '../ref/data/Ref';

type GitUrl = {
    protocol: string,
    resource: string,
    owner: string,
    name: string,
    view: string,
    viewIndex: number,
    ref?: Ref
};

function parseView(view: string): string {
    const viewMap = {
        pull: 'pull',
        pulls: 'pull',
        merge_requests: 'pull',
        issue: 'issue',
        issues: 'issue'
    };
    return viewMap[view];
}

export default function parseGitUrl(url: string): GitUrl {
    const remote = gitUp(url);
    const {protocol, resource, pathname} = remote;
    const [, owner, name, view, viewIndex] = pathname.replace(/\.git$/, '').split('/');

    return {
        protocol,
        resource,
        owner,
        name,
        view: parseView(view),
        viewIndex: parseInt(viewIndex, 10)
    };
}
