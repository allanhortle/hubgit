// @flow
import React, {useEffect, useState} from 'react';
import LoadingBoundary from '../core/LoadingBoundary';
import Api from '../core/EntityApi';
import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import sortBy from 'unmutable/lib/sortBy';
import pipeWith from 'unmutable/lib/util/pipeWith';
import pipe from 'unmutable/lib/util/pipe';
import {blue, red, green, magenta} from '../util/tag';

const Title = ({content, top}) => {
    const style = {
        fg: 'black',
        bg: 'white',
    };
    return <box tags top={top} style={style} height={1} content={`{center}${content}{/center}`}>
    </box>
}

export default (props) => {
    const [pull, setPull] = useState();
    const pulls = Api.repo.pulls.useRequest();
    const {owner, repo, pullId} = props.match.params;
    useEffect(() => {
        pulls.onRequest(props.match.params)
            .then(data => setPull(data.repository.pullRequests.edges[0].node.number))
            .catch(err => log(err));
    }, []);


    return <LoadingBoundary message={pulls}>
        {(data, meta) => {
            const pulls = data.repository.pullRequests.edges.map(ii => ii.node);
            const currentPull = pulls.find(ii => ii.number == pull);
            log(currentPull);
            return <>
                <listtable
                    top={1}
                    width="40%"
                    align="left"
                    mouse={true}
                    keys={true}
                    focused={true}
                    vi={true}
                    tags={true}
                    pad={0}
                    style={{
                        selected: {
                            fg: 'black',
                            bg: 'yellow'
                        },
                        scrollbar: {
                            bg: 'blue'
                        }
                    }}
                    rows={pipeWith(
                        pulls,
                        map(ii => [
                            `#${ii.number}`,
                            colorState(ii.state),
                            ii.title
                        ])
                    )}
                    onSelect={data => log(data.content, data.content.match(/#(\d*)/)) || setPull(data.content.match(/#(\d*)/)[1])}
                />
                <box left="40%">
                    {currentPull && <PullDescription pull={currentPull} />}
                </box>
             </>;
        }}
    </LoadingBoundary>;
}

function PullDescription({pull}) {
    const bodyLines = pull.body.split('\r').length;
    const {state, body} = pull;

    const statsHeight = 7
    const descriptionOffset = body ? statsHeight : 0;
    const commentOffset = body ? statsHeight + bodyLines + 3 : statsHeight;



    log(pull.comments);
        //<Title top={81} content="Comments" />
        //<element top={82} height={80} border={{type: 'line'}} content={pull.body} />

    return <box mouse scrollable padding={{left: 1, top: 1, right: 1, bottom: 1}}>
        <listtable tags align="left" rows={[
            ['state: ', colorState(state)],
            ['number: ', `#${pull.number}`],
            ['opened by: ', `${pull.author.login}`],
            ['merge: ', `${blue(pull.headRefName)} into ${blue(pull.baseRefName)}`],
            ['created', `${pull.createdAt}`],
            ['updated', `${pull.updatedAt}`],

        ]}/>
        {pull.body && <>
            <Title top={descriptionOffset} content="Description" />
            <element top={descriptionOffset + 1} height={bodyLines} content={pull.body} />
        </>}
        {pull.comments.edges.length > 0 && <>
            <Title top={commentOffset} content="Comments" />
            <table
                align="left"
                top={commentOffset + 1}
                tags
                rows={pull.comments.edges.map(({node}) => [
                    `{yellow-fg}${node.author.login}{/yellow-fg}`,
                    node.createdAt,
                    '\n' + node.body.trim()
                ])}
            />
        </>}
    </box>;
}

function colorState(val) {
    switch(val) {
        case 'MERGED':
            return magenta(val);
        case 'CLOSED':
            return red(val);
        case 'OPEN':
            return green(val);
        default:
            return val;
    }
}
