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
import Ref from '../ref/data/Ref';

type Props = {
    reference: Ref,
    id: string
};
export default function PullRequestCreate(props: Props) {
    const {pushStack, replaceStack, repo: {owner, name}} = useCoreContext();
    const {reference, id} = props;

    const form = useRef();
    const branchList = Api.ref.list.useRequest();
    const create = Api.pullRequest.create.useRequest();

    useEffect(() => {
        branchList.onRequest({owner, name});
    }, []);

    const onNo = () => pushStack(PullrequestList, {title: 'Pull Requests'});



    return <LoadingBoundary message={branchList}>
        {pipe(
            getIn(['repository', 'refs', 'nodes']),
            (refs) => {
                const branches = refs.map(get('name'));

                const onSubmit = async () => {
                    form.current.submit();
                    const {submission} = form.current || {};
                    create
                        .onRequest({input: {
                            headRefName: reference.name,
                            baseRefName: branches.find(ii => submission[ii]),
                            title: submission.title,
                            body: submission.body,
                            repositoryId: id
                        }})
                        .then(() => {
                            if(create.requestState.isSuccess) {
                                replaceStack(PullrequestList);
                            }
                        });
                };

                log(create);

                return create.requestState
                    .emptyMap(() => {
                        return <box>
                            <box tags top={1} content={`  No pull request found for ${blue(reference.name)}`}/>
                            <form keys vi ref={form} top={3} width="100%-2">
                                <textbox name="title" focused inputOnFocus keys mouse top={0} left={1}  border="line" height={3} label="Title"  />
                                <textarea name="body" inputOnFocus keys mouse top={3} height={7} left={1}  border="line" label="Description"  />
                                <radioset top={10} bottom={3} left={1} label="Merge into" border="line">
                                    {branches.map((ii, index) => <radiobutton name={ii} key={index} top={index} content={ii} />)}
                                </radioset>
                                <button keys vi mouse
                                    style={{fg: 'blue', focus: {underline: true}}}
                                    height={1} bottom={1}
                                    shrink
                                    right={1}
                                    content="Create pull request"
                                    onPress={() => onSubmit()}
                                />
                            </form>
                        </box>;
                    })
                    .fetchingMap(() => 'Loading...')
                    .refetchingMap(() => 'Loading...')
                    .errorMap(() => create.requestError.message)
                    .value()
            }
        )}
    </LoadingBoundary>;
}

