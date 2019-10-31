// @flow
import React, {useEffect} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import CommitItemStructure from './CommitItemStructure';
import Commit from './data/Commit';
import pipe from 'unmutable/pipe';
import getIn from 'unmutable/getIn';

type Props = {
    id: string
};
export default function CommitItemView(props: Props) {
    const {id} = props;
    const message = Api.commitItem.useRequest();

    useEffect(() => {
        message.onRequest({id});
    }, []);

    return <LoadingBoundary
        message={message}
        children={pipe(
            getIn(['commitItem']),
            _ => <CommitItemStructure commit={new Commit(_)} />
        )}
    />;
}

