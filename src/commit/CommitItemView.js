// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import CommitItemStructure from './CommitItemStructure';
import {useCoreContext} from '../core/CoreContext';
import Commit from './data/Commit';
import pipe from 'unmutable/pipe';
import getIn from 'unmutable/getIn';

type Props = {
    id: string
};
export default function CommitItemView(props: Props) {
    const {id, oid} = props;
    const message = Api.commitItem.useRequest();
    const {repo} = useCoreContext();
    const {owner, name} = repo;

    useEffect(() => {
        message.onRequest({id, owner, name, oid});
    }, []);

    return <LoadingBoundary
        message={message}
        children={pipe(
            getIn(['commitItem']),
            _ => <CommitItemStructure commit={new Commit(_)} />
        )}
    />;
}

