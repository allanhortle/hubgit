// @flow
import React, {useEffect, useRef} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/get';
import pipe from 'unmutable/lib/util/pipe';
import PullrequestList from './PullrequestList';
import {useCoreContext} from '../core/CoreContext';
import {blue} from '../util/tag';

type Props = {
    refName: string,
    id: string
};
export default function PullRequestCreate(props: Props) {
    const {pushStack, repo: {owner, name}} = useCoreContext();
    const {refName, id} = props;

    const form = useRef();
    const branchList = Api.ref.list.useRequest();
    const create = Api.pullRequest.create.useRequest();

    useEffect(() => {
        branchList.onRequest({owner, name});
    }, []);

    const onNo = () => pushStack(PullrequestList, {title: 'Pull Requests'});

    const shortRef = refName.replace('refs/heads/', '');


    return <LoadingBoundary message={branchList}>
        {pipe(
            getIn(['repository', 'refs', 'nodes']),
            (refs) => {
                const branches = refs.map(get('name'));

                const onSubmit = async () => {
                    form.current.submit();
                    const {submission} = form.current || {};

                    await create.onRequest({input: {
                        headRefName: refName,
                        baseRefName: `refs/heads/${branches.find(ii => submission[ii])}`,
                        title: submission.title,
                        repositoryId: id
                    }});
                    pushStack(PullrequestList);
                };

                return create.requestState
                    .emptyMap(() => {
                        return <box>
                            <box tags top={1} content={`  No pull request found for ${blue(shortRef)}`}/>
                            <form keys vi ref={form} top={3} width="100%-2">
                                <textbox name="title" focused inputOnFocus keys mouse top={0} left={1}  border="line" height={3} label="Title"  />
                                <radioset top={4} bottom={3} left={1} label="Merge into" border="line">
                                    {branches.map((ii, index) => <radiobutton name={ii} key={index} top={index} content={ii} />)}
                                </radioset>
                                <button keys vi mouse
                                    style={{fg: 'blue', focus: {underline: true}}}
                                    height={1} bottom={1}
                                    content="Create pull request"
                                    onPress={() => onSubmit()}
                                />
                            </form>
                        </box>;
                    })
                    .fetchingMap(() => 'Loading...')
                    .refetchingMap(() => 'Loading...')
                    .errorMap(() => create.requestError.toString())
                    .value()
            }
        )}
    </LoadingBoundary>;
}

