// @flow
import React, {useEffect} from 'react';
import Api from '../core/EntityApi';
import LoadingBoundary from '../core/LoadingBoundary';
import {Markdown} from 'react-blessed-contrib';

type Props = {
    repo: {owner: string, name: string}
};
export default function RepoStructure(props: Props) {
    const readme = Api.repo.readme.useRequest();
    const {owner, name} = props.repo;

    useEffect(() => {
        readme.onRequest({owner, name});
    }, []);

    return <LoadingBoundary message={readme}>
        {(data) => {
            return <Markdown mouse scrollable width={70} left={1} top={1}>
                {data.repository.object.text}
            </Markdown>;
        }}
    </LoadingBoundary>;
}
